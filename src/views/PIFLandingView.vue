<template>
  <main class="page-pif">

    <section class="hero">
      <h1>{{ copy.heroTitle }}</h1>
      <p class="subtitle">{{ copy.heroSubtitle }}</p>
      <router-link to="/PIF" class="cta-btn">{{ copy.heroCta }}</router-link>
    </section>

    <section class="section">
      <h2>{{ copy.whatTitle }}</h2>
      <p>{{ copy.whatDesc }}</p>
    </section>

    <section class="section">
      <h2>{{ copy.lawTitle }}</h2>
      <p>{{ copy.lawDesc }}</p>
    </section>

    <section class="section">
      <h2>{{ copy.serviceTitle }}</h2>
      <ul>
        <li v-for="item in copy.services" :key="item">◆ {{ item }}</li>
      </ul>
    </section>

    <section class="section cta-section">
      <h2>{{ copy.ctaTitle }}</h2>
      <router-link to="/PIF" class="cta-btn">查看詳細說明</router-link>
    </section>

  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue'

// ═══════════════════════════════════════════════
//  文案區域 — 只需要修改這裡
// ═══════════════════════════════════════════════
const copy = {
  // Hero 區塊
  heroTitle:    '化妝品產品資訊檔案（PIF）建檔服務',
  heroSubtitle: '符合衛福部法規，專業人員協助建立完整產品資訊檔案',
  heroCta:      '了解 PIF 詳情',

  // 什麼是 PIF
  whatTitle: '什麼是化粧品產品資訊檔案（PIF）？',
  whatDesc:  '化粧品產品資訊檔案（PIF，Product Information File）是衛生福利部依據《化粧品衛生安全管理法》要求業者建立的產品安全資料。PIF 內容包括產品配方、製造資訊、安全評估報告及品質管理文件，是產品上市前必備的合法要件。',

  // 法規要求
  lawTitle: '法規要求',
  lawDesc:  '依據《化粧品衛生安全管理法》第十一條，化粧品業者應於產品上市前建立產品資訊檔案，並保存至產品停產後至少五年。違反規定最高可處新臺幣一百萬元罰鍰。',

  // 服務內容
  serviceTitle: '服務內容',
  services: [
    '由持有化粧品安全資料簽署人員證照的專業人員協助建立 PIF',
    '完整收集並整理產品配方、原料安全資料與製造資訊',
    '協助建立電子化 PIF 檔案管理，方便日後查閱與更新',
  ],

  // 底部 CTA
  ctaTitle: '立即諮詢 PIF 建檔服務',
}
// ═══════════════════════════════════════════════

useHead({
  title: 'PIF 化妝品產品資訊檔案建檔｜化粧品安全資料服務 - 審盾橘',
  meta: [
    { name: 'description', content: '審盾橘提供化妝品（化粧品）產品資訊檔案 PIF 建檔服務，協助品牌符合法規要求，由具備專業證照的人員協助建立完整安全資料。' },
    { property: 'og:title', content: 'PIF 化妝品產品資訊檔案建檔｜化粧品安全資料服務 - 審盾橘' },
    { property: 'og:description', content: '審盾橘協助化妝品（化粧品）品牌完成 PIF 產品資訊檔案建檔，符合衛福部法規要求，專業人員直接簽署。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/pif' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/pif' }],
})
</script>

<style scoped>
.page-pif {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}
.hero {
  text-align: center;
  padding: 3rem 1rem;
}
.hero h1 {
  font-size: 2.25rem;
  color: #ff5733;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: 1.125rem;
  color: #555;
  margin-bottom: 1.5rem;
}
.section {
  margin: 3rem 0;
}
.section h2 {
  font-size: 1.5rem;
  color: #ff5733;
  margin-bottom: 1rem;
}
.section p {
  font-size: 1.05rem;
  color: #444;
  line-height: 1.8;
}
.section ul {
  list-style: none;
  padding: 0;
}
.section ul li {
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 0.5rem;
}
.cta-section {
  text-align: center;
}
.cta-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: #ff5733;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.cta-btn:hover { background: #e04e2d; }
</style>
