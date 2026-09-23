-- ════════════════════════════════════════════════════════════
-- 每週自動監控/寫文章系統 — Supabase 資料表設定
-- 請到 Supabase 專案 → SQL Editor → 貼上整段執行一次即可
-- ════════════════════════════════════════════════════════════

-- 記錄「已經處理過的來源項目」，避免同一則公告/新聞被重複寫成文章
create table if not exists source_log (
  id bigint generated always as identity primary key,
  source_url text unique not null,      -- 來源網址（拿來去重複用）
  source_name text not null,            -- 來源名稱，例如 'TFDA公告'、'TFDA裁罰'、'國際法規'、'台灣新聞'
  title text,
  seen_at timestamptz default now()
);

create index if not exists source_log_source_name_idx on source_log (source_name);

-- 如果你的 articles 表還沒有 refs 欄位（存參考資料連結），保險起見補上
alter table articles add column if not exists refs jsonb default '[]'::jsonb;

-- 如果 articles 表還沒有 published 欄位的預設值，保險起見設定一下
alter table articles alter column published set default false;
