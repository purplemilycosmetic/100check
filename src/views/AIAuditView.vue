<template>
  <div class="ai-audit-page">
    <h1>AI廣告檢核</h1>
    <p>違規詞彙將在輸入時即時高亮標示。滑鼠移到標記文字可查看法規依據。</p>

    <div class="audit-controls">
      <label for="category-select">選擇化粧品種類：</label>
      <select id="category-select" v-model="selectedCategory" class="category-select">
        <option value="" disabled selected>請選擇種類</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div class="audit-input">
      <label for="ad-text">輸入廣告文案：</label>
      <div class="audit-wrapper">
        <!-- 高亮背景層（在輸入框之後渲染，z-index 較低） -->
        <div
          class="highlight-backdrop"
          v-html="highlightedText"
          aria-hidden="true"
          ref="backdrop"
        ></div>
        <!-- 輸入層（透明背景，浮在高亮層上方） -->
        <textarea
          id="ad-text"
          v-model="adText"
          class="input-area"
          placeholder="請輸入您的廣告文案..."
          :maxlength="maxLength"
          @input="updateCharCount"
          @scroll="syncScroll"
          ref="inputArea"
        ></textarea>
      </div>
      <div class="char-count" :class="{ warning: charCount > maxLength }">
        字數: {{ charCount }} / {{ maxLength }}
        <span v-if="charCount > maxLength" class="warning-text">（文案超出字數限制）</span>
      </div>
    </div>

    <button @click="auditAd" class="audit-button" :disabled="!selectedCategory || !adText">審核</button>

    <div v-if="auditResult" class="audit-result">
      <h3>審核結果</h3>
      <p v-html="formattedResult"></p>
      <div v-if="violationCount > 0" class="risk-tag">未通過</div>
      <div v-else class="risk-tag low-risk">低風險</div>
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
      auditResult: '',
      violationCount: 0,
      categories: [
        '一、洗髮用化粧品類', '二、洗臉卸粧用化粧品類', '三、沐浴用化粧品類',
        '四、香皂類', '五、頭髮用化粧品類', '六、化粧水/油/面霜乳液類',
        '七、香氛用化粧品類', '八、止汗制臭劑', '九、唇用化粧品類',
        '十、覆敷用化粧品類', '十一、眼部用化粧品類', '十二、指甲用化粧品類',
        '十三、美白牙齒類', '十四、非藥用牙膏、漱口水類', '十五、其他及綜合性內容'
      ],
      maxLength: 2000,
      charCount: 0,
      forbiddenWordsList: []
    }
  },
  async mounted() {
    const { data, error } = await supabase.from('forbidden_words').select('*')
    if (error) {
      console.error('抓取失敗:', error)
    } else {
      this.forbiddenWordsList = data
      console.log('成功載入詞庫:', data)
    }
  },
  computed: {
    highlightedText() {
      if (!this.adText) return ''

      // 依關鍵字長度由長到短排序，防止短詞先替換破壞長詞匹配
      const sorted = [...this.forbiddenWordsList]
        .filter(item => item.name)
        .sort((a, b) => b.name.length - a.name.length)

      const text = this.adText
      const matches = []

      // 單次掃描找出所有不重疊的匹配位置
      sorted.forEach(item => {
        let idx = 0
        while (idx < text.length) {
          const pos = text.indexOf(item.name, idx)
          if (pos === -1) break
          const end = pos + item.name.length
          const overlaps = matches.some(m => pos < m.end && end > m.start)
          if (!overlaps) matches.push({ start: pos, end, item })
          idx = pos + 1
        }
      })

      matches.sort((a, b) => a.start - b.start)

      const escapeHtml = str =>
        str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      const toHtml = str => escapeHtml(str).replace(/\n/g, '<br>')

      let result = ''
      let lastIdx = 0

      matches.forEach(({ start, end, item }) => {
        result += toHtml(text.slice(lastIdx, start))
        const cls = item.risk_level === '高風險' ? 'highlight highlight-high' : 'highlight highlight-other'
        const title = item.reference ? ` title="${escapeHtml(item.reference)}"` : ''
        result += `<span class="${cls}"${title}>${escapeHtml(item.name)}</span>`
        lastIdx = end
      })

      result += toHtml(text.slice(lastIdx))
      return result
    },
    formattedResult() {
      return this.auditResult
    }
  },
  methods: {
    updateCharCount() {
      this.charCount = this.adText.length
    },
    // 同步 textarea 與高亮背景層的捲軸位置
    syncScroll() {
      if (this.$refs.backdrop) {
        this.$refs.backdrop.scrollTop = this.$refs.inputArea.scrollTop
      }
    },
    auditAd() {
      if (this.forbiddenWordsList.length === 0) {
        this.auditResult = '⚠️ 詞庫尚未載入，請稍後再試'
        this.violationCount = 0
        return
      }
      const matched = []
      this.forbiddenWordsList.forEach(item => {
        if (this.adText.includes(item.name)) {
          matched.push({
            forbiddenPhrase: item.name,
            riskLevel: item.risk_level,
            referenceSource: item.reference
          })
        }
      })
      this.violationCount = matched.length
      this.auditResult = matched.length > 0
        ? `共檢出違規 ${matched.length} 項：<br>` + matched.map((i, idx) => `${idx + 1}: ${i.forbiddenPhrase}（${i.riskLevel}）`).join('<br>')
        : '✅ 無違規用語'
    }
  }
}
</script>

<style scoped>
.ai-audit-page {
  padding: 2.5rem;
  text-align: center;
  min-height: calc(100vh - 6.25rem);
}

.ai-audit-page h1 {
  color: #ff5733;
  font-size: 2.25rem;
  margin-bottom: 1.25rem;
}

.ai-audit-page > p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.875rem;
}

.audit-controls {
  margin-bottom: 1.25rem;
}

.audit-controls label {
  font-size: 1rem;
  color: #333;
  margin-right: 0.625rem;
}

.category-select {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 0.3125rem;
  background-color: #fff;
  cursor: pointer;
}

.category-select:hover {
  border-color: #ff5733;
}

.audit-input {
  margin-bottom: 1.25rem;
}

.audit-input > label {
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 0.5rem;
  text-align: left;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

/* ── Overlay 容器 ─────────────────────────────── */
.audit-wrapper {
  position: relative;
  max-width: 56rem;
  height: 12rem;
  margin: 0 auto;
  border-radius: 0.375rem;
  text-align: left;
}

/* ── 高亮背景層：絕對定位，在 textarea 之下 ─── */
.highlight-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  /* 必須與 textarea 的字型、Padding 完全一致 */
  padding: 0.75rem;
  font-size: 0.9375rem;
  font-family: inherit;
  line-height: 1.6;
  letter-spacing: normal;
  word-spacing: normal;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background-color: #fff;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
  box-sizing: border-box;
  pointer-events: none; /* 點擊事件穿透到 textarea */
  color: transparent;   /* 隱藏文字，只顯示 span 背景色 */
}

/* ── 輸入層：透明背景，浮在高亮層上方 ─────── */
.input-area {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  font-family: inherit;
  line-height: 1.6;
  letter-spacing: normal;
  word-spacing: normal;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  resize: none;
  outline: none;
  box-sizing: border-box;
  background: transparent; /* 讓背景層的高亮透出來 */
  color: #333;
  caret-color: #333;
  transition: border-color 0.2s;
}

.input-area:focus {
  border-color: #ff5733;
}

/* ── 高亮 span 樣式 ───────────────────────────── */
/* 注意：不設 font-weight: bold，避免字寬不同造成錯位 */
.highlight {
  border-radius: 0.2rem;
  padding: 0.05rem 0;
}

.highlight-high {
  background-color: #ffcccc;
  box-shadow: 0 2px 0 0 #e74c3c; /* 底線效果，不影響字寬 */
}

.highlight-other {
  background-color: #fff3cd;
  box-shadow: 0 2px 0 0 #fd7e14;
}

/* ── 字數統計 ─────────────────────────────────── */
.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  max-width: 56rem;
  margin: 0.4rem auto 0;
}

.char-count.warning {
  color: #ff0000;
}

.warning-text {
  margin-left: 0.625rem;
  color: #ff0000;
}

/* ── 審核按鈕 ─────────────────────────────────── */
.audit-button {
  padding: 0.625rem 1.25rem;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 0.3125rem;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1.25rem;
}

.audit-button:hover {
  background: #e04e2d;
}

.audit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ── 審核結果 ─────────────────────────────────── */
.audit-result {
  margin-top: 1.25rem;
  padding: 0.9375rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.375rem;
  text-align: left;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

.audit-result h3 {
  color: #000;
  font-size: 1.125rem;
  margin-bottom: 0.625rem;
}

.audit-result p {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.8;
}

.risk-tag {
  display: inline-block;
  margin-top: 0.625rem;
  padding: 0.3125rem 0.9375rem;
  background-color: #ff0000;
  color: white;
  border-radius: 0.3125rem;
  font-size: 0.875rem;
  font-weight: bold;
}

.low-risk {
  background-color: #02c702;
  color: #fff;
}

/* ── 手機 ─────────────────────────────────────── */
@media (max-width: 600px) {
  .ai-audit-page {
    padding: 1rem;
    min-height: calc(100vh - 4rem);
  }

  .ai-audit-page h1 {
    font-size: 1.5rem;
  }

  .audit-wrapper {
    height: 10rem;
  }

  .category-select {
    width: 100%;
    margin-top: 0.5rem;
  }

  .audit-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .audit-result {
    max-width: 100%;
    padding: 0.625rem;
  }

  .risk-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
}

/* ── 平板 ─────────────────────────────────────── */
@media (min-width: 601px) and (max-width: 1024px) {
  .ai-audit-page {
    padding: 1.5rem;
  }

  .ai-audit-page h1 {
    font-size: 2rem;
  }

  .audit-wrapper {
    height: 11rem;
  }
}
</style>
