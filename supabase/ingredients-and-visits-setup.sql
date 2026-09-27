-- ════════════════════════════════════════════════════════════
-- 成分字典 — Supabase 資料表設定
-- 請到 Supabase 專案 → SQL Editor → 貼上整段執行一次即可
-- ════════════════════════════════════════════════════════════

create table if not exists ingredients_dictionary (
  id bigint generated always as identity primary key,
  name_zh text,
  name_en text,
  category text,
  summary text,
  content text,
  cautions text,
  suitable_for text,
  ai_generated boolean default true,
  created_at timestamptz default now()
);

create index if not exists ingredients_dictionary_name_zh_idx on ingredients_dictionary (name_zh);
create index if not exists ingredients_dictionary_name_en_idx on ingredients_dictionary (name_en);

-- 訪客流量計數（首頁「今日／累計造訪人次」小工具用）
create table if not exists site_visits (
  id bigint generated always as identity primary key,
  visited_at timestamptz default now()
);

create index if not exists site_visits_visited_at_idx on site_visits (visited_at);
