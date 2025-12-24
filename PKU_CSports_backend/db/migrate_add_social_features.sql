-- 为已有数据库添加社交功能相关表的迁移脚本
-- 包括：关注表、收藏表、点赞表、队伍账号关联表
-- 仅适用于已存在的数据库，新数据库请直接使用 schema.sql

-- 创建关注表
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 创建队伍账号关联表
CREATE TABLE IF NOT EXISTS team_accounts (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_post ON favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_team_accounts_team ON team_accounts(team_id);
CREATE INDEX IF NOT EXISTS idx_team_accounts_user ON team_accounts(user_id);

-- 输出成功信息
DO $$
BEGIN
    RAISE NOTICE '✓ 社交功能相关表已创建完成';
    RAISE NOTICE '  - follows (关注表)';
    RAISE NOTICE '  - favorites (收藏表)';
    RAISE NOTICE '  - likes (点赞表)';
    RAISE NOTICE '  - team_accounts (队伍账号关联表)';
    RAISE NOTICE '✓ 相关索引已创建';
END $$;

