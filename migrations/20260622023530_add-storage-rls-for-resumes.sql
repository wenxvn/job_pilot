-- 存储 RLS 策略：用户只能访问 resumes 桶中以自己 user_id 开头的文件
-- 文件路径格式：{user_id}/{filename}

-- 启用 RLS（如尚未启用）
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 查看：用户可查看自己上传的文件
CREATE POLICY "users can read own resume files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket = 'resumes'
    AND key LIKE (SELECT auth.uid())::text || '/%'
  );

-- 上传：用户只能上传到自己的路径
CREATE POLICY "users can upload own resume files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket = 'resumes'
    AND key LIKE (SELECT auth.uid())::text || '/%'
  );

-- 删除：用户只能删除自己的文件
CREATE POLICY "users can delete own resume files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'resumes'
    AND key LIKE (SELECT auth.uid())::text || '/%'
  );
