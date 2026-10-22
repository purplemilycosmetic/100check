<!--
  PIF AI 智慧預檢 ＋ PIF 建檔・簽署服務（/pif）
  - 原本 /PIF（PIFView）與 /pif（本頁）因 Vue Router 不分大小寫，實際上 /pif 一直顯示舊頁、
    本頁的 SEO 設定從未生效。現在兩頁合併成這一頁，/PIF 轉址到 /pif。
  - 新增免費工具：成分表比對食藥署禁限用表＋依產品類型產生 PIF 16 項缺件清單。
  - FAQ 可見內容與結構化資料共用同一份陣列，避免不一致。
-->
<template>
  <main class="page-pif">
    <!-- ═══ Hero ═══ -->
    <section class="hero">
      <p class="eyebrow">PIF AI 智慧預檢 · 專業安全資料簽署</p>
      <h1>化粧品 PIF 一站完成<br class="br-sm" />先用 AI 預檢，再交給專業簽署</h1>
      <p class="subtitle">
        貼上全成分表、選產品類型，30 秒比對食藥署禁用／限用成分表，並產出你這支產品專屬的
        <strong>PIF 16 項缺件清單</strong>。資料不足的部分，由持證安全資料簽署人員協助補齊、評估與簽署。
      </p>
      <div class="hero-cta">
        <a href="#precheck" class="cta-btn">免費開始 PIF 預檢</a>
        <router-link to="/about" class="cta-btn cta-secondary">免費諮詢報價</router-link>
      </div>
      <ul class="hero-points">
        <li>✓ 免註冊、免費使用</li>
        <li>✓ 成分表只在你的瀏覽器處理比對，不儲存配方</li>
        <li>✓ 不綁代工，既有配方、既有代工廠皆可</li>
      </ul>
    </section>

    <section class="alert-band">
      <strong>115 年 7 月 1 日起，一般化粧品也須完成 PIF 並符合 GMP。</strong>
      特定用途（113.07.01）、嬰兒用／唇用／眼部用／非藥用牙膏漱口水（114.07.01）早已上路——
      目前在市面販售、贈送、公開陳列的化粧品，原則上都應備妥 PIF（免工廠登記之手工香皂除外）。
    </section>

    <!-- ═══ 工具 ═══ -->
    <section id="precheck" class="tool">
      <h2>PIF AI 智慧預檢（免費）</h2>
      <p class="tool-intro">三個步驟，先知道自己缺什麼，再決定要自己補還是委託。</p>

      <!-- Step 1 -->
      <div class="step">
        <div class="step-head"><span class="step-no">1</span>產品屬性</div>
        <div class="field-grid">
          <label class="field">
            <span>產品類別</span>
            <select v-model="product.type">
              <option v-for="t in PRODUCT_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </label>
          <label class="field">
            <span>使用方式</span>
            <select v-model="product.usage">
              <option value="leave">停留型（乳液、精華、彩妝…）</option>
              <option value="rinse">沖洗型（洗面乳、洗髮精…）</option>
            </select>
          </label>
          <label class="field">
            <span>來源</span>
            <select v-model="product.origin">
              <option value="local">國內製造（自有工廠或委託代工）</option>
              <option value="import">國外輸入</option>
            </select>
          </label>
          <label class="field">
            <span>劑型</span>
            <select v-model="product.form">
              <option value="water">含水配方</option>
              <option value="anhydrous">無水配方（油、粉、蠟、棒狀…）</option>
              <option value="aerosol">噴霧／氣霧</option>
            </select>
          </label>
        </div>
        <div class="claims">
          <span class="claims-label">包裝或廣告上有這些宣稱嗎？（可複選）</span>
          <label v-for="c in CLAIMS" :key="c.value" class="chip" :class="{ on: product.claims.includes(c.value) }">
            <input v-model="product.claims" type="checkbox" :value="c.value" />{{ c.label }}
          </label>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="step">
        <div class="step-head"><span class="step-no">2</span>貼上全成分表（INCI，可附含量 %）</div>
        <textarea
          v-model="ingredientText"
          rows="6"
          placeholder="一行一個或用逗號分隔，可在名稱後加上含量，例：&#10;Water&#10;Glycerin 5&#10;Phenoxyethanol 0.8%&#10;Salicylic Acid 2.5"
        ></textarea>
        <div class="row-actions">
          <button class="cta-btn" :disabled="checking || !ingredientText.trim()" @click="runCheck">
            {{ checking ? '比對中…' : '開始比對成分' }}
          </button>
          <button class="link-btn" @click="fillSample">填入範例</button>
        </div>

        <p v-if="checkError" class="error-text">⚠ 比對失敗：{{ checkError }}</p>

        <div v-if="checked && !checkError" class="ing-result">
          <p class="summary">
            共 {{ ingRows.length }} 項：
            <span class="s-danger">{{ countBy('danger') }} 項禁用</span>、
            <span class="s-warn">{{ countBy('over') }} 項超過限量</span>、
            <span class="s-warn">{{ countBy('limit') }} 項限用（需確認含量與條件）</span>、
            <span class="s-ok">{{ countBy('clear') }} 項未列於禁限用表</span>
          </p>
          <div v-for="row in sortedRows" :key="row.raw" class="ing-row" :class="row.level">
            <div class="ing-top">
              <span class="ing-name">{{ row.name }}<em v-if="row.pct !== null"> {{ row.pct }}%</em></span>
              <span class="badge" :class="row.level">{{ LEVEL_LABEL[row.level] }}</span>
            </div>
            <ul v-if="row.hits.length" class="hit-list">
              <li v-for="h in row.hits" :key="h.id">
                <b>{{ h.category }}</b>
                <template v-if="h.limit_standard">｜限量 {{ h.limit_standard }}</template>
                <template v-if="h.scope">｜範圍：{{ h.scope }}</template>
                <template v-if="h.restriction">｜{{ h.restriction }}</template>
              </li>
            </ul>
            <p v-if="row.dict" class="dict-note">
              成分字典：{{ row.dict.name_zh }}
              <template v-if="row.dict.cautions">｜注意：{{ truncate(row.dict.cautions, 60) }}</template>
            </p>
          </div>
          <p class="hint">
            「未列於禁限用表」代表不在食藥署公告的 5 張表（禁止使用、一般限制、防腐劑、防曬劑、色素）中，
            不等於免評估；PIF 仍須逐一提供成分毒理資料並計算安全餘裕（MoS）。名稱寫法不同可能比對不到，可到
            <router-link to="/restricted-ingredients">禁限用成分查詢</router-link> 做模糊搜尋。
          </p>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="step">
        <div class="step-head"><span class="step-no">3</span>勾選你手上已經有的文件</div>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" :style="{ width: readiness + '%' }"></div></div>
          <span class="progress-text">PIF 準備度 {{ readiness }}%（{{ haveCount }}/{{ requiredItems.length }} 項）</span>
        </div>
        <ol class="checklist">
          <li v-for="item in checklist" :key="item.no" :class="{ done: have.includes(item.no), optional: item.optional }">
            <label>
              <input v-model="have" type="checkbox" :value="item.no" />
              <span class="ck-title">{{ item.no }}. {{ item.title }}</span>
              <span v-if="item.optional" class="tag-optional">可評估免除</span>
            </label>
            <p class="ck-desc">{{ item.desc }}</p>
            <p v-for="n in item.notes" :key="n" class="ck-note">▸ {{ n }}</p>
          </li>
        </ol>
        <div class="missing-box">
          <h3>你的缺件清單</h3>
          <p v-if="!missing.length" class="all-done">文件都齊了！下一步是由安全資料簽署人員完成安全評估（第 16 項）並簽署。</p>
          <ul v-else>
            <li v-for="m in missing" :key="m.no">{{ m.no }}. {{ m.title }}</li>
          </ul>
          <div class="row-actions">
            <button class="cta-btn cta-secondary" @click="copyReport">{{ copied ? '已複製 ✓' : '複製預檢報告' }}</button>
            <router-link to="/about" class="cta-btn">把缺件交給我們處理</router-link>
          </div>
        </div>
      </div>
      <p class="disclaimer">
        本工具依《化粧品產品資訊檔案管理辦法》與食藥署公開資料自動比對，結果僅供準備文件參考，
        不構成安全評估結論；正式 PIF 須由符合資格之安全資料簽署人員評估並簽署。
      </p>
    </section>

    <!-- ═══ 服務流程 ═══ -->
    <section class="section">
      <h2>AI 預檢 ＋ 專業簽署，PIF 怎麼做最省時間</h2>
      <ol class="flow">
        <li><b>AI 預檢</b><span>比對禁限用成分、依產品類型列出應備文件與缺件。</span></li>
        <li><b>文件盤點與補件</b><span>協助向原料商、代工廠索取 SDS／COA／TDS、GMP 證明與試驗報告。</span></li>
        <li><b>成分毒理與 MoS 計算</b><span>依 SCCS 指引整理毒理資料、計算全身暴露量（SED）與安全餘裕。</span></li>
        <li><b>安全資料簽署</b><span>由持證簽署人員載明評估結論、建議並簽名、押日期。</span></li>
        <li><b>電子化 PIF 交付</b><span>16 項文件依法規順序整理，方便查核與日後更新。</span></li>
      </ol>
    </section>

    <section class="section highlight">
      <h2>為什麼選擇審盾橘的 PIF 服務？</h2>
      <ul class="bullets">
        <li v-for="item in WHY_US" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- ═══ PIF 知識 ═══ -->
    <section class="section">
      <h2>什麼是化粧品產品資訊檔案（PIF）？</h2>
      <p>
        PIF（Product Information File）是有關化粧品品質、安全性與功能的完整資料文件，依《化粧品衛生安全管理法》
        及《化粧品產品資訊檔案管理辦法》，製造或輸入業者須在產品供應、販賣、贈送、公開陳列或提供消費者試用前建立，
        並經「安全資料簽署人員」評估簽署。PIF 不需送審，但須存放於業者標示地址備查（輸入產品存放於輸入業者地址），
        並自產品最後上市日之次日起至少保存 5 年。未依規定建立 PIF，可處新臺幣 1 萬元以上 100 萬元以下罰鍰，並得按次處罰。
      </p>
    </section>

    <section class="section">
      <h2>PIF 實施時程</h2>
      <div class="timeline">
        <div v-for="t in TIMELINE" :key="t.date" class="tl-item">
          <span class="tl-date">{{ t.date }}</span>
          <span class="tl-text">{{ t.text }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>PIF 應備 16 項文件</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>項目</th><th>說明及備製文件</th></tr></thead>
          <tbody>
            <tr v-for="item in PIF_ITEMS" :key="item.no">
              <td>{{ item.no }}. {{ item.title }}</td>
              <td>{{ item.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="section faq">
      <h2>PIF 常見問題</h2>
      <details v-for="(f, i) in FAQS" :key="i" class="faq-item">
        <summary>{{ f.q }}</summary>
        <p>{{ f.a }}</p>
      </details>
    </section>

    <section class="section cross-link">
      <h2>其他免費法規工具</h2>
      <div class="tool-links">
        <router-link to="/restricted-ingredients">禁用／限用成分查詢</router-link>
        <router-link to="/ingredients-dictionary">成分字典</router-link>
        <router-link to="/label-generator">中文標籤產生器</router-link>
        <router-link to="/ai-audit">AI 廣告文案審查</router-link>
        <router-link to="/safety-assessment">安全評估服務</router-link>
      </div>
    </section>

    <section class="section cta-section">
      <h2>預檢完了，剩下的交給我們</h2>
      <p>把預檢報告和現有文件寄給我們，免費評估需要補哪些資料與報價。</p>
      <router-link to="/about" class="cta-btn">免費諮詢 PIF 建檔・簽署</router-link>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'
import { serviceSchema, faqSchema, breadcrumbSchema } from '@/composables/useStructuredData'

// ═══════════════════════════════════════════════
//  文案與資料
// ═══════════════════════════════════════════════
const PRODUCT_TYPES = [
  { value: 'general', label: '一般化粧品（保養、清潔、彩妝、香水…）' },
  { value: 'sunscreen', label: '特定用途：防曬' },
  { value: 'hair-color', label: '特定用途：染髮' },
  { value: 'perm', label: '特定用途：燙髮' },
  { value: 'antiperspirant', label: '特定用途：止汗制臭' },
  { value: 'special-other', label: '特定用途：其他（如面皰預防、軟化角質、美白牙齒）' },
  { value: 'baby', label: '嬰兒用（三歲以下）' },
  { value: 'eye', label: '眼部用' },
  { value: 'lip', label: '唇用' },
  { value: 'oral', label: '非藥用牙膏、漱口水' },
]
const SPECIAL = ['sunscreen', 'hair-color', 'perm', 'antiperspirant', 'special-other']

const CLAIMS = [
  { value: 'whitening', label: '美白／淡斑' },
  { value: 'antiaging', label: '抗老／緊緻／抗皺' },
  { value: 'moisture', label: '保濕／修護' },
  { value: 'oil', label: '控油／抗痘' },
  { value: 'spf', label: 'SPF／PA 防曬係數' },
  { value: 'sensitive', label: '敏感肌適用／低敏' },
  { value: 'natural', label: '天然／有機／純素' },
  { value: 'clinical', label: '實測數據（xx% 有感、幾天見效）' },
]

const WHY_US = [
  '獨立第三方，不要求在我們這邊代工生產——既有配方、既有代工廠或國外輸入產品都能協助',
  '配方資料嚴格保密；PIF 屬非公開檔案，僅供主管機關查核',
  '由持有化粧品安全資料簽署人員資格的專業人員親自評估、簽署',
  '依 SCCS 指引執行毒理分析與安全餘裕（MoS）計算，熟悉台灣與歐盟法規',
  'AI 預檢先盤點缺件，減少來回補件時間',
]

const TIMELINE = [
  { date: '108.07.01', text: '《化粧品衛生安全管理法》施行' },
  { date: '108.11.09', text: '化粧品及成分安全性評估原則上不得以動物作為檢測對象' },
  { date: '110.07.01', text: '產品登錄制度上路；非藥用牙膏、漱口水納入化粧品管理' },
  { date: '113.07.01', text: '特定用途化粧品須完成 PIF、符合 GMP（原查驗登記許可證失效）' },
  { date: '114.07.01', text: '嬰兒用、唇用、眼部用及非藥用牙膏、漱口水須完成 PIF、符合 GMP' },
  { date: '115.07.01', text: '一般化粧品須完成 PIF、符合 GMP（免工廠登記之手工香皂除外）' },
]

const PIF_ITEMS = [
  { no: 1, title: '產品基本資料', desc: '品名、類別、劑型、用途、製造廠及製造或輸入業者名稱、地址、電話等' },
  { no: 2, title: '產品登錄證明文件', desc: '化粧品產品登錄平台登錄完成之證明' },
  { no: 3, title: '全成分名稱及其各含量', desc: 'INCI 名稱、含量、用途，成分合計應為 100%' },
  { no: 4, title: '產品標籤、仿單、外包裝或容器', desc: '中文標籤、仿單、外盒或容器之照片或設計稿' },
  { no: 5, title: '製造場所符合 GMP 之證明文件或聲明書', desc: '符合化粧品優良製造準則（ISO 22716）之證明或聲明' },
  { no: 6, title: '製造方法、流程', desc: '簡述製造流程，可為圖示或文字' },
  { no: 7, title: '使用方法、部位、用量、頻率及族群', desc: '用於暴露量計算：使用部位、每日用量、停留或沖洗、頻率、目標族群' },
  { no: 8, title: '產品使用不良反應資料', desc: '不良反應紀錄與統計；無不良反應可提供聲明' },
  { no: 9, title: '產品及各成分之物理與化學特性', desc: '成品規格；各成分 SDS／COA／TDS' },
  { no: 10, title: '成分毒理資料', desc: '急毒性、皮膚及眼刺激性、致敏性、致突變性、NOAEL 等，可採替代試驗或文獻' },
  { no: 11, title: '產品安定性試驗報告', desc: '加速安定性試驗；長期／常溫安定性（視需求）' },
  { no: 12, title: '微生物檢測報告', desc: '管制規定、檢測方法與結果，須符合《化粧品中微生物容許量基準》' },
  { no: 13, title: '防腐效能試驗報告', desc: '防腐效能（挑戰性）試驗' },
  { no: 14, title: '功能評估佐證資料', desc: '依宣稱提供文獻、體外試驗、人體實測或特定成分含量檢驗等' },
  { no: 15, title: '與產品接觸之包裝材質資料', desc: '材質、重金屬、塑化劑、溶出等相關資料' },
  { no: 16, title: '產品安全資料（安全評估）', desc: '安全資料簽署人員之評估結論、建議、資格證明、簽名及日期' },
]

const FAQS = [
  { q: 'PIF 可以用 AI 做嗎？', a: 'AI 可以協助比對禁限用成分、盤點應備文件、整理資料，大幅縮短準備時間；但 PIF 第 16 項「產品安全資料」須由符合資格的安全資料簽署人員評估並親自簽署，AI 無法取代簽署責任。審盾橘的做法是先用 AI 預檢找出缺件，再由專業人員完成毒理評估與簽署。' },
  { q: '化粧品沒有建立 PIF 會被罰嗎？', a: '會。依《化粧品衛生安全管理法》，應建立 PIF 而未建立或內容不完整者，可處新臺幣 1 萬元以上 100 萬元以下罰鍰，並得按次處罰，情節重大者可能停業或廢止登記。' },
  { q: '一般化粧品什麼時候要完成 PIF？', a: '特定用途化粧品自 113 年 7 月 1 日起、嬰兒用／唇用／眼部用／非藥用牙膏漱口水自 114 年 7 月 1 日起、一般化粧品自 115 年 7 月 1 日起，均須完成 PIF 並符合 GMP。' },
  { q: 'PIF 要送衛福部審查嗎？', a: '不用。PIF 由業者自行建立並存放於標示地址備查，主管機關查核時須能提供，無須送審或備查。' },
  { q: 'PIF 每一項資料都一定要有嗎？', a: '第 11 至 13 項（安定性、微生物、防腐效能試驗）可由安全資料簽署人員依產品屬性評估免除，例如部分無水或高酒精配方，但必須在 PIF 中敘明免除理由。' },
  { q: '國外輸入的產品，PIF 可以放在原廠嗎？', a: '不行。輸入產品的 PIF 必須存放於依法標示之國內輸入業者地址。' },
  { q: '安全資料簽署人員一定要是公司內部人員嗎？', a: '不一定。只要符合《化粧品產品資訊檔案管理辦法》第 4 至 6 條資格，內部或外部人員皆可擔任，並須每年接受持續訓練。' },
  { q: '找你們做 PIF 一定要在你們這邊代工生產嗎？', a: '不會。審盾橘是獨立第三方 PIF 建檔與安全簽署服務，不綁代工；已有配方、既有代工廠或輸入產品，一樣能協助完成。' },
  { q: '做 PIF 需要提供完整配方，會不會外洩？', a: 'PIF 屬非公開檔案，僅供主管機關查核。我們對所有客戶配方資料嚴格保密；本頁預檢工具的成分表只用於即時比對，不會儲存。' },
]

// ═══════════════════════════════════════════════
//  Step 1：產品屬性
// ═══════════════════════════════════════════════
const product = reactive({ type: 'general', usage: 'leave', origin: 'local', form: 'water', claims: [] })

// ═══════════════════════════════════════════════
//  Step 2：成分比對
// ═══════════════════════════════════════════════
const ingredientText = ref('')
const ingRows = ref([])
const checking = ref(false)
const checked = ref(false)
const checkError = ref('')
const LEVEL_LABEL = { danger: '🚫 禁止使用', over: '⚠ 超過限量', limit: '⚠ 限用成分', clear: '✓ 未列於禁限用表' }
const LEVEL_ORDER = { danger: 0, over: 1, limit: 2, clear: 3 }

function fillSample() {
  ingredientText.value = 'Water\nGlycerin 5\nNiacinamide 4\nSalicylic Acid 2.5\nPhenoxyethanol 0.8%\nTitanium Dioxide 3\nTretinoin'
}

function parseIngredients(text) {
  const parts = text.includes('\n') ? text.split(/\n/) : text.split(/[,，、;；]/)
  const seen = new Set()
  const out = []
  for (let raw of parts.flatMap((p) => (text.includes('\n') ? p.split(/[，、;；]/) : [p]))) {
    raw = raw.trim()
    if (!raw) continue
    let name = raw
    let pct = null
    const m = raw.match(/^(.*?)[\s:：=]+(\d+(?:\.\d+)?)\s*%?$/)
    if (m && m[1].trim()) {
      name = m[1].trim()
      pct = Number(m[2])
    }
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ raw, name, pct })
  }
  return out
}

// 同一成分的不同寫法：「Water (Aqua)」「Aqua/Water」
function variants(name) {
  const v = new Set([name])
  const noParen = name.replace(/\s*\(.*?\)\s*/g, ' ').trim()
  if (noParen) v.add(noParen)
  const inParen = name.match(/\(([^)]+)\)/)
  if (inParen) v.add(inParen[1].trim())
  for (const s of name.split('/')) if (s.trim()) v.add(s.trim())
  return [...v]
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/([%_])/g, '\\$1')
const quote = (s) => `"${esc(s)}"`

async function lookup(table, cols, select, terms) {
  const rows = []
  for (let i = 0; i < terms.length; i += 15) {
    const chunk = terms.slice(i, i + 15)
    // 完全相同，或資料庫名稱為「名稱 (INN)…」這種後面帶括號說明的寫法
    const filter = chunk
      .flatMap((t) => cols.flatMap((c) => [`${c}.ilike.${quote(t)}`, `${c}.ilike."${esc(t)} (%"`]))
      .join(',')
    const { data, error } = await supabase.from(table).select(select).or(filter).limit(500)
    if (error) throw error
    rows.push(...(data || []))
  }
  return rows
}

function parseLimit(s) {
  const m = String(s || '').match(/^\s*(\d+(?:\.\d+)?)\s*%\s*$/)
  return m ? Number(m[1]) : null
}

async function runCheck() {
  const items = parseIngredients(ingredientText.value)
  if (!items.length) return
  checking.value = true
  checkError.value = ''
  try {
    const allTerms = [...new Set(items.flatMap((it) => variants(it.name)))]
    const [restricted, dict] = await Promise.all([
      lookup('restricted_ingredients', ['inci_name', 'name'], 'id, name, inci_name, category, scope, limit_standard, restriction', allTerms),
      lookup('ingredients_dictionary', ['name_en', 'name_zh'], 'name_zh, name_en, cautions', allTerms).catch(() => []),
    ])
    // 去掉資料庫名稱後面的「註」與括號說明，例：「Tretinoin (INN) (retinoic acid…)」→ tretinoin
    const norm = (s) => String(s || '').replace(/\s*註\s*$/, '').replace(/\s*[(（].*$/, '').trim().toLowerCase()
    ingRows.value = items.map((it) => {
      const vs = variants(it.name).map((x) => x.toLowerCase())
      const same = (x) => x && (vs.includes(norm(x)) || vs.includes(String(x).replace(/\s*註\s*$/, '').trim().toLowerCase()))
      const hits = restricted.filter((r) => same(r.inci_name) || same(r.name))
      const uniq = [...new Map(hits.map((h) => [h.id, h])).values()]
      const d = dict.find((x) => same(x.name_en) || same(x.name_zh))
      let level = 'clear'
      if (uniq.some((h) => h.category === '禁止使用成分')) level = 'danger'
      else if (uniq.length) {
        const limits = uniq.map((h) => parseLimit(h.limit_standard)).filter((x) => x !== null)
        level = it.pct !== null && limits.length && it.pct > Math.max(...limits) ? 'over' : 'limit'
      }
      return { ...it, hits: uniq, dict: d || null, level }
    })
    checked.value = true
  } catch (err) {
    checkError.value = err.message || String(err)
  } finally {
    checking.value = false
  }
}

const sortedRows = computed(() => [...ingRows.value].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]))
const countBy = (lv) => ingRows.value.filter((r) => r.level === lv).length
const truncate = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s)

// ═══════════════════════════════════════════════
//  Step 3：依產品屬性產生的 16 項清單
// ═══════════════════════════════════════════════
const checklist = computed(() => {
  const isSpecial = SPECIAL.includes(product.type)
  const sensitiveGroup = ['baby', 'eye', 'lip', 'oral'].includes(product.type)
  const claims = product.claims
  return PIF_ITEMS.map((base) => {
    const item = { ...base, notes: [], optional: false }
    switch (base.no) {
      case 1:
        if (product.origin === 'import') item.notes.push('輸入產品：須載明國外製造廠與國內輸入業者資訊，PIF 存放於輸入業者地址。')
        break
      case 3:
        if (countBy('danger')) item.notes.push(`預檢發現 ${countBy('danger')} 項禁用成分，須先調整配方。`)
        if (countBy('over')) item.notes.push(`預檢發現 ${countBy('over')} 項超過限量，請確認實際含量或調整配方。`)
        if (countBy('limit')) item.notes.push(`${countBy('limit')} 項限用成分：須確認含量、使用範圍及標示警語是否符合限制表。`)
        break
      case 4:
        if (countBy('limit')) item.notes.push('限用成分若有規定警語或使用條件，標籤須一併標示。')
        if (claims.length) item.notes.push('標籤宣稱詞句須與第 14 項佐證資料一致，且不得涉及醫療效能。')
        break
      case 5:
        item.notes.push(product.origin === 'import' ? '輸入產品：提供國外製造廠之 GMP（ISO 22716）證明或聲明書。' : '委託代工者：向代工廠索取 GMP 證明或聲明書。')
        break
      case 7:
        if (product.type === 'baby') item.notes.push('嬰兒用產品：暴露量須以三歲以下族群體重與皮膚特性評估。')
        if (product.form === 'aerosol') item.notes.push('噴霧產品：須額外考量吸入暴露。')
        break
      case 10:
        if (product.type === 'baby' || product.type === 'eye') item.notes.push('嬰兒用／眼部用：刺激性與致敏性資料要求更嚴謹。')
        if (product.form === 'aerosol') item.notes.push('噴霧產品：需補充吸入毒性相關資料。')
        if (claims.includes('natural')) item.notes.push('植物萃取物須留意雜質、致敏原（如香料過敏原）資料。')
        break
      case 11:
      case 13:
        if (product.form === 'anhydrous') {
          item.optional = true
          item.notes.push('無水配方：可由安全資料簽署人員評估是否免除，須於 PIF 敘明理由。')
        }
        break
      case 12:
        if (sensitiveGroup) item.notes.push('嬰兒用、眼部用、唇用及接觸黏膜產品，適用較嚴格的微生物容許量。')
        if (product.form === 'anhydrous') {
          item.optional = true
          item.notes.push('無水配方：可評估是否免除，須敘明理由。')
        }
        break
      case 14:
        if (product.type === 'sunscreen' || claims.includes('spf')) item.notes.push('SPF／PA 須有防曬係數試驗報告（如 ISO 24444 / 24442）。')
        if (isSpecial && product.type !== 'sunscreen') item.notes.push('特定用途化粧品須有對應功能之佐證資料。')
        if (claims.includes('whitening')) item.notes.push('美白宣稱：須含公告之美白成分並符合濃度，或提供功能佐證。')
        if (claims.includes('clinical')) item.notes.push('實測數據宣稱：須有對應的人體試驗報告，數據須與報告一致。')
        if (claims.includes('sensitive')) item.notes.push('「敏感肌適用／低敏」：建議備有人體貼膚或刺激性試驗。')
        if (claims.includes('antiaging') || claims.includes('moisture') || claims.includes('oil'))
          item.notes.push('功效宣稱：備妥文獻、體外試驗或人體實測等佐證。')
        if (!claims.length && !isSpecial) {
          item.optional = true
          item.notes.push('沒有功效宣稱時資料需求較少，但仍須確認標籤、廣告用語。')
        }
        break
      case 15:
        if (product.type === 'oral' || product.type === 'lip') item.notes.push('牙膏、漱口水、唇用產品可能入口，包材溶出資料更重要。')
        break
      case 16:
        item.notes.push('須由安全資料簽署人員依第 1～15 項資料完成評估、計算 MoS 並簽署。')
        break
    }
    return item
  })
})

const have = ref([])
const requiredItems = computed(() => checklist.value.filter((i) => !i.optional))
const haveCount = computed(() => requiredItems.value.filter((i) => have.value.includes(i.no)).length)
const readiness = computed(() => Math.round((haveCount.value / requiredItems.value.length) * 100))
const missing = computed(() => checklist.value.filter((i) => !have.value.includes(i.no)))

const copied = ref(false)
async function copyReport() {
  const typeLabel = PRODUCT_TYPES.find((t) => t.value === product.type)?.label
  const lines = [
    '【審盾橘 PIF AI 預檢報告】',
    `產品類別：${typeLabel}`,
    `PIF 準備度：${readiness.value}%`,
    '',
  ]
  if (checked.value) {
    lines.push('▍成分比對')
    for (const r of sortedRows.value) lines.push(`- ${r.name}${r.pct !== null ? ` ${r.pct}%` : ''}：${LEVEL_LABEL[r.level]}${r.hits[0]?.limit_standard ? `（限量 ${r.hits[0].limit_standard}）` : ''}`)
    lines.push('')
  }
  lines.push('▍缺件清單')
  for (const m of missing.value) lines.push(`- ${m.no}. ${m.title}${m.optional ? '（可評估免除）' : ''}${m.notes.length ? `：${m.notes.join(' ')}` : ''}`)
  lines.push('', 'https://www.aicheck.com.tw/pif')
  try {
    await navigator.clipboard.writeText(lines.join('\n'))
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.prompt('請手動複製：', lines.join('\n'))
  }
}

// ═══════════════════════════════════════════════
//  SEO
// ═══════════════════════════════════════════════
const TITLE = 'PIF AI 智慧預檢｜化粧品 PIF 建檔・安全簽署代辦 - 審盾橘'
const DESC = '免費 PIF AI 預檢：貼上全成分表，自動比對食藥署禁用／限用成分並產出 PIF 16 項缺件清單。審盾橘提供化粧品產品資訊檔案建檔、毒理評估、MoS 計算與安全資料簽署，不綁代工、保密配方。'
useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESC },
    { name: 'keywords', content: 'PIF AI, PIF, 化粧品產品資訊檔案, PIF 建檔, PIF 代辦, PIF 費用, 安全資料簽署, 化粧品安全評估, 禁用成分, 限用成分' },
    { property: 'og:title', content: TITLE },
    { property: 'og:description', content: DESC },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/pif' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:title', content: TITLE },
    { name: 'twitter:description', content: DESC },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/pif' }],
  script: [
    serviceSchema('pif'),
    faqSchema(FAQS),
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'PIF AI 智慧預檢',
        url: 'https://www.aicheck.com.tw/pif#precheck',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: '貼上化粧品全成分表，自動比對台灣食藥署禁用／限用成分表，並依產品類型產生 PIF 16 項應備文件與缺件清單。',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        provider: { '@type': 'Organization', name: '審盾橘', url: 'https://www.aicheck.com.tw' },
      }),
    },
    breadcrumbSchema([
      { name: '首頁', url: 'https://www.aicheck.com.tw/' },
      { name: 'PIF AI 預檢與建檔', url: 'https://www.aicheck.com.tw/pif' },
    ]),
  ],
})
</script>

<style scoped>
.page-pif { max-width: 980px; margin: 0 auto; padding: 1.5rem 1rem 4rem; color: #333; }
.hero { text-align: center; padding: 2.5rem 0 1.5rem; }
.eyebrow { display: inline-block; background: #fff1ec; color: #e04e2d; font-weight: 700; font-size: 0.9rem; padding: 0.3rem 0.8rem; border-radius: 999px; margin-bottom: 1rem; }
.hero h1 { font-size: 2.1rem; line-height: 1.35; color: #222; margin: 0 0 1rem; }
.br-sm { display: none; }
.subtitle { font-size: 1.08rem; color: #555; line-height: 1.8; max-width: 760px; margin: 0 auto 1.5rem; }
.subtitle strong { color: #e04e2d; }
.hero-cta { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; }
.hero-points { list-style: none; padding: 0; margin: 1.25rem 0 0; display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem 1.25rem; color: #666; font-size: 0.92rem; }
.alert-band { background: #fff8e6; border: 1px solid #f5d38a; border-radius: 10px; padding: 1rem 1.25rem; line-height: 1.75; font-size: 0.98rem; margin: 1rem 0 2.5rem; }

.tool { background: #fff; border: 2px solid #ff5733; border-radius: 14px; padding: 1.75rem 1.5rem; scroll-margin-top: 80px; }
.tool > h2 { color: #ff5733; margin: 0 0 0.25rem; font-size: 1.6rem; }
.tool-intro { color: #666; margin: 0 0 1.25rem; }
.step { border-top: 1px dashed #f0c4b8; padding: 1.25rem 0; }
.step-head { font-weight: 700; font-size: 1.12rem; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.9rem; }
.step-no { width: 1.8rem; height: 1.8rem; border-radius: 50%; background: #ff5733; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0; }
.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem 1rem; }
.field { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.92rem; color: #555; }
.field select, textarea { width: 100%; box-sizing: border-box; padding: 0.6rem 0.7rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.98rem; font-family: inherit; background: #fff; }
textarea { resize: vertical; line-height: 1.6; }
.claims { margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.claims-label { width: 100%; font-size: 0.92rem; color: #555; }
.chip { border: 1px solid #ddd; border-radius: 999px; padding: 0.35rem 0.85rem; font-size: 0.9rem; cursor: pointer; user-select: none; }
.chip input { display: none; }
.chip.on { background: #ff5733; border-color: #ff5733; color: #fff; }
.row-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-top: 0.75rem; }
.link-btn { background: none; border: none; color: #e04e2d; text-decoration: underline; cursor: pointer; font-size: 0.95rem; }

.ing-result { margin-top: 1rem; }
.summary { font-size: 0.95rem; line-height: 1.8; }
.s-danger { color: #c62828; font-weight: 700; }
.s-warn { color: #b26a00; font-weight: 700; }
.s-ok { color: #2e7d32; font-weight: 700; }
.ing-row { border: 1px solid #eee; border-left-width: 4px; border-radius: 8px; padding: 0.6rem 0.8rem; margin-bottom: 0.5rem; }
.ing-row.danger { border-left-color: #c62828; background: #fff5f5; }
.ing-row.over { border-left-color: #e65100; background: #fff6ee; }
.ing-row.limit { border-left-color: #f0a500; background: #fffbef; }
.ing-row.clear { border-left-color: #8bc34a; }
.ing-top { display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.ing-name { font-weight: 600; word-break: break-word; }
.ing-name em { font-style: normal; color: #888; font-weight: 400; }
.badge { font-size: 0.82rem; padding: 0.15rem 0.6rem; border-radius: 999px; white-space: nowrap; }
.badge.danger { background: #c62828; color: #fff; }
.badge.over { background: #e65100; color: #fff; }
.badge.limit { background: #f0a500; color: #fff; }
.badge.clear { background: #e8f5e9; color: #2e7d32; }
.hit-list { margin: 0.4rem 0 0; padding-left: 1.1rem; font-size: 0.88rem; color: #555; line-height: 1.6; }
.dict-note { margin: 0.3rem 0 0; font-size: 0.85rem; color: #777; }
.hint { font-size: 0.86rem; color: #777; line-height: 1.7; }
.hint a { color: #e04e2d; }
.error-text { color: #c62828; }

.progress-wrap { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
.progress-bar { flex: 1; min-width: 160px; height: 12px; background: #f1f1f1; border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #ff8a65, #ff5733); transition: width 0.3s; }
.progress-text { font-weight: 700; color: #e04e2d; font-size: 0.95rem; }
.checklist { list-style: none; padding: 0; margin: 0; }
.checklist li { border-bottom: 1px solid #f2f2f2; padding: 0.6rem 0; }
.checklist label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; flex-wrap: wrap; }
.checklist input { width: 1.05rem; height: 1.05rem; accent-color: #ff5733; flex-shrink: 0; }
.ck-title { font-weight: 600; }
.checklist li.done .ck-title { color: #999; text-decoration: line-through; }
.tag-optional { font-size: 0.75rem; background: #eef4ff; color: #3b62b5; padding: 0.1rem 0.5rem; border-radius: 999px; }
.ck-desc { margin: 0.2rem 0 0 1.6rem; font-size: 0.86rem; color: #777; }
.ck-note { margin: 0.2rem 0 0 1.6rem; font-size: 0.86rem; color: #b5481f; }
.missing-box { background: #fff5f2; border-radius: 10px; padding: 1rem 1.25rem; margin-top: 1rem; }
.missing-box h3 { margin: 0 0 0.5rem; color: #e04e2d; font-size: 1.1rem; }
.missing-box ul { margin: 0; padding-left: 1.2rem; line-height: 1.8; columns: 2; }
.all-done { color: #2e7d32; font-weight: 600; }
.disclaimer { font-size: 0.8rem; color: #999; margin: 0.5rem 0 0; line-height: 1.6; }

.section { margin: 3rem 0; }
.section h2 { font-size: 1.5rem; color: #ff5733; margin-bottom: 1rem; }
.section p { font-size: 1.02rem; color: #444; line-height: 1.85; }
.flow { counter-reset: f; list-style: none; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.75rem; }
.flow li { counter-increment: f; background: #fafafa; border-radius: 10px; padding: 1rem 0.85rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem; color: #555; line-height: 1.6; }
.flow li::before { content: counter(f); font-weight: 800; color: #ff5733; font-size: 1.3rem; }
.flow b { color: #222; font-size: 1rem; }
.highlight { background: #fff5f2; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #ff5733; }
.bullets { padding-left: 1.2rem; line-height: 1.9; color: #444; }
.timeline { border-left: 3px solid #ff5733; padding-left: 1rem; }
.tl-item { display: flex; gap: 1rem; padding: 0.5rem 0; line-height: 1.6; }
.tl-date { font-weight: 700; color: #e04e2d; min-width: 5.5rem; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.93rem; }
th, td { border: 1px solid #eee; padding: 0.6rem 0.75rem; text-align: left; vertical-align: top; line-height: 1.6; }
th { background: #ff5733; color: #fff; }
tbody tr:nth-child(even) { background: #fafafa; }
td:first-child { font-weight: 600; width: 38%; }
.faq-item { border-bottom: 1px solid #eee; padding: 0.9rem 0; }
.faq-item summary { font-size: 1.05rem; font-weight: 700; cursor: pointer; }
.faq-item p { margin: 0.6rem 0 0; color: #555; }
.cross-link { background: #f8f8f8; padding: 1.25rem; border-radius: 10px; }
.tool-links { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tool-links a { border: 1px solid #ffcab8; color: #e04e2d; padding: 0.4rem 0.9rem; border-radius: 999px; text-decoration: none; background: #fff; font-size: 0.93rem; }
.tool-links a:hover { background: #fff1ec; }
.cta-section { text-align: center; }
.cta-btn { display: inline-block; padding: 0.75rem 1.6rem; background: #ff5733; color: #fff; border: 2px solid #ff5733; border-radius: 8px; text-decoration: none; font-size: 1rem; cursor: pointer; font-family: inherit; }
.cta-btn:hover { background: #e04e2d; border-color: #e04e2d; }
.cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.cta-secondary { background: #fff; color: #ff5733; }
.cta-secondary:hover { background: #fff5f2; color: #e04e2d; }

@media (max-width: 720px) {
  .hero h1 { font-size: 1.6rem; }
  .br-sm { display: inline; }
  .tool { padding: 1.25rem 1rem; }
  .field-grid { grid-template-columns: 1fr; }
  .flow { grid-template-columns: 1fr; }
  .missing-box ul { columns: 1; }
  td:first-child { width: auto; }
}
</style>
