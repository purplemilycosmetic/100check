<!--
  強化版 PIFLandingView.vue
  改動重點：
  1. 加入「不綁代工 / 配方保密」差異化段落（對手最大弱點）
  2. 加入可見 FAQ（搭配 pifFaqSchema，搶 Google FAQ 摺疊顯示）
  3. 接上結構化資料（serviceSchema + pifFaqSchema + breadcrumbSchema）
  4. 強化內鏈：導向免費 AI 審查工具（漏斗）
  5. title/description 微調，加入「費用」「代辦」等變現關鍵字
-->
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

    <!-- ⭐ 新增：差異化段落（你的獨家賣點，對手綁代工） -->
    <section class="section highlight">
      <h2>{{ copy.whyUsTitle }}</h2>
      <ul>
        <li v-for="item in copy.whyUs" :key="item">◆ {{ item }}</li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ copy.serviceTitle }}</h2>
      <ul>
        <li v-for="item in copy.services" :key="item">◆ {{ item }}</li>
      </ul>
    </section>

    <!-- ⭐ 新增：可見 FAQ（搭配 FAQ 結構化資料） -->
    <section class="section faq">
      <h2>常見問題</h2>
      <details v-for="(f, i) in copy.faqs" :key="i" class="faq-item">
        <summary>{{ f.q }}</summary>
        <p>{{ f.a }}</p>
      </details>
    </section>

    <!-- ⭐ 新增：漏斗內鏈 — 導向免費工具 -->
    <section class="section cross-link">
      <p>還在煩惱廣告文案會不會違規？先用我們的
        <router-link to="/ai-audit">免費 AI 廣告文案審查工具</router-link>
        檢查，再進一步準備 PIF 建檔。
      </p>
    </section>

    <section class="section cta-section">
      <h2>{{ copy.ctaTitle }}</h2>
      <router-link to="/PIF" class="cta-btn">查看詳細說明</router-link>
      <router-link to="/about" class="cta-btn cta-secondary">免費諮詢報價</router-link>
    </section>

  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import {
  serviceSchema,
  pifFaqSchema,
  breadcrumbSchema,
} from '@/composables/useStructuredData'

// ═══════════════════════════════════════════════
//  文案區域 — 只需要修改這裡
// ═══════════════════════════════════════════════
const copy = {
  heroTitle:    '化妝品產品資訊檔案（PIF）建檔・代辦服務',
  heroSubtitle: '獨立第三方專業簽署，不綁代工生產、嚴格保密配方，符合衛福部《化粧品衛生安全管理法》',
  heroCta:      '了解 PIF 詳情',

  whatTitle: '什麼是化粧品產品資訊檔案（PIF）？',
  whatDesc:  '化粧品產品資訊檔案（PIF，Product Information File）是衛生福利部依據《化粧品衛生安全管理法》要求業者建立的產品安全資料。PIF 內容包括產品配方、製造資訊、安全評估報告及品質管理文件，是產品上市前必備的合法要件。',

  lawTitle: '法規要求與罰則',
  lawDesc:  '依據《化粧品衛生安全管理法》，化粧品業者應於產品上市前建立產品資訊檔案，並保存至產品停產後一定年限。違反規定最高可處新臺幣一百萬元罰鍰，並可能面臨停售、回收風險。一般化妝品自 115 年 7 月 1 日起須完成 PIF 並符合 GMP。',

  // ⭐ 差異化賣點
  whyUsTitle: '為什麼選擇審盾橘的 PIF 服務？',
  whyUs: [
    '獨立第三方服務，不要求你在我們這邊代工生產 — 已有配方或既有代工廠都能協助',
    '配方資料嚴格保密，PIF 屬非公開檔案，僅供主管機關查核備查',
    '由持有化粧品安全資料簽署人員證照的專業人員親自簽署',
    '完整安全評估：毒理分析、安全餘裕（MoS）計算、依 SCCS 標準執行',
  ],

  serviceTitle: '服務內容',
  services: [
    '由持有化粧品安全資料簽署人員證照的專業人員協助建立 PIF',
    '完整收集並整理產品配方、原料安全資料與製造資訊',
    '協助建立電子化 PIF 檔案管理，方便日後查閱與更新',
  ],

  // ⭐ FAQ（內容須與 pifFaqSchema 一致，Google 才認可）
  faqs: [
    { q: '化妝品沒有建立 PIF 會被罰嗎？', a: '會。依《化粧品衛生安全管理法》規定，業者應於產品上市前建立 PIF。未依規定者最高可處新臺幣一百萬元罰鍰，並可能面臨停售、回收風險。' },
    { q: '一般化妝品什麼時候要完成 PIF？', a: '特定用途化妝品已於 113 年 7 月 1 日起須完成；嬰兒用、唇用、眼部用等於 114 年 7 月 1 日起；一般化妝品自 115 年 7 月 1 日起須完成 PIF 並符合 GMP。' },
    { q: '找你們做 PIF 一定要在你們這邊代工生產嗎？', a: '不會。審盾橘是獨立第三方 PIF 建檔與安全簽署服務，不綁定代工。你已有配方或既有代工廠，一樣能協助完成建檔與簽署。' },
    { q: '做 PIF 需要提供完整配方，會不會外洩？', a: 'PIF 屬「非公開」檔案，僅供主管機關查核備查，無須提交審查。我們對所有客戶配方資料嚴格保密。' },
  ],

  ctaTitle: '立即諮詢 PIF 建檔服務',
}
// ═══════════════════════════════════════════════

useHead({
  title: 'PIF 代辦・建檔費用｜化妝品產品資訊檔案 - 審盾橘',
  meta: [
    { name: 'description', content: '審盾橘提供化妝品 PIF 代辦建檔服務，獨立第三方專業簽署、不綁代工、保密配方，符合衛福部《化粧品衛生安全管理法》。一般化妝品 115 年 7 月須完成 PIF，立即免費諮詢費用。' },
    { property: 'og:title', content: 'PIF 代辦・建檔服務｜化妝品產品資訊檔案 - 審盾橘' },
    { property: 'og:description', content: '獨立第三方化妝品 PIF 建檔，不綁代工、保密配方，由專業證照人員簽署，符合衛福部法規。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/pif' },
    { property: 'og:type', content: 'website' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/pif' }],
  script: [
    serviceSchema('pif'),
    pifFaqSchema(),
    breadcrumbSchema([
      { name: '首頁', url: 'https://www.aicheck.com.tw/' },
      { name: 'PIF 建檔服務', url: 'https://www.aicheck.com.tw/pif' },
    ]),
  ],
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
  line-height: 1.7;
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
  margin-bottom: 0.75rem;
  line-height: 1.7;
}
/* 差異化段落加底色強調 */
.highlight {
  background: #fff5f2;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #ff5733;
}
/* FAQ 樣式 */
.faq-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.faq-item summary {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}
.faq-item p {
  margin-top: 0.75rem;
  color: #555;
}
.cross-link {
  background: #f8f8f8;
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
}
.cross-link a {
  color: #ff5733;
  font-weight: bold;
}
.cta-section {
  text-align: center;
}
.cta-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  margin: 0.5rem;
  background: #ff5733;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.cta-btn:hover { background: #e04e2d; }
.cta-secondary {
  background: white;
  color: #ff5733;
  border: 2px solid #ff5733;
}
.cta-secondary:hover { background: #fff5f2; }
</style>