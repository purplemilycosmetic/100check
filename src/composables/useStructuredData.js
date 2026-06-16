const BASE_URL = 'https://www.aicheck.com.tw'

// Service schema — 傳入 'pif' | 'ad-review' | 'safety-assessment'
export function serviceSchema(type) {
  const services = {
    pif: {
      name: '化粧品 PIF 建檔・代辦服務',
      description: '獨立第三方化粧品產品資訊檔案建檔，不綁代工、保密配方，由具備衛福部核可資格的安全資料簽署人員親自簽署。',
      serviceType: 'PIF 建檔代辦',
    },
    'ad-review': {
      name: '免費 AI 化粧品廣告文案審查',
      description: '使用 AI 技術自動標示化粧品廣告風險字眼，比對政府裁罰案例，快速完成廣告合規檢測。',
      serviceType: '廣告合規檢測',
    },
    'safety-assessment': {
      name: '化粧品安全評估與安全資料簽署服務',
      description: '由具備衛福部核可資格的化粧品安全資料簽署人員執行安全評估、毒理分析並親自簽署，符合 PIF 法規要求。',
      serviceType: '化粧品安全評估',
    },
  }

  const s = services[type] || services['ad-review']

  return {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.name,
      description: s.description,
      serviceType: s.serviceType,
      areaServed: { '@type': 'Country', name: '台灣' },
      provider: {
        '@type': 'Organization',
        name: '審盾橘',
        url: BASE_URL,
      },
    }),
  }
}

// FAQPage schema for PIF page
export function pifFaqSchema() {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '化妝品沒有建立 PIF 會被罰嗎？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '會。依《化粧品衛生安全管理法》規定，業者應於產品上市前建立 PIF。未依規定者最高可處新臺幣一百萬元罰鍰，並可能面臨停售、回收風險。',
          },
        },
        {
          '@type': 'Question',
          name: '一般化妝品什麼時候要完成 PIF？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '特定用途化妝品已於 113 年 7 月 1 日起須完成；嬰兒用、唇用、眼部用等於 114 年 7 月 1 日起；一般化妝品自 115 年 7 月 1 日起須完成 PIF 並符合 GMP。',
          },
        },
        {
          '@type': 'Question',
          name: '找你們做 PIF 一定要在你們這邊代工生產嗎？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '不會。審盾橘是獨立第三方 PIF 建檔與安全簽署服務，不綁定代工。你已有配方或既有代工廠，一樣能協助完成建檔與簽署。',
          },
        },
        {
          '@type': 'Question',
          name: '做 PIF 需要提供完整配方，會不會外洩？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PIF 屬「非公開」檔案，僅供主管機關查核備查，無須提交審查。我們對所有客戶配方資料嚴格保密。',
          },
        },
      ],
    }),
  }
}

// BreadcrumbList schema — 傳入 [{name, url}, ...]
export function breadcrumbSchema(items) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    }),
  }
}
