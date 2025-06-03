<template>
  <div class="services-page">
    <!-- 標題區塊 -->
    <section class="hero-section">
      <h1>服務介紹</h1>
      <p>我們的 AI 智慧檢核平台，幫助您快速審核廣告內容，降低法規風險，提升效率！</p>
    </section>

    <!-- 服務特色區塊 -->
    <section class="features-section">
      <div class="feature-card">
        <h3>AI 快速審核</h3>
        <p>利用 AI 技術，快速檢查廣告文案是否符合法規，減少人工審核時間。</p>
      </div>
      <div class="feature-card">
        <h3>法規風險警示</h3>
        <p>即時標示潛在風險字眼，提供政府裁罰案例參考，降低違規風險。</p>
      </div>
      <div class="feature-card">
        <h3>化妝品安全簽署</h3>
        <p>專業團隊提供化妝品安全資料簽署，建立化妝品安全資料(PIF)。</p>
      </div>
      <div class="feature-card">
        <h3>完整法規庫</h3>
        <p>建立全面的法規資料庫，隨時更新，確保您的廣告符合最新法規。</p>
      </div>
    </section>

    <!-- 呼籲行動區塊 -->
    <section class="cta-section">
      <h2>立即體驗 AI 智慧檢核</h2>
      <router-link to="/register" class="primary-btn">立即體驗</router-link>
    </section>
  </div>
</template>

<style scoped>
.services-page {
  margin: 60px auto 20px;
  padding: 20px;
  max-width: 1200px;
}

/* 標題區塊 */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.hero-section h1 {
  color: #ff5733;
  font-size: 36px;
  margin-bottom: 20px;
}

.hero-section p {
  font-size: 18px;
  color: #333;
}

/* 服務特色區塊 */
.features-section {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  width: 22%;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
}

.feature-card h3 {
  color: #ff5733;
  font-size: 20px;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 14px;
  color: #666;
}

/* 呼籲行動區塊 */
.cta-section {
  text-align: center;
  padding: 40px 0;
}

.cta-section h2 {
  color: #ff5733;
  font-size: 28px;
  margin-bottom: 20px;
}

.primary-btn {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
}

.primary-btn:hover {
  background: #e04e2d;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .feature-card {
    width: 45%;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .feature-card {
    width: 90%;
    margin-bottom: 20px;
  }
}
</style>