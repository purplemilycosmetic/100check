<template>
  <section class="hero-section">
    <!-- 區塊1 -->
    <div class="hero-section-content" style="background-color: #fff;">
      <h1>審盾橘 | 廣告快速審核 - AI 快速審核廣告</h1>
      <p>減少人工檢核，建立標準化審查程序，降低建項風險！</p>
      <p class="subtext">※ 詳情請參考 <a href="#">審盾橘</a>，免費體驗檢核廣告</p>
      <div class="buttons">
        <router-link to="/ServicesView" class="primary-btn">查看方案</router-link>
        <router-link to="/LoginView" class="primary-btn">註冊免費體驗</router-link>
      </div>
    </div>
    <!-- <div align="center" style="margin-top: 50px;">
      <img src="@/assets/test.jpg" alt="Hero Image" class="hero-image" />
    </div> -->

    <!-- 幻燈片場景 -->
    <div class="carousel">
      <div class="carousel-slides">
        <div class="carousel-slide">
          <img src="@/assets/幻燈片1.png" alt="Slide 1" class="carousel-image" />
        </div>
        <div class="carousel-slide">
          <img src="@/assets/幻燈片2.png" alt="Slide 2" class="carousel-image" />
        </div>
        <div class="carousel-slide">
          <img src="@/assets/簽署圖.jpg" alt="Slide 3" class="carousel-image" />
        </div>
      </div>
      <button class="carousel-prev" @click="prevSlide">◄</button>
      <button class="carousel-next" @click="nextSlide">►</button>
      <div class="carousel-counter">{{ currentSlide + 1 }} / {{ slidesCount }}</div>
    </div>

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

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      currentSlide: 0,
      slidesCount: 3,
      autoPlayInterval: null
    }
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeDestroy() {
    this.stopAutoPlay();
  },
  methods: {
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slidesCount) % this.slidesCount;
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slidesCount;
    },
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // 每 5 秒自動切換
    },
    stopAutoPlay() {
      clearInterval(this.autoPlayInterval);
    }
  }
}
</script>

<style scoped>
/* 幻燈片場景樣式 */
.carousel {
  position: relative;
  width: 1200px; /* 鎖定寬度 */
  height: 432px; /* 鎖定高度 */
  margin: 0 auto; /* 置中 */
  overflow: hidden;
}

.carousel-slides {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  flex-shrink: 0;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-prev {
  left: 10px;
}

.carousel-next {
  right: 10px;
}

.carousel-prev:hover,
.carousel-next:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-counter {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  z-index: 10;
}

/* 自動播放幻燈片 */
@keyframes slide {
  0%, 33.33% { opacity: 0; }
  33.33%, 66.66% { opacity: 1; }
  66.66%, 100% { opacity: 0; }
}

.carousel-slide:nth-child(1) { animation: slide 9s infinite 0s; }
.carousel-slide:nth-child(2) { animation: slide 9s infinite 3s; }
.carousel-slide:nth-child(3) { animation: slide 9s infinite 6s; }

/* 動態控制幻燈片 */
.carousel-slide {
  animation-play-state: paused;
}

.carousel-slide.active {
  animation-play-state: running;
}

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