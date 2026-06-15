/**
 * ════════════════════════════════════════════════════════════
 *  Prerender 腳本（支援 Vite 6 / Vue 3.5）
 *  scripts/prerender.mjs
 * ════════════════════════════════════════════════════════════
 *
 *  做什麼：build 完後，用無頭瀏覽器打開每個行銷頁，
 *  等 Vue 渲染完成，把「完整 HTML」存回 dist/，
 *  讓 Google 爬蟲不靠 JS 就能讀到內容。
 *
 *  只處理「內容固定的行銷頁」。
 *  部落格文章（動態）不在此處理，靠 sitemap + 之後的 ISR。
 *
 *  執行：vite build 之後自動跑（已寫進 package.json）
 */

import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '../dist')
const PORT = 4173

// ─── 要預渲染的行銷頁（內容固定的才放這） ───
// 注意：用實際 router 路徑。動態頁（/blog/:slug）不放。
const ROUTES = [
  '/',
  '/pif',          // PIFLandingView（landing 頁）
  '/PIF',          // PIFView（詳細內容頁）
  '/services',
  '/plan',
  '/ai-audit',
  '/about',
  '/blog',         // 部落格列表頁（列表本身可預渲染，個別文章不行）
]

// ─── 簡易靜態檔 server（跑 dist/） ───
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        let urlPath = decodeURIComponent(req.url.split('?')[0])
        let filePath = join(DIST, urlPath)

        // 有副檔名 → 當靜態資源；沒有 → SPA 一律回 index.html
        if (extname(urlPath) === '') {
          filePath = join(DIST, 'index.html')
        }
        if (!existsSync(filePath)) {
          filePath = join(DIST, 'index.html')
        }

        const data = await readFile(filePath)
        const ext = extname(filePath)
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
        res.end(data)
      } catch (e) {
        res.writeHead(500)
        res.end('error')
      }
    })
    server.listen(PORT, () => resolve(server))
  })
}

async function prerender() {
  if (!existsSync(DIST)) {
    console.error('✗ 找不到 dist/，請先跑 vite build')
    process.exit(1)
  }

  const server = await startServer()
  console.log(`✓ 本地 server 啟動於 :${PORT}`)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let ok = 0
  for (const route of ROUTES) {
    const page = await browser.newPage()
    try {
      const url = `http://localhost:${PORT}${route}`
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

      // 等 Vue app 實際掛上內容（#app 裡有東西才算渲染好）
      await page.waitForFunction(
        () => {
          const app = document.querySelector('#app')
          return app && app.innerHTML.trim().length > 100
        },
        { timeout: 15000 }
      ).catch(() => {
        console.warn(`  ⚠ ${route} 等待渲染逾時，仍存出目前狀態`)
      })

      const html = await page.content()

      // 決定存檔路徑：/ → dist/index.html，/pif → dist/pif/index.html
      const outDir = route === '/' ? DIST : join(DIST, route)
      await mkdir(outDir, { recursive: true })
      await writeFile(join(outDir, 'index.html'), html, 'utf-8')

      console.log(`  ✓ 預渲染 ${route}`)
      ok++
    } catch (e) {
      console.error(`  ✗ ${route} 失敗：${e.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  server.close()
  console.log(`\n✓ 完成：${ok}/${ROUTES.length} 頁已預渲染`)
}

prerender().catch((err) => {
  console.error('✗ prerender 失敗：', err)
  process.exit(1)
})
