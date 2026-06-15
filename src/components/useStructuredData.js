/**
 * 結構化資料 composable — src/composables/useStructuredData.js
 *
 * Schema.org JSON-LD 讓 Google 理解你是「PIF 專業服務商」，
 * 並在搜尋結果顯示加分資訊（FAQ 摺疊、服務評價、麵包屑等）。
 *
 * 用法：在各頁 <script setup> 裡 import 對應函式，傳給 useHead 的 script 欄位。
 *
 *   import { organizationSchema, serviceSchema } from '@/composables/useStructuredData'
 *   useHead({ script: [organizationSchema(), serviceSchema('pif')] })
 */

const SITE = 'https://www.aicheck.com.tw'
const BRAND = '審盾橘'
const EMAIL = 'adchecktw@gmail.com'

function jsonLd(obj) {
  return { type: 'application/ld+json', children: JSON.stringify(obj) }
}

/* ─────────────────────────────────────────────
   1. 組織資訊（放首頁 + 每頁都可，建議放共用 layout）
   告訴 Google「審盾橘是誰、做什麼、怎麼聯絡」
───────────────────────────────────────────── */
export function organizationSchema() {
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE}/#organization`,
    name: BRAND,
    alternateName: 'AICheck 化妝品法規合規平台',
    url: SITE,
    email: EMAIL,
    description:
      '審盾橘提供化妝品（化粧品）PIF 產品資訊檔案建檔、安全資料簽署、AI 廣告文案合規審查服務，由具證照之安全簽署人員執行，符合衛福部《化粧品衛生安全管理法》。',
    areaServed: { '@type': 'Country', name: '台灣' },
    knowsAbout: [
      '化粧品產品資訊檔案 PIF',
      '化妝品安全資料簽署',
      '化妝品廣告法規合規',
      '化粧品衛生安全管理法',
      '安全評估報告',
    ],
    serviceType: ['PIF 建檔', '化妝品安全資料簽署', 'AI 廣告文案審查'],
  })
}

/* ─────────────────────────────────────────────
   2. 服務頁（PIF / 簽署 / AI 審核 各一）
   每個服務獨立宣告，強化主題相關性
───────────────────────────────────────────── */
const SERVICES = {
  pif: {
    name: '化妝品 PIF 產品資訊檔案建檔服務',
    description:
      '由具備化粧品安全資料簽署人員證照的專業人員，協助建立符合衛福部《化粧品衛生安全管理法》之完整 PIF（Product Information File）。第三方獨立服務，不綁代工生產，保障配方機密。',
    serviceType: 'PIF 建檔代辦',
    url: `${SITE}/pif`,
  },
  signature: {
    name: '化妝品安全資料簽署服務',
    description:
      '專業安全簽署人員針對化妝品成分進行毒理評估、安全餘裕（MoS）計算與安全資料簽署，依成分與難易度計費，提供完整合規報告。',
    serviceType: '化妝品安全評估簽署',
    url: `${SITE}/pif`,
  },
  audit: {
    name: '免費 AI 化妝品廣告文案審查',
    description:
      '免費 AI 化妝品廣告文案合規審查工具，自動標示虛偽誇大、醫療效能等違規風險字眼，比對台北市衛生局實際裁罰案例，協助品牌降低廣告違規風險。',
    serviceType: 'AI 廣告合規審查',
    url: `${SITE}/ai-audit`,
  },
}

export function serviceSchema(key) {
  const s = SERVICES[key]
  if (!s) return jsonLd({})
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    serviceType: s.serviceType,
    url: s.url,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: { '@type': 'Country', name: '台灣' },
    ...(key === 'audit'
      ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' } }
      : {}),
  })
}

/* ─────────────────────────────────────────────
   3. FAQ（PIF 頁強烈建議放）
   Google 會把 FAQ 直接摺疊顯示在搜尋結果，大幅提升點擊率
   ⚠️ 問答內容必須真的出現在頁面可見文字中，否則違反 Google 規範
───────────────────────────────────────────── */
export function pifFaqSchema() {
  const faqs = [
    {
      q: '什麼是化妝品 PIF 產品資訊檔案？',
      a: 'PIF（Product Information File，產品資訊檔案）是依《化粧品衛生安全管理法》要求建立的產品安全資料，包含配方、製造資訊、安全評估報告與品質管理文件，是化妝品上市前的必備合法要件。',
    },
    {
      q: '化妝品沒有建立 PIF 會被罰嗎？',
      a: '會。依《化粧品衛生安全管理法》規定，業者應於產品上市前建立 PIF 並保存。未依規定建立者，最高可處新臺幣一百萬元罰鍰，並可能面臨停售、回收風險。',
    },
    {
      q: '一般化妝品什麼時候要完成 PIF？',
      a: '依分階段實施時程，特定用途化妝品已於 113 年 7 月 1 日起須完成；嬰兒用、唇用、眼部用等於 114 年 7 月 1 日起；一般化妝品則自 115 年 7 月 1 日起須完成 PIF 並符合 GMP。',
    },
    {
      q: '找你們做 PIF 會要求一定要在你們這邊代工生產嗎？',
      a: '不會。審盾橘是獨立第三方 PIF 建檔與安全簽署服務，不綁定代工生產。你已有配方或既有代工廠，我們一樣能協助完成 PIF 建檔與安全資料簽署。',
    },
    {
      q: '做 PIF 需要提供完整配方，會不會外洩？',
      a: 'PIF 屬「非公開」檔案，僅供主管機關查核時備查，無須提交審查。審盾橘對所有客戶配方資料嚴格保密，簽署人員依專業倫理執行評估。',
    },
  ]
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })
}

/* ─────────────────────────────────────────────
   4. 部落格文章（BlogPostView 動態套用）
   讓文章在搜尋結果顯示作者、日期、封面圖
───────────────────────────────────────────── */
export function articleSchema(article) {
  if (!article) return jsonLd({})
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary || '',
    image: article.cover_image || `${SITE}/og-image.png`,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: { '@type': 'Organization', name: BRAND, url: SITE },
    publisher: {
      '@type': 'Organization',
      name: BRAND,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE}/blog/${article.slug}`,
    },
  })
}

/* ─────────────────────────────────────────────
   5. 麵包屑（任何子頁都可用，提升搜尋結果層級顯示）
───────────────────────────────────────────── */
export function breadcrumbSchema(items) {
  // items: [{ name, url }, ...]
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  })
}
