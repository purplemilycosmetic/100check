/**
 * ════════════════════════════════════════════════════════════
 *  成分字典 — 資料匯入腳本
 *  scripts/seed-ingredients-dictionary.mjs
 * ════════════════════════════════════════════════════════════
 *
 *  讀取 data/ingredient-dictionary-seed.json，寫進 Supabase 的
 *  ingredients_dictionary 表（清空重寫）。
 *
 *  這份資料是 AI 根據公開、廣為人知的保養品成分科學知識撰寫，
 *  不是逐字翻譯自任何特定網站，但仍建議之後找機會請專業人員
 *  複核內容正確性。之後想新增/修改成分，就是編輯這個 JSON 檔案，
 *  重新 push 上去，Actions 會自動重新匯入。
 *
 *  需要的環境變數（GitHub Secrets，跟其他腳本共用）：
 *  - SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 缺少必要的環境變數：SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  const seedPath = path.join(__dirname, '..', 'data', 'ingredient-dictionary-seed.json')
  console.log(`📂 讀取資料檔：${seedPath}`)

  const raw = readFileSync(seedPath, 'utf-8')
  const rows = JSON.parse(raw).map((r) => ({ ...r, ai_generated: true }))
  console.log(`📋 共 ${rows.length} 筆資料`)

  console.log('🗑️ 清空舊資料...')
  const { error: delError } = await supabase.from('ingredients_dictionary').delete().neq('id', 0)
  if (delError) throw new Error(`清空舊資料失敗：${delError.message}`)

  const { error } = await supabase.from('ingredients_dictionary').insert(rows)
  if (error) throw new Error(`寫入失敗：${error.message}`)

  console.log(`✅ 完成！已寫入 ${rows.length} 筆資料到 Supabase。`)
}

main().catch((err) => {
  console.error('❌ 執行失敗：', err)
  process.exit(1)
})
