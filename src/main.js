import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
const head = createHead()

app.use(router)
app.use(store)
app.use(head)
app.mount('#app')