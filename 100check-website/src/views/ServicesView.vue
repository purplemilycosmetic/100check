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
    <!-- <section class="cta-section">
      <h2>立即體驗 AI 智慧檢核</h2>
      <router-link to="register" class="primary-btn">立即體驗</router-link>
    </section> -->
  </div>
</template>

<style scoped>
.services-page {
  margin: 3.75rem auto 1.25rem; /* 60px 20px 轉為 rem */
  padding: 1.25rem; /* 20px 轉為 rem */
  max-width: 75rem; /* 1200px 轉為 rem */
}

/* 標題區塊 */
.hero-section {
  text-align: center;
  margin-bottom: 2.5rem; /* 40px 轉為 rem */
}

.hero-section h1 {
  color: #ff5733;
  font-size: 2.25rem; /* 36px 轉為 rem */
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
}

.hero-section p {
  font-size: 1.125rem; /* 18px 轉為 rem */
  color: #333;
}

/* 服務特色區塊 */
.features-section {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.25rem; /* 20px 轉為 rem */
  margin-bottom: 2.5rem; /* 40px 轉為 rem */
}

.feature-card {
  width: 22%;
  padding: 1.25rem; /* 20px 轉為 rem */
  background: #f8f8f8;
  border-radius: 0.625rem; /* 10px 轉為 rem */
  text-align: center;
  box-sizing: border-box;
}

.feature-card h3 {
  color: #ff5733;
  font-size: 1.25rem; /* 20px 轉為 rem */
  margin-bottom: 0.625rem; /* 10px 轉為 rem */
}

.feature-card p {
  font-size: 0.875rem; /* 14px 轉為 rem */
  color: #666;
}

/* 呼籲行動區塊 */
.cta-section {
  text-align: center;
  padding: 2.5rem 0; /* 40px 轉為 rem */
}

.cta-section h2 {
  color: #ff5733;
  font-size: 1.75rem; /* 28px 轉為 rem */
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
}

.primary-btn {
  padding: 0.625rem 1.25rem; /* 10px 20px 轉為 rem */
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 0.3125rem; /* 5px 轉為 rem */
  text-decoration: none;
  font-size: 1rem; /* 16px 轉為 rem */
}

.primary-btn:hover {
  background: #e04e2d;
}

/* 設備斷點 - 手機 (max-width: 600px) */
@media (max-width: 600px) {
  .services-page {
    margin: 2rem auto 1rem; /* 32px 16px 轉為 rem */
    padding: 1rem; /* 16px 轉為 rem */
    max-width: 100%; /* 滿寬 */
  }

  .hero-section h1 {
    font-size: 1.5rem; /* 24px 轉為 rem */
  }

  .hero-section p {
    font-size: 0.875rem; /* 14px 轉為 rem */
  }

  .feature-card {
    width: 90%; /* 滿寬 */
    margin-bottom: 1rem; /* 16px 轉為 rem */
  }

  .cta-section h2 {
    font-size: 1.25rem; /* 20px 轉為 rem */
  }

  .primary-btn {
    padding: 0.5rem 1rem; /* 8px 16px 轉為 rem */
    font-size: 0.875rem; /* 14px 轉為 rem */
  }
}

/* 設備斷點 - 平板 (601px - 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .services-page {
    max-width: 60rem; /* 960px 轉為 rem */
  }

  .feature-card {
    width: 45%; /* 兩列布局 */
  }

  .hero-section h1 {
    font-size: 2rem; /* 32px 轉為 rem */
  }

  .cta-section h2 {
    font-size: 1.5rem; /* 24px 轉為 rem */
  }
}

/* 設備斷點 - 桌面 (min-width: 1025px) */
@media (min-width: 1025px) {
  .services-page {
    max-width: 75rem; /* 1200px 轉為 rem */
  }

  .feature-card {
    width: 22%; /* 三列布局 */
  }
}
</style>