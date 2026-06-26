-- profiles 表：保存个人资料完成度派生状态
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_complete BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS completion_percentage INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS missing_fields JSONB NOT NULL DEFAULT '[]'::jsonb;
