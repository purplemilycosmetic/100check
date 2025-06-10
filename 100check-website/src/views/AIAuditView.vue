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
      <textarea id="ad-text" v-model="adText" class="ad-textarea" placeholder="請輸入您的廣告文案..."></textarea>
    </div>
    <button @click="auditAd" class="audit-button" :disabled="!selectedCategory || !adText">審核</button>
    <div v-if="auditResult" class="audit-result">
      <h3>審核結果</h3>
      <p>{{ auditResult }}</p>
    </div>
  </div>
</template>

<script>
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
      ]
    }
  },
  methods: {
    auditAd() {
      if (!this.selectedCategory || !this.adText) return;

      // 簡單的審核邏輯範例
      const hasMedicalClaim = this.adText.toLowerCase().includes('治療') || this.adText.toLowerCase().includes('醫學');
      const isExaggerated = this.adText.toLowerCase().includes('完美') || this.adText.toLowerCase().includes('神奇');

      if (hasMedicalClaim) {
        this.auditResult = '警告：文案涉及醫療效能，需修正以符合法規。';
      } else if (isExaggerated) {
        this.auditResult = '警告：文案可能誇大效果，建議調整。';
      } else {
        this.auditResult = `文案初步符合 ${this.selectedCategory} 的合規要求，請確認其他細節。`;
      }
    }
  }
}
</script>

<style scoped>
.ai-audit-page {
  padding: 40px;
  text-align: center;
  background: linear-gradient(to bottom, #f0f0f0 50%, #ffffff 50%);
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
  background: #f9f9f9;
  border-radius: 5px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.audit-result h3 {
  color: #ec0000;
  font-size: 18px;
  margin-bottom: 10px;
}

.audit-result p {
  font-size: 14px;
  color: #333;
}
</style>