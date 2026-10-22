import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 換頁一律回到頁首（原本會停在上一頁的捲動位置，長頁面點「聯絡我們」會直接落在頁尾）；
  // 有 #錨點 時捲到該區塊並避開固定頁首；上一頁／下一頁則回到原位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/contact',
      redirect: (to) => ({ path: '/about', query: to.query }),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
      {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
      {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
    },     
     {
      path: '/forget-password',
      name: 'forget-password',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ForgetPassword.vue'),
    },
     {
      path: '/services',
      name: 'services',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ServicesView.vue'),
    },
     {
      // 舊網址 /PIF 轉到 /pif（sensitive：只攔大寫，避免 /pif 也被導向而無限迴圈）
      path: '/PIF',
      redirect: '/pif',
      sensitive: true,
    },
     {
      // 方案介紹已併入「服務與方案」
      path: '/plan',
      redirect: '/services#plans',
    },
    {
      path: '/NewsView',
      name: 'NewsView',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/NewsView.vue'),
    },
       {
      path: '/ai-audit',
      name: 'ai-audit',
      component: () => import('../views/AIAuditView.vue'),
    },
    {
      path: '/ad-review',
      name: 'ad-review',
      component: () => import('../views/AdReviewView.vue'),
    },
    {
      path: '/pif',
      name: 'pif-landing',
      component: () => import('../views/PIFLandingView.vue'),
    },
    {
      path: '/safety-assessment',
      name: 'safety-assessment',
      component: () => import('../views/SafetyAssessmentView.vue'),
    },
    {
      path: '/label-generator',
      name: 'label-generator',
      component: () => import('../views/LabelGeneratorView.vue'),
    },
    {
      path: '/reference-links',
      name: 'reference-links',
      component: () => import('../views/ReferenceLinksView.vue'),
    },
    {
      path: '/restricted-ingredients',
      name: 'restricted-ingredients',
      component: () => import('../views/RestrictedIngredientsView.vue'),
    },
    {
      path: '/ingredients-dictionary',
      name: 'ingredients-dictionary',
      component: () => import('../views/IngredientsDictionaryView.vue'),
    },
    {
      path: '/dv-greencard',
      name: 'dv-greencard',
      component: () => import('../views/DvGreencardView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogListView.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue'),
    },
    {
      path: '/admin/blog',
      name: 'admin-blog',
      component: () => import('../views/AdminBlogView.vue'),
    },
    {
      path: '/admin/blog/new',
      name: 'admin-blog-new',
      component: () => import('../views/AdminBlogEditView.vue'),
    },
    {
      path: '/admin/blog/:id',
      name: 'admin-blog-edit',
      component: () => import('../views/AdminBlogEditView.vue'),
    },
  ],
})

export default router
