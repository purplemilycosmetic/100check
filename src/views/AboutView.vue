<template>
  <div class="contact-page">
    <!-- 標題區塊 -->
    <section class="hero-section">
      <h1>聯絡我們</h1>
      <p>有任何問題或需要專業諮詢？請透過以下資訊聯繫我們！</p>
    </section>

    <!-- 聯絡資訊區塊 -->
    <section class="contact-section">
      <div class="contact-container">
        <div class="contact-info">
          <h2>聯絡資訊</h2>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <p>電子信箱: adcheck@gmail.com</p>
          </div>
          <div class="info-item">
            <i class="fas fa-qrcode"></i>
            <div class="qrcode-container">
              <p class="qrcode-text">Line 免費諮詢</p>
              <img src="@/assets/line-qrcode.png" alt="Line QR Code" class="qrcode-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactView'
}
</script>

<style scoped>
.contact-page {
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

/* 聯絡資訊區塊 */
.contact-section {
  margin-bottom: 2.5rem; /* 40px 轉為 rem */
}

.contact-container {
  display: flex;
  justify-content: center;
}

.contact-info {
  width: 100%;
  max-width: 31.25rem; /* 500px 轉為 rem */
  background: #f8f8f8;
  padding: 1.25rem; /* 20px 轉為 rem */
  border-radius: 0.625rem; /* 10px 轉為 rem */
  text-align: center;
}

.contact-info h2 {
  color: #ff5733;
  font-size: 1.5rem; /* 24px 轉為 rem */
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9375rem; /* 15px 轉為 rem */
}

.info-item i {
  color: #ff5733;
  font-size: 1.25rem; /* 20px 轉為 rem */
  margin-right: 0.625rem; /* 10px 轉為 rem */
}

.info-item p {
  font-size: 1rem; /* 16px 轉為 rem */
  color: #333;
  margin: 0;
}

.qrcode-container {
  text-align: center;
}

.qrcode-text {
  font-size: 1.125rem; /* 18px 轉為 rem */
  color: #ff5733;
  margin-bottom: 0.625rem; /* 10px 轉為 rem */
  font-weight: bold;
}

.qrcode-image {
  width: 10rem; /* 160px 轉為 rem */
  height: 10rem; /* 160px 轉為 rem */
  object-fit: contain;
}

/* 設備斷點 - 手機 (max-width: 600px) */
@media (max-width: 600px) {
  .contact-page {
    margin: 2rem auto 1rem; /* 32px 16px 轉為 rem */
    padding: 1rem; /* 16px 轉為 rem */
    max-width: 100%; /* 滿寬 */
  }

  .hero-section h1 {
    font-size: 1.75rem; /* 28px 轉為 rem */
  }

  .hero-section p {
    font-size: 1rem; /* 16px 轉為 rem */
  }

  .contact-info h2 {
    font-size: 1.25rem; /* 20px 轉為 rem */
  }

  .info-item p {
    font-size: 0.875rem; /* 14px 轉為 rem */
  }

  .qrcode-text {
    font-size: 1rem; /* 16px 轉為 rem */
  }

  .qrcode-image {
    width: 8rem; /* 128px 轉為 rem */
    height: 8rem; /* 128px 轉為 rem */
  }
}

/* 設備斷點 - 平板 (601px - 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .contact-page {
    max-width: 60rem; /* 960px 轉為 rem */
  }

  .contact-info h2 {
    font-size: 1.375rem; /* 22px 轉為 rem */
  }

  .qrcode-text {
    font-size: 1.0625rem; /* 17px 轉為 rem */
  }

  .qrcode-image {
    width: 9rem; /* 144px 轉為 rem */
    height: 9rem; /* 144px 轉為 rem */
  }
}

/* 設備斷點 - 桌面 (min-width: 1025px) */
@media (min-width: 1025px) {
  .contact-page {
    max-width: 75rem; /* 1200px 轉為 rem */
  }
}
</style>