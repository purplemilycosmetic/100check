/**
 * ════════════════════════════════════════════════════════════
 *  台灣禁用／限用化粧品成分 — 資料匯入腳本
 *  scripts/sync-restricted-ingredients.mjs
 * ════════════════════════════════════════════════════════════
 *
 *  跟舊版不同：這支腳本不是去食藥署網站即時抓資料，而是讀取
 *  data/restricted-ingredients-seed.json 這個「已經整理好的資料檔」，
 *  寫進 Supabase 的 restricted_ingredients 表。
 *
 *  為什麼改成這樣：食藥署的禁用／限用成分表是用 PDF 公告發布的，
 *  不是每一張都有穩定可用的開放資料 API。這份 JSON 是直接從官方
 *  公告 PDF 裡完整解析出來的，資料來源：
 *  - 化粧品禁止使用成分表（660 筆）
 *  - 化粧品成分使用限制表－一般限制（190 筆）
 *  - 化粧品防曬劑成分使用限制表（27 筆）
 *  - 化粧品色素成分使用限制表（152 筆）
 *
 *  ⚠️ 目前沒有「化粧品防腐劑成分名稱及使用限制表」的資料，因為上次
 *  收到的官方 PDF 裡這張表被誤放成防曬劑表的重複檔。麻煩之後補傳
 *  正確的防腐劑限制表 PDF，我再幫你解析加進來。
 *
 *  之後每次食藥署發布新公告、你重新整理好資料，就是「更新
 *  data/restricted-ingredients-seed.json 這個檔案 → push 上 GitHub」，
 *  這支腳本就會自動重新把 Supabase 的資料表清空重寫成最新版本。
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
  const seedPath = path.join(__dirname, '..', 'data', 'restricted-ingredients-seed.json')
  console.log(`📂 讀取資料檔：${seedPath}`)

  const raw = readFileSync(seedPath, 'utf-8')
  const rows = JSON.parse(raw)
  console.log(`📋 共 ${rows.length} 筆資料`)

  if (rows.length === 0) {
    console.log('⚠️ 資料檔是空的，不清空現有資料表。')
    return
  }

  console.log('🗑️ 清空舊資料...')
  const { error: delError } = await supabase.from('restricted_ingredients').delete().neq('id', 0)
  if (delError) throw new Error(`清空舊資料失敗：${delError.message}`)

  const BATCH = 500
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('restricted_ingredients').insert(batch)
    if (error) throw new Error(`寫入第 ${Math.floor(i / BATCH) + 1} 批失敗：${error.message}`)
    console.log(`   已寫入 ${Math.min(i + BATCH, rows.length)} / ${rows.length} 筆`)
  }

  console.log(`✅ 完成！已寫入 ${rows.length} 筆資料到 Supabase。`)
}

main().catch((err) => {
  console.error('❌ 執行失敗：', err)
  process.exit(1)
})
