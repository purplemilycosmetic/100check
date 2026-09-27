<template>
  <main class="dict-page">
    <section class="hero">
      <h1>保養品成分字典</h1>
      <p class="subtitle">查詢常見保養品成分的功效、原理與注意事項</p>
    </section>

    <div class="disclaimer-banner">
      ⚠️ 本頁內容由 AI 根據公開、廣為人知的保養品科學知識撰寫，<strong>非逐一查證之學術文獻整理</strong>，
      僅供初步了解參考，不能取代正式的成分安全評估或醫療建議。詳細資料、最新研究與個別產品的實際配方，
      請自行查閱驗證或諮詢專業人員。
    </div>

    <section class="search-section">
      <input
        v-model.trim="query"
        type="text"
        class="search-input"
        placeholder="搜尋成分中文名或英文名，例：菸鹼醯胺、Niacinamide"
      />
    </section>

    <section class="result-section">
      <p class="result-count">共 {{ filtered.length }} 筆成分{{ query ? '（搜尋結果）' : '' }}</p>

      <div v-if="loadError" class="error-text">⚠ 載入失敗：{{ loadError }}</div>

      <div v-for="item in filtered" :key="item.id" class="ing-card">
        <div class="ing-header" @click="item.expanded = !item.expanded">
          <div>
            <span class="ing-name-zh">{{ item.name_zh }}</span>
            <span class="ing-name-en">{{ item.name_en }}</span>
          </div>
          <span class="ing-category">{{ item.category }}</span>
        </div>
        <p class="ing-summary">{{ item.summary }}</p>

        <div v-if="item.expanded" class="ing-detail">
          <h4>詳細說明</h4>
          <p>{{ item.content }}</p>

          <h4 v-if="item.cautions">注意事項</h4>
          <p v-if="item.cautions">{{ item.cautions }}</p>

          <h4 v-if="item.suitable_for">適合族群</h4>
          <p v-if="item.suitable_for">{{ item.suitable_for }}</p>

          <p class="ai-tag">🤖 本段內容為 AI 生成，僅供參考，請自行查閱驗證</p>
        </div>
        <button class="toggle-btn" @click="item.expanded = !item.expanded">
          {{ item.expanded ? '收合 ▲' : '查看詳情 ▼' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'

useHead({
  title: '保養品成分字典 - 審盾橘',
  meta: [
    { name: 'description', content: '查詢常見保養品成分的功效、原理與注意事項，AI 整理生成內容，僅供初步參考。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/ingredients-dictionary' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/ingredients-dictionary' }],
})

const query = ref('')
const items = ref([])
const loadError = ref('')

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('ingredients_dictionary')
      .select('*')
      .order('name_zh', { ascending: true })
    if (error) throw error
    items.value = (data || []).map((r) => ({ ...r, expanded: false }))
  } catch (err) {
    loadError.value = err.message
  }
})

const filtered = computed(() => {
  if (!query.value) return items.value
  const q = query.value.toLowerCase()
  return items.value.filter(
    (item) =>
      (item.name_zh && item.name_zh.includes(query.value)) ||
      (item.name_en && item.name_en.toLowerCase().includes(q))
  )
})
</script>

<style scoped>
.dict-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}
.hero {
  text-align: center;
  padding: 1.5rem 0 1.5rem;
}
.hero h1 {
  font-size: 1.8rem;
  color: #ff5733;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #666;
}
.disclaimer-banner {
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 0.9rem 1.1rem;
  font-size: 0.85rem;
  color: #7d6608;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.search-section {
  margin-bottom: 1.5rem;
}
.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.9rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}
.result-count {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
.error-text {
  color: #d84315;
}
.ing-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  background: #fafafa;
}
.ing-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  cursor: pointer;
}
.ing-name-zh {
  font-weight: 700;
  color: #333;
  margin-right: 0.5rem;
}
.ing-name-en {
  font-size: 0.85rem;
  color: #999;
}
.ing-category {
  font-size: 0.75rem;
  background: #fff3e0;
  color: #e65100;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
}
.ing-summary {
  margin: 0.5rem 0 0;
  color: #555;
  font-size: 0.9rem;
}
.ing-detail {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}
.ing-detail h4 {
  margin: 0.75rem 0 0.3rem;
  font-size: 0.85rem;
  color: #ff5733;
}
.ing-detail p {
  margin: 0;
  font-size: 0.9rem;
  color: #444;
  line-height: 1.7;
}
.ai-tag {
  margin-top: 0.75rem !important;
  font-size: 0.75rem !important;
  color: #aaa !important;
}
.toggle-btn {
  margin-top: 0.6rem;
  background: none;
  border: none;
  color: #ff5733;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
</style>
