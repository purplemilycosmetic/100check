import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // 導入 Vuex 儲存

const app = createApp(App)
app.use(router)
app.use(store) // 使用 Vuex
app.mount('#app')