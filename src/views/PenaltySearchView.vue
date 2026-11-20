<!--
  違規廠商查詢（/penalty-search）
  資料：Supabase penalty_records（scripts/sync-penalties.mjs 每週同步）
   - 食藥署開放資料「化粧品違規廣告」（全國各縣市衛生局，2012 年起）
   - 本站整理之裁罰通知案例（含罰鍰金額、違規詞句）
-->
<template>
  <main class="penalty-page">
    <section class="hero">
      <p class="eyebrow">免費工具</p>
      <h1>違規廠商查詢</h1>
      <p class="subtitle">
        輸入公司或產品名稱，查詢是否曾因化粧品廣告違規被衛生局裁處。
        收錄全國衛生局公告紀錄 <b>{{ stats.total ? stats.total.toLocaleString() : '—' }}</b> 筆、
        資料更新至 <b>{{ stats.latest || '—' }}</b>。
      </p>
    </section>

    <section class="search-box">
      <div class="mode-tabs">
        <button :class="{ on: mode === 'company' }" @click="setMode('company')">查公司</button>
        <button :class="{ on: mode === 'product' }" @click="setMode('product')">查產品</button>
      </div>
      <form class="search-row" @submit.prevent="search">
        <input
          v-model.trim="query"
          type="search"
          :placeholder="mode === 'company' ? '輸入公司名稱' : '輸入產品名稱'"
          aria-label="查詢關鍵字"
        />
        <button class="btn" :disabled="loading || query.length < 2">{{ loading ? '查詢中…' : '查詢' }}</button>
      </form>
      <p class="hint">至少輸入 2 個字；公司名稱可只打關鍵字（例如不含「股份有限公司」）。</p>
    </section>

    <p v-if="error" class="error">⚠ 查詢失敗：{{ error }}</p>

    <!-- ═══ 查詢結果 ═══ -->
    <section v-if="searched && !error" class="results">
      <div v-if="!groups.length" class="empty">
        <b>查無「{{ lastQuery }}」的裁罰紀錄</b>
        <p>代表在本站收錄的公開資料中沒有找到，不等於從未被處分；也可以換個關鍵字（例如品牌名、公司簡稱）再試一次。</p>
      </div>
      <template v-else>
        <p class="summary">
          找到 <b>{{ groups.length }}</b> 家{{ mode === 'product' ? '相關廠商' : '公司' }}、共
          <b>{{ totalCases }}</b> 筆紀錄<span v-if="truncated">（僅顯示最近 {{ LIMIT }} 筆，請輸入更完整的名稱）</span>
        </p>
        <article v-for="g in groups" :key="g.company" class="co-card">
          <header @click="g.open = !g.open">
            <div class="co-main">
              <h2>{{ g.company }}</h2>
              <p class="co-meta">
                <span class="badge" :class="g.recent ? 'hot' : ''">{{ g.cases.length }} 筆</span>
                最近一次 {{ g.latest || '日期未載明' }}
                <template v-if="g.fine">・已知罰鍰合計 {{ g.fine.toLocaleString() }} 元</template>
                <template v-if="g.authorities.length">・{{ g.authorities.slice(0, 3).join('、') }}{{ g.authorities.length > 3 ? ' 等' : '' }}</template>
              </p>
            </div>
            <span class="toggle">{{ g.open ? '收合 ▲' : '明細 ▼' }}</span>
          </header>
          <div v-if="g.open" class="cases">
            <div v-for="c in g.cases" :key="c.id" class="case">
              <div class="case-top">
                <span class="date">{{ c.decision_date || '日期未載明' }}</span>
                <b class="product">{{ c.product || '（未載明產品）' }}</b>
              </div>
              <dl>
                <template v-if="c.authority"><dt>處分機關</dt><dd>{{ c.authority }}</dd></template>
                <template v-if="c.law_ref"><dt>處分法條</dt><dd>{{ c.law_ref }}</dd></template>
                <template v-if="c.penalty"><dt>處分結果</dt><dd>{{ c.penalty }}</dd></template>
                <template v-if="c.ad_source"><dt>刊播媒體</dt><dd>{{ truncate(c.ad_source, 80) }}</dd></template>
                <template v-if="c.violation"><dt>違規內容</dt><dd class="viol">{{ c.violation }}</dd></template>
              </dl>
            </div>
          </div>
        </article>
      </template>
    </section>

    <!-- ═══ 近期裁罰 ═══ -->
    <section v-if="!searched" class="recent">
      <h2>近期裁罰紀錄</h2>
      <div v-if="recentLoading" class="hint">載入中…</div>
      <div v-for="c in recent" :key="c.id" class="recent-row" @click="quick(c.company)">
        <span class="date">{{ c.decision_date }}</span>
        <span class="r-co">{{ c.company }}</span>
        <span class="r-prod">{{ c.product }}</span>
        <span class="r-auth">{{ c.authority }}</span>
      </div>
    </section>

    <section class="notes">
      <h2>使用說明</h2>
      <ul>
        <li>資料來源：衛福部食藥署開放資料「化粧品違規廣告」（全國各縣市衛生局公告，2012 年起），以及本站整理的裁罰通知案例（含罰鍰金額與違規詞句）。每週自動更新。</li>
        <li>名稱相同或相近不代表是同一家公司，請以統一編號或主管機關公告為準；處分後若經訴願、撤銷，公開資料可能未即時更新。</li>
        <li>非公司行號之個人姓名已遮蔽部分文字。</li>
        <li>想知道自家廣告會不會踩到同樣的雷？用 <router-link to="/ai-audit">AI 廣告檢核</router-link> 比對裁罰案例中的違規詞句。</li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'

const LIMIT = 600
const route = useRoute()
const router = useRouter()
const mode = ref(route.query.by === 'product' ? 'product' : 'company')
const query = ref(String(route.query.q || ''))
const lastQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const error = ref('')
const rows = ref([])
const truncated = ref(false)
const groups = ref([])
const stats = ref({ total: 0, latest: '' })
const recent = ref([])
const recentLoading = ref(true)

const truncate = (s, n) => (s && s.length > n ? s.slice(0, n) + '…' : s)
const escLike = (s) => s.replace(/[\\%_]/g, (m) => '\\' + m)
const totalCases = computed(() => groups.value.reduce((n, g) => n + g.cases.length, 0))

function setMode(m) {
  mode.value = m
  if (searched.value && query.value.length >= 2) search()
}
function quick(company) {
  mode.value = 'company'
  query.value = company
  search()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function search() {
  const q = query.value.trim()
  if (q.length < 2) return
  loading.value = true
  error.value = ''
  try {
    const col = mode.value === 'product' ? 'product' : 'company'
    const { data, error: err } = await supabase
      .from('penalty_records')
      .select('id, source, company, product, violation, law_ref, authority, penalty, fine, decision_date, ad_source')
      .ilike(col, `%${escLike(q)}%`)
      .neq('company', '非廠商')
      .order('decision_date', { ascending: false, nullsFirst: false })
      .limit(LIMIT)
    if (err) throw err
    rows.value = data || []
    truncated.value = rows.value.length >= LIMIT
    const byCo = new Map()
    const yearAgo = new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10)
    for (const r of rows.value) {
      const g = byCo.get(r.company) || { company: r.company, cases: [], fine: 0, authorities: [], latest: '', open: false }
      g.cases.push(r)
      if (r.fine) g.fine += Number(r.fine)
      if (r.authority && !g.authorities.includes(r.authority)) g.authorities.push(r.authority)
      if (r.decision_date && r.decision_date > g.latest) g.latest = r.decision_date
      byCo.set(r.company, g)
    }
    // 名稱完全相符的排最前，其次依筆數
    groups.value = [...byCo.values()]
      .map((g) => ({ ...g, recent: g.latest >= yearAgo }))
      .sort((a, b) => (b.company === q) - (a.company === q) || b.cases.length - a.cases.length)
    if (groups.value.length === 1) groups.value[0].open = true
    lastQuery.value = q
    searched.value = true
    router.replace({ query: { q, ...(mode.value === 'product' ? { by: 'product' } : {}) } })
  } catch (e) {
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (query.value.length >= 2) search()
  const [{ count }, latest, rec] = await Promise.all([
    supabase.from('penalty_records').select('id', { count: 'exact', head: true }),
    supabase.from('penalty_records').select('decision_date').not('decision_date', 'is', null).order('decision_date', { ascending: false }).limit(1),
    supabase.from('penalty_records').select('id, company, product, authority, decision_date').neq('company', '非廠商').not('decision_date', 'is', null).order('decision_date', { ascending: false }).limit(15),
  ])
  stats.value = { total: count || 0, latest: latest.data?.[0]?.decision_date || '' }
  recent.value = rec.data || []
  recentLoading.value = false
})

useHead({
  title: '違規廠商查詢｜化粧品廣告裁罰紀錄 - 審盾橘',
  meta: [
    { name: 'description', content: '免費查詢化粧品公司是否曾因廣告違規被衛生局裁處：收錄食藥署公開的全國化粧品違規廣告紀錄（2012 年起），可依公司或產品名稱搜尋處分機關、日期、法條與違規內容。' },
    { property: 'og:title', content: '違規廠商查詢｜化粧品廣告裁罰紀錄 - 審盾橘' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/penalty-search' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/penalty-search' }],
})
</script>

<style scoped>
.penalty-page { max-width: 920px; margin: 0 auto; padding: 1.5rem 1rem 3rem; color: #333; }
.hero { text-align: center; padding: 2rem 0 1.25rem; }
.eyebrow { display: inline-block; background: #fff1ec; color: #e04e2d; font-weight: 700; font-size: 0.9rem; padding: 0.3rem 0.8rem; border-radius: 999px; margin: 0 0 0.8rem; }
.hero h1 { font-size: 2rem; margin: 0 0 0.75rem; color: #222; }
.subtitle { color: #555; line-height: 1.8; max-width: 640px; margin: 0 auto; }
.subtitle b { color: #e04e2d; }

.search-box { background: #fff; border: 2px solid #ff5733; border-radius: 14px; padding: 1.25rem; }
.mode-tabs { display: flex; gap: 0.4rem; margin-bottom: 0.75rem; }
.mode-tabs button { border: 1px solid #ffd2c4; background: #fff; color: #e04e2d; padding: 0.35rem 1rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; font-family: inherit; }
.mode-tabs button.on { background: #ff5733; color: #fff; border-color: #ff5733; }
.search-row { display: flex; gap: 0.5rem; }
.search-row input { flex: 1; min-width: 0; padding: 0.7rem 0.9rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-family: inherit; }
.btn { padding: 0.7rem 1.4rem; background: #ff5733; color: #fff; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; white-space: nowrap; font-family: inherit; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.hint { font-size: 0.85rem; color: #888; margin: 0.6rem 0 0; }
.error { color: #c62828; }

.results { margin-top: 1.5rem; }
.summary { color: #555; }
.summary b { color: #e04e2d; }
.empty { background: #f5faf5; border: 1px solid #cfe8cf; border-radius: 12px; padding: 1.25rem; }
.empty b { color: #2e7d32; }
.empty p { margin: 0.4rem 0 0; color: #555; line-height: 1.7; font-size: 0.93rem; }

.co-card { border: 1px solid #eee; border-radius: 12px; margin-bottom: 0.75rem; background: #fff; overflow: hidden; }
.co-card header { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; padding: 0.9rem 1.1rem; cursor: pointer; }
.co-card header:hover { background: #fffaf8; }
.co-main { min-width: 0; }
.co-card h2 { font-size: 1.1rem; margin: 0 0 0.3rem; color: #222; word-break: break-all; }
.co-meta { margin: 0; font-size: 0.88rem; color: #666; line-height: 1.6; }
.badge { display: inline-block; background: #f1f1f1; color: #555; border-radius: 999px; padding: 0 0.6rem; margin-right: 0.35rem; font-weight: 700; }
.badge.hot { background: #ffe5de; color: #c62828; }
.toggle { color: #e04e2d; font-size: 0.88rem; white-space: nowrap; }
.cases { border-top: 1px solid #f2f2f2; padding: 0.5rem 1.1rem 1rem; }
.case { border-left: 3px solid #ffb39e; padding: 0.5rem 0 0.5rem 0.8rem; margin: 0.6rem 0; }
.case-top { display: flex; gap: 0.6rem; align-items: baseline; flex-wrap: wrap; }
.date { font-family: ui-monospace, monospace; font-size: 0.85rem; color: #e04e2d; white-space: nowrap; }
.product { font-size: 0.98rem; }
.case dl { display: grid; grid-template-columns: 5.5rem 1fr; gap: 0.2rem 0.6rem; margin: 0.4rem 0 0; font-size: 0.88rem; }
.case dt { color: #888; }
.case dd { margin: 0; color: #444; word-break: break-word; }
.case dd.viol { color: #b5481f; }

.recent { margin-top: 2rem; }
.recent h2, .notes h2 { font-size: 1.25rem; color: #ff5733; margin: 0 0 0.75rem; }
.recent-row { display: grid; grid-template-columns: 6.2rem 1.3fr 1.5fr 1fr; gap: 0.6rem; padding: 0.55rem 0.4rem; border-bottom: 1px solid #f2f2f2; font-size: 0.9rem; cursor: pointer; align-items: baseline; }
.recent-row:hover { background: #fffaf8; }
.r-co { font-weight: 700; color: #333; }
.r-prod { color: #555; }
.r-auth { color: #888; font-size: 0.85rem; }
.notes { margin-top: 2.5rem; background: #fafafa; border-radius: 12px; padding: 1.25rem 1.5rem; }
.notes ul { margin: 0; padding-left: 1.2rem; line-height: 1.85; color: #555; font-size: 0.93rem; }
.notes a { color: #e04e2d; }

@media (max-width: 640px) {
  .hero h1 { font-size: 1.6rem; }
  .recent-row { grid-template-columns: 1fr; gap: 0.1rem; }
  .case dl { grid-template-columns: 1fr; }
  .case dt { margin-top: 0.3rem; }
}
</style>
