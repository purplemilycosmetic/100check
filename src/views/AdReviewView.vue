<template>
  <main class="page-ad-review">

    <section class="hero">
      <h1>{{ copy.heroTitle }}</h1>
      <p class="subtitle">{{ copy.heroSubtitle }}</p>
      <router-link to="/ai-audit" class="cta-btn">{{ copy.heroCta }}</router-link>
    </section>

    <section class="section">
      <h2>{{ copy.serviceTitle }}</h2>
      <p>{{ copy.serviceDesc }}</p>
    </section>

    <section class="section">
      <h2>{{ copy.featuresTitle }}</h2>
      <ul>
        <li v-for="item in copy.features" :key="item">◆ {{ item }}</li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ copy.audienceTitle }}</h2>
      <p>{{ copy.audienceDesc }}</p>
    </section>

    <section class="section cta-section">
      <h2>{{ copy.ctaTitle }}</h2>
      <router-link to="/ai-audit" class="cta-btn">免費體驗</router-link>
      <router-link to="/plan" class="secondary-btn">查看方案</router-link>
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
  heroTitle:    'AI 化妝品廣告審核服務',
  heroSubtitle: '快速、精準、省時 — 讓 AI 幫你把關每一則廣告文案',
  heroCta:      '馬上免費檢核',

  // 服務說明
  serviceTitle: '服務說明',
  serviceDesc:  '審盾橘使用 AI 技術自動分析化粧品廣告文案，比對政府裁罰案例與相關法規，即時標示風險字眼，幫助品牌在刊登前完成合規審查，有效降低違規罰款風險。',

  // 功能特色
  featuresTitle: '功能特色',
  features: [
    'AI 自動標示風險字眼，秒速完成初審',
    '比對政府裁罰案例，審核有憑有據',
    '支援長篇廣告劇本，大量文案一次審查',
  ],

  // 適用對象
  audienceTitle: '適用對象',
  audienceDesc:  '適合化粧品品牌主、行銷人員、廣告代理商，以及任何需要刊登化粧品相關廣告的業者。',

  // 底部 CTA
  ctaTitle: '立即開始審核',
}
// ═══════════════════════════════════════════════

// SEO（title / description 若要修改也在這裡改）
useHead({
  title: '免費 AI 廣告文案審查｜化妝品廣告合規檢測服務 - 審盾橘',
  meta: [
    { name: 'description', content: '審盾橘提供免費 AI 化妝品（化粧品）廣告文案審查服務，自動標示違規風險字眼、比對政府裁罰案例，快速完成廣告合規檢測，降低違規罰款風險。' },
    { property: 'og:title', content: '免費 AI 廣告文案審查｜化妝品廣告合規檢測服務 - 審盾橘' },
    { property: 'og:description', content: '免費 AI 化妝品廣告文案審查，自動標示風險字眼，依據政府裁罰案例辨識違規內容。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/ad-review' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/ad-review' }],
})
</script>

<style scoped>
.page-ad-review {
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
  margin: 0 0.5rem;
}
.cta-btn:hover { background: #e04e2d; }
.secondary-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  border: 2px solid #ff5733;
  color: #ff5733;
  border-radius: 5px;
  text-decoration: none;
  margin: 0 0.5rem;
}
.secondary-btn:hover { background: #fff3f0; }
</style>
