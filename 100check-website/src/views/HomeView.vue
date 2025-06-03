<template>
  <section class="hero-section">
    <!-- 區塊1 -->
    <div class="hero-section-content" style="background-color: #fff;">
      <h1>百元快檢 | 廣告快速審核 - AI 快速審核廣告</h1>
      <p>減少人工檢核，建立標準化審查程序，降低建項風險！</p>
      <p class="subtext">※ 詳情請參考 <a href="#">百元快檢</a>，免費體驗檢核廣告</p>
      <div class="buttons">
        <router-link to="/ServicesView" class="primary-btn">查看方案</router-link>
        <router-link to="/LoginView" class="primary-btn">註冊免費體驗</router-link>
       </div>
    </div>
    <!-- <div align="center" style="margin-top: 50px;">
      <img src="@/assets/test.jpg" alt="Hero Image" class="hero-image" />
    </div> -->

    <!-- 區塊2 -->
    <div class="info-sections1">
      <div class="info-card">
        <img src="@/assets/廣告審核放大鏡圖.jpg" alt="test" class="card-icon" />
        <h3>降低政府查核廣告風險</h3>
        <h3>減少非必要的支出風險</h3>
          <ul>
          <li>◆ 有效控管風險及錯誤</li>
          <li>◆ 提升法廣告合規性</li>
          <li>◆ 有效運用廣告經費</li>
        </ul>
      </div>
     <div class="info-card">
        <img src="@/assets/一鍵快速審查.png" alt="Cosmetics" class="card-icon" />
        <h3>一鍵快速AI審查</h3>
        <h3>掌握你的每分每秒</h3>
         <ul>
          <li>◆ 匯入文案免費快速審查</li>
          <li>◆ 風險字眼 AI 快速辨識</li>
          <li>◆ 標示風險字眼簡單明瞭</li>
          <li>◆ 政府裁罰案例辨識有憑有據</li>
        </ul>
      </div>
    <div class="info-card">
        <img src="@/assets/簽署圖.jpg" alt="Cosmetics" class="card-icon" />
        <h3>提供化妝品安全資料簽署</h3>
          <ul>
          <li>◆ 具化妝品安全資料簽署人員證照</li>
          <li>◆ 專業簽署人員直接簽署</li>
          <li>◆ 有效管理及建立PIF檔案</li>
         </ul>
      </div>
    </div>
     <!-- 區塊3 -->
   <div class="info-sections1">
      <div class="info-card">
        <img src="@/assets/test2.jpg" alt="test" class="card-icon" />
        <h3>降低建規風險</h3>
        <p>大幅提升效率及合規性檢核</p>
        <ul>
          <li>有效控管風險及錯誤</li>
          <li>提升法規效率及合規性</li>
          <li>建立完整法規庫</li>
        </ul>
      </div>
     <div class="info-card">
        <img src="@/assets/test2.jpg" alt="Cosmetics" class="card-icon" />
        <h3>化妝品安全資料簽署</h3>
        <p>提供化妝品安全資料簽署</p>
        <ul>
          <li>提供法規合規性檢查</li>
          <li>確保產品安全</li>
          <li>減少法規風險</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 區塊1 樣式 */
.hero-section {
  text-align: center;
}

.hero-section-content {
  height: 250px;
}

.hero-image {
  width: 100%;
  max-width: 800px;
  height: auto;
  margin-bottom: 20px;
}

.hero-section-content h1 {
  color: #ff5733;
  font-size: 36px;
  margin-bottom: 20px;
}

.hero-section-content p {
  font-size: 18px;
  color: #333;
}

.subtext {
  font-size: 14px;
  color: #666;
}

.subtext a {
  color: #ff5733;
  text-decoration: none;
}

.buttons {
  margin-top: 20px;
}

.primary-btn, .secondary-btn {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.primary-btn {
  background: #ff5733;
  color: white;
}

.secondary-btn {
  background: #fff;
  color: #ff5733;
  border: 1px solid #ff5733;
}

.primary-btn {
  background: #ff5733;
  color: white;
  text-decoration: none; /* 移除底線 */
}

.primary-btn:hover,
.primary-btn:active,
.primary-btn:visited {
  text-decoration: none; /* 確保點擊後無底線 */
}

/* 區塊2 樣式 */
.info-sections1 {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 0px;
  padding: 50px;
  background: #ffffff;
  border-radius: 10px;
}

.info-card {
  width: 20%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

.card-icon {
  width: 250px;
  height: 250px;
  margin-bottom: 0px;
}

.info-card h3 {
  color: #ff5733;
  font-size: 24px;
  margin-bottom: 10px; /* 調整與下一個元素的間距 */
  letter-spacing: 2px; /* 調整字元間距 */
  line-height: 1; /* 調整行高 */
}

.info-card p {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.info-card ul {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-left: 20px;
}

.info-card ul li {
  font-size: 18px;
  color: #666;
  margin-bottom: 5px;
}

@media (max-width: 768px) {
  .info-card {
    width: 45%;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .info-card {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>