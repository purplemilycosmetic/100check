<template>
  <div class="register-page">
    <!-- 標題區塊 -->
    <section class="hero-section">
      <h1>註冊</h1>
      <p>立即註冊，開始體驗我們的化妝品合規服務！</p>
    </section>

    <!-- 註冊表單區塊 -->
    <section class="register-section">
      <div class="register-container">
        <div class="register-form">
          <h2>建立您的帳號</h2>
          <div v-if="formSubmitted" class="success-message">
            註冊成功！請檢查您的電子郵件以完成後續步驟。
          </div>
          <div v-else>
            <div class="form-group">
              <label for="email">電子郵件</label>
              <input type="email" id="email" v-model="form.email" placeholder="請輸入您的電子郵件" required />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            <div class="form-group">
              <label for="password">密碼</label>
              <input type="password" id="password" v-model="form.password" placeholder="請輸入您的密碼（至少 8 個字符）" required />
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
            <div class="form-group">
              <label for="confirm-password">確認密碼</label>
              <input type="password" id="confirm-password" v-model="form.confirmPassword" placeholder="請再次輸入您的密碼" required />
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="terms" v-model="form.terms" required />
              <label for="terms">我同意 <router-link to="/terms" class="terms-link">服務條款</router-link></label>
              <span v-if="errors.terms" class="error-message">{{ errors.terms }}</span>
            </div>
            <button class="primary-btn" @click="submitForm">註冊</button>
            <p class="login-link">已有帳號？<router-link to="/LoginView">立即登入</router-link></p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
      },
      errors: {
        email: '',
        password: '',
        confirmPassword: '',
        terms: ''
      },
      formSubmitted: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        email: '',
        password: '',
        confirmPassword: '',
        terms: ''
      }
      let isValid = true

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.errors.email = '請輸入電子郵件'
        isValid = false
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = '請輸入有效的電子郵件格式'
        isValid = false
      }

      if (!this.form.password) {
        this.errors.password = '請輸入密碼'
        isValid = false
      } else if (this.form.password.length < 8) {
        this.errors.password = '密碼必須至少 8 個字符'
        isValid = false
      }

      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = '請再次輸入密碼'
        isValid = false
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = '兩次輸入的密碼不一致'
        isValid = false
      }

      if (!this.form.terms) {
        this.errors.terms = '請同意服務條款'
        isValid = false
      }

      return isValid
    },
    async submitForm() {
      if (this.validateForm()) {
        try {
          const response = await axios.post('http://localhost:3000/api/register', {
            email: this.form.email,
            password: this.form.password
          })
          if (response.status === 201) {
            this.formSubmitted = true
            this.form.email = ''
            this.form.password = ''
            this.form.confirmPassword = ''
            this.form.terms = false
            setTimeout(() => {
              this.formSubmitted = false
            }, 5000)
          }
        } catch (error) {
          console.log('註冊失敗詳細錯誤:', error)
          if (!error.response) {
            this.errors.email = '無法連線到伺服器，請確認後端是否運行'
          } else {
            const status = error.response.status
            const message = error.response.data?.message || '註冊失敗，請稍後重試'
            if (status === 400) {
              this.errors.email = message
            } else if (status === 500) {
              this.errors.email = '伺服器內部錯誤，請稍後重試'
            } else {
              this.errors.email = message
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  margin: 3.75rem auto 1.25rem; /* 60px 20px 轉為 rem */
  padding: 1.25rem; /* 20px 轉為 rem */
  max-width: 75rem; /* 1200px 轉為 rem */
}

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
  font-size: 1.25rem; /* 18px 轉為 rem */
  color: #333;
}

.register-section {
  margin-bottom: 2.5rem; /* 40px 轉為 rem */
}

.register-container {
  display: flex;
  justify-content: center;
}

.register-form {
  width: 100%;
  max-width: 31.25rem; /* 500px 轉為 rem */
  background: #f8f8f8;
  padding: 1.25rem; /* 20px 轉為 rem */
  border-radius: 0.625rem; /* 10px 轉為 rem */
}

.register-form h2 {
  color: #ff5733;
  font-size: 1.5rem; /* 24px 轉為 rem */
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
  text-align: center;
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

.form-group input {
  width: 100%;
  padding: 0.625rem; /* 10px 轉為 rem */
  border: 1px solid #ddd;
  border-radius: 0.3125rem; /* 5px 轉為 rem */
  font-size: 0.875rem; /* 14px 轉為 rem */
  color: #333;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 0.625rem; /* 10px 轉為 rem */
}

.checkbox-group label {
  font-size: 0.875rem; /* 14px 轉為 rem */
}

.terms-link {
  color: #ff5733;
  text-decoration: none;
}

.terms-link:hover {
  color: #e04e2d;
}

.error-message {
  display: block;
  color: #ff0000;
  font-size: 0.75rem; /* 12px 轉為 rem */
  margin-top: 0.3125rem; /* 5px 轉為 rem */
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 0.625rem; /* 10px 轉為 rem */
  border-radius: 0.3125rem; /* 5px 轉為 rem */
  text-align: center;
  margin-bottom: 1.25rem; /* 20px 轉為 rem */
}

.primary-btn {
  width: 100%;
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

.login-link {
  text-align: center;
  margin-top: 0.9375rem; /* 15px 轉為 rem */
  font-size: 0.875rem; /* 14px 轉為 rem */
  color: #333;
}

.login-link a {
  color: #ff5733;
  text-decoration: none;
}

.login-link a:hover {
  color: #e04e2d;
}

/* 設備斷點 - 手機 (max-width: 600px) */
@media (max-width: 600px) {
  .register-page {
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

  .register-form {
    padding: 0.9375rem; /* 15px 轉為 rem */
  }

  .register-form h2 {
    font-size: 1.25rem; /* 20px 轉為 rem */
  }

  .form-group label {
    font-size: 0.875rem; /* 14px 轉為 rem */
  }

  .form-group input {
    font-size: 0.75rem; /* 12px 轉為 rem */
  }

  .primary-btn {
    padding: 0.5rem 1rem; /* 8px 16px 轉為 rem */
    font-size: 0.875rem; /* 14px 轉為 rem */
  }
}

/* 設備斷點 - 平板 (601px - 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .register-page {
    max-width: 60rem; /* 960px 轉為 rem */
  }

  .register-form {
    max-width: 25rem; /* 400px 轉為 rem */
  }

  .hero-section h1 {
    font-size: 2rem; /* 32px 轉為 rem */
  }
}

/* 設備斷點 - 桌面 (min-width: 1025px) */
@media (min-width: 1025px) {
  .register-page {
    max-width: 75rem; /* 1200px 轉為 rem */
  }
}
</style>