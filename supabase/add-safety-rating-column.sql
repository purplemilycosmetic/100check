-- ════════════════════════════════════════════════════════════
-- 成分字典加上「安心度」星級欄位
-- 請到 Supabase 專案 → SQL Editor → 貼上執行一次即可
-- ════════════════════════════════════════════════════════════

alter table ingredients_dictionary
  add column if not exists safety_rating smallint;

comment on column ingredients_dictionary.safety_rating is
  '成分安心度星級（1-5），5 代表安全性最高、致敏性最低，1 代表需特別留意的爭議成分';
