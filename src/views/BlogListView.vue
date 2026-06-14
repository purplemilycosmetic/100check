<template>
  <main class="blog-list-page">
    <section class="blog-hero">
      <h1>化妝品法規專欄</h1>
      <p>每週更新｜化粧品廣告合規、PIF 建檔、安全評估知識分享</p>
    </section>

    <section class="articles">
      <div v-if="loading" class="loading">載入中...</div>
      <div v-else-if="articles.length === 0" class="empty">目前尚無文章</div>

      <div v-else class="article-grid">
        <router-link
          v-for="a in articles"
          :key="a.id"
          :to="`/blog/${a.slug}`"
          class="article-card"
        >
          <img v-if="a.cover_image" :src="a.cover_image" :alt="a.title" class="card-cover" />
          <div class="card-cover placeholder" v-else></div>
          <div class="card-body">
            <span class="card-date">{{ formatDate(a.created_at) }}</span>
            <h2 class="card-title">{{ a.title }}</h2>
            <p class="card-summary">{{ a.summary }}</p>
            <span class="read-more">閱讀全文 →</span>
          </div>
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { supabase } from '@/supabaseClient'

useHead({
  title: '化妝品法規專欄｜化粧品廣告合規知識 - 審盾橘',
  meta: [
    { name: 'description', content: '審盾橘每週分享化妝品（化粧品）廣告法規、PIF 建檔、安全評估等專業知識，幫助品牌了解合規要求。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/blog' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.aicheck.com.tw/blog' }],
})

const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, summary, cover_image, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  articles.value = data || []
  loading.value = false
})

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.blog-list-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}
.blog-hero {
  text-align: center;
  padding: 2rem 0 3rem;
}
.blog-hero h1 {
  font-size: 2rem;
  color: #ff5733;
  margin-bottom: 0.5rem;
}
.blog-hero p {
  color: #666;
}
.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #999;
}
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.article-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: box-shadow 0.2s;
}
.article-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.card-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.card-cover.placeholder {
  background: #f5f5f5;
}
.card-body {
  padding: 1rem;
}
.card-date {
  font-size: 0.8rem;
  color: #999;
}
.card-title {
  font-size: 1.1rem;
  color: #222;
  margin: 0.4rem 0 0.5rem;
  line-height: 1.4;
}
.card-summary {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.read-more {
  font-size: 0.85rem;
  color: #ff5733;
}
</style>
