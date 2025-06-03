import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Services from './views/ServicesView.vue'
import PIFView from './views/PIFView.vue'
import PlanView from './views/PlanView.vue'
import NewsView from './views/NewsView.vue'
import AboutView from './views/AboutView.vue'
import Loginview from './views/Loginview.vue' 

const routes = [
  { path: '/', component: Home },
  { path: '/ServicesView', component: Services },
  { path: '/PIFView', component: PIFView },
  { path: '/PlanView', component: PlanView },
  { path: '/NewsView', component: NewsView },
  { path: '/AboutView', component: AboutView },
  { path: '/LoginView', component: Loginview },
  { path: '/register', component: () => import('./views/Register.vue') }, 
  { path: '/ForgetPassword', component: () => import('./views/ForgetPassword.vue') } 
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router