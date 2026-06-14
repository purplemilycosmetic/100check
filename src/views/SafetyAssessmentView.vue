<template>
  <main class="page-safety">

    <section class="hero">
      <h1>{{ copy.heroTitle }}</h1>
      <p class="subtitle">{{ copy.heroSubtitle }}</p>
      <router-link to="/services" class="cta-btn">{{ copy.heroCta }}</router-link>
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
      <router-link to="/services" class="cta-btn">查看服務方案</router-link>
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
  heroTitle:    '化妝品安全評估與安全資料簽署服務',
  heroSubtitle: '具備專業證照的簽署人員，協助品牌完成化粧品安全評估',
  heroCta:      '查看所有服務',

  // 什麼是安全評估
  whatTitle: '什麼是化粧品安全評估？',
  whatDesc:  '化粧品安全評估（Safety Assessment）是針對產品成分、使用方式及可能暴露量進行科學評估，確認產品在正常使用條件下對消費者無安全疑慮，是建立 PIF 產品資訊檔案的核心文件之一。',

  // 法規背景
  lawTitle: '法規背景',
  lawDesc:  '衛生福利部規定，化粧品產品資訊檔案（PIF）中須包含安全評估報告，且須由具備資格的化粧品安全資料簽署人員簽署確認，方具法律效力。',

  // 服務項目
  serviceTitle: '服務項目',
  services: [
    '由具備衛福部核可資格的化粧品安全資料簽署人員親自評估並簽署',
    '協助彙整原料安全資訊、毒理資料及暴露量評估',
    '簽署完成後納入 PIF 檔案，符合法規要求',
  ],

  // 底部 CTA
  ctaTitle: '立即諮詢安全評估服務',
}
// ═══════════════════════════════════════════════

useHead({
  title: '化妝品安全評估與資料簽署｜化粧品法規合規服務 - 審盾橘',
  meta: [
    { name: 'description', content: '審盾橘提供化妝品（化粧品）安全評估及安全資料簽署服務，由持有化粧品安全資料簽署人員證照的專業人員協助，確保符合衛福部法規。' },
    { property: 'og:title', content: '化妝品安全評估與資料簽署｜化粧品法規合規服務 - 審盾橘' },
    { property: 'og:description', content: '審盾橘專業人員提供化妝品（化粧品）安全評估與安全資料簽署，協助品牌建立合規的 PIF 檔案，符合衛福部最新規範。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/safety-assessment' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/safety-assessment' }],
})
</script>

<style scoped>
.page-safety {
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
