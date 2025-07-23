<template>
  <div class="ai-audit-page">
    <h1>AI廣告檢核</h1>
    <p>歡迎使用我們的 AI 廣告檢核服務！此功能利用人工智慧技術，幫助您檢查廣告內容的合規性與安全性。</p>
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
      <textarea
        id="ad-text"
        v-model="adText"
        class="ad-textarea"
        placeholder="請輸入您的廣告文案..."
        :maxlength="maxLength"
        @input="updateCharCount"
      ></textarea>
      <div class="char-count" :class="{ 'warning': charCount > maxLength }">
        字數: {{ charCount }} / {{ maxLength }}
        <span v-if="charCount > maxLength" class="warning-text">（文案超出字數限制）</span>
      </div>
    </div>
    <button @click="auditAd" class="audit-button" :disabled="!selectedCategory || !adText">審核</button>
    <div v-if="auditResult" class="audit-result">
      <h3>審核結果</h3>
      <p v-html="formattedResult"></p>
      <div v-if="violationCount > 0" class="risk-tag">風險</div>
      <div v-else class="risk-tag low-risk">低風險</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AIAuditView',
  data() {
    return {
      selectedCategory: '',
      adText: '',
      auditResult: '',
      violationCount: 0,
      categories: [
        '一、洗髮用化粧品類',
        '二、洗臉卸粧用化粧品類',
        '三、沐浴用化粧品類',
        '四、香皂類',
        '五、頭髮用化粧品類',
        '六、化粧水/油/面霜乳液類',
        '七、香氛用化粧品類',
        '八、止汗制臭劑',
        '九、唇用化粧品類',
        '十、覆敷用化粧品類',
        '十一、眼部用化粧品類',
        '十二、指甲用化粧品類',
        '十三、美白牙齒類',
        '十四、非藥用牙膏、漱口水類',
        '十五、其他及綜合性內容'
      ],
      maxLength: 2000,
      charCount: 0
    }
  },
  computed: {
    formattedResult() {
      return this.auditResult
        .split('</br>')
        .map(part => `<span style="color: #000000; padding: 2px;">${part}</span>`)
        .join('<br>')
    }
  },
  methods: {
    updateCharCount() {
      this.charCount = this.adText.length
    },
    auditAd() {
      if (!this.selectedCategory || !this.adText) return

      this.auditResult = ''
      axios
        .post('http://localhost:8080/check/test', {
          text: this.adText
        })
        .then(response => {
          const matched = response.data.matched || []
          this.violationCount = matched.length

          if (matched.length > 0) {
            const violations = matched.map(item =>
              `❌ ${item.forbiddenPhrase}（${item.riskLevel}）－${item.referenceSource}`
            )
            this.auditResult = `共檢出違規 ${matched.length} 項：</br>` + violations.join('</br>')
          } else {
            this.auditResult = '✅ 文案初步符合，未檢出違規用語'
          }
        })
        .catch(error => {
          console.error('API 錯誤:', error.response ? error.response.data : error.message)
          this.violationCount = 0
          this.auditResult = '⚠️ API 發生錯誤，請稍後再試'
        })
    }
  }
}
</script>

<style scoped>
.ai-audit-page {
  padding: 2.5rem;
  text-align: center;
  background: linear-gradient(to bottom, #ffffff 50%, #ffffff 50%);
  min-height: calc(100vh - 6.25rem);
}

.ai-audit-page h1 {
  color: #ff5733;
  font-size: 2.25rem;
  margin-bottom: 1.25rem;
}

.ai-audit-page p {
  font-size: 1.125rem;
  color: #333;
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

.audit-input label {
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 0.3125rem;
}

.ad-textarea {
  width: 100%;
  max-width: 37.5rem;
  height: 9.375rem;
  padding: 0.625rem;
  font-size: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 0.3125rem;
  resize: vertical;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  max-width: 37.5rem;
  margin-top: 0.3125rem;
}

.char-count.warning {
  color: #ff0000;
}

.warning-text {
  margin-left: 0.625rem;
  color: #ff0000;
}

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

.audit-result {
  margin-top: 1.25rem;
  padding: 0.9375rem;
  background: #ffffff;
  border-radius: 0.3125rem;
  text-align: left;
  max-width: 37.5rem;
  margin-left: auto;
  margin-right: auto;
}

.audit-result h3 {
  color: #000000;
  font-size: 1.125rem;
  margin-bottom: 0.625rem;
}

.audit-result p {
  font-size: 0.875rem;
  color: #333;
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
  background-color: #02ff02;
  color: #000000;
}

@media (max-width: 600px) {
  .ai-audit-page {
    padding: 1rem;
    min-height: calc(100vh - 4rem);
  }

  .ai-audit-page h1 {
    font-size: 1.5rem;
  }

  .ai-audit-page p {
    font-size: 0.875rem;
  }

  .category-select {
    width: 100%;
    margin-top: 0.5rem;
  }

  .ad-textarea {
    height: 6.25rem;
    font-size: 0.75rem;
  }

  .audit-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .audit-result {
    max-width: 100%;
    padding: 0.625rem;
  }

  .audit-result h3 {
    font-size: 1rem;
  }

  .risk-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .ai-audit-page {
    padding: 1.5rem;
  }

  .ai-audit-page h1 {
    font-size: 2rem;
  }

  .ad-textarea {
    height: 7.5rem;
  }

  .audit-button {
    padding: 0.625rem 1.25rem;
  }

  .audit-result {
    max-width: 90%;
  }
}
</style>
