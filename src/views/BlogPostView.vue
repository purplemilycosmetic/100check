<template>
  <main class="blog-post-page">
    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="!article" class="not-found">找不到這篇文章</div>

    <template v-else>
      <article>
        <header class="post-header">
          <p class="post-date">{{ formatDate(article.created_at) }}</p>
          <h1>{{ article.title }}</h1>
          <p class="post-summary">{{ article.summary }}</p>
          <img v-if="article.cover_image" :src="article.cover_image" :alt="article.title" class="post-cover" />
        </header>

        <div class="post-content" v-html="renderedContent"></div>

        <footer v-if="article.refs && article.refs.length" class="post-refs">
          <h2>參考資料</h2>
          <ul>
            <li v-for="(ref, i) in article.refs" :key="i">
              <a v-if="ref.url" :href="ref.url" target="_blank" rel="noopener noreferrer">{{ ref.label }}</a>
              <span v-else>{{ ref.label }}</span>
            </li>
          </ul>
        </footer>
      </article>

      <div class="back-link">
        <router-link to="/blog">← 返回專欄列表</router-link>
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { marked } from 'marked'
import { supabase } from '@/supabaseClient'

const route = useRoute()
const article = ref(null)
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', route.params.slug)
    .eq('published', true)
    .single()

  article.value = data || null
  loading.value = false
})

const renderedContent = computed(() =>
  article.value ? marked(article.value.content || '') : ''
)

useHead(computed(() => ({
  title: article.value ? `${article.value.title} - 審盾橘專欄` : '文章 - 審盾橘',
  meta: [
    { name: 'description', content: article.value?.summary || '' },
    { property: 'og:title', content: article.value ? `${article.value.title} - 審盾橘` : '審盾橘' },
    { property: 'og:description', content: article.value?.summary || '' },
    { property: 'og:image', content: article.value?.cover_image || 'https://www.aicheck.com.tw/og-image.png' },
  ],
})))

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.blog-post-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}
.loading, .not-found {
  text-align: center;
  padding: 3rem;
  color: #999;
}
.post-header {
  margin-bottom: 2rem;
}
.post-date {
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}
.post-header h1 {
  font-size: 2rem;
  color: #222;
  line-height: 1.3;
  margin-bottom: 0.75rem;
}
.post-summary {
  font-size: 1.05rem;
  color: #555;
  border-left: 3px solid #ff5733;
  padding-left: 1rem;
  margin-bottom: 1.5rem;
}
.post-cover {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.post-content {
  font-size: 1.05rem;
  color: #333;
  line-height: 1.9;
}
.post-content :deep(h2) { font-size: 1.4rem; color: #ff5733; margin: 2rem 0 0.75rem; }
.post-content :deep(h3) { font-size: 1.15rem; color: #444; margin: 1.5rem 0 0.5rem; }
.post-content :deep(img) { max-width: 100%; border-radius: 6px; margin: 1rem 0; }
.post-content :deep(a) { color: #ff5733; }
.post-content :deep(ul), .post-content :deep(ol) { padding-left: 1.5rem; }
.post-content :deep(blockquote) { border-left: 3px solid #ff5733; padding-left: 1rem; color: #666; }
.post-refs {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}
.post-refs h2 {
  font-size: 1rem;
  color: #888;
  margin-bottom: 0.75rem;
}
.post-refs ul {
  padding-left: 1.25rem;
}
.post-refs li {
  margin-bottom: 0.4rem;
}
.post-refs a {
  color: #ff5733;
  font-size: 0.9rem;
}
.back-link {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
.back-link a {
  color: #ff5733;
  text-decoration: none;
}
</style>
