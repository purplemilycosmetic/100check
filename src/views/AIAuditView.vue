<template>
  <div class="ai-audit-page">
    <h1>AI廣告檢核</h1>
    <p>本審核結果僅供參考，缺少字眼歡迎加line告知，增加我們資料庫</p>

    <div class="audit-input">
      <label>輸入廣告文案：</label>
      <div class="audit-wrapper">
        <textarea
          id="ad-text"
          v-model="adText"
          class="input-area"
          placeholder="請輸入您的廣告文案..."
          :maxlength="maxLength"
          @input="updateCharCount"
        ></textarea>
        <div class="highlight-area" v-html="highlightedText"></div>
      </div>
      <div class="char-count" :class="{ warning: charCount > maxLength }">
        字數：{{ charCount }} / {{ maxLength }}
        <span v-if="charCount > maxLength" class="warning-text">（超出字數限制）</span>
      </div>
    </div>

    <div class="legend">
      <span class="legend-item l5">★★★★★ 極高</span>
      <span class="legend-item l4">★★★★☆ 高</span>
      <span class="legend-item l3">★★★☆☆ 中</span>
      <span class="legend-item l2">★★☆☆☆ 低</span>
      <span class="legend-item l1">★☆☆☆☆ 觀察</span>
    </div>

    <button @click="auditAd" class="audit-button" :disabled="!adText || loading">
      {{ loading ? '詞庫載入中...' : '審核' }}
    </button>

    <div v-if="auditResult !== null" class="audit-result">
      <h3>審核結果</h3>
      <div v-html="auditResult"></div>
      <div v-if="violationCount > 0" class="risk-tag">未通過（共 {{ violationCount }} 項）</div>
      <div v-else-if="violationCount === 0 && auditResult" class="risk-tag low-risk">通過</div>
    </div>
  </div>
</template>

<script>
import { useHead } from '@unhead/vue'
import { supabase } from '../supabaseClient'

export default {
  name: 'AIAuditView',
  setup() {
    useHead({
      title: '免費 AI 廣告文案審查工具｜化妝品廣告合規檢測 - 審盾橘',
      meta: [
        { name: 'description', content: '免費使用 AI 審查化妝品（化粧品）廣告文案，自動標示違規風險字眼，依據政府裁罰案例即時檢測，幫助品牌廣告文案符合法規，避免罰款。' },
        { property: 'og:title', content: '免費 AI 廣告文案審查工具｜化妝品廣告合規 - 審盾橘' },
        { property: 'og:description', content: '免費 AI 化妝品廣告文案審查，自動標示風險字眼，依政府裁罰案例辨識違規內容。' },
        { property: 'og:url', content: 'https://www.aicheck.com.tw/ai-audit' },
      ],
      link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/ai-audit' }],
    })
  },
  data() {
    return {
      adText: '',
      auditResult: null,
      violationCount: 0,
      loading: false,
      maxLength: 2000,
      charCount: 0,
      forbiddenWordsList: [],
      whitelistSet: new Set([
        '修復','修護','修復肌膚','修護肌膚',
        '滋潤肌膚','調理肌膚','清潔肌膚','保護肌膚',
        '舒緩肌膚乾燥不適感','舒緩肌膚壓力',
        '緊緻毛孔','收斂毛孔','通暢毛孔','淨化毛孔',
        '淡化皺紋','淡化細紋','撫平皺紋','撫平細紋',
        '延緩肌膚老化','防止肌膚老化',
        '改善暗沉','均勻膚色',
        '保濕','補水','鎖水','保水',
        '控油','抗痘','去角質',
        '淨白肌膚','美白肌膚','亮白肌膚',
        '幫助改善黑眼圈','幫助淡化黑眼圈',
        '幫助改善泡泡眼','幫助改善熊貓眼',
        '強健髮根','滋養頭皮','滋養頭髮',
        '防止髮絲斷裂','防止髮絲分叉',
        '去除多餘油脂',
        '促進角質更新代謝','促進肌膚新陳代謝',
        '改善毛躁髮質','修護毛躁髮質','改善乾燥髮質','修護乾燥髮質',
        '草本','植萃','放鬆心情','舒緩壓力',
        '減緩因乾燥引起的皮膚癢',
        '減緩因乾燥引起的皮膚泛紅',
      ])
    }
  },

  async mounted() {
    this.loading = true
    try {
      // Supabase 預設每次只回傳 1000 筆，詞庫已超過，必須分頁拉完
      const PAGE = 500
      let allData = []
      let page = 0
      while (true) {
        const { data, error } = await supabase
          .from('forbidden_words')
          .select(`
            id, name, core_keyword, category, risk_score, fix_suggestion, reference,
            violation_cases (
              case_no, company, product, ad_source,
              fine, enforce_unit, enforce_date, phrase, law_ref
            )
          `)
          .order('id', { ascending: true })
          .range(page * PAGE, (page + 1) * PAGE - 1)
        if (error) throw error
        if (!data || data.length === 0) break
        allData = allData.concat(data)
        if (data.length < PAGE) break
        page++
      }
      this.forbiddenWordsList = allData
      console.log(`詞庫載入完成：${allData.length} 筆（共 ${page + 1} 頁）`)
    } catch (e) {
      console.error('詞庫載入失敗:', e)
    } finally {
      this.loading = false
    }
  },

  computed: {
    highlightedText() {
      if (!this.adText || !this.forbiddenWordsList.length) return ''
      const text = this.adText
      // 共用比對：取得違規區間與白名單區間（與審核結果完全一致）
      const { matches, whiteRanges } = this.computeMatches(text)

      const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      const toHtml = s => esc(s).replace(/\n/g,'<br>')

      // 合併違規＋白名單區間，違規優先（去重疊）
      const allRanges = [
        ...matches.map(m => ({ ...m, type: 'violation' })),
        ...whiteRanges.map(r => ({ ...r, item: null, type: 'white' }))
      ].sort((a, b) => a.start - b.start)
      const rendered = []
      for (const r of allRanges) {
        if (!rendered.some(x => r.start < x.end && r.end > x.start)) rendered.push(r)
      }
      rendered.sort((a, b) => a.start - b.start)

      let result = '', last = 0
      for (const r of rendered) {
        result += toHtml(text.slice(last, r.start))
        if (r.type === 'violation') {
          const score = r.item.risk_score || 3
          const stars = '★'.repeat(score) + '☆'.repeat(5 - score)
          const cases = (r.item.violation_cases || []).slice(0, 2)
            .map(c => `${c.company}（罰${((c.fine||0)/10000).toFixed(0)}萬，${c.ad_source||''}）`)
            .join(' / ')
          const title = esc(`${stars} ${r.item.category||''} ｜ ${cases||'法規明文禁用詞'}`)
          result += `<span class="hl hl${score}" title="${title}">${esc(r.item.name.trim())}</span>`
        } else {
          result += `<span class="hl-ok" title="附件二合法詞彙">${esc(text.slice(r.start, r.end))}</span>`
        }
        last = r.end
      }
      result += toHtml(text.slice(last))
      return result
    }
  },

  methods: {
    updateCharCount() { this.charCount = this.adText.length },
    riskLabel(s) {
      return {5:'極高風險（醫療效能）',4:'高風險',3:'中風險',2:'低風險',1:'觀察'}[s]||'未知'
    },

    // ★ 核心：單一比對來源，預覽與審核共用，確保結果一致、無子字串重複
    computeMatches(text) {
      // 1. 先標白名單區間（長詞優先，不重疊）
      const whiteRanges = []
      const whitelistSorted = [...this.whitelistSet]
        .filter(w => w.length >= 2)
        .sort((a, b) => b.length - a.length)
      for (const w of whitelistSorted) {
        let idx = 0
        while (idx < text.length) {
          const pos = text.indexOf(w, idx)
          if (pos === -1) break
          const end = pos + w.length
          if (!whiteRanges.some(r => pos < r.end && end > r.start))
            whiteRanges.push({ start: pos, end })
          idx = pos + 1
        }
      }
      // 2. 違規詞比對（長詞優先，不重疊，跳過白名單區間）
      const candidates = this.forbiddenWordsList
        .filter(item => item.name && item.name.trim().length >= 2)
        .sort((a, b) => b.name.length - a.name.length)
      const matches = []
      for (const item of candidates) {
        const kw = item.name.trim()
        let idx = 0
        while (idx <= text.length - kw.length) {
          const pos = text.indexOf(kw, idx)
          if (pos === -1) break
          const end = pos + kw.length
          const inWhite = whiteRanges.some(r => pos >= r.start && end <= r.end)
          const overlaps = matches.some(m => pos < m.end && end > m.start)
          if (!inWhite && !overlaps) matches.push({ start: pos, end, item })
          idx = pos + 1
        }
      }
      matches.sort((a, b) => a.start - b.start)
      return { matches, whiteRanges }
    },

    auditAd() {
      if (!this.forbiddenWordsList.length) {
        this.auditResult = '<p class="empty">⚠️ 詞庫尚未載入，請稍後再試</p>'
        this.violationCount = 0; return
      }

      // 與預覽共用同一套比對，從實際命中區間取違規詞
      const { matches } = this.computeMatches(this.adText)

      // 同一違規詞（同 id）只列一張卡片
      const matchedMap = new Map()
      for (const m of matches) {
        if (!matchedMap.has(m.item.id)) matchedMap.set(m.item.id, m.item)
      }
      const matched = [...matchedMap.values()].sort((a,b)=>(b.risk_score||3)-(a.risk_score||3))
      this.violationCount = matched.length

      if (!matched.length) {
        this.auditResult = '<p class="pass">✅ 無違規用語，文案符合規範</p>'; return
      }

      const adSourceIcon = s => ({'網站':'🌐','電視':'📺','雜誌':'📰'}[s]||'📄')

      const cards = matched.map((item, idx) => {
        const score = item.risk_score || 3
        const stars = '★'.repeat(score) + '☆'.repeat(5 - score)
        const cases = item.violation_cases || []

        const lawBadge = item.reference?.includes('第2項')
          ? `<span class="badge-2p">⚠️ 涉及醫療效能（第2項，罰則更重）</span>` : ''

        const caseCards = cases.map(c => {
          const fineW = c.fine ? `${(c.fine/10000).toFixed(0)}萬元` : ''
          return `<div class="case-card">
            <div class="case-top">
              <span class="case-company">${c.company||''}</span>
              ${fineW ? `<span class="case-fine">罰 ${fineW}</span>` : ''}
            </div>
            <div class="case-meta">
              ${c.case_no  ? `<span>案件 #${c.case_no}</span>` : ''}
              ${c.ad_source ? `<span>${adSourceIcon(c.ad_source)} ${c.ad_source}</span>` : ''}
              ${c.enforce_unit ? `<span>🏛 ${c.enforce_unit}</span>` : ''}
              ${c.enforce_date ? `<span>📅 ${c.enforce_date}</span>` : ''}
            </div>
            ${c.product ? `<div class="case-product">產品：${c.product}</div>` : ''}
            ${c.phrase  ? `<div class="case-phrase">${c.phrase}</div>` : ''}
            ${c.law_ref ? `<div class="case-law">⚖️ ${c.law_ref}</div>` : ''}
          </div>`
        }).join('')

        const caseSection = cases.length
          ? `<div class="card-row">
               <span class="card-label">📋 被罰案例</span>
               <div class="cases-wrap">${caseCards}</div>
             </div>`
          : `<div class="card-row">
               <span class="card-label">📋 法規依據</span>
               <span class="legal-note">此詞句為認定準則附件明文禁用詞，尚無臺北市實際裁罰紀錄，但使用即屬違規。</span>
             </div>`

        const fixSection = item.fix_suggestion
          ? `<div class="card-row">
               <span class="card-label">✏️ 修改建議</span>
               <span class="fix-text">${item.fix_suggestion}</span>
             </div>` : ''

        const refSection = item.reference
          ? `<div class="card-row">
               <span class="card-label">⚖️ 法規條文</span>
               <span>${item.reference}</span>
             </div>` : ''

        return `<div class="vcard risk${score}">
          <div class="vcard-head">
            <span class="vnum">${idx+1}</span>
            <span class="vphrase">${item.name.trim()}</span>
            ${item.category ? `<span class="vtag">${item.category}</span>` : ''}
            <span class="vstars s${score}">${stars}</span>
            <span class="vlabel">${this.riskLabel(score)}</span>
          </div>
          ${lawBadge}
          ${caseSection}${fixSection}${refSection}
        </div>`
      }).join('')

      this.auditResult = `
        <p class="summary">共檢出 <strong>${matched.length}</strong> 項違規詞彙，請參考被罰案例與修改建議：</p>
        ${cards}`
    }
  }
}
</script>

<style scoped>
.ai-audit-page { padding: 2.5rem; text-align: center; min-height: calc(100vh - 6.25rem); }
.ai-audit-page h1 { color: #ff5733; font-size: 2.25rem; margin-bottom: 1.25rem; }
.ai-audit-page > p { font-size: 1rem; color: #555; margin-bottom: 1.5rem; }

.audit-input { margin-bottom: 0.75rem; }
.audit-input > label { font-size: 1rem; color: #333; display: block; margin-bottom: 0.5rem; text-align: left; max-width: 56rem; margin-inline: auto; }
.audit-wrapper { display: flex; flex-direction: column; gap: 0.75rem; max-width: 56rem; margin: 0 auto; text-align: left; }
.input-area { width: 100%; height: 10rem; padding: 0.75rem; font-size: 0.9375rem; font-family: inherit; line-height: 1.6; border: 1px solid #ddd; border-radius: 0.375rem; resize: vertical; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
.input-area:focus { border-color: #ff5733; }
.highlight-area { width: 100%; min-height: 4rem; padding: 0.75rem; font-size: 0.9375rem; font-family: inherit; line-height: 1.6; border: 1px solid #ddd; border-radius: 0.375rem; background: #fafafa; overflow-y: auto; white-space: pre-wrap; word-break: break-all; box-sizing: border-box; color: #333; }

:deep(.hl) { border-radius: 0.25rem; padding: 0.1rem 0.3rem; cursor: help; font-weight: bold; }
:deep(.hl5) { background: #ff8a80; border: 2px solid #c62828; color: #b71c1c; }
:deep(.hl4) { background: #ffcccc; border: 2px solid #e53935; color: #c0392b; }
:deep(.hl3) { background: #ffe0b2; border: 2px solid #fb8c00; color: #7d4e00; }
:deep(.hl2) { background: #fff9c4; border: 2px solid #f9a825; color: #5d4037; }
:deep(.hl1) { background: #f1f8e9; border: 2px solid #7cb342; color: #33691e; }
:deep(.hl-ok) { background: #e8f5e9; border-bottom: 2px solid #4caf50; color: #1b5e20; border-radius: 0.15rem; }

.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem; max-width: 56rem; margin-inline: auto; }
.legend-item { font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.6rem; border-radius: 0.25rem; border: 1px solid; }
.l5 { background: #ff8a80; border-color: #c62828; color: #b71c1c; }
.l4 { background: #ffcccc; border-color: #e53935; color: #c0392b; }
.l3 { background: #ffe0b2; border-color: #fb8c00; color: #7d4e00; }
.l2 { background: #fff9c4; border-color: #f9a825; color: #5d4037; }
.l1 { background: #f1f8e9; border-color: #7cb342; color: #33691e; }

.char-count { text-align: right; font-size: 0.75rem; color: #666; max-width: 56rem; margin: 0.3rem auto 0; }
.char-count.warning, .warning-text { color: #f00; }

.audit-button { padding: 0.625rem 1.75rem; background: #ff5733; color: #fff; border: none; border-radius: 0.3125rem; cursor: pointer; font-size: 1rem; margin-bottom: 1.5rem; }
.audit-button:hover { background: #e04e2d; }
.audit-button:disabled { background: #ccc; cursor: not-allowed; }

.audit-result { max-width: 56rem; margin: 0 auto; padding: 1rem; background: #fff; border: 1px solid #eee; border-radius: 0.5rem; text-align: left; }
.audit-result h3 { font-size: 1.125rem; color: #333; margin-bottom: 0.75rem; }

:deep(.summary) { font-size: 0.9375rem; color: #333; margin-bottom: 0.75rem; }
:deep(.pass) { font-size: 1rem; color: #2e7d32; font-weight: bold; }
:deep(.empty) { font-size: 0.9375rem; color: #e65100; }

:deep(.vcard) { border-left: 4px solid #ccc; border-radius: 0.375rem; padding: 0.75rem 1rem; margin-bottom: 0.75rem; background: #fafafa; }
:deep(.risk5) { border-left-color: #c62828; background: #fff5f5; }
:deep(.risk4) { border-left-color: #e53935; background: #fff8f8; }
:deep(.risk3) { border-left-color: #fb8c00; background: #fffbf5; }
:deep(.risk2) { border-left-color: #f9a825; background: #fffef5; }
:deep(.risk1) { border-left-color: #7cb342; background: #f9fbe7; }

:deep(.vcard-head) { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
:deep(.vnum) { background: #666; color: #fff; border-radius: 50%; width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; flex-shrink: 0; }
:deep(.vphrase) { font-size: 1rem; font-weight: bold; color: #222; }
:deep(.vtag) { background: #e0e0e0; color: #444; border-radius: 0.25rem; padding: 0.1rem 0.4rem; font-size: 0.75rem; }
:deep(.vstars) { font-size: 1rem; }
:deep(.s5) { color: #c62828; } :deep(.s4) { color: #e53935; } :deep(.s3) { color: #fb8c00; }
:deep(.s2) { color: #f9a825; } :deep(.s1) { color: #7cb342; }
:deep(.vlabel) { font-size: 0.8rem; color: #555; font-weight: bold; }

:deep(.badge-2p) { display: inline-block; background: #b71c1c; color: #fff; font-size: 0.75rem; font-weight: bold; padding: 0.2rem 0.6rem; border-radius: 0.25rem; margin-bottom: 0.5rem; }
:deep(.card-row) { display: flex; gap: 0.5rem; font-size: 0.875rem; line-height: 1.6; padding-top: 0.5rem; border-top: 1px solid #eee; margin-top: 0.5rem; color: #444; align-items: flex-start; }
:deep(.card-label) { white-space: nowrap; font-weight: bold; min-width: 5.5rem; padding-top: 0.15rem; flex-shrink: 0; }
:deep(.fix-text) { color: #1565c0; }
:deep(.legal-note) { color: #888; font-style: italic; font-size: 0.82rem; }

:deep(.cases-wrap) { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
:deep(.case-card) { background: #fff; border: 1px solid #e0e0e0; border-radius: 0.375rem; padding: 0.5rem 0.75rem; }
:deep(.case-top) { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem; }
:deep(.case-company) { font-weight: bold; color: #222; font-size: 0.875rem; }
:deep(.case-fine) { background: #ffeaea; color: #c62828; font-size: 0.75rem; font-weight: bold; padding: 0.15rem 0.5rem; border-radius: 0.25rem; white-space: nowrap; }
:deep(.case-meta) { display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.78rem; color: #666; margin-bottom: 0.25rem; }
:deep(.case-product) { font-size: 0.78rem; color: #444; margin-bottom: 0.2rem; }
:deep(.case-phrase) { font-size: 0.78rem; color: #555; font-style: italic; background: #f5f5f5; border-left: 3px solid #ddd; padding: 0.2rem 0.4rem; border-radius: 0 0.2rem 0.2rem 0; margin-top: 0.25rem; }
:deep(.case-law) { font-size: 0.75rem; color: #888; margin-top: 0.2rem; }

.risk-tag { display: inline-block; margin-top: 0.75rem; padding: 0.375rem 1rem; background: #d32f2f; color: #fff; border-radius: 0.3125rem; font-size: 0.875rem; font-weight: bold; }
.low-risk { background: #2e7d32; }

@media (max-width: 600px) {
  .ai-audit-page { padding: 1rem; }
  .ai-audit-page h1 { font-size: 1.5rem; }
  .input-area { height: 8rem; }
  :deep(.card-row) { flex-direction: column; }
  :deep(.case-top) { flex-direction: column; align-items: flex-start; }
}
@media (min-width: 601px) and (max-width: 1024px) {
  .ai-audit-page { padding: 1.5rem; }
  .ai-audit-page h1 { font-size: 2rem; }
}
</style>