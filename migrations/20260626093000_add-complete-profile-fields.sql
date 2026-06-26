-- profiles 表：补全个人资料页面所需字段
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS education JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS job_preferences JSONB NOT NULL DEFAULT '{
    "work_type": "",
    "remote_preference": "",
    "preferred_locations": [],
    "industries": []
  }'::jsonb;
