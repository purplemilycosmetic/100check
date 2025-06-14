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
      <div v-if="hasViolations" class="risk-tag">風險</div>
      <div v-else-if="auditResult === '文案初步符合'" class="risk-tag low-risk">低風險</div>
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
      maxLength: 2000, // 最大字數限制
      charCount: 0
    }
  },
  computed: {
    hasViolations() {
      return this.auditResult.includes('</br>');
    },
    formattedResult() {
      if (this.auditResult.includes('</br>')) {
        const parts = this.auditResult.split('</br>');
        const blackText = parts.map(part => `<span style="color: #000000; padding: 2px;">${part}</span>`).join('<br>');
        return blackText;
      }
      return this.auditResult === '文案初步符合' ? '<span style="padding: 2px;">' + this.auditResult + '</span>' : this.auditResult;
    }
  },
  methods: {
    updateCharCount() {
      this.charCount = this.adText.length;
      // 移除截斷邏輯，讓使用者看到警告後自行調整
      // if (this.charCount > this.maxLength) {
      //   this.adText = this.adText.substring(0, this.maxLength);
      //   this.charCount = this.maxLength;
      // }
    },
    auditAd() {
      if (!this.selectedCategory || !this.adText) return;

      this.auditResult = '';
      axios.post('http://52.91.0.205:8080/check', {
        content: this.adText
      })
      .then(response => {
        if (response.data.ileagalWords.length > 0) {
          this.auditResult = response.data.ileagalWords.join('</br>');
        } else {
          this.auditResult = '文案初步符合';
        }
      })
      .catch(error => {
        console.error('API 錯誤:', error.response ? error.response.data : error.message);
      });
    }
  }
}
</script>

<style scoped>
.ai-audit-page {
  padding: 40px;
  text-align: center;
  background: linear-gradient(to bottom, #ffffff 50%, #ffffff 50%);
  min-height: calc(100vh - 100px);
}

.ai-audit-page h1 {
  color: #ff5733;
  font-size: 36px;
  margin-bottom: 20px;
}

.ai-audit-page p {
  font-size: 18px;
  color: #333;
  margin-bottom: 30px;
}

.audit-controls {
  margin-bottom: 20px;
}

.audit-controls label {
  font-size: 16px;
  color: #333;
  margin-right: 10px;
}

.category-select {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
}

.category-select:hover {
  border-color: #ff5733;
}

.audit-input {
  margin-bottom: 20px;
}

.audit-input label {
  font-size: 16px;
  color: #333;
  margin-right: 10px;
  display: block;
  margin-bottom: 5px;
}

.ad-textarea {
  width: 100%;
  max-width: 600px;
  height: 150px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  max-width: 600px;
  margin-top: 5px;
}

.char-count.warning {
  color: #ff0000; /* 超過時顯示紅色 */
}

.warning-text {
  margin-left: 10px;
  color: #ff0000;
}

.audit-button {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.audit-button:hover {
  background: #e04e2d;
}

.audit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.audit-result {
  margin-top: 20px;
  padding: 15px;
  background: #ffffff;
  border-radius: 5px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.audit-result h3 {
  color: #000000;
  font-size: 18px;
  margin-bottom: 10px;
}

.audit-result p {
  font-size: 14px;
  color: #333;
}

.risk-tag {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 15px;
  background-color: #ff0000;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

.low-risk {
  background-color: #02ff02; /* 綠色背景 */
  color: #000000; /* 黑色文字 */
}
</style>