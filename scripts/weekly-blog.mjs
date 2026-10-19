/**
 * ════════════════════════════════════════════════════════════
 *  每週自動監控 + 寫文章腳本
 *  scripts/weekly-blog.mjs
 * ════════════════════════════════════════════════════════════
 *
 *  做什麼：
 *  1. 抓取 4 個來源本週的新資料
 *     - TFDA 本署公告／新聞（官方 DataAction API）
 *     - TFDA 違規化粧品廣告資料集（官方開放資料 API）
 *     - 國際法規更新（Google News RSS：SCCS / EU cosmetics regulation）
 *     - 台灣新聞媒體（Google News RSS：化妝品 違規／裁罰 關鍵字）
 *  2. 去除「上週已經處理過」的項目（用 Supabase 的 source_log 表記錄）
 *  3. 把新項目丟給 Gemini API（Google，免費），整理寫成一篇繁體中文文章
 *  4. 寫入 Supabase 的 articles 表，並標記 published: true
 *
 *  執行：由 GitHub Actions 排程觸發（見 .github/workflows/weekly-blog.yml）
 *  也可以在本機手動跑：node scripts/weekly-blog.mjs
 *
 *  需要的環境變數（GitHub Secrets）：
 *  - GEMINI_API_KEY            （Google AI Studio 免費申請，不需信用卡）
 *  - SUPABASE_URL              （即 VITE_SUPABASE_URL 的值）
 *  - SUPABASE_SERVICE_ROLE_KEY （Supabase 專案設定 → API → service_role key，不是 anon key！）
 */

import { createClient } from '@supabase/supabase-js'
import { XMLParser } from 'fast-xml-parser'
import { fetchAllInternationalRecalls, fetchTaipeiPenalties, debug } from './recall-sources.mjs'

// ─── 環境變數檢查 ───
const {
  GEMINI_API_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env

if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 缺少必要的環境變數：GEMINI_API_KEY / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const xml = new XMLParser({ ignoreAttributes: false })

// 只處理最近 N 天內的項目（配合每週排程，抓 8 天留一點緩衝）
const LOOKBACK_DAYS = 8
const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
// 違規廣告資料集更新較慢（常落後數週），抓 45 天，再靠 source_log 去重，才不會每週都 0 筆
const VIOLATION_LOOKBACK_DAYS = 45
const violationCutoff = new Date(Date.now() - VIOLATION_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
const DRY_RUN = !!process.env.DRY_RUN

function fmtDate(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())}`
}

// ════════════════════════════════════════════════════════════
// 來源 1：TFDA 本署公告／新聞
// 官方文件：https://www.fda.gov.tw/tc/DataAction.aspx
// ════════════════════════════════════════════════════════════
async function fetchTFDAAnnouncements() {
  const items = []
  const keywords = ['化粧品', '化妝品']
  const startdate = fmtDate(cutoff)
  const enddate = fmtDate(new Date())

  for (const keyword of keywords) {
    try {
      const url = `http://www.fda.gov.tw/DataAction?keyword=${encodeURIComponent(keyword)}&startdate=${startdate}&enddate=${enddate}`
      const res = await fetch(url)
      if (!res.ok) {
        console.warn(`⚠️ TFDA 公告 API 回應非 200（keyword=${keyword}）：${res.status}`)
        continue
      }
      const data = await res.json()
      const list = Array.isArray(data) ? data : data?.Data || data?.data || []
      for (const row of list) {
        items.push({
          source_name: 'TFDA公告',
          title: row['標題'] || row.title || '（無標題）',
          url: row['附檔連結'] || row.link || `https://www.fda.gov.tw/`,
          date: row['發布日期'] || row.date || enddate,
          summary: (row['內容'] || row.content || '').slice(0, 300),
        })
      }
    } catch (err) {
      console.warn(`⚠️ TFDA 公告抓取失敗（keyword=${keyword}）：${err.message}`)
    }
  }
  return items
}

// ════════════════════════════════════════════════════════════
// 來源 2：TFDA 違規化粧品廣告資料集
// 資料集頁面：https://data.gov.tw/dataset/... （InfoId=158）
// ════════════════════════════════════════════════════════════
async function fetchTFDAViolations() {
  const items = []
  try {
    const url = 'https://data.fda.gov.tw/data/opendata/export/158/json'
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`⚠️ TFDA 違規廣告資料集回應非 200：${res.status}`)
    debug('TFDA裁罰', `HTTP ${res.status}`)
      return items
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : data?.Data || []
    const dates = list.map((row) => parseROCorADDate(row['處分日期'] || row['刊播日期'] || '')).filter(Boolean).sort((a, b) => b - a)
    debug('TFDA裁罰', `資料集共 ${list.length} 筆，可解析日期 ${dates.length} 筆，最新 ${dates[0]?.toISOString().slice(0, 10)}。欄位：${Object.keys(list[0] || {}).join('、')}`)
    const parsed = list
      .map((row) => ({ row, rowDate: parseROCorADDate(row['處分日期'] || row['刊播日期'] || '') }))
      // 保守處理：日期解析不出來的，寧可跳過也不要誤收進一大包舊資料
      .filter((x) => x.rowDate && x.rowDate >= violationCutoff)
      // 保險上限：就算篩選邏輯還是抓太多，最多只取最近 50 筆，避免塞爆 AI 的輸入
      .sort((a, b) => b.rowDate - a.rowDate)
      .slice(0, 30)

    for (const { row, rowDate } of parsed) {
      const dateStr = row['處分日期'] || row['刊播日期'] || ''
      items.push({
        source_name: 'TFDA裁罰',
        title: `違規裁罰：${row['違規產品名稱'] || '（未載明產品）'}（${row['違規廠商名稱或負責人'] || '未載明廠商'}）`,
        // 資料集沒有個別連結，用「資料集頁 + 產品/廠商/日期」組成唯一識別，才能正確去重
        url: `https://data.gov.tw/dataset/154561#${encodeURIComponent(
          [row['違規產品名稱'], row['違規廠商名稱或負責人'], row['處分日期'] || row['刊播日期']].join('|')
        )}`,
        date: dateStr,
        summary: [
          row['處分機關'] && `處分機關：${row['處分機關']}`,
          row['處分法條'] && `處分法條：${row['處分法條']}`,
          row['違規情節'] && `違規情節：${row['違規情節']}`,
          row['查處情形'] && `查處情形：${row['查處情形']}`,
        ].filter(Boolean).join('；'),
      })
    }
  } catch (err) {
    console.warn(`⚠️ TFDA 違規廣告資料集抓取失敗：${err.message}`)
    debug('TFDA裁罰', `抓取失敗：${err.message}`)
  }
  return items
}

// 民國年或西元年日期字串轉 Date（抓不到就回傳 null，不會擋掉這筆資料）
function parseROCorADDate(str) {
  if (!str) return null
  const m = String(str).match(/(\d{2,4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/)
  if (!m) return null
  let [, y, mo, d] = m.map(Number)
  if (y < 1911) y += 1911 // 民國年轉西元年
  const dt = new Date(y, mo - 1, d)
  return isNaN(dt.getTime()) ? null : dt
}

// ════════════════════════════════════════════════════════════
// 來源 3 & 4：Google News RSS（國際法規 + 台灣新聞）
// 免金鑰、公開可用，格式：https://news.google.com/rss/search?q=...
// ════════════════════════════════════════════════════════════
async function fetchGoogleNewsRSS({ sourceName, query, hl, gl, ceid }) {
  const items = []
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`⚠️ Google News RSS 回應非 200（${sourceName}）：${res.status}`)
      return items
    }
    const text = await res.text()
    const parsed = xml.parse(text)
    const rawItems = parsed?.rss?.channel?.item || []
    const list = Array.isArray(rawItems) ? rawItems : [rawItems]

    for (const row of list) {
      const pubDate = row.pubDate ? new Date(row.pubDate) : null
      if (pubDate && pubDate < cutoff) continue
      items.push({
        source_name: sourceName,
        title: row.title || '（無標題）',
        url: row.link || '',
        date: row.pubDate || '',
        summary: (row.description || '').replace(/<[^>]+>/g, '').slice(0, 300),
      })
    }
  } catch (err) {
    console.warn(`⚠️ Google News RSS 抓取失敗（${sourceName}）：${err.message}`)
  }
  return items
}

async function fetchInternationalRegUpdates() {
  return fetchGoogleNewsRSS({
    sourceName: '國際法規',
    query: '(SCCS cosmetic ingredient OR "EU cosmetic regulation" OR "cosmetics regulation" update)',
    hl: 'en-GB',
    gl: 'EU',
    ceid: 'GB:en',
  })
}

async function fetchTaiwanNews() {
  return fetchGoogleNewsRSS({
    sourceName: '台灣新聞',
    query: '化妝品 (違規 OR 裁罰 OR 廣告 OR 下架)',
    hl: 'zh-TW',
    gl: 'TW',
    ceid: 'TW:zh-Hant',
  })
}

// ════════════════════════════════════════════════════════════
// 去重複：查 source_log，過濾掉已經處理過的 url
// ════════════════════════════════════════════════════════════
async function filterUnseen(items) {
  if (items.length === 0) return items
  const urls = items.map((i) => i.url).filter(Boolean)
  if (urls.length === 0) return items

  const { data: seen, error } = await supabase
    .from('source_log')
    .select('source_url')
    .in('source_url', urls)

  if (error) {
    console.warn('⚠️ 查詢 source_log 失敗，本次不過濾重複：', error.message)
    return items
  }

  const seenSet = new Set((seen || []).map((r) => r.source_url))
  let unseen = items.filter((i) => !i.url || !seenSet.has(i.url))

  // 第二層：標題去重。同一則新聞常被不同媒體用不同網址轉載，
  // 所以也比對「已處理過的標題」與「本批內部重複的標題」。
  const { data: pastTitles } = await supabase
    .from('source_log')
    .select('title')
    .order('seen_at', { ascending: false })
    .limit(500)
  const norm = (t) => String(t || '').replace(/\s*[-–—|｜].{0,30}$/, '').replace(/[\s\p{P}]/gu, '').toLowerCase()
  const seenTitles = new Set((pastTitles || []).map((r) => norm(r.title)))
  unseen = unseen.filter((i) => {
    const k = norm(i.title)
    if (!k || seenTitles.has(k)) return false
    seenTitles.add(k)
    return true
  })
  return unseen
}

async function markAsSeen(items) {
  // 同一批內若有重複網址，upsert 會整批失敗，所以先去重
  const byUrl = new Map()
  for (const i of items) if (i.url && !byUrl.has(i.url)) byUrl.set(i.url, i)
  const rows = [...byUrl.values()].map((i) => ({ source_url: i.url, source_name: i.source_name, title: i.title }))
  if (rows.length === 0) return
  const { error } = await supabase.from('source_log').upsert(rows, { onConflict: 'source_url' })
  if (error) console.warn('⚠️ 寫入 source_log 失敗：', error.message)
  else console.log(`   已記錄 ${rows.length} 筆來源到 source_log`)
}

// ════════════════════════════════════════════════════════════
// 呼叫 Gemini API（Google AI Studio，免費），把整理過的原始資料寫成一篇文章
// 文件：https://ai.google.dev/gemini-api/docs
// ════════════════════════════════════════════════════════════
async function fetchRecentArticles(n = 6) {
  const { data } = await supabase
    .from('articles')
    .select('title, summary')
    .order('created_at', { ascending: false })
    .limit(n)
  return data || []
}

async function generateArticle(items) {
  const recent = await fetchRecentArticles()
  const recentText = recent.length
    ? recent.map((a, i) => `${i + 1}. ${a.title}｜${a.summary || ''}`).join('\n')
    : '（無）'
  const sourceText = items
    .map((i, idx) => `${idx + 1}. [${i.source_name}] ${i.title}\n   日期：${i.date}\n   連結：${i.url}\n   摘要：${i.summary || '（無）'}`)
    .join('\n\n')

  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })

  const systemPrompt = `你是「審盾橘」（100check）網站的化妝品法規專欄編輯，專業背景是化妝品法規事務與產品合規。
你的任務是把本週蒐集到的原始資料，整理成一篇專業、精簡、對品牌業者有實用價值的繁體中文週報文章。

寫作規則：
- 用繁體中文（台灣用語，例如「化粧品」是法規正式用字，一般敘述可用「化妝品」）
- 語氣專業但易讀，避免生硬的公文腔
- 依主題分類整理，每類用 ## 小標題。以下兩個段落為固定必備（資料中有相關項目時一定要寫）：
  1. 「## 本週台灣違規裁罰廠商」：把來源為 [TFDA裁罰]、[台北市裁罰] 以及新聞中明確點名的違規業者，整理成 Markdown 表格，欄位：廠商｜產品｜違規情節｜處分機關／法條｜日期。廠商與產品名稱照資料原文，不可改寫或臆測；資料沒寫的欄位填「—」。表格後用 2-3 句話點出共通的違規類型與提醒
  2. 「## 國際化粧品召回與警訊」：把來源為 [歐盟SafetyGate]、[美國FDA]、[英國OPSS]、[加拿大HealthCanada]、[日本回收]、[泰國FDA] 的項目整理成 Markdown 表格，欄位：國家／機關｜品牌或廠商｜產品｜原因｜連結。外文產品名保留原文，原因翻成中文（例如檢出禁用成分、微生物超標、標示不全）。表格後說明「台灣品牌／代理商該注意什麼」，例如是否有相同成分、是否有在台販售的可能
  - 若本週該類沒有資料，就寫一句「本週無新增」，不要編造
- 其他主題（法規公告、國際法規更新、產業新聞）再依內容分段
- 對每則重要項目，說明「這對品牌/業者代表什麼」「有什麼合規上要注意的地方」，不要只是條列原文
- 開頭寫 2-3 句話的本週摘要
- 結尾可以加一段「本週提醒」，給品牌方實用建議
- 內容使用 Markdown 格式（## 標題、- 條列、**粗體**等）
- 不要編造資料中沒有的事實或數字
- 【避免雷同】系統會附上「最近已發布的文章」。請不要重複寫相同的主題與角度；若本週資料中有與之重疊的項目，只能一句話帶過，把篇幅留給「全新的」項目。標題必須反映本週最新、最不同的重點，不可沿用近期標題的句型

只回傳一個 JSON 物件，格式如下，不要有其他文字：
{
  "title": "文章標題（吸引人但專業，包含日期週次或主題）",
  "slug": "url-friendly-slug（英文小寫+連字號，例如 weekly-roundup-2026-09-22）",
  "summary": "1-2句話的文章摘要，會顯示在文章列表卡片上",
  "content": "完整文章內容，Markdown 格式",
  "refs": [{"label": "參考資料名稱", "url": "來源連結"}]
}`

  const userPrompt = `今天日期：${today}

本週蒐集到的原始資料（共 ${items.length} 則）：

${sourceText}

最近已發布的文章（請避免重複這些主題與角度）：
${recentText}

請根據以上資料撰寫本週的化妝品法規週報文章。`

  // gemini-flash-latest 是 Google 提供的別名，會自動指向當前的穩定版本，
  // 不用每次 Google 換模型代號就要手動更新。若忙線，退而求其次試備用模型。
  const models = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.5-flash']

  const requestBody = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      // 直接要求 JSON 輸出，省去自己剝 code fence 的麻煩
      responseMimeType: 'application/json',
      maxOutputTokens: 8192,
    },
  })

  // Gemini 偶爾會回 503（伺服器過載）或 429（速率限制），這兩種都值得重試；
  // 單一模型重試幾次還是忙線，就換下一個模型試試看。
  const MAX_ATTEMPTS_PER_MODEL = 3
  let res
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: requestBody,
      })

      if (res.ok) break
      const retryable = res.status === 503 || res.status === 429
      if (!retryable || attempt === MAX_ATTEMPTS_PER_MODEL) break

      const waitMs = attempt * 5000 // 5s, 10s...
      console.log(`⏳ Gemini（${model}）回應 ${res.status}（暫時性），${waitMs / 1000}秒後重試（第 ${attempt}/${MAX_ATTEMPTS_PER_MODEL} 次）...`)
      await new Promise((r) => setTimeout(r, waitMs))
    }
    if (res.ok) break
    if (res.status === 503 || res.status === 429) {
      console.log(`⏳ ${model} 重試多次仍忙線，改試下一個模型...`)
    }
  }

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini API 錯誤 ${res.status}：${errText}`)
  }

  const data = await res.json()
  const candidate = data.candidates?.[0]
  const textPart = candidate?.content?.parts?.find((p) => p.text)
  if (!textPart) {
    throw new Error(`Gemini API 回應沒有文字內容，finishReason：${candidate?.finishReason || '未知'}`)
  }

  let raw = textPart.text.trim()
  // 保險：萬一還是包了 code fence，剝掉它
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')

  let article
  try {
    article = JSON.parse(raw)
  } catch (err) {
    throw new Error(`無法解析 Gemini 回傳的 JSON：${err.message}\n原始內容：${raw.slice(0, 500)}`)
  }
  return article
}

// ════════════════════════════════════════════════════════════
// 寫入 Supabase articles 表
// ════════════════════════════════════════════════════════════
async function publishArticle(article) {
  // slug 加上日期避免撞名
  const dateSuffix = new Date().toISOString().slice(0, 10)
  const slug = `${article.slug || 'weekly-roundup'}-${dateSuffix}`

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: article.title,
      slug,
      summary: article.summary,
      content: article.content,
      refs: article.refs || [],
      published: true,
    })
    .select()
    .single()

  if (error) throw new Error(`寫入 Supabase articles 表失敗：${error.message}`)
  return data
}

// ════════════════════════════════════════════════════════════
// 主流程
// ════════════════════════════════════════════════════════════
async function main() {
  // 防止一週發兩篇：最近 3 天內已發過文章就跳過（手動補發可設 FORCE=1）
  if (!process.env.FORCE && !DRY_RUN) {
    const { data: last } = await supabase
      .from('articles')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
    const lastAt = last?.[0]?.created_at ? new Date(last[0].created_at) : null
    if (lastAt && Date.now() - lastAt.getTime() < 3 * 24 * 60 * 60 * 1000) {
      console.log(`✅ 最近一篇文章發布於 ${lastAt.toISOString()}，3 天內不重複發文，本次跳過。`)
      return
    }
  }

  console.log('🔍 開始蒐集本週資料...')

  const [tfdaNews, tfdaViolations, intlReg, twNews] = await Promise.all([
    fetchTFDAAnnouncements(),
    fetchTFDAViolations(),
    fetchInternationalRegUpdates(),
    fetchTaiwanNews(),
  ])
  const [intlRecalls, taipeiPenalties] = await Promise.all([fetchAllInternationalRecalls(), fetchTaipeiPenalties()])

  console.log(`   TFDA公告：${tfdaNews.length} 則`)
  console.log(`   TFDA裁罰：${tfdaViolations.length} 則`)
  console.log(`   國際法規：${intlReg.length} 則`)
  console.log(`   台灣新聞：${twNews.length} 則`)
  console.log(`   台北市裁罰：${taipeiPenalties.length} 則`)
  const bySource = {}
  for (const i of intlRecalls) bySource[i.source_name] = (bySource[i.source_name] || 0) + 1
  for (const k of ['歐盟SafetyGate', '美國FDA', '英國OPSS', '加拿大HealthCanada', '日本回收', '泰國FDA']) {
    console.log(`   ${k}：${bySource[k] || 0} 則`)
  }

  // 順序決定超過上限時優先保留誰：官方公告 > 台灣裁罰 > 國際召回 > 新聞
  const allItems = [...tfdaNews, ...tfdaViolations, ...taipeiPenalties, ...intlRecalls, ...intlReg, ...twNews]

  if (DRY_RUN) {
    console.log('🧪 DRY_RUN：只檢查來源，不呼叫 AI、不發布、不寫 source_log')
    const groups = {}
    for (const i of allItems) (groups[i.source_name] ||= []).push(i)
    for (const [k, list] of Object.entries(groups)) {
      console.log(`\n── ${k}（${list.length}）`)
      for (const i of list.slice(0, 3)) console.log(`   • ${i.date} ｜ ${i.title}\n     ${i.url}\n     ${String(i.summary).slice(0, 160)}`)
    }
    // GitHub Actions 註記（Annotations），方便不用下載 log 也能看到結果（每步驟上限 10 則）
    if (process.env.GITHUB_ACTIONS) {
      const esc = (t) => String(t).replace(/%/g, '%25').replace(/\r/g, '').replace(/\n/g, '%0A')
      const counts = Object.entries(groups).map(([k, l]) => `${k}=${l.length}`).join(', ')
      console.log(`::notice title=DRY_RUN counts::${esc(counts || 'no items')}`)
      const focus = ['TFDA裁罰', '台北市裁罰', '歐盟SafetyGate', '美國FDA', '英國OPSS', '加拿大HealthCanada', '日本回收', '泰國FDA', 'TFDA公告']
      for (const k of focus) {
        const list = groups[k] || []
        const body = list.length
          ? list.slice(0, 2).map((i) => `${i.date} | ${i.title} | ${i.url} | ${String(i.summary).slice(0, 120)}`).join('\n')
          : '0 items'
        console.log(`::notice title=${k}::${esc(body)}`)
      }
    }
    return
  }
  const newItems = await filterUnseen(allItems)
  // 保險上限：不管前面各來源篩選有沒有出包，送進 AI 的項目數都設個天花板
  const MAX_ITEMS = 100
  if (newItems.length > MAX_ITEMS) {
    console.log(`⚠️ 項目數 ${newItems.length} 超過上限，只取前 ${MAX_ITEMS} 筆`)
    newItems.length = MAX_ITEMS
  }

  console.log(`📋 去除重複後剩下 ${newItems.length} 則新項目`)

  const MIN_NEW_ITEMS = 3
  if (newItems.length > 0 && newItems.length < MIN_NEW_ITEMS) {
    console.log(`✅ 新項目僅 ${newItems.length} 則（少於 ${MIN_NEW_ITEMS}），累積到下週再一併寫，避免湊數灌水。`)
    return
  }
  if (newItems.length === 0) {
    console.log('✅ 本週沒有新資料，不產出文章。')
    return
  }

  console.log('✍️ 呼叫 Gemini API 撰寫文章...')
  const article = await generateArticle(newItems)

  console.log(`📝 產出文章：${article.title}`)
  const saved = await publishArticle(article)
  console.log(`✅ 已發布到 Supabase，文章 id：${saved.id}，slug：${saved.slug}`)

  await markAsSeen(newItems)
  console.log('✅ 已標記本次處理過的來源項目，避免下週重複。')
}

main().catch((err) => {
  console.error('❌ 執行失敗：', err)
  process.exit(1)
})
