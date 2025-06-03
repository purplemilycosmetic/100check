<template>
  <div class="plans-page">
    <!-- 標題區塊 -->
    <section class="hero-section">
      <h1>方案介紹</h1>
      <p>選擇最適合您的化妝品合規方案，快速提升效率與安全性！</p>
    </section>

    <!-- 方案卡片區塊 -->
    <section class="plans-section">
      <div class="plan-card">
        <h3>AI 審核化妝品廣告</h3>
        <p class="price">免費</p>
        <p>利用 AI 技術快速審核化妝品廣告文案，確保符合法規要求，減少人工審核負擔。</p>
        <ul>
          <li>即時辨識風險字眼</li>
          <li>提供法規合規建議</li>
          <li>適用於所有化妝品廣告</li>
        </ul>
        <router-link to="/register" class="primary-btn">立即體驗</router-link>
      </div>
      <div class="plan-card">
        <h3>化妝品安全資料簽署</h3>
        <p class="price">依成分與難易度計費</p>
        <p>專業團隊為您的化妝品進行安全資料簽署，確保產品符合法規，降低違規風險。</p>
        <ul>
          <li>專業安全評估人員簽署</li>
          <li>針對成分進行毒理評估</li>
          <li>提供詳細合規報告</li>
        </ul>
        <router-link to="/contact" class="primary-btn">洽詢報價</router-link>
      </div>
      <div class="plan-card">
        <h3>協助 PIF 建檔</h3>
        <p class="price">搭配安全資料簽署服務</p>
        <p>協助您完成產品資訊檔案（PIF）建檔，確保符合最新法規要求，加速產品上市。</p>
        <ul>
          <li>彙整產品基本資料與成分</li>
          <li>完成安全性與功效佐證文件</li>
          <li>符合國際與台灣法規標準</li>
        </ul>
        <router-link to="/contact" class="primary-btn">免費諮詢</router-link>
      </div>
    </section>

    <!-- 聯繫區塊 -->
    <section class="contact-section">
      <h2>需要更多資訊？</h2>
      <p>我們的專業團隊隨時為您提供諮詢，協助您選擇最適合的方案。</p>
      <router-link to="/contact" class="primary-btn">聯繫我們</router-link>
    </section>
  </div>
</template>

<style scoped>
.plans-page {
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

/* 方案卡片區塊 */
.plans-section {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.plan-card {
  width: 30%;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
}

.plan-card h3 {
  color: #ff5733;
  font-size: 20px;
  margin-bottom: 10px;
}

.plan-card .price {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
}

.plan-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.plan-card ul {
  list-style: disc;
  padding-left: 20px;
  text-align: left;
  margin-bottom: 20px;
}

.plan-card ul li {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.plan-card .primary-btn {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
}

.plan-card .primary-btn:hover {
  background: #e04e2d;
}

/* 聯繫區塊 */
.contact-section {
  text-align: center;
  padding: 40px 0;
}

.contact-section h2 {
  color: #ff5733;
  font-size: 28px;
  margin-bottom: 20px;
}

.contact-section p {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.contact-section .primary-btn {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
}

.contact-section .primary-btn:hover {
  background: #e04e2d;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .plan-card {
    width: 45%;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .plan-card {
    width: 90%;
    margin-bottom: 20px;
  }
}
</style>