<template>
  <main class="edit-page">
    <div class="edit-header">
      <router-link to="/admin/blog" class="back-link">← 返回列表</router-link>
      <h1>{{ isNew ? '新增文章' : '編輯文章' }}</h1>
    </div>

    <form @submit.prevent="save" class="edit-form">

      <!-- 標題 -->
      <div class="field">
        <label>標題 *</label>
        <input v-model="form.title" @input="autoSlug" type="text" required placeholder="文章標題" />
      </div>

      <!-- Slug -->
      <div class="field">
        <label>網址 slug *</label>
        <div class="slug-preview">
          <span class="slug-base">aicheck.com.tw/blog/</span>
          <input v-model="form.slug" type="text" required placeholder="article-slug" />
        </div>
      </div>

      <!-- 摘要 -->
      <div class="field">
        <label>摘要 <small>（顯示在列表卡片，建議 80–120 字）</small></label>
        <textarea v-model="form.summary" rows="3" placeholder="一段簡短說明..."></textarea>
      </div>

      <!-- 封面圖 -->
      <div class="field">
        <label>封面圖網址</label>
        <input v-model="form.cover_image" type="url" placeholder="https://..." />
        <img v-if="form.cover_image" :src="form.cover_image" class="cover-preview" alt="封面預覽" />
      </div>

      <!-- 正文（Markdown） -->
      <div class="field">
        <div class="content-tabs">
          <label>正文內容 <small>（支援 Markdown）</small></label>
          <button type="button" @click="showPreview = !showPreview" class="preview-toggle">
            {{ showPreview ? '關閉預覽' : '預覽' }}
          </button>
        </div>
        <textarea
          v-if="!showPreview"
          v-model="form.content"
          rows="18"
          placeholder="## 小標題&#10;&#10;段落內文...&#10;&#10;![圖片說明](圖片網址)&#10;&#10;**粗體** *斜體*"
          class="content-editor"
        ></textarea>
        <div v-else class="content-preview" v-html="previewHtml"></div>
      </div>

      <!-- 參考資料 -->
      <div class="field">
        <label>參考資料</label>
        <div v-for="(ref, i) in form.refs" :key="i" class="ref-row">
          <input v-model="ref.title" type="text" placeholder="資料名稱" />
          <input v-model="ref.url" type="url" placeholder="https://..." />
          <button type="button" @click="removeRef(i)" class="remove-ref">✕</button>
        </div>
        <button type="button" @click="addRef" class="add-ref-btn">+ 新增參考資料</button>
      </div>

      <!-- 發佈狀態 -->
      <div class="field field-row">
        <label class="toggle-label">
          <input type="checkbox" v-model="form.published" />
          <span>立即發佈</span>
        </label>
        <small v-if="!form.published" style="color:#999">儲存為草稿，不會公開顯示</small>
        <small v-else style="color:#27ae60">儲存後會立即公開</small>
      </div>

      <!-- 操作按鈕 -->
      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="saving">
          {{ saving ? '儲存中...' : '儲存' }}
        </button>
        <router-link to="/admin/blog" class="cancel-btn">取消</router-link>
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

    </form>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { supabase } from '@/supabaseClient'

const route = useRoute()
const router = useRouter()

// 未登入則擋回
if (!localStorage.getItem('token')) {
  router.push('/login')
}

const isNew = route.params.id === undefined
const saving = ref(false)
const errorMsg = ref('')
const showPreview = ref(false)

const form = ref({
  title: '',
  slug: '',
  summary: '',
  cover_image: '',
  content: '',
  refs: [],
  published: false,
})

// 載入現有文章（編輯模式）
onMounted(async () => {
  if (!isNew) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (data) {
      form.value = { ...data, refs: data.refs || [] }
    }
  }
})

// 標題自動產生 slug
function autoSlug() {
  if (!isNew) return
  form.value.slug = form.value.title
    .toLowerCase()
    .replace(/[\s一-鿿]+/g, '-')   // 中文/空白 → -
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// 參考資料
function addRef() { form.value.refs.push({ title: '', url: '' }) }
function removeRef(i) { form.value.refs.splice(i, 1) }

// Markdown 預覽
const previewHtml = computed(() => marked(form.value.content || ''))

// 儲存
async function save() {
  saving.value = true
  errorMsg.value = ''

  const payload = {
    title: form.value.title,
    slug: form.value.slug,
    summary: form.value.summary,
    cover_image: form.value.cover_image,
    content: form.value.content,
    refs: form.value.refs.filter(r => r.title || r.url),
    published: form.value.published,
    updated_at: new Date().toISOString(),
  }

  let error
  if (isNew) {
    ;({ error } = await supabase.from('articles').insert(payload))
  } else {
    ;({ error } = await supabase.from('articles').update(payload).eq('id', route.params.id))
  }

  saving.value = false

  if (error) {
    errorMsg.value = `儲存失敗：${error.message}`
  } else {
    router.push('/admin/blog')
  }
}
</script>

<style scoped>
.edit-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}
.edit-header {
  margin-bottom: 1.5rem;
}
.edit-header h1 {
  font-size: 1.5rem;
  color: #333;
  margin-top: 0.5rem;
}
.back-link {
  color: #ff5733;
  text-decoration: none;
  font-size: 0.9rem;
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.4rem;
}
.field label small {
  font-weight: 400;
  color: #999;
}
.field input[type="text"],
.field input[type="url"],
.field textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.95rem;
  box-sizing: border-box;
  font-family: inherit;
}
.field textarea:focus,
.field input:focus {
  outline: none;
  border-color: #ff5733;
}
.slug-preview {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}
.slug-base {
  background: #f5f5f5;
  padding: 0.6rem 0.75rem;
  color: #999;
  font-size: 0.85rem;
  white-space: nowrap;
  border-right: 1px solid #ddd;
}
.slug-preview input {
  border: none;
  border-radius: 0;
  flex: 1;
}
.slug-preview input:focus {
  outline: none;
  border-color: transparent;
}
.cover-preview {
  margin-top: 0.5rem;
  max-height: 160px;
  border-radius: 6px;
  object-fit: cover;
}
.content-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}
.preview-toggle {
  background: #f0f0f0;
  border: none;
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.preview-toggle:hover { background: #e0e0e0; }
.content-editor {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
}
.content-preview {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  min-height: 300px;
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
}
.content-preview :deep(h2) { color: #ff5733; }
.content-preview :deep(img) { max-width: 100%; }
.ref-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.ref-row input { flex: 1; }
.remove-ref {
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.3rem;
}
.add-ref-btn {
  background: none;
  border: 1px dashed #ccc;
  color: #666;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
.add-ref-btn:hover { border-color: #ff5733; color: #ff5733; }
.field-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}
.toggle-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.save-btn {
  background: #ff5733;
  color: white;
  border: none;
  padding: 0.7rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}
.save-btn:hover { background: #e04e2d; }
.save-btn:disabled { background: #ccc; cursor: not-allowed; }
.cancel-btn {
  color: #666;
  text-decoration: none;
}
.error-msg {
  color: #c00;
  font-size: 0.9rem;
}
</style>
