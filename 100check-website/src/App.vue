<template>
  <div id="app">
    <!-- 固定首欄 -->
    <header class="fixed-header">
      <router-link to="/" class="logo-btn">
        <img src="@/assets/logo.png" alt="100check Logo" class="logo-image" />
      </router-link>
      <nav>
        <router-link to="/" exact>首頁</router-link>
        <router-link to="/AIAuditView">AI廣告檢核</router-link> 
        <router-link to="/ServicesView">服務介紹</router-link>
        <router-link to="/PIFView">化妝品安全資料簽署</router-link>
        <router-link to="/PlanView">方案介紹</router-link>
        <router-link to="/NewsView">最新消息</router-link>
        <router-link to="/AboutView">關於我們</router-link>
      </nav>
      <div class="right-section">
        <div class="lang-switcher">
          <!-- 語言切換器 -->
        </div>
        <div v-if="isLoggedIn" class="user-info">
          <span class="username">{{ username }}</span>
          <button @click="logout" class="logout-btn">登出</button>
        </div>
        <router-link v-else to="/loginview" class="auth-btn">註冊/登入</router-link>
      </div>
    </header>

    <!-- 主內容 -->
    <main class="content">
      <router-view />
    </main>
    <!-- 頁尾 -->
    <Footer />
  </div>
</template>

<script>
import Footer from './components/Footer.vue'

export default {
  components: {
    Footer
  },
  data() {
    return {
      username: localStorage.getItem('username') || '',
      isLoggedIn: !!localStorage.getItem('token')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      this.isLoggedIn = false
      this.username = ''
      this.$router.push('/loginview')
    }
  },
  watch: {
    '$route'() {
      this.isLoggedIn = !!localStorage.getItem('token')
      this.username = localStorage.getItem('username') || ''
    }
  }
}
</script>

<style scoped>
/* 整體樣式 */
#app {
  font-family: Arial, sans-serif;
}

/* 固定首欄 */
.fixed-header {
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  padding: 10px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
}

.logo-btn {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-image {
  height: 40px;
  width: auto;
  cursor: pointer;
}

.logo-btn:hover .logo-image {
  opacity: 0.8;
}

nav {
  flex-grow: 1;
  text-align: center;
}

nav a, router-link {
  margin: 0 15px;
  text-decoration: none;
  color: #e04e2d;
  font-size: 16px;
}

nav a:hover, router-link:hover {
  color: #ff5733;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lang-switcher select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.auth-btn {
  background: #ff5733;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 100px;
  text-decoration: none;
}

.auth-btn:hover {
  background: #e04e2d;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 100px;
}

.username {
  font-size: 14px;
  color: #333;
}

.logout-btn {
  background: #ff5733;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background: #e04e2d;
}

/* 主內容 */
.content {
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(to bottom, #ffffff 50%, #fff 50%);
}
</style>