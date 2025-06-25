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
            <p></p>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <p></p>
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

/* 聯絡表單與資訊區塊 */
.contact-section {
  margin-bottom: 2.5rem; /* 40px 轉為 rem */
}

.contact-container {
  display: flex;
  gap: 2.5rem; /* 40px 轉為 rem */
  flex-wrap: wrap;
}

.contact-form,
.contact-info {
  flex: 1;
  min-width: 18.75rem; /* 300px 轉為 rem */
  background: #f8f8f8;
  padding: 1.25rem; /* 20px 轉為 rem */
  border-radius: 0.625rem; /* 10px 轉為 rem */
}

.contact-form h2,
.contact-info h2 {
  color: #ff5733;
  font-size: 1.5rem; /* 24px 轉為 rem */
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
}

.form-group {
  margin-bottom: 0.9375rem; /* 15px 轉為 rem */
}

.form-group label {
  display: block;
  font-size: 1rem; /* 16px 轉為 rem */
  color: #333;
  margin-bottom: 0.3125rem; /* 5px 轉為 rem */
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.625rem; /* 10px 轉為 rem */
  border: 1px solid #ddd;
  border-radius: 0.3125rem; /* 5px 轉為 rem */
  font-size: 0.875rem; /* 14px 轉為 rem */
  color: #333;
}

.form-group textarea {
  resize: vertical;
}

.primary-btn {
  padding: 0.625rem 1.25rem; /* 10px 20px 轉為 rem */
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 0.3125rem; /* 5px 轉為 rem */
  font-size: 1rem; /* 16px 轉為 rem */
  cursor: pointer;
}

.primary-btn:hover {
  background: #e04e2d;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 0.625rem; /* 10px 轉為 rem */
  border-radius: 0.3125rem; /* 5px 轉為 rem */
  text-align: center;
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
}

/* 聯絡資訊 */
.info-item {
  display: flex;
  align-items: center;
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

.social-links {
  margin-top: 1.25rem; /* 20px 轉為 rem */
}

.social-links h3 {
  color: #ff5733;
  font-size: 1.125rem; /* 18px 轉為 rem */
  margin-bottom: 0.625rem; /* 10px 轉為 rem */
}

.social-icon {
  display: inline-block;
  margin-right: 0.625rem; /* 10px 轉為 rem */
  color: #ff5733;
  font-size: 1.25rem; /* 20px 轉為 rem */
  text-decoration: none;
}

.social-icon:hover {
  color: #e04e2d;
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

  .contact-container {
    flex-direction: column;
    gap: 1.25rem; /* 20px 轉為 rem */
  }

  .contact-form,
  .contact-info {
    width: 100%;
  }

  .contact-form h2,
  .contact-info h2 {
    font-size: 1.25rem; /* 20px 轉為 rem */
  }

  .form-group label {
    font-size: 0.875rem; /* 14px 轉為 rem */
  }

  .form-group input,
  .form-group textarea {
    font-size: 0.75rem; /* 12px 轉為 rem */
  }

  .info-item p {
    font-size: 0.875rem; /* 14px 轉為 rem */
  }

  .primary-btn {
    padding: 0.5rem 1rem; /* 8px 16px 轉為 rem */
    font-size: 0.875rem; /* 14px 轉為 rem */
  }
}

/* 設備斷點 - 平板 (601px - 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .contact-page {
    max-width: 60rem; /* 960px 轉為 rem */
  }

  .contact-container {
    gap: 1.875rem; /* 30px 轉為 rem */
  }

  .hero-section h1 {
    font-size: 2rem; /* 32px 轉為 rem */
  }

  .contact-form h2,
  .contact-info h2 {
    font-size: 1.375rem; /* 22px 轉為 rem */
  }
}

/* 設備斷點 - 桌面 (min-width: 1025px) */
@media (min-width: 1025px) {
  .contact-page {
    max-width: 75rem; /* 1200px 轉為 rem */
  }
}
</style>