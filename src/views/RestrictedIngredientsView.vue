<template>
  <main class="restricted-page">
    <section class="hero">
      <h1>台灣禁用／限用成分查詢</h1>
      <p class="subtitle">輸入成分中文名、INCI 名稱或 CAS 號碼，查詢是否為食藥署公告禁止或限制使用之成分</p>
    </section>

    <div class="mode-tabs">
      <button :class="{ active: mode === 'single' }" @click="mode = 'single'">單筆查詢</button>
      <button :class="{ active: mode === 'batch' }" @click="mode = 'batch'">成分表批次審核</button>
    </div>

    <section v-if="mode === 'single'" class="search-section">
      <input
        v-model.trim="query"
        type="text"
        class="search-input"
        placeholder="例：Hydroquinone、對苯二酚、123-31-9"
        @keyup.enter="search"
      />
      <button class="search-btn" :disabled="loading" @click="search">
        {{ loading ? '查詢中...' : '查詢' }}
      </button>
    </section>

    <section v-else class="batch-section">
      <textarea
        v-model="batchInput"
        class="batch-textarea"
        rows="6"
        placeholder="貼上成分表，一行一個或用逗號分隔皆可，例：&#10;Water, Glycerin, Niacinamide&#10;Arbutin&#10;Hydroquinone"
      ></textarea>
      <button class="search-btn batch-btn" :disabled="batchLoading" @click="runBatch">
        {{ batchLoading ? `審核中...（${batchProgress}/${batchTotal}）` : '開始審核' }}
      </button>
    </section>

    <section v-if="mode === 'single' && searched" class="result-section">
      <p v-if="loadError" class="error-text">⚠ 查詢失敗：{{ loadError }}</p>

      <template v-else>
        <p class="result-count">共找到 {{ results.length }} 筆精確符合資料</p>

        <div v-if="results.length === 0 && partialResults.length === 0" class="empty-hint">
          查無資料，可能代表此成分不在食藥署公告的禁用／限用清單中，但仍建議另外查閱 PIF 安全評估相關文獻確認。
        </div>

        <div v-for="item in results" :key="item.id" class="result-card" :class="cardClass(item.category)">
          <div class="result-header">
            <span class="category-badge" :class="cardClass(item.category)">{{ item.category }}</span>
            <span class="result-name">{{ item.name || item.inci_name || '（未載明名稱）' }}</span>
          </div>
          <dl class="result-detail">
            <template v-if="item.inci_name">
              <dt>INCI 名稱</dt><dd>{{ item.inci_name }}</dd>
            </template>
            <template v-if="item.cas_no">
              <dt>CAS 號碼</dt><dd>{{ item.cas_no }}</dd>
            </template>
            <template v-if="item.scope">
              <dt>使用範圍</dt><dd>{{ item.scope }}</dd>
            </template>
            <template v-if="item.limit_standard">
              <dt>限量標準</dt><dd>{{ item.limit_standard }}</dd>
            </template>
            <template v-if="item.restriction">
              <dt>限制規定</dt><dd>{{ item.restriction }}</dd>
            </template>
            <template v-if="item.notes">
              <dt>備註</dt><dd>{{ item.notes }}</dd>
            </template>
          </dl>
        </div>

        <details v-if="partialResults.length > 0" class="partial-block">
          <summary>另有 {{ partialResults.length }} 筆「相似詞」，非精確符合，僅供參考（點開查看）</summary>
          <p class="hint partial-warning">
            以下資料是成分名稱裡「剛好包含」你輸入的字，不代表就是同一個成分——例如查「Water」可能會連到「Water-soluble
            zinc salts...」這種完全不同的物質，或是一段落落長的限制條文裡剛好提到你查的字（甚至條文本身可能寫的是「不在此限」）。
            請務必完整讀過內容再判斷，不要只看到成分名出現就當作真的違規。
          </p>
          <div v-for="item in partialResults" :key="item.id" class="result-card info">
            <div class="result-header">
              <span class="category-badge info">{{ item.category }}（相似詞）</span>
              <span class="result-name">{{ item.name || item.inci_name || '（未載明名稱）' }}</span>
            </div>
            <dl class="result-detail">
              <template v-if="item.inci_name"><dt>INCI 名稱</dt><dd>{{ item.inci_name }}</dd></template>
              <template v-if="item.cas_no"><dt>CAS 號碼</dt><dd>{{ item.cas_no }}</dd></template>
              <template v-if="item.scope"><dt>使用範圍</dt><dd>{{ item.scope }}</dd></template>
              <template v-if="item.limit_standard"><dt>限量標準</dt><dd>{{ item.limit_standard }}</dd></template>
              <template v-if="item.restriction"><dt>限制規定</dt><dd>{{ item.restriction }}</dd></template>
              <template v-if="item.notes"><dt>備註</dt><dd>{{ item.notes }}</dd></template>
            </dl>
          </div>
        </details>
      </template>
    </section>

    <section v-if="mode === 'batch' && batchSearched" class="result-section">
      <p v-if="batchError" class="error-text">⚠ 審核失敗：{{ batchError }}</p>

      <template v-else>
        <p class="result-count">
          共 {{ batchResults.length }} 項成分：
          <span class="summary-danger">{{ bannedCount }} 項禁止使用</span>、
          <span class="summary-warning">{{ restrictedCount }} 項限制使用</span>、
          <span class="summary-info">{{ similarCount }} 項有相似詞待確認</span>、
          <span class="summary-clear">{{ clearCount }} 項未查到</span>
        </p>

        <div v-for="row in batchResults" :key="row.term" class="batch-row" :class="rowClass(row)">
          <div class="batch-row-header" @click="row.expanded = !row.expanded">
            <span class="batch-term">{{ row.term }}</span>
            <span class="batch-status" :class="rowClass(row)">{{ statusLabel(row) }}</span>
          </div>
          <div v-if="(row.exact.length || row.partial.length) && row.expanded" class="batch-detail">
            <div v-for="item in row.exact" :key="item.id" class="result-card" :class="cardClass(item.category)">
              <div class="result-header">
                <span class="category-badge" :class="cardClass(item.category)">{{ item.category }}</span>
                <span class="result-name">{{ item.name || item.inci_name || '（未載明名稱）' }}</span>
              </div>
              <dl class="result-detail">
                <template v-if="item.inci_name"><dt>INCI 名稱</dt><dd>{{ item.inci_name }}</dd></template>
                <template v-if="item.cas_no"><dt>CAS 號碼</dt><dd>{{ item.cas_no }}</dd></template>
                <template v-if="item.scope"><dt>使用範圍</dt><dd>{{ item.scope }}</dd></template>
                <template v-if="item.limit_standard"><dt>限量標準</dt><dd>{{ item.limit_standard }}</dd></template>
                <template v-if="item.restriction"><dt>限制規定</dt><dd>{{ item.restriction }}</dd></template>
                <template v-if="item.notes"><dt>備註</dt><dd>{{ item.notes }}</dd></template>
              </dl>
            </div>

            <template v-if="row.partial.length">
              <p class="hint partial-warning">
                以下是「相似詞」，成分名稱裡剛好包含這個字，不代表就是同一個成分，請完整讀過內容再判斷：
              </p>
              <div v-for="item in row.partial" :key="item.id" class="result-card info">
                <div class="result-header">
                  <span class="category-badge info">{{ item.category }}（相似詞）</span>
                  <span class="result-name">{{ item.name || item.inci_name || '（未載明名稱）' }}</span>
                </div>
                <dl class="result-detail">
                  <template v-if="item.inci_name"><dt>INCI 名稱</dt><dd>{{ item.inci_name }}</dd></template>
                  <template v-if="item.cas_no"><dt>CAS 號碼</dt><dd>{{ item.cas_no }}</dd></template>
                  <template v-if="item.scope"><dt>使用範圍</dt><dd>{{ item.scope }}</dd></template>
                  <template v-if="item.limit_standard"><dt>限量標準</dt><dd>{{ item.limit_standard }}</dd></template>
                  <template v-if="item.restriction"><dt>限制規定</dt><dd>{{ item.restriction }}</dd></template>
                  <template v-if="item.notes"><dt>備註</dt><dd>{{ item.notes }}</dd></template>
                </dl>
              </div>
            </template>
          </div>
        </div>

        <p class="hint batch-hint">未查到不代表絕對安全，僅代表未列於這 4 張食藥署公告表中，正式送審請另外查閱 PIF 安全評估相關文獻。</p>
      </template>
    </section>

    <p class="source-note">
      資料來源：衛福部食藥署開放資料平台（禁止使用成分表、成分使用限制表、防腐劑／防曬劑／色素成分限制表）。
      資料為不定期更新，正式送審請以食藥署最新公告為準。
    </p>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'

useHead({
  title: '台灣禁用／限用成分查詢 - 審盾橘',
  meta: [
    { name: 'description', content: '查詢化粧品成分是否為台灣食藥署公告禁止使用或限制使用之成分，涵蓋一般限制、防腐劑、防曬劑、色素成分表，支援成分表批次審核。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/restricted-ingredients' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/restricted-ingredients' }],
})

const mode = ref('single')

// ── 單筆查詢 ──
const query = ref('')
const results = ref([])
const partialResults = ref([])
const loading = ref(false)
const searched = ref(false)
const loadError = ref('')

function cardClass(category) {
  return category === '禁止使用成分' ? 'danger' : 'warning'
}

// 判斷一筆資料是否為「精確符合」：成分名或 INCI 名整個字串完全等於輸入詞（不分大小寫），
// 或 CAS 號碼完全相同。只有精確符合才代表這筆資料真的就是在講這個成分本身；
// 反之，字串裡「剛好包含」輸入詞的（例如 Water 出現在 "Water-soluble zinc salts..." 或
// "...cherry laurel water" 這種完全不同的成分名稱裡），只能算「相似詞」，不能直接當作命中。
function isExactMatch(item, term) {
  const t = term.trim().toLowerCase()
  const name = (item.name || '').trim().toLowerCase()
  const inci = (item.inci_name || '').trim().toLowerCase()
  const cas = (item.cas_no || '').trim().toLowerCase()
  return name === t || inci === t || cas === t
}

async function queryIngredient(term) {
  const q = `%${term}%`
  // CAS 號碼不做模糊比對（號碼相似不代表是同一物質），只比對成分名／INCI名
  const { data, error } = await supabase
    .from('restricted_ingredients')
    .select('*')
    .or(`name.ilike.${q},inci_name.ilike.${q},cas_no.eq.${term}`)
    .order('category', { ascending: true })
    .limit(200)
  if (error) throw error
  const all = data || []
  const exact = all.filter((item) => isExactMatch(item, term))
  const partial = all.filter((item) => !isExactMatch(item, term))
  return { exact, partial }
}

async function search() {
  if (!query.value) return
  loading.value = true
  searched.value = true
  loadError.value = ''
  try {
    const { exact, partial } = await queryIngredient(query.value)
    results.value = exact
    partialResults.value = partial
  } catch (err) {
    loadError.value = err.message
    results.value = []
    partialResults.value = []
  } finally {
    loading.value = false
  }
}

// ── 成分表批次審核 ──
const batchInput = ref('')
const batchResults = ref([])
const batchLoading = ref(false)
const batchSearched = ref(false)
const batchError = ref('')
const batchProgress = ref(0)
const batchTotal = ref(0)

function parseBatchInput(text) {
  return text
    .split(/[\n,，、;；]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

async function runBatch() {
  const terms = parseBatchInput(batchInput.value)
  if (terms.length === 0) return

  batchLoading.value = true
  batchSearched.value = true
  batchError.value = ''
  batchProgress.value = 0
  batchTotal.value = terms.length
  const rows = []

  try {
    for (const term of terms) {
      const { exact, partial } = await queryIngredient(term)
      rows.push({ term, exact, partial, expanded: false })
      batchProgress.value++
    }
    batchResults.value = rows
  } catch (err) {
    batchError.value = err.message
  } finally {
    batchLoading.value = false
  }
}

// 狀態判定「只看精確符合」：精確符合才會標成禁止使用／限制使用，
// 光是有相似詞出現，只會標成中性的「有相似詞」，不會誤判成真的違規。
function rowClass(row) {
  if (row.exact.some((m) => m.category === '禁止使用成分')) return 'danger'
  if (row.exact.length > 0) return 'warning'
  if (row.partial.length > 0) return 'info'
  return 'clear'
}

function statusLabel(row) {
  if (row.exact.some((m) => m.category === '禁止使用成分')) return '🚫 禁止使用'
  if (row.exact.length > 0) return `⚠ 限制使用（${row.exact.length}）`
  if (row.partial.length > 0) return `🔍 有相似詞（${row.partial.length}），建議人工確認`
  return '✓ 未查到'
}

const bannedCount = computed(() => batchResults.value.filter((r) => rowClass(r) === 'danger').length)
const restrictedCount = computed(() => batchResults.value.filter((r) => rowClass(r) === 'warning').length)
const similarCount = computed(() => batchResults.value.filter((r) => rowClass(r) === 'info').length)
const clearCount = computed(() => batchResults.value.filter((r) => rowClass(r) === 'clear').length)
</script>

<style scoped>
.restricted-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}
.hero {
  text-align: center;
  padding: 1.5rem 0 2rem;
}
.hero h1 {
  font-size: 1.8rem;
  color: #ff5733;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #666;
}
.mode-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #eee;
}
.mode-tabs button {
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}
.mode-tabs button.active {
  color: #ff5733;
  border-bottom-color: #ff5733;
}
.batch-section {
  margin-bottom: 1.5rem;
}
.batch-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.75rem;
}
.batch-btn {
  width: 100%;
}
.summary-danger {
  color: #c62828;
  font-weight: 600;
}
.summary-warning {
  color: #e65100;
  font-weight: 600;
}
.summary-info {
  color: #1565c0;
  font-weight: 600;
}
.summary-clear {
  color: #2e7d32;
  font-weight: 600;
}
.result-card.info {
  border-left-color: #90caf9;
  background: #f5f9ff;
}
.category-badge.info {
  background: #e3f2fd;
  color: #1565c0;
}
.batch-row.info {
  border-left-color: #90caf9;
}
.batch-status.info {
  color: #1565c0;
}
.partial-block {
  margin-top: 1.25rem;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.partial-block summary {
  cursor: pointer;
  font-weight: 600;
  color: #1565c0;
}
.partial-warning {
  background: #fffde7;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  margin: 0.75rem 0;
  color: #7d6608;
}
.batch-row {
  border: 1px solid #eee;
  border-left: 4px solid #a5d6a7;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  overflow: hidden;
}
.batch-row.warning {
  border-left-color: #ffb499;
}
.batch-row.danger {
  border-left-color: #d32f2f;
}
.batch-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background: #fafafa;
}
.batch-term {
  font-weight: 600;
  color: #333;
}
.batch-status {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2e7d32;
}
.batch-status.warning {
  color: #e65100;
}
.batch-status.danger {
  color: #c62828;
}
.batch-detail {
  padding: 0 1rem 1rem;
}
.hint {
  color: #999;
  font-size: 0.85rem;
}
.batch-hint {
  margin-top: 1rem;
}
.search-section {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 2rem;
}
.search-input {
  flex: 1;
  padding: 0.65rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}
.search-btn {
  padding: 0.65rem 1.5rem;
  background: #ff5733;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.search-btn:disabled {
  background: #ffb499;
  cursor: not-allowed;
}
.result-count {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
.empty-hint {
  color: #999;
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
}
.error-text {
  color: #d84315;
}
.result-card {
  border: 1px solid #eee;
  border-left: 4px solid #ffb499;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  background: #fafafa;
}
.result-card.danger {
  border-left-color: #d32f2f;
  background: #fff5f5;
}
.result-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}
.category-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: #fff3e0;
  color: #e65100;
}
.category-badge.danger {
  background: #ffebee;
  color: #c62828;
}
.result-name {
  font-weight: 600;
  color: #333;
}
.result-detail {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.3rem 0.75rem;
  font-size: 0.9rem;
  margin: 0;
}
.result-detail dt {
  color: #999;
}
.result-detail dd {
  margin: 0;
  color: #444;
}
.source-note {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #999;
  text-align: center;
}

@media (max-width: 500px) {
  .search-section {
    flex-direction: column;
  }
}
</style>
