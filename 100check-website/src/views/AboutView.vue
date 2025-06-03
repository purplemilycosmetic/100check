<template>
  <div class="contact-page">
    <!-- 標題區塊 -->
    <section class="hero-section">
      <h1>聯絡我們</h1>
      <p>有任何問題或需要專業諮詢？請填寫表單或直接聯繫我們！</p>
    </section>

    <!-- 聯絡表單與資訊區塊 -->
    <section class="contact-section">
      <div class="contact-container">
        <!-- 聯絡表單 -->
        <div class="contact-form">
          <h2>傳送訊息</h2>
          <div v-if="formSubmitted" class="success-message">
            感謝您的訊息！我們將盡快回覆。
          </div>
          <div v-else>
            <div class="form-group">
              <label for="name">姓名</label>
              <input type="text" id="name" v-model="form.name" placeholder="請輸入您的姓名" required />
            </div>
            <div class="form-group">
              <label for="email">電子郵件</label>
              <input type="email" id="email" v-model="form.email" placeholder="請輸入您的電子郵件" required />
            </div>
            <div class="form-group">
              <label for="message">訊息</label>
              <textarea id="message" v-model="form.message" placeholder="請輸入您的訊息" rows="5" required></textarea>
            </div>
            <button class="primary-btn" @click="submitForm">提交</button>
          </div>
        </div>

        <!-- 公司資訊 -->
        <div class="contact-info">
          <h2>聯絡資訊</h2>
            <div class="info-item">
            <i class="fas fa-phone"></i>
            <p>+886 932-911-445</p>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <p>purplemilycosmetic@gmail.com</p>
          </div>
          <div class="info-item">
            <i class="fas fa-clock"></i>
            <p>星期一至星期五：上午 9:00 - 下午 5:00</p>
          </div>

          <!-- 社交媒體連結 -->
          <div class="social-links">
            <h3>關注我們</h3>
            <a href="https://facebook.com" target="_blank" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" class="social-icon"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </section>

    <!-- 地圖區塊 -->
    <section class="map-section">
      <h2>我們的位置</h2>
      <div class="map-container">
        <!-- 使用靜態地圖圖片（可替換為 Google 地圖 iframe） -->
        <img src="https://via.placeholder.com/800x400?text=Map+Placeholder" alt="公司地圖" />
        <!-- 若使用 Google 地圖 iframe，可替換為以下：
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.678804982573!2d121.52215931500624!3d25.041020983972406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a94e6b6e3b2f%3A0x5f5f5f5f5f5f5f5f!2sTaipei%20101!5e0!3m2!1sen!2stw!4v1698234567890!5m2!1sen!2stw" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        -->
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      formSubmitted: false
    }
  },
  methods: {
    submitForm() {
      // 模擬表單提交
      if (this.form.name && this.form.email && this.form.message) {
        this.formSubmitted = true
        // 重置表單
        this.form.name = ''
        this.form.email = ''
        this.form.message = ''
        // 5 秒後隱藏成功訊息
        setTimeout(() => {
          this.formSubmitted = false
        }, 5000)
      } else {
        alert('請填寫所有必填欄位！')
      }
    }
  }
}
</script>

<style scoped>
.contact-page {
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

/* 聯絡表單與資訊區塊 */
.contact-section {
  margin-bottom: 40px;
}

.contact-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.contact-form, .contact-info {
  flex: 1;
  min-width: 300px;
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
}

.contact-form h2, .contact-info h2 {
  color: #ff5733;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
}

.form-group textarea {
  resize: vertical;
}

.primary-btn {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #e04e2d;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
}

/* 聯絡資訊 */
.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item i {
  color: #ff5733;
  font-size: 20px;
  margin-right: 10px;
}

.info-item p {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.social-links {
  margin-top: 20px;
}

.social-links h3 {
  color: #ff5733;
  font-size: 18px;
  margin-bottom: 10px;
}

.social-icon {
  display: inline-block;
  margin-right: 10px;
  color: #ff5733;
  font-size: 20px;
  text-decoration: none;
}

.social-icon:hover {
  color: #e04e2d;
}

/* 地圖區塊 */
.map-section {
  margin-bottom: 40px;
  text-align: center;
}

.map-section h2 {
  color: #ff5733;
  font-size: 24px;
  margin-bottom: 20px;
}

.map-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.map-container img, .map-container iframe {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
    gap: 20px;
  }

  .contact-form, .contact-info {
    width: 100%;
  }

  .info-item p {
    font-size: 14px;
  }

  .map-container img, .map-container iframe {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 28px;
  }

  .hero-section p {
    font-size: 16px;
  }

  .contact-form h2, .contact-info h2 {
    font-size: 20px;
  }

  .form-group label {
    font-size: 14px;
  }

  .form-group input, .form-group textarea {
    font-size: 12px;
  }
}
</style>