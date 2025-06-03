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
          placeholder="請輸入帳號"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="請輸入密碼"
          required
        />
      </div>
      <button type="submit" class="primary-btn">登入</button>
    </form>
    <div class="login-links">
      <router-link to="/register" class="link-btn">尚未註冊</router-link>
      <router-link to="/ForgetPassword" class="link-btn">忘記密碼</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // 這裡可以添加登入邏輯，例如發送 API 請求
      console.log('登入嘗試:', { username: this.username, password: this.password })
      // 模擬成功後跳轉到首頁（/）
      this.$router.push('/')
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