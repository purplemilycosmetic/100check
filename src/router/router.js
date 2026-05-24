import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import aiaudit from './views/ai-audit.vue'
import services from './views/services.vue'
import PIF from './views/PIF.vue'
import plan from './views/plan.vue'
import NewsView from './views/NewsView.vue'
import about from './views/about.vue'
import login from './views/login.vue' 
import register from './views/register.vue' 
const routes = [
  { path: '/', component: Home },
  { path: '/ai-audit', component: ai-audit },
  { path: '/services', component: services },
  { path: '/PIF', component: PIF },
  { path: '/plan', component: plan },
  { path: '/NewsView', component: NewsView },
  { path: '/about', component: about },
  { path: '/login', component: login },
  { path: '/register', component:register }, 
  { path: '/forget-password', component: () => import('./views/forget-password.vue') } 
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router