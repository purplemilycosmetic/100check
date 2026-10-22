<!--
  服務與方案（/services）
  原「服務介紹」與「方案介紹（/plan）」合併為一頁，/plan 轉址到 /services#plans。
-->
<template>
  <main class="services-page">
    <section class="hero">
      <p class="eyebrow">服務與方案</p>
      <h1>從廣告文案到 PIF，化粧品合規一次搞定</h1>
      <p class="subtitle">
        先用免費工具自己檢查，需要專業簽署或建檔時再交給我們。獨立第三方、不綁代工、配方嚴格保密。
      </p>
      <div class="hero-cta">
        <a href="#plans" class="btn">看服務方案</a>
        <router-link to="/about" class="btn btn-ghost">免費諮詢</router-link>
      </div>
    </section>

    <!-- ═══ 方案 ═══ -->
    <section id="plans" class="plans">
      <article v-for="p in PLANS" :key="p.title" class="plan" :class="{ featured: p.featured }">
        <span v-if="p.badge" class="plan-badge">{{ p.badge }}</span>
        <h2>{{ p.title }}</h2>
        <p class="price">{{ p.price }}</p>
        <p class="plan-desc">{{ p.desc }}</p>
        <ul>
          <li v-for="f in p.features" :key="f">{{ f }}</li>
        </ul>
        <div class="plan-actions">
          <router-link :to="p.cta.to" class="btn" :class="{ 'btn-ghost': !p.featured }">{{ p.cta.label }}</router-link>
          <router-link v-if="p.more" :to="p.more.to" class="more-link">{{ p.more.label }} →</router-link>
        </div>
      </article>
    </section>

    <!-- ═══ 流程 ═══ -->
    <section class="block">
      <h2>合作流程</h2>
      <ol class="flow">
        <li v-for="s in FLOW" :key="s.title"><b>{{ s.title }}</b><span>{{ s.desc }}</span></li>
      </ol>
    </section>

    <!-- ═══ 為什麼 ═══ -->
    <section class="block why">
      <h2>為什麼選擇審盾橘</h2>
      <div class="why-grid">
        <div v-for="w in WHY" :key="w.title" class="why-item">
          <span class="why-icon">{{ w.icon }}</span>
          <div><b>{{ w.title }}</b><p>{{ w.desc }}</p></div>
        </div>
      </div>
    </section>

    <!-- ═══ 免費工具 ═══ -->
    <section class="block">
      <h2>免費法規工具</h2>
      <div class="tools">
        <router-link v-for="t in TOOLS" :key="t.to" :to="t.to" class="tool">
          <b>{{ t.title }}</b><span>{{ t.desc }}</span>
        </router-link>
      </div>
    </section>

    <section class="cta-band">
      <h2>不確定需要哪一種服務？</h2>
      <p>告訴我們產品類型與目前進度，免費評估需要做什麼、大約多少費用。</p>
      <router-link to="/about" class="btn btn-light">聯絡我們</router-link>
    </section>
  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue'

const PLANS = [
  {
    title: 'AI 廣告文案檢核',
    price: '免費',
    desc: '貼上廣告文案，自動標示違規風險字眼並對照政府裁罰案例。',
    features: ['即時標示風險字眼與風險分數', '對照實際裁罰案例與罰款金額', '支援長篇文案、直播腳本'],
    cta: { label: '立即檢核', to: '/ai-audit' },
    more: { label: '服務說明', to: '/ad-review' },
  },
  {
    title: 'PIF 預檢',
    price: '免費',
    badge: '新功能',
    desc: '貼上全成分表，比對食藥署禁限用成分，產出 PIF 16 項缺件清單。',
    features: ['禁用、限用、超過限量一次標出', '依產品類別與宣稱列出應備文件', '可複製預檢報告，直接交給我們報價'],
    cta: { label: '開始預檢', to: '/pif#precheck' },
  },
  {
    title: 'PIF 建檔＋安全資料簽署',
    price: '依成分數與難易度報價',
    featured: true,
    badge: '主要服務',
    desc: '由持證安全資料簽署人員完成安全評估、MoS 計算與簽署，並整理成完整 PIF。',
    features: [
      '成分毒理資料彙整與安全餘裕（MoS）計算',
      '協助向原料商、代工廠索取缺件',
      '安全資料簽署人員親自評估、簽署',
      '電子化 PIF 交付，方便查核與更新',
    ],
    cta: { label: '免費諮詢報價', to: '/about?topic=pif' },
    more: { label: '安全評估說明', to: '/safety-assessment' },
  },
]

const FLOW = [
  { title: '免費預檢', desc: '用 PIF 預檢、AI 廣告檢核先找出問題。' },
  { title: '諮詢報價', desc: '提供預檢報告與產品資訊，評估範圍與費用。' },
  { title: '資料補齊', desc: '協助向原料商、代工廠索取缺少的文件。' },
  { title: '評估簽署', desc: '毒理評估、MoS 計算，簽署人員簽署。' },
  { title: '交付 PIF', desc: '依法規順序整理，日後變更可協助更新。' },
]

const WHY = [
  { icon: '🛡️', title: '獨立第三方', desc: '不綁代工，既有配方、既有代工廠或輸入產品都能做。' },
  { icon: '🔒', title: '配方保密', desc: 'PIF 屬非公開檔案，客戶資料僅用於評估。' },
  { icon: '🎓', title: '專業簽署', desc: '具安全資料簽署人員資格，熟悉 TFDA 與歐盟 SCCS 指引。' },
  { icon: '⚡', title: '工具先行', desc: '免費工具先盤點問題，減少來回補件時間與費用。' },
]

const TOOLS = [
  { to: '/restricted-ingredients', title: '禁限用成分查詢', desc: '食藥署 5 張公告表' },
  { to: '/ingredients-dictionary', title: '成分字典', desc: '300+ 常見成分說明' },
  { to: '/label-generator', title: '中文標籤產生器', desc: '依法規格式產出標示' },
  { to: '/blog', title: '法規專欄', desc: '每週裁罰與國際召回' },
]

useHead({
  title: '服務與方案｜PIF 建檔・安全資料簽署・AI 廣告檢核 - 審盾橘',
  meta: [
    { name: 'description', content: '審盾橘服務與方案：免費 AI 廣告文案檢核、免費 PIF 預檢，以及化粧品 PIF 建檔與安全資料簽署（依成分數報價）。獨立第三方、不綁代工、配方保密。' },
    { property: 'og:title', content: '服務與方案｜PIF 建檔・安全資料簽署・AI 廣告檢核 - 審盾橘' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/services' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/services' }],
})
</script>

<style scoped>
.services-page { max-width: 1080px; margin: 0 auto; padding: 1.5rem 1rem 3rem; color: #333; }
.hero { text-align: center; padding: 2.5rem 0 2rem; }
.eyebrow { display: inline-block; background: #fff1ec; color: #e04e2d; font-weight: 700; font-size: 0.9rem; padding: 0.3rem 0.8rem; border-radius: 999px; margin: 0 0 1rem; }
.hero h1 { font-size: 2.1rem; line-height: 1.35; margin: 0 0 1rem; color: #222; }
.subtitle { color: #555; font-size: 1.08rem; line-height: 1.8; max-width: 680px; margin: 0 auto 1.5rem; }
.hero-cta { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; }

.btn { display: inline-block; padding: 0.7rem 1.5rem; background: #ff5733; color: #fff; border: 2px solid #ff5733; border-radius: 8px; text-decoration: none; font-size: 1rem; text-align: center; }
.btn:hover { background: #e04e2d; border-color: #e04e2d; }
.btn-ghost { background: #fff; color: #ff5733; }
.btn-ghost:hover { background: #fff5f2; color: #e04e2d; }
.btn-light { background: #fff; color: #e04e2d; border-color: #fff; }
.btn-light:hover { background: #fff1ec; border-color: #fff1ec; }

.plans { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; align-items: stretch; scroll-margin-top: 96px; }
.plan { position: relative; display: flex; flex-direction: column; background: #fff; border: 1px solid #eee; border-radius: 14px; padding: 1.75rem 1.5rem 1.5rem; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04); }
.plan.featured { border: 2px solid #ff5733; box-shadow: 0 8px 24px rgba(255, 87, 51, 0.15); }
.plan-badge { position: absolute; top: -0.75rem; left: 1.5rem; background: #ff5733; color: #fff; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.7rem; border-radius: 999px; }
.plan:not(.featured) .plan-badge { background: #fff1ec; color: #e04e2d; }
.plan h2 { font-size: 1.3rem; margin: 0 0 0.4rem; color: #222; }
.price { font-size: 1.15rem; font-weight: 800; color: #ff5733; margin: 0 0 0.75rem; }
.plan-desc { color: #555; line-height: 1.7; margin: 0 0 1rem; font-size: 0.95rem; }
.plan ul { list-style: none; padding: 0; margin: 0 0 1.25rem; flex: 1; }
.plan li { position: relative; padding-left: 1.4rem; margin-bottom: 0.5rem; font-size: 0.93rem; color: #555; line-height: 1.6; }
.plan li::before { content: '✓'; position: absolute; left: 0; color: #ff5733; font-weight: 700; }
.plan-actions { display: flex; flex-direction: column; gap: 0.6rem; align-items: stretch; }
.more-link { text-align: center; color: #e04e2d; font-size: 0.9rem; text-decoration: none; }
.more-link:hover { text-decoration: underline; }

.block { margin: 3.5rem 0; }
.block h2 { font-size: 1.5rem; color: #ff5733; margin: 0 0 1.25rem; text-align: center; }
.flow { counter-reset: f; list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.75rem; }
.flow li { counter-increment: f; background: #fafafa; border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.9rem; color: #555; line-height: 1.6; }
.flow li::before { content: counter(f); width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #ff5733; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
.flow b { color: #222; font-size: 1rem; }
.why { background: #fff8f5; border-radius: 16px; padding: 2rem 1.5rem; }
.why-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.5rem; }
.why-item { display: flex; gap: 0.75rem; align-items: flex-start; }
.why-icon { font-size: 1.6rem; line-height: 1; }
.why-item b { font-size: 1.05rem; }
.why-item p { margin: 0.25rem 0 0; color: #555; font-size: 0.93rem; line-height: 1.6; }
.tools { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }
.tool { display: flex; flex-direction: column; gap: 0.25rem; border: 1px solid #ffd9cc; border-radius: 12px; padding: 1rem; text-decoration: none; background: #fff; transition: transform 0.15s, box-shadow 0.15s; }
.tool:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 87, 51, 0.12); }
.tool b { color: #e04e2d; }
.tool span { color: #777; font-size: 0.88rem; }
.cta-band { text-align: center; background: linear-gradient(135deg, #ff7a52, #ff5733); color: #fff; border-radius: 16px; padding: 2.25rem 1.25rem; }
.cta-band h2 { margin: 0 0 0.5rem; font-size: 1.5rem; }
.cta-band p { margin: 0 0 1.25rem; opacity: 0.95; }

@media (max-width: 900px) {
  .plans { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
  .flow { grid-template-columns: 1fr; }
  .tools { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .hero h1 { font-size: 1.6rem; }
  .why-grid { grid-template-columns: 1fr; }
}
</style>
