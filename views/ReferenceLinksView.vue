<template>
  <main class="ref-page">
    <section class="hero">
      <h1>常用參考網站</h1>
      <p class="subtitle">化粧品法規、成分查詢與毒理安全評估常用工具彙整</p>
    </section>

    <section v-for="cat in categories" :key="cat.title" class="cat-block">
      <h2>{{ cat.title }}</h2>
      <div class="link-grid">
        <a
          v-for="item in cat.items"
          :key="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="link-card"
        >
          <span class="link-name">{{ item.name }}</span>
          <span v-if="item.note" class="link-note">{{ item.note }}</span>
          <span class="link-url">{{ item.url }}</span>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: '常用參考網站｜化粧品法規與成分查詢彙整 - 審盾橘',
  meta: [
    { name: 'description', content: '化粧品法規、INCI成分查詢、毒理與安全評估常用資料庫連結彙整。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/reference-links' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/reference-links' }],
})

const categories = [
  {
    title: '法規與官方資源',
    items: [
      { name: '化粧品標示相關規定', url: 'https://www.mlshb.gov.tw/nc/article?id=959e8219-a307-42d0-8339-7aad798c3a15' },
      { name: '化粧品法規諮詢問答', url: 'https://www.cosmeticregulation.org.tw/quest_info.php?ms=ZXFfSUQ9MjE3' },
      { name: '食藥署電子書－化粧品相關', url: 'https://fadobook.fda.gov.tw/upload/ebook/109Cosmetics/index.html' },
      { name: '食藥署消費者專區－化粧品法規', url: 'https://consumer.fda.gov.tw/LAW/Cosmetic1.aspx?nodeID=1068' },
      { name: '食藥署數位學習網', url: 'https://mdcel.fda.gov.tw/mooc/index.php' },
      { name: 'PIF 產品資訊檔案建檔說明', url: 'https://www.fda.gov.tw/TC/siteContent.aspx?sid=12524' },
      { name: '美白功效宣稱認定原則', url: 'https://cosmeticregulation.org.tw/rules_info.php?ms=ZXFfSUQ9MzEy' },
      { name: '化妝品建議檢驗方法', url: 'https://www.fda.gov.tw/TC/siteList.aspx?sid=1574&scid=171' },
      { name: '韓國化妝品工業協會（KCIA）', url: 'https://kcia.or.kr/home/main/', note: '國際法規' },
      { name: '台北市衛生局裁罰公告查詢', url: 'https://health.gov.taipei/News.aspx?n=13A23138C06A3532&sms=8E7386D329C4B210' },
    ],
  },
  {
    title: '成分命名／INCI 查詢',
    items: [
      { name: 'CosIng（EU 化粧品成分資料庫）', url: 'https://ec.europa.eu/growth/tools-databases/cosing/', note: 'EU INCI 官方查詢' },
      { name: 'PCPC（Personal Care Products Council）', url: 'https://www.personalcarecouncil.org/', note: 'Global INCI 命名機構' },
    ],
  },
  {
    title: '毒理與安全評估資料庫',
    items: [
      { name: 'ECHA（歐洲化學署）', url: 'https://echa.europa.eu/', note: '毒性、GHS、過敏、重複給藥毒性' },
      { name: 'CIR（美國化粧品成分評估委員會）', url: 'https://www.cir-safety.org/' },
      { name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov/', note: '化學合成原料查詢／SMILES' },
      { name: 'QSAR Toolbox', url: 'https://qsartoolbox.org/', note: '理化特性／毒理終點值（需下載本地模擬）' },
      { name: 'ChemSpider', url: 'https://www.chemspider.com/', note: '理化特性／毒化資料' },
      { name: 'T3DB', url: 'https://www.t3db.ca/', note: '理化特性／作用蛋白' },
      { name: 'DEDuCT（內分泌干擾資料庫）', url: 'https://cb.imsc.res.in/deduct/' },
      { name: 'GenRA（類似物查找）', url: 'https://comptox.epa.gov/genra/' },
      { name: 'ICE（Integrated Chemical Environment）', url: 'https://ice.ntp.niehs.nih.gov/', note: '化學品分析／毒理資料庫' },
      { name: 'Allergome（過敏原查找）', url: 'https://www.allergome.org/' },
      { name: 'MPDB（藥用植物資料庫）', url: 'https://www.medicinalplantbd.com/' },
      { name: 'RIFM Fragrance Material Safety Resource', url: 'https://fragrancematerialsafetyresource.elsevier.com/', note: '香精、精油資料庫' },
      { name: 'VERA（皮膚致敏預測工具）', url: 'https://www.vegahub.eu/vera-a-new-read-across-tool/' },
      { name: 'AromaDb（芳香植物成分查找）', url: 'https://aromadb.cimapbioinfo.in/' },
      { name: 'TAAT（台灣動物替代測試資料庫）', url: 'https://taat.nhri.edu.tw/' },
      { name: 'NICEATM ALTBIB（替代測試文獻資料庫）', url: 'https://ntp.niehs.nih.gov/whatwestudy/niceatm/altbib' },
      { name: 'ICCR 整合安全評估策略', url: 'https://www.iccr-cosmetics.org/topics-documents/5-integrated-strategies-for-safety-assesment', note: '不使用動物數據之安全評估原則' },
      {
        name: 'SCCS Notes of Guidance（第12版）',
        url: 'https://health.ec.europa.eu/publications/sccs-notes-guidance-testing-cosmetic-ingredients-and-their-safety-evaluation-12th-revision_en',
        note: '化粧品成分安全評估測試指引',
      },
      { name: 'EU 化粧品安全性評估課程', url: 'https://safetycourse.eu/cosmetics/' },
      { name: 'NGRA（Next Generation Risk Assessment）', url: 'https://sicherheitsbewerter.info/next-generation-risk-assessment/' },
    ],
  },
  {
    title: '文獻檢索與 AI 輔助工具',
    items: [
      { name: 'SciSpace', url: 'https://scispace.com/', note: '文獻檢索與 AI 輔助閱讀' },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com/', note: 'Google AI 筆記整理工具' },
    ],
  },
  {
    title: '安定性測試',
    items: [
      { name: '安定性測試方法參考', url: 'https://taobe.consulting/everything-you-need-to-know-about-stability-testing/' },
    ],
  },
]
</script>

<style scoped>
.ref-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}
.hero {
  text-align: center;
  padding: 1.5rem 0 2.5rem;
}
.hero h1 {
  font-size: 1.8rem;
  color: #ff5733;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #666;
}
.cat-block {
  margin-bottom: 2.5rem;
}
.cat-block h2 {
  font-size: 1.15rem;
  color: #333;
  border-left: 4px solid #ff5733;
  padding-left: 0.6rem;
  margin-bottom: 1rem;
}
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.9rem;
}
.link-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.85rem 1rem;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}
.link-card:hover {
  border-color: #ff5733;
  background: #fff5f2;
}
.link-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}
.link-note {
  font-size: 0.8rem;
  color: #999;
}
.link-url {
  font-size: 0.75rem;
  color: #ff5733;
  word-break: break-all;
}

@media (max-width: 600px) {
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
