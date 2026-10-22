<!--
  聯絡我們（/about，/contact 轉址至此）
  支援 ?topic=pif|safety|ad 預先帶入信件主旨。
-->
<template>
  <main class="contact-page">
    <section class="hero">
      <p class="eyebrow">聯絡我們</p>
      <h1>{{ topic.heading }}</h1>
      <p class="subtitle">PIF 建檔、安全資料簽署、廣告文案審查都可以免費諮詢與報價。</p>
    </section>

    <section class="cards">
      <article class="card">
        <h2>💬 Line 諮詢（最快）</h2>
        <p>手機掃描 QR Code 加入好友，直接傳訊息或檔案給我們。</p>
        <img src="@/assets/line-qrcode.png" alt="審盾橘 Line 官方帳號 QR Code" class="qr" />
      </article>

      <article class="card">
        <h2>✉️ Email</h2>
        <p>適合寄送成分表、預檢報告、標籤設計稿等附件。</p>
        <a :href="mailto" class="email">adchecktw@gmail.com</a>
        <a :href="mailto" class="btn">寫信給我們</a>
        <button class="copy-btn" @click="copyEmail">{{ copied ? '已複製 ✓' : '複製信箱' }}</button>
      </article>
    </section>

    <section class="prepare">
      <h2>諮詢前可以先準備</h2>
      <ul>
        <li v-for="item in topic.prepare" :key="item">{{ item }}</li>
      </ul>
      <p class="note">
        還沒準備好？先用
        <router-link to="/pif#precheck">PIF 預檢</router-link>
        或
        <router-link to="/ai-audit">AI 廣告檢核</router-link>
        整理問題，再把結果傳給我們。所有資料僅用於評估，嚴格保密。
      </p>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const EMAIL = 'adchecktw@gmail.com'
const TOPICS = {
  pif: {
    heading: '把 PIF 交給我們',
    subject: 'PIF 建檔／安全資料簽署諮詢',
    prepare: ['PIF 預檢報告（預檢頁「複製預檢報告」即可貼上）', '全成分表（INCI 與含量）', '產品類別、使用方式、國內製造或輸入', '目前手上已有的文件（SDS、COA、試驗報告等）'],
  },
  safety: {
    heading: '安全評估與簽署諮詢',
    subject: '安全評估／安全資料簽署諮詢',
    prepare: ['全成分表（INCI 與含量）', '產品類別與使用方式', '原料 SDS／COA', '預計上市時間'],
  },
  ad: {
    heading: '廣告文案審查諮詢',
    subject: '廣告文案審查諮詢',
    prepare: ['要刊登的文案或設計稿', '刊登通路（官網、電商、社群、直播）', '產品類別與主要成分'],
  },
  default: {
    heading: '有問題？直接問我們',
    subject: '審盾橘服務諮詢',
    prepare: ['想諮詢的服務（PIF、安全評估、廣告審查）', '產品類別與數量', '預計上市時間'],
  },
}

const route = useRoute()
const topic = computed(() => TOPICS[route.query.topic] || TOPICS.default)
const mailto = computed(() => `mailto:${EMAIL}?subject=${encodeURIComponent(topic.value.subject)}`)

const copied = ref(false)
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.prompt('請手動複製：', EMAIL)
  }
}

useHead({
  title: '聯絡我們｜PIF 建檔・安全簽署・廣告審查免費諮詢 - 審盾橘',
  meta: [
    { name: 'description', content: '聯絡審盾橘：Line 或 Email 免費諮詢化粧品 PIF 建檔、安全資料簽署與廣告文案審查，提供成分表與預檢報告即可快速報價。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/about' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/about' }],
})
</script>

<style scoped>
.contact-page { max-width: 880px; margin: 0 auto; padding: 1.5rem 1rem 3rem; color: #333; }
.hero { text-align: center; padding: 2.5rem 0 1.5rem; }
.eyebrow { display: inline-block; background: #fff1ec; color: #e04e2d; font-weight: 700; font-size: 0.9rem; padding: 0.3rem 0.8rem; border-radius: 999px; margin: 0 0 1rem; }
.hero h1 { font-size: 2rem; margin: 0 0 0.75rem; color: #222; }
.subtitle { color: #555; font-size: 1.05rem; line-height: 1.8; margin: 0; }
.cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; margin: 1.5rem 0 2rem; }
.card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.6rem; background: #fff; border: 1px solid #eee; border-radius: 14px; padding: 1.75rem 1.25rem; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04); }
.card h2 { font-size: 1.2rem; margin: 0; color: #222; }
.card p { margin: 0; color: #666; font-size: 0.93rem; line-height: 1.6; }
.qr { width: 160px; height: 160px; object-fit: contain; margin-top: 0.5rem; }
.email { font-size: 1.15rem; font-weight: 700; color: #e04e2d; text-decoration: none; margin-top: 0.5rem; word-break: break-all; }
.btn { display: inline-block; padding: 0.7rem 1.5rem; background: #ff5733; color: #fff; border-radius: 8px; text-decoration: none; margin-top: 0.5rem; }
.btn:hover { background: #e04e2d; }
.copy-btn { background: none; border: none; color: #e04e2d; text-decoration: underline; cursor: pointer; font-size: 0.9rem; font-family: inherit; }
.prepare { background: #fff8f5; border-radius: 14px; padding: 1.5rem 1.75rem; }
.prepare h2 { font-size: 1.2rem; color: #ff5733; margin: 0 0 0.75rem; }
.prepare ul { margin: 0 0 1rem; padding-left: 1.2rem; line-height: 1.9; }
.note { margin: 0; color: #666; font-size: 0.92rem; line-height: 1.7; }
.note a { color: #e04e2d; }
@media (max-width: 640px) {
  .hero h1 { font-size: 1.6rem; }
  .cards { grid-template-columns: 1fr; }
}
</style>
