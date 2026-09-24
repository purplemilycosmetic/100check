<template>
  <main class="label-gen-page">
    <section class="hero">
      <h1>化粧品中文標籤產生器</h1>
      <p class="subtitle">依《化粧品衛生安全管理法》必要標示事項，填好欄位自動組成合規標籤內容</p>
    </section>

    <section class="form-section">
      <div class="field">
        <label>品名 <span class="required">*</span></label>
        <input v-model.trim="form.productName" type="text" placeholder="例：舒緩保濕精華液" />
      </div>

      <div class="field">
        <label>用途 <span class="required">*</span></label>
        <textarea v-model.trim="form.purpose" rows="2" placeholder="例：保濕、滋潤肌膚"></textarea>
      </div>

      <div class="field">
        <label>使用方法 <span class="required">*</span></label>
        <textarea v-model.trim="form.usage" rows="2" placeholder="例：潔膚後，取適量塗抹於臉部肌膚"></textarea>
      </div>

      <div class="field">
        <label>保存方法 <span class="required">*</span></label>
        <textarea v-model.trim="form.storage" rows="2" placeholder="例：請置於陰涼乾燥處，避免陽光直射"></textarea>
      </div>

      <div class="field-row">
        <div class="field">
          <label>容量或淨重 <span class="required">*</span></label>
          <div class="inline-inputs">
            <input v-model.trim="form.volumeValue" type="text" placeholder="例：30" />
            <select v-model="form.volumeUnit">
              <option value="ml">ml（容量）</option>
              <option value="g">g（淨重）</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>批號 <span class="required">*</span></label>
          <input v-model.trim="form.batchNo" type="text" placeholder="例：B20260924" />
        </div>
      </div>

      <div class="field">
        <label>全成分 <span class="required">*</span></label>
        <textarea
          v-model.trim="form.ingredients"
          rows="3"
          placeholder="請依含量由高到低排列，逗號分隔，例：Water, Glycerin, Niacinamide..."
        ></textarea>
        <p class="hint">依規定需列出全成分（INCI 名稱），含量大於 1% 者需由高到低排列。</p>
      </div>

      <div class="field">
        <label>原產地 <span class="required">*</span></label>
        <input v-model.trim="form.origin" type="text" placeholder="例：台灣、日本、韓國" />
      </div>

      <div class="field">
        <label>製造或輸入業者類型 <span class="required">*</span></label>
        <div class="radio-group">
          <label><input type="radio" v-model="form.manufacturerType" value="domestic" /> 國產（台灣廠商）</label>
          <label><input type="radio" v-model="form.manufacturerType" value="imported" /> 輸入（進口商）</label>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label>{{ form.manufacturerType === 'imported' ? '輸入業者名稱' : '製造或輸入業者名稱' }} <span class="required">*</span></label>
          <input v-model.trim="form.companyName" type="text" placeholder="請輸入公司全名" />
        </div>
        <div class="field">
          <label>地址/電話 <span class="required">*</span></label>
          <input v-model.trim="form.companyContact" type="text" placeholder="例：台北市OO路OO號 / 02-1234-5678" />
        </div>
      </div>

      <div v-if="form.manufacturerType === 'domestic'" class="field highlight-block">
        <label>製造工廠（名稱/地址） <span class="required">*</span></label>
        <input v-model.trim="form.factoryInfo" type="text" placeholder="台灣廠商需另外標示，例：OO化工廠 / 桃園市OO路OO號" />
      </div>

      <div class="field date-block">
        <label>製造日期／有效期間／保存期限（三選二） <span class="required">*</span></label>
        <p class="hint">依規定至少需擇二標示，且欄位名稱須與下方完全一致，本工具已自動套用正確名稱。</p>
        <div class="date-grid">
          <div class="date-item">
            <label class="date-label">製造日期</label>
            <input v-model.trim="form.mfgDate" type="text" placeholder="日/月/年，例：24/09/2026" />
          </div>
          <div class="date-item">
            <label class="date-label">有效期間</label>
            <input v-model.trim="form.expiryPeriod" type="text" placeholder="例：三年" />
          </div>
          <div class="date-item">
            <label class="date-label">保存期限</label>
            <input v-model.trim="form.expiryDate" type="text" placeholder="日/月/年，例：24/09/2029" />
          </div>
        </div>
        <p v-if="!dateRuleOk" class="warning-text">⚠ 三項需至少填寫兩項</p>
      </div>

      <div class="field">
        <label>注意事項 <span class="required">*</span></label>
        <textarea v-model.trim="form.precautions" rows="3" placeholder="例：避開眼周使用，如有不適請停止使用並洽詢醫師"></textarea>
      </div>

      <button class="generate-btn" :disabled="wordsLoading" @click="generate">
        {{ wordsLoading ? '風險詞庫載入中...' : '產生標籤內容' }}
      </button>
    </section>

    <section v-if="showResult" class="result-section">
      <h2>檢查結果</h2>

      <div v-if="missingFields.length" class="missing-box">
        <p class="missing-title">⚠ 以下必填欄位尚未填寫：</p>
        <ul>
          <li v-for="f in missingFields" :key="f">{{ f }}</li>
        </ul>
      </div>

      <div v-if="riskMatches.length" class="risk-box">
        <p class="risk-title">⚠ 用途／注意事項文字中偵測到可能的風險字眼：</p>
        <div v-for="(m, i) in riskMatches" :key="i" class="risk-item">
          <span class="risk-word">「{{ m.name }}」</span>
          <span class="risk-stars">{{ '★'.repeat(m.risk_score || 3) }}{{ '☆'.repeat(5 - (m.risk_score || 3)) }}</span>
          <p v-if="m.fix_suggestion" class="risk-suggestion">建議：{{ m.fix_suggestion }}</p>
        </div>
        <p class="hint">這裡的比對只是參考，正式送審前建議另外使用「AI廣告檢核」做完整檢查。</p>
      </div>

      <template v-if="!missingFields.length && dateRuleOk">
        <div class="label-preview">
          <h3>標籤內容預覽</h3>
          <pre>{{ labelText }}</pre>
        </div>
        <button class="copy-btn" @click="copyText">{{ copied ? '已複製 ✓' : '複製標籤內容' }}</button>
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'

useHead({
  title: '化粧品中文標籤產生器｜必要標示事項一鍵產出 - 審盾橘',
  meta: [
    { name: 'description', content: '依化粧品衛生安全管理法必要標示事項，自動組成合規中文標籤內容，並比對風險字眼詞庫。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/label-generator' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/label-generator' }],
})

const form = reactive({
  productName: '',
  purpose: '',
  usage: '',
  storage: '',
  volumeValue: '',
  volumeUnit: 'ml',
  ingredients: '',
  origin: '',
  manufacturerType: 'domestic',
  companyName: '',
  companyContact: '',
  factoryInfo: '',
  mfgDate: '',
  expiryPeriod: '',
  expiryDate: '',
  batchNo: '',
  precautions: '',
})

const showResult = ref(false)
const copied = ref(false)
const wordsLoading = ref(true)
const forbiddenWordsList = ref([])

// 沿用「AI廣告檢核」頁面的詞庫載入方式，一次載入、分頁拉完
async function loadForbiddenWords() {
  wordsLoading.value = true
  try {
    const PAGE = 500
    let allData = []
    let page = 0
    while (true) {
      const { data, error } = await supabase
        .from('forbidden_words')
        .select('id, name, core_keyword, risk_score, fix_suggestion')
        .order('id', { ascending: true })
        .range(page * PAGE, (page + 1) * PAGE - 1)
      if (error) throw error
      if (!data || data.length === 0) break
      allData = allData.concat(data)
      if (data.length < PAGE) break
      page++
    }
    forbiddenWordsList.value = allData
  } catch (e) {
    console.error('詞庫載入失敗:', e)
  } finally {
    wordsLoading.value = false
  }
}
loadForbiddenWords()

const dateRuleOk = computed(() => {
  const filled = [form.mfgDate, form.expiryPeriod, form.expiryDate].filter(Boolean).length
  return filled >= 2
})

const missingFields = computed(() => {
  const missing = []
  const need = [
    ['productName', '品名'],
    ['purpose', '用途'],
    ['usage', '使用方法'],
    ['storage', '保存方法'],
    ['volumeValue', '容量或淨重'],
    ['ingredients', '全成分'],
    ['origin', '原產地'],
    ['companyName', '製造或輸入業者名稱'],
    ['companyContact', '地址/電話'],
    ['batchNo', '批號'],
    ['precautions', '注意事項'],
  ]
  for (const [key, label] of need) {
    if (!form[key]) missing.push(label)
  }
  if (form.manufacturerType === 'domestic') {
    if (!form.factoryInfo) missing.push('製造工廠（名稱/地址）')
  }
  return missing
})

const riskMatches = computed(() => {
  if (!forbiddenWordsList.value.length) return []
  const textToCheck = `${form.purpose} ${form.usage} ${form.precautions}`
  if (!textToCheck.trim()) return []
  const found = []
  const seen = new Set()
  for (const item of forbiddenWordsList.value) {
    const kw = item.core_keyword || item.name
    if (!kw || seen.has(item.name)) continue
    if (textToCheck.includes(item.name) || (item.core_keyword && textToCheck.includes(item.core_keyword))) {
      found.push(item)
      seen.add(item.name)
    }
  }
  return found
})

const labelText = computed(() => {
  const lines = []
  lines.push(`品名：${form.productName}`)
  lines.push(`用途：${form.purpose}`)
  lines.push(`使用方法：${form.usage}`)
  lines.push(`保存方法：${form.storage}`)
  lines.push(`容量：${form.volumeValue}${form.volumeUnit}`)
  lines.push(`全成分：${form.ingredients}`)
  lines.push('')
  if (form.manufacturerType === 'imported') {
    lines.push(`輸入業者：${form.companyName}`)
    lines.push(`地址/電話：${form.companyContact}`)
  } else {
    lines.push(`製造或輸入業者：${form.companyName}`)
    lines.push(`地址/電話：${form.companyContact}`)
    lines.push(`製造工廠：${form.factoryInfo}`)
  }
  lines.push(`原產地：${form.origin}`)
  lines.push('')
  if (form.mfgDate) lines.push(`製造日期：${form.mfgDate}`)
  if (form.expiryPeriod) lines.push(`有效期間：${form.expiryPeriod}`)
  if (form.expiryDate) lines.push(`保存期限：${form.expiryDate}`)
  lines.push(`批號：${form.batchNo}`)
  lines.push('')
  lines.push(`注意事項：${form.precautions}`)
  return lines.join('\n')
})

function generate() {
  showResult.value = true
  copied.value = false
}

async function copyText() {
  try {
    await navigator.clipboard.writeText(labelText.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('複製失敗:', e)
  }
}
</script>

<style scoped>
.label-gen-page {
  max-width: 760px;
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
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
}
.required {
  color: #e64a19;
}
input[type="text"],
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
}
textarea {
  resize: vertical;
}
.inline-inputs {
  display: flex;
  gap: 0.5rem;
}
.inline-inputs input {
  flex: 1;
}
.inline-inputs select {
  width: auto;
}
.hint {
  font-size: 0.82rem;
  color: #999;
  margin-top: 0.35rem;
}
.radio-group {
  display: flex;
  gap: 1.5rem;
}
.radio-group label {
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.highlight-block {
  background: #fff8f5;
  border: 1px solid #ffd9c9;
  border-radius: 8px;
  padding: 1rem;
  margin: 0;
}
.date-block {
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
}
.date-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.date-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #555;
}
.warning-text {
  color: #e64a19;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
.generate-btn {
  margin-top: 0.5rem;
  padding: 0.85rem;
  background: #ff5733;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.generate-btn:disabled {
  background: #ffb499;
  cursor: not-allowed;
}
.result-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}
.result-section h2 {
  color: #333;
  margin-bottom: 1rem;
}
.missing-box {
  background: #fff3f0;
  border: 1px solid #ffccbc;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
}
.missing-title {
  color: #d84315;
  font-weight: 600;
  margin: 0 0 0.5rem;
}
.missing-box ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #d84315;
}
.risk-box {
  background: #fffde7;
  border: 1px solid #fff59d;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
}
.risk-title {
  font-weight: 600;
  color: #7d6608;
  margin: 0 0 0.75rem;
}
.risk-item {
  margin-bottom: 0.6rem;
}
.risk-word {
  font-weight: 600;
  color: #7d6608;
}
.risk-stars {
  margin-left: 0.5rem;
  color: #f9a825;
}
.risk-suggestion {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #666;
}
.label-preview {
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.25rem;
}
.label-preview h3 {
  margin-top: 0;
  color: #333;
}
.label-preview pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.7;
  color: #333;
}
.copy-btn {
  margin-top: 1rem;
  padding: 0.65rem 1.5rem;
  background: #fff;
  color: #ff5733;
  border: 1.5px solid #ff5733;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 600px) {
  .field-row,
  .date-grid {
    grid-template-columns: 1fr;
  }
}
</style>
