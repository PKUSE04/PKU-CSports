# 数据库迁移指南

## 问题说明

如果遇到以下错误：
```
error: relation "likes" does not exist
error: relation "favorites" does not exist
error: relation "follows" does not exist
error: relation "team_accounts" does not exist
```

说明数据库缺少新添加的社交功能相关表。

## 解决方案

### 方法一：执行迁移脚本（推荐，适用于已有数据库）

如果你已经有数据，不想重新创建数据库，执行迁移脚本：

```bash
# 在 WSL 或 Linux 环境下
psql -U postgres -d csports_db -f db/migrate_add_social_features.sql

# 或者在 Windows 下使用完整路径
psql -U postgres -d csports_db -f PKU_CSports_backend/db/migrate_add_social_features.sql
```

### 方法二：重新执行完整 schema（适用于新数据库或可清空数据）

如果数据库是新的或者可以清空数据，直接执行完整的 schema：

```bash
psql -U postgres -d csports_db -f db/schema.sql
```

### 方法三：手动执行 SQL

如果上述方法都不行，可以手动连接到数据库并执行以下 SQL：

```sql
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
```

## 验证迁移是否成功

执行以下 SQL 检查表是否创建成功：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('follows', 'favorites', 'likes', 'team_accounts');
```

应该返回 4 行数据。

## 迁移后操作

迁移完成后，重启后端服务：

```bash
# 如果使用 nodemon
npm run dev

# 或者直接启动
npm start
```

## 注意事项

- 迁移脚本使用 `CREATE TABLE IF NOT EXISTS`，可以安全地重复执行
- 如果表已存在，不会报错，只是跳过创建
- 索引也会检查是否存在，不会重复创建

