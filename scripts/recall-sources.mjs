/**
 * ════════════════════════════════════════════════════════════
 *  國際化粧品召回／警訊來源 + 台北市裁罰公告
 *  scripts/recall-sources.mjs（由 weekly-blog.mjs 匯入）
 * ════════════════════════════════════════════════════════════
 *
 *  每個 fetch 函式都回傳統一格式：
 *  { source_name, title, url, date, summary }
 *  任何一個來源失敗都只會印警告、回傳空陣列，不會讓整個週報失敗。
 *
 *  去重複靠 weekly-blog.mjs 的 source_log（以 url 為唯一鍵），
 *  所以這裡的 url 一定要「每一則召回各自唯一」。
 */

import { XMLParser } from 'fast-xml-parser'

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; 100check-weekly-bot; +https://www.aicheck.com.tw)' }

// 國際召回資料更新頻率不一（例如歐盟是週報），抓久一點，靠 source_log 去重
const INTL_LOOKBACK_DAYS = 35
const intlCutoff = () => new Date(Date.now() - INTL_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)

async function getText(url, opts = {}) {
  const res = await fetch(url, { headers: UA, ...opts })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
const clip = (s, n = 300) => String(s || '').slice(0, n)
const asArray = (x) => (Array.isArray(x) ? x : x ? [x] : [])

function warn(name, err) {
  console.warn(`⚠️ ${name} 抓取失敗：${err.message}`)
  debug(name, `抓取失敗：${err.message}`)
  return []
}

// 試跑（DRY_RUN）時把除錯訊息寫成 GitHub Actions 警告註記，不用下載 log 也看得到
export function debug(name, msg) {
  if (process.env.DRY_RUN && process.env.GITHUB_ACTIONS) {
    console.log(`::warning title=${name}::${String(msg).replace(/%/g, '%25').replace(/\r?\n/g, '%0A').slice(0, 900)}`)
  }
}

// ─── 英國 OPSS（GOV.UK 官方搜尋 API，cosmetics 類別）───
export async function fetchUK() {
  const name = '英國OPSS'
  try {
    const url =
      'https://www.gov.uk/api/search.json?filter_format=product_safety_alert_report_recall' +
      '&filter_product_category=cosmetics&order=-public_timestamp&count=20' +
      '&fields=title,link,public_timestamp,description'
    const data = JSON.parse(await getText(url))
    const cutoff = intlCutoff()
    return (data.results || [])
      .filter((r) => r.public_timestamp && new Date(r.public_timestamp) >= cutoff)
      .map((r) => ({
        source_name: name,
        title: r.title,
        url: `https://www.gov.uk${r.link}`,
        date: r.public_timestamp.slice(0, 10),
        summary: clip(r.description),
      }))
  } catch (e) {
    return warn(name, e)
  }
}

// ─── 加拿大 Health Canada（官方 open data JSON，Beauty and personal care）───
export async function fetchCanada() {
  const name = '加拿大HealthCanada'
  try {
    const url = 'https://recalls-rappels.canada.ca/sites/default/files/opendata-donneesouvertes/HCRSAMOpenData.json'
    const data = JSON.parse(await getText(url))
    const cutoff = intlCutoff()
    const beauty = asArray(data).filter((r) => /beauty and personal care|cosmetic/i.test(`${r.Category} ${r.Title}`))
    debug(name, `總筆數 ${asArray(data).length}，美妝類 ${beauty.length}，最新日期 ${beauty.map((r) => r['Last updated']).sort().pop()}`)
    return asArray(data)
      .filter((r) => /beauty and personal care|cosmetic/i.test(`${r.Category} ${r.Title}`))
      .filter((r) => r['Last updated'] && new Date(r['Last updated']) >= cutoff)
      .filter((r) => String(r.Archived) !== '1')
      .slice(0, 15)
      .map((r) => ({
        source_name: name,
        title: r.Title,
        url: r.URL,
        date: r['Last updated'],
        summary: clip(`產品：${r.Product || ''}；問題：${r.Issue || ''}`),
      }))
  } catch (e) {
    return warn(name, e)
  }
}

// ─── 歐盟 Safety Gate（官方週報 XML：先抓清單，再抓近期週報明細）───
// 明細 XML 結構沒有公開文件，所以用「遞迴找出含化粧品類別的通報物件」的方式解析
function findNotifications(node, out = []) {
  if (!node || typeof node !== 'object') return out
  if (Array.isArray(node)) {
    node.forEach((n) => findNotifications(n, out))
    return out
  }
  const flat = JSON.stringify(node)
  const keys = Object.keys(node).join(' ').toLowerCase()
  const looksLikeAlert = /category/.test(keys) && /(product|name|brand)/.test(keys)
  if (looksLikeAlert && /cosmetic/i.test(flat) && flat.length < 20000) {
    out.push(node)
    return out
  }
  Object.values(node).forEach((v) => findNotifications(v, out))
  return out
}

function pick(obj, patterns) {
  // 在物件（含巢狀）中找第一個 key 符合 pattern 的字串值
  const stack = [obj]
  while (stack.length) {
    const cur = stack.shift()
    if (!cur || typeof cur !== 'object') continue
    for (const [k, v] of Object.entries(cur)) {
      if (patterns.some((p) => p.test(k)) && (typeof v === 'string' || typeof v === 'number')) return String(v)
    }
    stack.push(...Object.values(cur).filter((v) => v && typeof v === 'object'))
  }
  return ''
}

export async function fetchEU() {
  const name = '歐盟SafetyGate'
  try {
    const list = xml.parse(await getText('https://ec.europa.eu/safety-gate-alerts/api/download/weeklyReport/list/xml/en'))
    const reports = asArray(list?.['Safety-Gate']?.weeklyReport)
    const cutoff = intlCutoff()
    const recent = reports
      .map((r) => {
        const [d, m, y] = String(r.publicationDate || '').split('/').map(Number)
        return { ...r, pub: y ? new Date(y, m - 1, d) : null }
      })
      .filter((r) => r.pub && r.pub >= cutoff && r.URL)
      .slice(0, 3)

    const items = []
    for (const rep of recent) {
      const detail = xml.parse(await getText(rep.URL))
      for (const n of findNotifications(detail)) {
        const ref = pick(n, [/^reference$/i, /alert.?number/i, /^caseNumber$/i, /notification.?number/i, /^id$/i])
        const product = pick(n, [/^name$/i, /product.?name/i, /^product$/i])
        const brand = pick(n, [/brand/i])
        const risk = pick(n, [/risk.?type/i, /^risk$/i, /hazard/i])
        const measures = pick(n, [/measure/i])
        const country = pick(n, [/notifying.?country/i, /^country$/i])
        const link = pick(n, [/^url$/i, /link/i])
        const key = ref || `${brand}-${product}`
        items.push({
          source_name: name,
          title: `歐盟 Safety Gate 化粧品通報：${brand || '（未載明品牌）'}「${product || '（未載明產品）'}」`,
          url: link && /^https?:/.test(link) ? link : `https://ec.europa.eu/safety-gate-alerts/screen/webReport#${encodeURIComponent(key)}`,
          date: rep.publicationDate,
          summary: clip([risk && `風險：${risk}`, measures && `措施：${measures}`, country && `通報國：${country}`, ref && `編號：${ref}`].filter(Boolean).join('；')),
        })
      }
    }
    return items.slice(0, 15)
  } catch (e) {
    return warn(name, e)
  }
}

// ─── 美國 FDA（openFDA 召回執行報告，再補 FDA 召回 RSS 的化粧品相關新聞稿）───
export async function fetchUS() {
  const name = '美國FDA'
  const items = []
  const cutoff = intlCutoff()
  const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, '')
  try {
    const url =
      `https://api.fda.gov/food/enforcement.json?search=product_type:"Cosmetics"+AND+report_date:[${ymd(cutoff)}+TO+${ymd(new Date())}]&limit=20`
    const res = await fetch(url, { headers: UA })
    if (res.ok) {
      const data = await res.json()
      for (const r of data.results || []) {
        items.push({
          source_name: name,
          title: `FDA 召回：${r.recalling_firm || ''}－${clip(r.product_description, 80)}`,
          url: `https://www.accessdata.fda.gov/scripts/ires/index.cfm#${encodeURIComponent(r.recall_number || r.event_id || r.product_description)}`,
          date: r.report_date,
          summary: clip(`召回等級：${r.classification || ''}；原因：${r.reason_for_recall || ''}`),
        })
      }
    } else if (res.status !== 404) {
      console.warn(`⚠️ ${name} openFDA 回應 ${res.status}`)
    }
  } catch (e) {
    warn(`${name} openFDA`, e)
  }
  try {
    const rss = xml.parse(await getText('https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/recalls/rss.xml'))
    for (const r of asArray(rss?.rss?.channel?.item)) {
      const text = `${r.title} ${r.description}`
      const cosmeticWords = /cosmetic|shampoo|conditioner|sunscreen|body wash|hand soap|face wash|lotion|moisturi[sz]er|toothpaste|mouthwash|deodorant|mascara|eyeliner|eye shadow|lipstick|lip gloss|nail polish|hair dye|hair color|tattoo ink|baby wipes|dry shampoo|makeup|skin ?care/i
      const foodWords = /ice cream|gelato|cheese|snack|cookie|candy|chocolate|frozen|beverage|juice|supplement|tablet|capsule|undeclared|allergen|listeria|salmonella|e\. coli/i
      if (!cosmeticWords.test(text) || foodWords.test(text)) continue
      const d = r.pubDate ? new Date(r.pubDate) : null
      if (d && d < cutoff) continue
      items.push({ source_name: name, title: stripTags(r.title), url: r.link, date: r.pubDate || '', summary: clip(stripTags(r.description)) })
    }
  } catch (e) {
    warn(`${name} RSS`, e)
  }
  return items.slice(0, 15)
}

// ─── 泰國 FDA 危險化粧品清單（官方網頁，無日期，靠 source_log 去重，只取最上面幾筆）───
export async function fetchThailand() {
  const name = '泰國FDA'
  try {
    const html = await getText('https://cosmetic.fda.moph.go.th/dangerous-cosmetics')
    const occ = (html.match(/dangerous-cosmetics\//g) || []).length
    const sample = (html.match(/.{0,120}dangerous-cosmetics\/.{0,160}/s) || [''])[0]
    debug(name, `HTML 長度 ${html.length}，出現 dangerous-cosmetics/ ${occ} 次。範例：${sample}`)
    const items = []
    const seen = new Set()
    const re = /<a[^>]+href=["']([^"']*\/dangerous-cosmetics\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
    let m
    while ((m = re.exec(html)) && items.length < 10) {
      let href = m[1].trim()
      if (!/^https?:/.test(href)) href = new URL(href, 'https://cosmetic.fda.moph.go.th').href
      const title = stripTags(m[2])
      if (!title || title.length < 3 || seen.has(href)) continue
      seen.add(href)
      // 抓連結後方一小段文字當摘要（通常含違規原因，例如 พบสารห้ามใช้＝檢出禁用成分）
      const tail = stripTags(html.slice(m.index + m[0].length, m.index + m[0].length + 600)).slice(0, 200)
      items.push({ source_name: name, title: `泰國FDA危險化粧品：${title}`, url: href, date: '', summary: tail })
    }
    return items
  } catch (e) {
    return warn(name, e)
  }
}

// ─── 日本（PMDA 回收資料庫沒有公開 API，改用 Google News 日文「化粧品 自主回収」）───
export async function fetchJapan() {
  const name = '日本回收'
  try {
    const q = encodeURIComponent('化粧品 (自主回収 OR リコール)')
    const rss = xml.parse(await getText(`https://news.google.com/rss/search?q=${q}&hl=ja&gl=JP&ceid=JP:ja`))
    const cutoff = intlCutoff()
    return asArray(rss?.rss?.channel?.item)
      .filter((r) => !r.pubDate || new Date(r.pubDate) >= cutoff)
      .slice(0, 10)
      .map((r) => ({ source_name: name, title: r.title, url: r.link, date: r.pubDate || '', summary: clip(stripTags(r.description)) }))
  } catch (e) {
    return warn(name, e)
  }
}

// ─── 台北市衛生局「化粧品違規廣告處罰案件統計表」（每月一份 PDF，內含被罰廠商名單）───
async function pdfToText(buf, maxChars = 6000) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await getDocument({ data: new Uint8Array(buf), useSystemFonts: true }).promise
  let text = ''
  for (let p = 1; p <= doc.numPages && text.length < maxChars; p++) {
    const page = await doc.getPage(p)
    const tc = await page.getTextContent()
    // 依 y 座標分行，讓表格列盡量維持在同一行
    const rows = new Map()
    for (const it of tc.items) {
      const y = Math.round(it.transform[5])
      rows.set(y, (rows.get(y) || '') + it.str + ' ')
    }
    text += [...rows.entries()].sort((a, b) => b[0] - a[0]).map(([, t]) => t.trim()).filter(Boolean).join('\n') + '\n'
  }
  return text.slice(0, maxChars)
}

export async function fetchTaipeiPenalties() {
  const name = '台北市裁罰'
  try {
    const base = 'https://health.gov.taipei/News.aspx?n=13A23138C06A3532&sms=8E7386D329C4B210'
    const html = await getText(base)
    const re = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
    const items = []
    let m
    while ((m = re.exec(html)) && items.length < 2) {
      const title = stripTags(m[2])
      if (!/化粧品違規廣告處罰案件統計表/.test(title)) continue
      const href = new URL(m[1].replace(/&amp;/g, '&'), 'https://health.gov.taipei/').href
      const near = html.slice(m.index, m.index + 1500)
      const date = (near.match(/1\d{2}-\d{2}-\d{2}/) || [''])[0]
      let text = ''
      try {
        const res = await fetch(href, { headers: UA })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        text = await pdfToText(await res.arrayBuffer())
      } catch (e) {
        debug(name, `PDF 解析失敗：${e.message}`)
      }
      items.push({
        source_name: name,
        title,
        url: href,
        date,
        // 給 AI 的原始表格文字（內含處分日期、廠商、產品、違規內容、罰鍰）
        summary: text ? `【統計表內容節錄】\n${text}` : '（PDF 內容無法解析，請只列出公告標題）',
      })
    }
    debug(name, `找到 ${items.length} 份統計表；第一份文字長度 ${items[0]?.summary.length || 0}。節錄：${(items[0]?.summary || '').slice(0, 500)}`)
    return items
  } catch (e) {
    return warn(name, e)
  }
}

export async function fetchAllInternationalRecalls() {
  const results = await Promise.all([fetchEU(), fetchUS(), fetchUK(), fetchCanada(), fetchJapan(), fetchThailand()])
  return results.flat()
}
