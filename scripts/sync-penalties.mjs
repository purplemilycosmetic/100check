/**
 * ════════════════════════════════════════════════════════════
 *  違規廠商裁罰紀錄同步
 *  scripts/sync-penalties.mjs
 * ════════════════════════════════════════════════════════════
 *
 *  寫入 Supabase penalty_records，供網站「違規廠商查詢」使用：
 *   1. 食藥署開放資料「違規廣告」（data.fda.gov.tw InfoId=158，全國各縣市衛生局）
 *   2. 本站已匯入的臺北市衛生局案例（violation_cases，依案件彙整）
 *
 *  以 uid（來源+廠商+產品+日期）去重，可重複執行。
 *  個人姓名（非公司行號）會遮蔽中間字，例如「王小明」→「王○明」。
 *
 *  環境變數：SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY；DRY_RUN=1 只檢查不寫入
 */
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { existsSync, readFileSync } from 'fs'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
const DRY_RUN = !!process.env.DRY_RUN
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('❌ 缺少 SUPABASE 環境變數'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const notice = (title, msg) => {
  console.log(`\n### ${title}\n${msg}`)
  if (process.env.GITHUB_ACTIONS) console.log(`::notice title=${title}::${String(msg).replace(/%/g, '%25').replace(/\r?\n/g, '%0A').slice(0, 8000)}`)
}

function parseDate(str) {
  if (!str) return null
  const raw = String(str).trim()
  let m = raw.match(/(\d{2,4})[\/\-.年](\d{1,2})[\/\-.月](\d{1,2})/)
  if (!m) m = raw.match(/^(\d{3})(\d{2})(\d{2})$/) || raw.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (!m) { const us = raw.match(/^(\d{1,2})\s+(\d{1,2})\s+(\d{4})/); if (us) m = [null, us[3], us[1], us[2]] }
  if (!m) return null
  let [, y, mo, d] = m.map(Number)
  if (y < 1911) y += 1911
  if (y < 1990 || mo < 1 || mo > 12 || d < 1 || d > 31) return null
  const dt = new Date(Date.UTC(y, mo - 1, d))
  if (dt > new Date(Date.now() + 86400000)) return null // 資料打錯的未來日期
  return dt.toISOString().slice(0, 10)
}

// 公司行號關鍵字；沒有這些字、且是 2~4 個中文字的，視為個人姓名並遮蔽
const ORG = /(公司|行|社|店|廠|坊|所|館|院|中心|企業|集團|協會|工作室|國際|實業|生技|生物|科技|美容|藥局|藥妝|商號|商店|股份|有限|有限公司|Co|Ltd|Inc)/i
function maskPerson(name) {
  const n = String(name || '').trim()
  if (!n || ORG.test(n)) return n
  if (/^[一-鿿]{2,4}$/.test(n)) return n.length === 2 ? n[0] + '○' : n[0] + '○'.repeat(n.length - 2) + n.at(-1)
  return n
}
const uidOf = (...parts) => createHash('sha1').update(parts.map((p) => String(p ?? '').trim()).join('|')).digest('hex')
const pickField = (row, keys) => { for (const k of keys) { if (row[k] != null && String(row[k]).trim()) return String(row[k]).trim() } return null }
const parseFine = (s) => { if (!s) return null; const m = String(s).replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(萬)?/); if (!m) return null; return Math.round(Number(m[1]) * (m[2] ? 10000 : 1)) }

async function fetchTFDA() {
  // 檔案很大，GitHub Actions 先用 curl（含重試）下載到 TFDA_FILE；沒有檔案時才直接抓
  let data
  if (process.env.TFDA_FILE && existsSync(process.env.TFDA_FILE)) {
    const txt = readFileSync(process.env.TFDA_FILE, 'utf-8').replace(/^\uFEFF/, '')
    if (!txt.trim()) throw new Error('TFDA 檔案是空的（下載失敗）')
    data = JSON.parse(txt)
  } else {
    const res = await fetch('https://data.fda.gov.tw/data/opendata/export/158/json')
    if (!res.ok) throw new Error(`TFDA HTTP ${res.status}`)
    data = await res.json()
  }
  const list = Array.isArray(data) ? data : data?.Data || []
  const fields = Object.keys(list[0] || {})
  const typeKey = fields.find((f) => /類別|品項|產品類/.test(f))
  const typeCount = {}
  list.forEach((r) => { const t = typeKey ? r[typeKey] : '（無類別欄）'; typeCount[t] = (typeCount[t] || 0) + 1 })
  notice('TFDA 資料集', `共 ${list.length} 筆\n欄位：${fields.join('、')}\n類別欄：${typeKey || '無'}\n類別分布：${Object.entries(typeCount).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => `${k} ${v}`).join('、')}\n範例：${JSON.stringify(list[0]).slice(0, 1500)}`)

  const out = []
  for (const r of list) {
    const type = typeKey ? String(r[typeKey] || '') : ''
    if (typeKey && type && !/化粧|化妝/.test(type)) continue // 只收化粧品
    const company = maskPerson(pickField(r, ['違規廠商名稱或負責人', '違規廠商名稱', '廠商名稱']))
    if (!company) continue
    const product = pickField(r, ['違規產品名稱', '產品名稱'])
    const date = parseDate(pickField(r, ['處分日期', '查處日期', '刊播日期']))
    const penalty = pickField(r, ['查處情形', '處分情形', '罰鍰'])
    out.push({
      uid: uidOf('TFDA', company, product, date, pickField(r, ['違規情節'])),
      source: '食藥署開放資料',
      company, product,
      product_type: type || '化粧品',
      violation: pickField(r, ['違規情節', '違規內容']),
      law_ref: pickField(r, ['處分法條', '違反法條']),
      authority: pickField(r, ['處分機關', '查處機關']),
      penalty,
      fine: parseFine(pickField(r, ['罰鍰金額', '罰鍰']) || penalty),
      decision_date: date,
      ad_source: pickField(r, ['刊播媒體', '刊播媒體類別', '廣告媒體']),
    })
  }
  return out
}

async function fetchTaipei() {
  const rows = []
  for (let p = 0; ; p++) {
    const { data, error } = await supabase.from('violation_cases').select('company, product, date, enforce_date, fine, phrase, ad_source, enforce_unit, law_ref').range(p * 1000, p * 1000 + 999)
    if (error) throw error
    rows.push(...data); if (data.length < 1000) break
  }
  const byCase = new Map()
  for (const r of rows) {
    r.date = r.date || r.enforce_date
    const key = `${r.company}|${r.product}|${r.date}`
    const c = byCase.get(key) || { ...r, phrases: new Set() }
    if (r.phrase) c.phrases.add(r.phrase)
    byCase.set(key, c)
  }
  return [...byCase.values()].map((c) => ({
    uid: uidOf('TPE', c.company, c.product, c.date),
    source: '裁罰案例彙整',
    company: maskPerson(c.company), product: c.product, product_type: '化粧品',
    violation: [...c.phrases].slice(0, 12).join('、'),
    law_ref: c.law_ref, authority: c.enforce_unit || null,
    penalty: c.fine ? `罰鍰 ${Number(c.fine).toLocaleString()} 元` : null,
    fine: c.fine ?? null, decision_date: parseDate(c.date), ad_source: c.ad_source,
  }))
}

async function main() {
  let all = []
  try { all = all.concat(await fetchTFDA()) } catch (e) { notice('TFDA 失敗', e.message) }
  all = all.concat(await fetchTaipei())
  const uniq = [...new Map(all.map((r) => [r.uid, r])).values()]
  const companies = new Set(uniq.map((r) => r.company)).size
  notice('彙整結果', `共 ${uniq.length} 筆（${companies} 家）：${Object.entries(uniq.reduce((m, r) => ((m[r.source] = (m[r.source] || 0) + 1), m), {})).map((e) => e.join(' ')).join('、')}\n無日期 ${uniq.filter((r) => !r.decision_date).length} 筆\n範例：${JSON.stringify(uniq.slice(0, 2))}`)
  if (DRY_RUN) return
  for (let i = 0; i < uniq.length; i += 500) {
    const { error } = await supabase.from('penalty_records').upsert(uniq.slice(i, i + 500), { onConflict: 'uid' })
    if (error) throw new Error(`寫入失敗：${error.message}`)
  }
  notice('完成', `已寫入 ${uniq.length} 筆`)
}
main().catch((e) => { console.error(e); process.exit(1) })
