<template>
  <section class="hero-section">
    <!-- 區塊1 -->
    <div class="hero-section-content">
      <h1>審盾橘 | 廣告快速審核 - AI 快速審核廣告</h1>
      <p>減少人工檢核，建立標準化審查程序，降低建項風險！</p>
      <p class="subtext">※ 詳情請參考 <a href="#">審盾橘</a>，免費體驗檢核廣告</p>
      <div class="buttons">
        <router-link to="/services" class="primary-btn">查看方案</router-link>
        <router-link to="/ai-audit" class="primary-btn">馬上檢核廣告</router-link>
      </div>
    </div>

    <!-- 幻燈片場景 -->
    <div class="carousel">
      <div class="carousel-slides">
        <div class="carousel-slide" :class="{ active: currentSlide === 0 }">
          <img src="@/assets/幻燈片1.png" alt="Slide 1" class="carousel-image" />
        </div>
        <div class="carousel-slide" :class="{ active: currentSlide === 1 }">
          <img src="@/assets/幻燈片2.png" alt="Slide 2" class="carousel-image" />
        </div>
        <div class="carousel-slide" :class="{ active: currentSlide === 2 }">
          <img src="@/assets/簽署圖.jpg" alt="Slide 3" class="carousel-image" />
        </div>
      </div>
    </div>

    <!-- 新增區塊 1 -->
    <div class="info-sections2">
      <h2 class="section-title">｜一鍵快速AI審查，長篇劇本輕鬆審查，免除人工看字失誤</h2>
      <div class="info-card2">
        <img src="@/assets/實際案例1.jpg" alt="test" class="card-icon2" />
      </div>
      <div class="info-card2">
        <img src="@/assets/實際案例2.jpg" alt="Cosmetics" class="card-icon2" />
      </div>
    </div>

    <!-- 新增區塊 2 -->
    <div class="info-sections3">
      <h2 class="section-title">｜台北市衛生局查緝資訊</h2>
      <div class="info-card4">
        <img src="@/assets/臺北市政府衛生局1.png" alt="Case 3" class="card-icon4" />
      </div>
    </div>

    <!-- 新增區塊 3 -->
    <div class="info-sections4">
      <div class="info-card4">
        <img src="@/assets/臺北市政府衛生局2.png" alt="Case 4" class="card-icon4" />
      </div>
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
    this.startAutoPlay()
  },
  beforeDestroy() {
    this.stopAutoPlay()
  },
  methods: {
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.slidesCount) % this.slidesCount
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slidesCount
    },
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, 3000) // 改為 3 秒
    },
    stopAutoPlay() {
      clearInterval(this.autoPlayInterval)
    }
  }
}
</script>

<style scoped>
/* 幻燈片場景樣式 */
.carousel {
  position: relative;
  width: 100%;
  max-width: 75rem;
  height: 27rem;
  margin: 0 auto;
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

/* 移除按鈕相關樣式 */
.carousel-prev,
.carousel-next {
  display: none; /* 隱藏按鈕 */
}

/* 區塊1 樣式 */
.hero-section {
  text-align: center;
  padding: 1.25rem;
}

.hero-section-content {
  padding: 1.25rem;
}

.hero-section-content h1 {
  color: #ff5733;
  font-size: 2.25rem;
  margin-bottom: 1rem;
}

.hero-section-content p {
  font-size: 1.125rem;
  color: #333;
}

.subtext {
  font-size: 0.875rem;
  color: #666;
}

.subtext a {
  color: #ff5733;
  text-decoration: none;
}

.buttons {
  margin-top: 1.25rem;
}

.primary-btn {
  padding: 0.625rem 1.25rem;
  margin: 0 0.625rem;
  border: none;
  border-radius: 0.3125rem;
  cursor: pointer;
  background: #ff5733;
  color: white;
  text-decoration: none;
}

.primary-btn:hover {
  background: #e04e2d;
}

/* 新增區塊 1 樣式 */
.info-sections2 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 0.625rem;
}

.section-title {
  width: 100%;
  text-align: center;
  color: #ff5733;
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
  font-weight: bold;
  letter-spacing: 0.125rem;
}

.info-card2 {
  width: auto;
  text-align: center;
  padding: 1.25rem;
  box-sizing: border-box;
  margin: 0 0.625rem;
}

.card-icon2 {
  width: 75rem;
  height: 27rem;
  margin-bottom: 0.625rem;
  object-fit: cover;
  border-radius: 0.625rem;
}

/* 新增區塊 2 樣式 */
.info-sections3 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.25rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 0.625rem;
}

.info-card4 {
  width: auto;
  text-align: center;
  padding: 1.25rem;
  box-sizing: border-box;
  margin: 0 0.625rem;
}

.card-icon4 {
  width: 75rem;
  height: 27rem;
  margin-bottom: 0.625rem;
  object-fit: cover;
  border-radius: 0.625rem;
}

/* 新增區塊 3 樣式 */
.info-sections4 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.25rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 0.625rem;
}

.info-card4 {
  width: auto;
  text-align: center;
  padding: 1.25rem;
  box-sizing: border-box;
  margin: 0 0.625rem;
}

.card-icon4 {
  width: 75rem;
  height: 27rem;
  margin-bottom: 0.625rem;
  object-fit: cover;
  border-radius: 0.625rem;
}

/* 區塊2 樣式 */
.info-sections1 {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 0;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 0.625rem;
}

.info-card {
  width: 30%;
  text-align: center;
  padding: 1.25rem;
  box-sizing: border-box;
  margin-bottom: 1.25rem;
}

.card-icon {
  width: 15.625rem;
  height: 15.625rem;
  margin-bottom: 0.625rem;
}

.info-card h3 {
  color: #ff5733;
  font-size: 1.5rem;
  margin-bottom: 0.625rem;
  letter-spacing: 0.125rem;
  line-height: 1;
}

.info-card ul {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-left: 1.25rem;
}

.info-card ul li {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 0.3125rem;
}

/* 設備斷點 - 手機 (max-width: 600px) */
@media (max-width: 600px) {
  .carousel {
    max-width: 100%;
    height: 10rem;
  }

  .hero-section-content h1 {
    font-size: 1.5rem;
  }

  .hero-section-content p {
    font-size: 0.875rem;
  }

  .subtext {
    font-size: 0.75rem;
  }

  .primary-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    margin: 0 0.3125rem;
  }

  .info-card {
    width: 100%;
  }

  .card-icon {
    width: 10rem;
    height: 10rem;
  }

  .info-card h3 {
    font-size: 1.25rem;
  }

  .info-card ul li {
    font-size: 1rem;
  }

  .info-sections2, .info-sections3, .info-sections4 {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .info-card2, .info-card4 {
    margin: 0.625rem 0;
  }

  .card-icon2 {
    width: 100%;
    height: 15rem;
  }

  .card-icon4 {
    width: 100%;
    height: 10rem;
  }
}

/* 設備斷點 - 平板 (601px - 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .carousel {
    max-width: 60rem;
    height: 21rem;
  }

  .hero-section-content h1 {
    font-size: 2rem;
  }

  .hero-section-content p {
    font-size: 1rem;
  }

  .info-card {
    width: 45%;
  }

  .card-icon {
    width: 12.5rem;
    height: 12.5rem;
  }

  .info-card h3 {
    font-size: 1.375rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .info-card2, .info-card4 {
    margin: 0 0.625rem;
  }

  .card-icon2 {
    width: 60rem;
    height: 21rem;
  }

  .card-icon4 {
    width: 60rem;
    height: 21rem;
  }
}

/* 設備斷點 - 桌面 (min-width: 1025px) */
@media (min-width: 1025px) {
  .carousel {
    max-width: 75rem;
    height: 27rem;
  }

  .info-card {
    width: 30%;
  }

  .section-title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }

  .card-icon2 {
    width: 37rem;
    height: 37rem;
  }

  .card-icon4 {
    width: 70rem;
    height: 40rem;
  }
}
</style>