<template>
  <div id="app">
    <!-- 固定首欄 -->
    <header class="fixed-header">
      <div class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="header-left">
        <router-link to="/" class="logo-btn">
          <img src="@/assets/logo.png" alt="100check Logo" class="logo-image" />
        </router-link>
      </div>
      <nav :class="{ 'active': isMenuOpen }">
        <router-link to="/" exact>首頁</router-link>
        <router-link to="/ai-audit">AI廣告檢核</router-link>
        <router-link to="/services">服務介紹</router-link>
        <router-link to="/PIF">化妝品安全資料簽署</router-link>
        <router-link to="/plan">方案介紹</router-link>
        <router-link to="/about">關於我們</router-link>
      </nav>
      <div class="right-section">
        <div class="lang-switcher">
          <!-- 語言切換器 -->
        </div>
        <div v-if="isLoggedIn" class="user-info">
          <span class="username">{{ username }}</span>
          <button @click="logout" class="logout-btn">登出</button>
        </div>
        <!-- <router-link v-else to="/login" class="auth-btn">註冊/登入</router-link> -->
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
      isLoggedIn: !!localStorage.getItem('token'),
      isMenuOpen: false
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      this.isLoggedIn = false
      this.username = ''
      this.$router.push('/loginview')
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    }
  },
  watch: {
    '$route'() {
      this.isLoggedIn = !!localStorage.getItem('token')
      this.username = localStorage.getItem('username') || ''
      this.isMenuOpen = false // 切換路由時關閉菜單
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
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  z-index: 1000;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  display: none; /* 預設隱藏，僅手機顯示 */
  flex-direction: column;
  justify-content: space-between;
  width: 1.5rem;
  height: 1.25rem;
  cursor: pointer;
  margin-right: 1rem; /* 與 LOGO 分隔 */
}

.menu-toggle span {
  width: 100%;
  height: 0.1875rem;
  background: #e04e2d;
  transition: all 0.3s;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(0.3rem, 0.3rem);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(0.3rem, -0.3rem);
}

.logo-btn {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-image {
  height: 3rem;
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

nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #e04e2d;
  font-size: 1rem;
  white-space: nowrap;
}

nav a:hover {
  color: #ff5733;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.lang-switcher select {
  padding: 0.3125rem;
  border: 1px solid #ddd;
  border-radius: 0.3125rem;
  font-size: 0.875rem;
}

.auth-btn {
  background: #ff5733;
  color: white;
  padding: 0.5rem 0.9375rem;
  border: none;
  border-radius: 0.6125rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: none;
  min-width: 1.25rem;
}

.auth-btn:hover {
  background: #e04e2d;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.username {
  font-size: 0.875rem;
  color: #333;
}

.logout-btn {
  background: #ff5733;
  color: white;
  padding: 0.5rem 0.9375rem;
  border: none;
  border-radius: 0.3125rem;
  cursor: pointer;
  font-size: 0.875rem;
  min-width: 5rem;
}

.logout-btn:hover {
  background: #e04e2d;
}

/* 主內容 */
.content {
  margin-top: 3.75rem;
  padding: 1.25rem;
  background: linear-gradient(to bottom, #ffffff 50%, #fff 50%);
  min-height: calc(100vh - 3.75rem);
}

/* 手機模式 (max-width: 600px) */
@media (max-width: 600px) {
  .menu-toggle {
    display: flex; /* 顯示漢堡菜單 */
  }

  .fixed-header {
    padding: 0.625rem;
    flex-direction: row; /* 保持水平 */
    justify-content: flex-start;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .logo-image {
    height: 2.5rem;
    margin-left: 1rem; /* 與漢堡菜單分隔 */
  }

  nav {
    display: none;
    width: 100%;
    margin-top: 0.625rem;
    text-align: left;
    background: #fff;
    padding: 0.625rem 0;
    position: absolute;
    top: 100%;
    left: 0;
    border-bottom: 1px solid #ddd;
  }

  nav.active {
    display: block;
  }

  nav a {
    display: block;
    margin: 0.5rem 0;
    font-size: 0.875rem;
  }

  .right-section {
    margin-top: 0.625rem;
    width: 100%;
    justify-content: flex-end;
  }

  .auth-btn,
  .logout-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    min-width: 3rem;
  }

  .content {
    padding: 0.625rem;
  }
}

/* 平板模式 (601px - 1024px) */
@media (min-width: 601px) and (max-width: 1024px) {
  .fixed-header {
    padding: 1rem 1.5rem;
  }

  .logo-image {
    height: 2.75rem;
  }

  nav a {
    margin: 0 0.75rem;
    font-size: 0.9375rem;
  }

  .auth-btn,
  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .content {
    padding: 1rem;
  }
}

/* 桌面模式 (min-width: 1025px) */
@media (min-width: 1025px) {
  .fixed-header {
    padding: 1.25rem 2.5rem;
  }

  .logo-image {
    height: 4rem;
  }

  nav a {
    margin: 0 1.25rem;
    font-size: 1.0625rem;
  }

  .auth-btn,
  .logout-btn {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
  }

  .content {
    padding: 1.5rem;
  }
}
</style>