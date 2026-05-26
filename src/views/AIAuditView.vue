<template>
  <div class="ai-audit-page">
    <h1>AI廣告檢核</h1>
    <p>歡迎使用我們的 AI 廣告檢核服務！違規詞彙將即時標記，審核後顯示風險等級、真實被罰案例與修改建議。</p>

    <div class="audit-controls">
      <label for="category-select">選擇化粧品種類：</label>
      <select id="category-select" v-model="selectedCategory" class="category-select">
        <option value="" disabled selected>請選擇種類</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>

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
      <div class="char-count" :class="{ 'warning': charCount > maxLength }">
        字數: {{ charCount }} / {{ maxLength }}
        <span v-if="charCount > maxLength" class="warning-text">（文案超出字數限制）</span>
      </div>
    </div>

    <div class="legend">
      <span class="legend-item legend-5">★★★★★ 極高</span>
      <span class="legend-item legend-4">★★★★☆ 高</span>
      <span class="legend-item legend-3">★★★☆☆ 中</span>
      <span class="legend-item legend-2">★★☆☆☆ 低</span>
      <span class="legend-item legend-1">★☆☆☆☆ 觀察</span>
    </div>

    <button @click="auditAd" class="audit-button" :disabled="!selectedCategory || !adText || loading">
      {{ loading ? '載入中...' : '審核' }}
    </button>

    <div v-if="auditResult !== null" class="audit-result">
      <h3>審核結果</h3>
      <div v-html="auditResult"></div>
      <div v-if="violationCount > 0" class="risk-tag">未通過（共 {{ violationCount }} 項）</div>
      <div v-else-if="violationCount === 0 && auditResult" class="risk-tag low-risk">低風險</div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabaseClient'

export default {
  name: 'AIAuditView',
  data() {
    return {
      selectedCategory: '',
      adText: '',
      auditResult: null,
      violationCount: 0,
      loading: false,
      categories: [
        '一、洗髮用化粧品類', '二、洗臉卸粧用化粧品類', '三、沐浴用化粧品類',
        '四、香皂類', '五、頭髮用化粧品類', '六、化粧水/油/面霜乳液類',
        '七、香氛用化粧品類', '八、止汗制臭劑', '九、唇用化粧品類',
        '十、覆敷用化粧品類', '十一、眼部用化粧品類', '十二、指甲用化粧品類',
        '十三、美白牙齒類', '十四、非藥用牙膏、漱口水類', '十五、其他及綜合性內容'
      ],
      maxLength: 2000,
      charCount: 0,
      // 主詞庫：[{ id, name, category, risk_score, fix_suggestion, reference, cases: [...] }]
      forbiddenWordsList: []
    }
  },

  async mounted() {
    this.loading = true
    try {
      // 一次拉所有違規詞 + 關聯案例（Supabase 支援巢狀查詢）
      const { data, error } = await supabase
        .from('forbidden_words')
        .select(`
          id, name, core_keyword, category, risk_score, fix_suggestion, reference,
          violation_cases ( case_no, company, phrase, fine, date )
        `)
        .order('risk_score', { ascending: false })

      if (error) throw error
      this.forbiddenWordsList = data || []
      console.log(`載入詞庫：${this.forbiddenWordsList.length} 筆，各自含案例資料`)
    } catch (e) {
      console.error('詞庫載入失敗:', e)
    } finally {
      this.loading = false
    }
  },

  computed: {
    highlightedText() {
      if (!this.adText || !this.forbiddenWordsList.length) return ''

      const sorted = [...this.forbiddenWordsList]
        .filter(item => item.name && item.name.trim())
        .sort((a, b) => b.name.length - a.name.length)

      const text = this.adText
      const matches = []

      sorted.forEach(item => {
        let idx = 0
        while (idx < text.length) {
          const pos = text.indexOf(item.name, idx)
          if (pos === -1) break
          const end = pos + item.name.length
          if (!matches.some(m => pos < m.end && end > m.start))
            matches.push({ start: pos, end, item })
          idx = pos + 1
        }
      })

      matches.sort((a, b) => a.start - b.start)

      const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
      const toHtml = s => esc(s).replace(/\n/g,'<br>')

      let result = '', lastIdx = 0
      matches.forEach(({ start, end, item }) => {
        result += toHtml(text.slice(lastIdx, start))
        const score = item.risk_score || 3
        const stars = '★'.repeat(score) + '☆'.repeat(5 - score)
        const caseSummary = (item.violation_cases || [])
          .slice(0, 3)
          .map(c => `${c.company}（案件${c.case_no}，罰${(c.fine/10000).toFixed(0)}萬）`)
          .join(' / ')
        const title = esc(`${stars} ${item.category || ''} ｜ ${caseSummary}`)
        result += `<span class="highlight highlight-${score}" title="${title}">${esc(item.name)}</span>`
        lastIdx = end
      })
      result += toHtml(text.slice(lastIdx))
      return result
    }
  },

  methods: {
    updateCharCount() {
      this.charCount = this.adText.length
    },

    riskLabel(score) {
      return { 5:'極高風險', 4:'高風險', 3:'中風險', 2:'低風險', 1:'觀察' }[score] || '未知'
    },

    auditAd() {
      if (!this.forbiddenWordsList.length) {
        this.auditResult = '<p class="audit-empty">⚠️ 詞庫尚未載入，請稍後再試</p>'
        this.violationCount = 0
        return
      }

      const matched = this.forbiddenWordsList.filter(
        item => item.name && this.adText.includes(item.name.trim())
      )
      this.violationCount = matched.length

      if (matched.length === 0) {
        this.auditResult = '<p class="audit-pass">✅ 無違規用語，文案符合規範</p>'
        return
      }

      // 依 risk_score 由高到低
      const sorted = [...matched].sort((a, b) => (b.risk_score||3) - (a.risk_score||3))

      const cards = sorted.map((item, idx) => {
        const score = item.risk_score || 3
        const stars = '★'.repeat(score) + '☆'.repeat(5 - score)
        const label = this.riskLabel(score)
        const categoryTag = item.category
          ? `<span class="tag-category">${item.category}</span>` : ''

        // ── 案例列表（來自 violation_cases 關聯表）─────────────
        const cases = item.violation_cases || []
        const caseHtml = cases.length
          ? `<div class="card-row card-cases">
               <span class="card-label">📋 被罰案例</span>
               <div class="cases-list">
                 ${cases.map(c => `
                   <div class="case-item">
                     <span class="case-company">${c.company || ''}</span>
                     <span class="case-meta">
                       案件 #${c.case_no}
                       ${c.fine ? `｜罰款 <strong>${(c.fine/10000).toFixed(0)}萬元</strong>` : ''}
                       ${c.date ? `｜${c.date}` : ''}
                     </span>
                     ${c.phrase ? `<div class="case-phrase">「${c.phrase}」</div>` : ''}
                   </div>`).join('')}
               </div>
             </div>`
          : ''

        const fixHtml = item.fix_suggestion
          ? `<div class="card-row card-fix">
               <span class="card-label">✏️ 修改建議</span>
               <span>${item.fix_suggestion}</span>
             </div>` : ''

        const refHtml = item.reference
          ? `<div class="card-row card-ref">
               <span class="card-label">⚖️ 法規依據</span>
               <span>${item.reference}</span>
             </div>` : ''

        return `
          <div class="violation-card risk-${score}">
            <div class="card-header">
              <span class="card-num">${idx + 1}</span>
              <span class="card-phrase">${item.name}</span>
              ${categoryTag}
              <span class="card-stars risk-stars-${score}">${stars}</span>
              <span class="card-risk-label">${label}</span>
            </div>
            ${caseHtml}${fixHtml}${refHtml}
          </div>`
      }).join('')

      this.auditResult = `
        <p class="audit-summary">共檢出 <strong>${matched.length}</strong> 項違規詞彙，請參考被罰案例與修改建議：</p>
        ${cards}`
    }
  }
}
</script>

<style scoped>
/* ── 基礎版型（與原版相同）────────────────────── */
.ai-audit-page { padding: 2.5rem; text-align: center; min-height: calc(100vh - 6.25rem); }
.ai-audit-page h1 { color: #ff5733; font-size: 2.25rem; margin-bottom: 1.25rem; }
.ai-audit-page > p { font-size: 1rem; color: #555; margin-bottom: 1.5rem; }

.audit-controls { margin-bottom: 1.25rem; }
.audit-controls label { font-size: 1rem; color: #333; margin-right: 0.625rem; }
.category-select { padding: 0.5rem 0.75rem; font-size: 0.875rem; border: 1px solid #ddd; border-radius: 0.3125rem; background-color: #fff; cursor: pointer; }
.category-select:hover { border-color: #ff5733; }

.audit-input { margin-bottom: 0.75rem; }
.audit-input > label { font-size: 1rem; color: #333; display: block; margin-bottom: 0.5rem; text-align: left; max-width: 56rem; margin-left: auto; margin-right: auto; }
.audit-wrapper { display: flex; flex-direction: column; gap: 0.75rem; max-width: 56rem; margin: 0 auto; text-align: left; }
.input-area { width: 100%; height: 10rem; padding: 0.75rem; font-size: 0.9375rem; font-family: inherit; line-height: 1.6; border: 1px solid #ddd; border-radius: 0.375rem; resize: vertical; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
.input-area:focus { border-color: #ff5733; }
.highlight-area { width: 100%; min-height: 4rem; padding: 0.75rem; font-size: 0.9375rem; font-family: inherit; line-height: 1.6; border: 1px solid #ddd; border-radius: 0.375rem; background-color: #fafafa; overflow-y: auto; white-space: pre-wrap; word-break: break-all; box-sizing: border-box; color: #333; }

:deep(.highlight) { border-radius: 0.25rem; padding: 0.1rem 0.3rem; cursor: help; display: inline; font-weight: bold; }
:deep(.highlight-5) { background-color: #ff8a80; border: 2px solid #c62828; color: #b71c1c; }
:deep(.highlight-4) { background-color: #ffcccc; border: 2px solid #e53935; color: #c0392b; }
:deep(.highlight-3) { background-color: #ffe0b2; border: 2px solid #fb8c00; color: #7d4e00; }
:deep(.highlight-2) { background-color: #fff9c4; border: 2px solid #f9a825; color: #5d4037; }
:deep(.highlight-1) { background-color: #f1f8e9; border: 2px solid #7cb342; color: #33691e; }

.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem; max-width: 56rem; margin-left: auto; margin-right: auto; }
.legend-item { font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.6rem; border-radius: 0.25rem; border: 1px solid; }
.legend-5 { background: #ff8a80; border-color: #c62828; color: #b71c1c; }
.legend-4 { background: #ffcccc; border-color: #e53935; color: #c0392b; }
.legend-3 { background: #ffe0b2; border-color: #fb8c00; color: #7d4e00; }
.legend-2 { background: #fff9c4; border-color: #f9a825; color: #5d4037; }
.legend-1 { background: #f1f8e9; border-color: #7cb342; color: #33691e; }

.char-count { text-align: right; font-size: 0.75rem; color: #666; max-width: 56rem; margin: 0.3rem auto 0; }
.char-count.warning { color: #ff0000; }
.warning-text { margin-left: 0.5rem; color: #ff0000; }

.audit-button { padding: 0.625rem 1.75rem; background: #ff5733; color: white; border: none; border-radius: 0.3125rem; cursor: pointer; font-size: 1rem; margin-bottom: 1.5rem; }
.audit-button:hover { background: #e04e2d; }
.audit-button:disabled { background: #ccc; cursor: not-allowed; }

.audit-result { max-width: 56rem; margin: 0 auto; padding: 1rem; background: #fff; border: 1px solid #eee; border-radius: 0.5rem; text-align: left; }
.audit-result h3 { font-size: 1.125rem; color: #333; margin-bottom: 0.75rem; }

:deep(.audit-summary) { font-size: 0.9375rem; color: #333; margin-bottom: 0.75rem; }
:deep(.audit-pass) { font-size: 1rem; color: #2e7d32; font-weight: bold; }
:deep(.audit-empty) { font-size: 0.9375rem; color: #e65100; }

/* ── 違規卡片 ──────────────────────────────────── */
:deep(.violation-card) { border-left: 4px solid #ccc; border-radius: 0.375rem; padding: 0.75rem 1rem; margin-bottom: 0.75rem; background: #fafafa; }
:deep(.risk-5) { border-left-color: #c62828; background: #fff5f5; }
:deep(.risk-4) { border-left-color: #e53935; background: #fff8f8; }
:deep(.risk-3) { border-left-color: #fb8c00; background: #fffbf5; }
:deep(.risk-2) { border-left-color: #f9a825; background: #fffef5; }
:deep(.risk-1) { border-left-color: #7cb342; background: #f9fbe7; }

:deep(.card-header) { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
:deep(.card-num) { background: #666; color: #fff; border-radius: 50%; width: 1.5rem; height: 1.5rem; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; flex-shrink: 0; }
:deep(.card-phrase) { font-size: 1rem; font-weight: bold; color: #222; }
:deep(.tag-category) { background: #e0e0e0; color: #444; border-radius: 0.25rem; padding: 0.1rem 0.4rem; font-size: 0.75rem; }
:deep(.card-stars) { font-size: 1rem; }
:deep(.risk-stars-5) { color: #c62828; }
:deep(.risk-stars-4) { color: #e53935; }
:deep(.risk-stars-3) { color: #fb8c00; }
:deep(.risk-stars-2) { color: #f9a825; }
:deep(.risk-stars-1) { color: #7cb342; }
:deep(.card-risk-label) { font-size: 0.8rem; color: #555; font-weight: bold; }

:deep(.card-row) { display: flex; gap: 0.5rem; font-size: 0.875rem; line-height: 1.6; padding-top: 0.4rem; border-top: 1px solid #eee; margin-top: 0.4rem; color: #444; }
:deep(.card-label) { white-space: nowrap; font-weight: bold; min-width: 5.5rem; padding-top: 0.1rem; }
:deep(.card-fix span:last-child) { color: #1565c0; }

/* ── 案例列表（新增）──────────────────────────── */
:deep(.card-cases) { align-items: flex-start; }
:deep(.cases-list) { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
:deep(.case-item) { background: #fff; border: 1px solid #e0e0e0; border-radius: 0.3rem; padding: 0.4rem 0.6rem; }
:deep(.case-company) { font-weight: bold; color: #222; font-size: 0.875rem; display: block; }
:deep(.case-meta) { font-size: 0.8rem; color: #666; }
:deep(.case-meta strong) { color: #c62828; }
:deep(.case-phrase) { font-size: 0.8rem; color: #555; margin-top: 0.2rem; font-style: italic; background: #f5f5f5; border-left: 3px solid #ddd; padding: 0.2rem 0.4rem; border-radius: 0 0.2rem 0.2rem 0; }

/* ── 通過 / 未通過標籤 ─────────────────────────── */
.risk-tag { display: inline-block; margin-top: 0.75rem; padding: 0.375rem 1rem; background-color: #d32f2f; color: white; border-radius: 0.3125rem; font-size: 0.875rem; font-weight: bold; }
.low-risk { background-color: #2e7d32; }

/* ── 手機 ────────────────────────────────────── */
@media (max-width: 600px) {
  .ai-audit-page { padding: 1rem; }
  .ai-audit-page h1 { font-size: 1.5rem; }
  .input-area { height: 8rem; }
  .category-select { width: 100%; margin-top: 0.5rem; }
  .legend { gap: 0.3rem; }
  .legend-item { font-size: 0.65rem; }
  .audit-button { padding: 0.5rem 1rem; font-size: 0.875rem; }
  .audit-result { padding: 0.625rem; }
  :deep(.card-row) { flex-direction: column; gap: 0.2rem; }
}
@media (min-width: 601px) and (max-width: 1024px) {
  .ai-audit-page { padding: 1.5rem; }
  .ai-audit-page h1 { font-size: 2rem; }
  .input-area { height: 9rem; }
}
</style>