/**
 * ════════════════════════════════════════════════════════════
 *  違規廣告案例匯入
 *  scripts/import-violation-cases.mjs
 * ════════════════════════════════════════════════════════════
 *
 *  讀取 data/ 下整理好的案例 JSON（格式見 data/taipei-violations-115-05-08.json），
 *  寫入 Supabase：
 *   - violation_cases：每句違規詞句 × 命中的關鍵詞 一列
 *   - forbidden_words：詞句在現有詞庫中完全比對不到時，新增關鍵詞
 *
 *  比對方式與網站「AI 廣告檢核」相同：關鍵詞長度 ≥ 2、長詞優先、不重疊。
 *  已匯入過的案件（同廠商＋同裁處日期＋同產品）會自動跳過，可重複執行。
 *
 *  環境變數：
 *   SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY（GitHub Secrets）
 *   DATA_FILE   要匯入的 JSON 路徑（預設 data/taipei-violations-115-05-08.json）
 *   DRY_RUN=1   只檢查，不寫入
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
const DATA_FILE = process.env.DATA_FILE || 'data/taipei-violations-115-05-08.json'
const DRY_RUN = !!process.env.DRY_RUN
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 缺少 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// GitHub Actions 註記，方便不下載 log 也看得到結果
const notice = (title, msg) => {
  console.log(`\n### ${title}\n${msg}`)
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::notice title=${title}::${String(msg).replace(/%/g, '%25').replace(/\r?\n/g, '%0A').slice(0, 60000)}`)
  }
}

async function fetchAllWords() {
  const PAGE = 1000
  let all = []
  for (let page = 0; ; page++) {
    const { data, error } = await supabase
      .from('forbidden_words')
      .select('id, name, category, risk_score')
      .order('id')
      .range(page * PAGE, (page + 1) * PAGE - 1)
    if (error) throw new Error(`讀取 forbidden_words 失敗：${error.message}`)
    all = all.concat(data)
    if (data.length < PAGE) break
  }
  return all
}

// 與 AIAuditView.computeMatches 相同：長詞優先、不重疊
function matchWords(text, candidates) {
  const hits = []
  for (const item of candidates) {
    const kw = item.name.trim()
    let idx = 0
    while (idx <= text.length - kw.length) {
      const pos = text.indexOf(kw, idx)
      if (pos === -1) break
      const end = pos + kw.length
      if (!hits.some((h) => pos < h.end && end > h.start)) hits.push({ start: pos, end, item })
      idx = pos + 1
    }
  }
  // 同一關鍵詞只算一次
  return [...new Map(hits.map((h) => [h.item.id, h.item])).values()]
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  const keywords = data.keywords || {} // 比對不到時，詞句 → 要新增的關鍵詞
  console.log(`📂 ${data.source}：${data.cases.length} 件案件、${data.phrases.length} 句詞句`)

  const words = await fetchAllWords()
  const byName = new Map(words.map((w) => [w.name.trim(), w]))
  let candidates = words.filter((w) => w.name && w.name.trim().length >= 2).sort((a, b) => b.name.trim().length - a.name.trim().length)
  console.log(`📚 現有關鍵詞 ${words.length} 筆`)

  // 已匯入過的案件
  const { data: existing, error: exErr } = await supabase
    .from('violation_cases')
    .select('company, date, product')
    .in('company', [...new Set(data.cases.map((c) => c.company))])
  if (exErr) throw new Error(`讀取既有案例失敗：${exErr.message}`)
  const doneKey = new Set((existing || []).map((r) => `${r.company}|${r.date}|${r.product}`))

  const caseOf = new Map(data.cases.map((c) => [`${c.month}-${c.case_no}`, c]))
  const rows = []
  const newWords = new Map() // name → {name, category, risk_score}
  const unmatched = []
  let skipped = 0

  for (const p of data.phrases) {
    const c = caseOf.get(`${p.month}-${p.case_no}`)
    if (doneKey.has(`${c.company}|${c.decision_date}|${c.product}`)) { skipped++; continue }

    let hits = matchWords(p.phrase, candidates)
    if (!hits.length) {
      const kw = (keywords[p.phrase] || p.phrase).trim()
      unmatched.push(`${p.phrase}${keywords[p.phrase] ? ` → ${kw}` : ''}`)
      let w = byName.get(kw) || newWords.get(kw)
      if (!w) {
        w = { name: kw, category: p.category, risk_score: p.risk, _new: true }
        newWords.set(kw, w)
      }
      hits = [w]
    }
    for (const w of hits) {
      rows.push({
        _word: w,
        case_no: c.case_no,
        company: c.company,
        phrase: p.phrase,
        fine: c.fine,
        date: c.decision_date,
        category: p.category,
        product: c.product,
        ad_source: c.ad_source,
        enforce_unit: c.enforce_unit,
        enforce_date: c.enforce_date,
        law_ref: c.law_ref,
      })
    }
  }

  notice('匯入摘要', [
    `案件 ${data.cases.length} 件（已存在略過詞句 ${skipped} 句）`,
    `將寫入 violation_cases ${rows.length} 列`,
    `命中既有關鍵詞 ${rows.filter((r) => !r._word._new).length} 列`,
    `新增關鍵詞 ${newWords.size} 筆`,
  ].join('\n'))
  notice(`比對不到的詞句（${unmatched.length}）`, unmatched.join('\n') || '（無）')

  if (DRY_RUN) {
    console.log('🧪 DRY_RUN：不寫入')
    return
  }

  // 1. 新增關鍵詞
  if (newWords.size) {
    const insert = [...newWords.values()].map((w) => ({
      name: w.name,
      category: w.category,
      risk_score: w.risk_score,
      reference: '化粧品衛生安全管理法第10條第1項',
    }))
    const { data: created, error } = await supabase.from('forbidden_words').insert(insert).select('id, name')
    if (error) throw new Error(`新增關鍵詞失敗：${error.message}`)
    const idByName = new Map(created.map((r) => [r.name, r.id]))
    for (const w of newWords.values()) w.id = idByName.get(w.name)
  }

  // 2. 寫入案例（分批）
  const payload = rows.map(({ _word, ...r }) => ({ ...r, forbidden_word_id: _word.id }))
  for (let i = 0; i < payload.length; i += 500) {
    const { error } = await supabase.from('violation_cases').insert(payload.slice(i, i + 500))
    if (error) throw new Error(`寫入 violation_cases 失敗：${error.message}`)
  }
  notice('完成', `已新增關鍵詞 ${newWords.size} 筆、案例 ${payload.length} 列`)
}

main().catch((err) => {
  console.error('❌ 匯入失敗：', err)
  process.exit(1)
})
