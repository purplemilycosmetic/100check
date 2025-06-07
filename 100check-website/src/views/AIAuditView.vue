<template>
  <div class="ai-audit-page">
    <h1>AI廣告檢核</h1>
    <p>歡迎使用我們的 AI 廣告檢核服務！此功能利用人工智慧技術，幫助您檢查廣告內容的合規性與安全性。</p>
    <div class="audit-features">
      <div class="feature-card">
        <h3>自動化檢查</h3>
        <p>即時檢測廣告是否符合法規要求。</p>
      </div>
      <div class="feature-card">
        <h3>準確報告</h3>
        <p>提供詳細的合規性分析報告。</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIAuditView'
}
</script>

<style scoped>
.ai-audit-page {
  padding: 40px;
  text-align: center;
  background: linear-gradient(to bottom, #f0f0f0 50%, #ffffff 50%);
  min-height: calc(100vh - 100px); /* 調整高度以填充螢幕 */
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

.audit-features {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.feature-card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 250px;
}

.feature-card h3 {
  color: #ec0000;
  font-size: 20px;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 14px;
  color: #666;
}
</style>