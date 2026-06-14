<template>
  <main class="admin-page">
    <div class="admin-header">
      <h1>文章管理後台</h1>
      <router-link to="/admin/blog/new" class="new-btn">+ 新增文章</router-link>
    </div>

    <div v-if="loading" class="loading">載入中...</div>

    <table v-else class="article-table">
      <thead>
        <tr>
          <th>標題</th>
          <th>狀態</th>
          <th>建立日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in articles" :key="a.id">
          <td>{{ a.title }}</td>
          <td>
            <span :class="['status-badge', a.published ? 'published' : 'draft']">
              {{ a.published ? '已發佈' : '草稿' }}
            </span>
          </td>
          <td>{{ formatDate(a.created_at) }}</td>
          <td class="actions">
            <router-link :to="`/admin/blog/${a.id}`" class="edit-btn">編輯</router-link>
            <button @click="deleteArticle(a.id, a.title)" class="delete-btn">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && articles.length === 0" class="empty">
      尚無文章，<router-link to="/admin/blog/new">新增第一篇</router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const router = useRouter()
const articles = ref([])
const loading = ref(true)

// 未登入則擋回登入頁
if (!localStorage.getItem('token')) {
  router.push('/login')
}

onMounted(async () => {
  const { data } = await supabase
    .from('articles')
    .select('id, title, published, created_at')
    .order('created_at', { ascending: false })

  articles.value = data || []
  loading.value = false
})

async function deleteArticle(id, title) {
  if (!confirm(`確定要刪除「${title}」？`)) return
  await supabase.from('articles').delete().eq('id', id)
  articles.value = articles.value.filter(a => a.id !== id)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('zh-TW')
}
</script>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.admin-header h1 {
  font-size: 1.5rem;
  color: #333;
}
.new-btn {
  background: #ff5733;
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
}
.new-btn:hover { background: #e04e2d; }
.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #999;
}
.empty a { color: #ff5733; }
.article-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.article-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid #eee;
  color: #666;
  font-weight: 600;
}
.article-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}
.status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
}
.status-badge.published { background: #d4edda; color: #155724; }
.status-badge.draft     { background: #fff3cd; color: #856404; }
.actions { display: flex; gap: 0.5rem; }
.edit-btn {
  padding: 0.3rem 0.75rem;
  background: #f0f0f0;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.85rem;
}
.edit-btn:hover { background: #e0e0e0; }
.delete-btn {
  padding: 0.3rem 0.75rem;
  background: #fff0f0;
  color: #c00;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.delete-btn:hover { background: #ffe0e0; }
</style>
