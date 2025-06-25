<template>
  <div class="login-page">
    <h1>登入</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">帳號</label>
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="請輸入帳號（電子郵件）"
          required
        />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="請輸入密碼（至少 8 個字符）"
          required
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
      <div class="form-group checkbox-group">
        <input type="checkbox" id="remember" v-model="rememberMe" />
        <label for="remember">記住我</label>
      </div>
      <button type="submit" class="primary-btn" :disabled="isLoading">
        <span v-if="isLoading">載入中...</span>
        <span v-else>登入</span>
      </button>
      <div v-if="loginSuccess" class="success-message">
        登入成功！即將導向首頁。
      </div>
    </form>
    <div class="login-links">
      <router-link to="/register" class="link-btn">尚未註冊</router-link>
      <router-link to="/forget-password" class="link-btn">忘記密碼</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      errors: {
        username: '',
        password: ''
      },
      rememberMe: false,
      isLoading: false,
      loginSuccess: false
    }
  },
  watch: {
    username(newValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (newValue && !emailRegex.test(newValue)) {
        this.errors.username = '請輸入有效的電子郵件格式'
      } else {
        this.errors.username = ''
      }
    },
    password(newValue) {
      if (newValue && newValue.length < 8) {
        this.errors.password = '密碼必須至少 8 個字符'
      } else {
        this.errors.password = ''
      }
    }
  },
  created() {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      this.username = savedUsername
      this.rememberMe = true
    }
  },
  methods: {
    validateForm() {
      this.errors = {
        username: '',
        password: ''
      }
      let isValid = true

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.username) {
        this.errors.username = '請輸入帳號'
        isValid = false
      } else if (!emailRegex.test(this.username)) {
        this.errors.username = '請輸入有效的電子郵件格式'
        isValid = false
      }

      if (!this.password) {
        this.errors.password = '請輸入密碼'
        isValid = false
      } else if (this.password.length < 8) {
        this.errors.password = '密碼必須至少 8 個字符'
        isValid = false
      }

      return isValid
    },
    async handleLogin() {
      if (this.validateForm()) {
        this.isLoading = true
        try {
          const response = await axios.post('http://localhost:3000/api/login', {
            email: this.username,
            password: this.password
          })
          if (response.status === 200) {
            // 儲存會話資訊
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', this.username)

            // 確認會話已儲存
            const storedToken = localStorage.getItem('token')
            const storedUsername = localStorage.getItem('username')
            if (!storedToken || !storedUsername) {
              throw new Error('會話儲存失敗')
            }
            console.log('會話儲存成功:', { token: storedToken, username: storedUsername })

            // 處理「記住我」功能
            if (this.rememberMe) {
              localStorage.setItem('username', this.username)
            } else {
              localStorage.removeItem('username')
            }

            this.loginSuccess = true
            setTimeout(() => {
              this.loginSuccess = false
              this.$router.push('/')
            }, 2000)
          }
        } catch (error) {
          console.log('登入失敗詳細錯誤:', error)
          if (!error.response) {
            this.errors.username = '無法連線到伺服器，請確認後端是否運行'
          } else {
            const status = error.response.status
            const message = error.response.data?.message || '登入失敗，請稍後重試'
            if (status === 400) {
              if (message.includes('帳號不存在')) {
                this.errors.username = message
              } else if (message.includes('密碼錯誤')) {
                this.errors.password = message
              } else {
                this.errors.username = message
              }
            } else {
              this.errors.username = message
            }
          }
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 60px auto 20px;
  padding: 20px;
  text-align: center;
}

.login-page h1 {
  color: #ff5733;
  font-size: 36px;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 10px;
}

.checkbox-group label {
  font-size: 14px;
}

.error-message {
  display: block;
  color: #ff0000;
  font-size: 12px;
  margin-top: 5px;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  text-align: center;
}

.primary-btn {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.primary-btn:hover {
  background: #e04e2d;
}

.primary-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-links {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.link-btn {
  color: #ff5733;
  text-decoration: none;
  font-size: 14px;
}

.link-btn:hover {
  text-decoration: underline;
}
</style>