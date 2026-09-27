<template>
  <main class="restricted-page">
    <section class="hero">
      <h1>台灣禁用／限用成分查詢</h1>
      <p class="subtitle">輸入成分中文名、INCI 名稱或 CAS 號碼，查詢是否為食藥署公告禁止或限制使用之成分</p>
    </section>

    <section class="search-section">
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

    <section v-if="searched" class="result-section">
      <p v-if="loadError" class="error-text">⚠ 查詢失敗：{{ loadError }}</p>

      <template v-else>
        <p class="result-count">共找到 {{ results.length }} 筆相關資料</p>

        <div v-if="results.length === 0" class="empty-hint">
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
      </template>
    </section>

    <p class="source-note">
      資料來源：衛福部食藥署開放資料平台（禁止使用成分表、成分使用限制表、防腐劑／防曬劑／色素成分限制表）。
      資料為不定期更新，正式送審請以食藥署最新公告為準。
    </p>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'

useHead({
  title: '台灣禁用／限用成分查詢 - 審盾橘',
  meta: [
    { name: 'description', content: '查詢化粧品成分是否為台灣食藥署公告禁止使用或限制使用之成分，涵蓋一般限制、防腐劑、防曬劑、色素成分表。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/restricted-ingredients' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/restricted-ingredients' }],
})

const query = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const loadError = ref('')

function cardClass(category) {
  return category === '禁止使用成分' ? 'danger' : 'warning'
}

async function search() {
  if (!query.value) return
  loading.value = true
  searched.value = true
  loadError.value = ''
  try {
    const q = `%${query.value}%`
    const { data, error } = await supabase
      .from('restricted_ingredients')
      .select('*')
      .or(`name.ilike.${q},inci_name.ilike.${q},cas_no.ilike.${q}`)
      .order('category', { ascending: true })
      .limit(200)
    if (error) throw error
    results.value = data || []
  } catch (err) {
    loadError.value = err.message
    results.value = []
  } finally {
    loading.value = false
  }
}
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
