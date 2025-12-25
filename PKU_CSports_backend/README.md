# PKU-CSports 后端服务

校园体育赛事助手后端 API 服务。

## 快速开始

### 1. 环境要求

- Node.js >= 14.0.0
- PostgreSQL >= 12.0

### 2. 安装依赖

```bash
npm install
```

### 3. 配置数据库

#### 方式一：使用环境变量（推荐）

创建 `.env` 文件：

```env
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=your_password
PG_DATABASE=csports_db
PG_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

#### 方式二：直接修改配置文件

编辑 `src/config/db.js`，修改数据库连接信息。

### 4. 初始化数据库

#### 首次运行（新数据库）

```bash
# 创建数据库（如果不存在）
createdb csports_db

# 执行 schema 创建所有表
psql -U postgres -d csports_db -f db/schema.sql
```

#### 已有数据库（添加 media 字段）

如果数据库已存在但没有 `media` 字段，执行：

```bash
psql -U postgres -d csports_db -f db/migrate_add_media.sql
```

### 5. 初始化测试数据（可选）

```bash
node scripts/seed.js
```

这会创建：
- 测试用户：`testuser` / `123456` (普通用户)
- 协会用户：`assoc` / `123456` (协会用户，可发布内容)
- 示例球队、球员、赛程、帖子等数据

### 6. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务默认运行在 `http://localhost:3000`

## API 文档

### 认证

大部分 API 需要 Bearer Token 认证（登录后获取）。

### 主要接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/news` - 获取资讯列表
- `POST /api/news` - 创建资讯（需要协会/管理员权限）
- `GET /api/news/:id` - 获取资讯详情
- `POST /api/upload` - 上传文件（图片/视频）
- `GET /api/matches` - 获取赛程列表
- `GET /api/standings` - 获取积分榜

详细 API 文档请参考 `API_DOC.md`

## 文件上传

上传的文件存储在 `uploads/` 目录，通过 `/uploads/:filename` 访问。

**注意**：确保 `uploads/` 目录存在且有写入权限。

## 数据库结构

主要表：
- `users` - 用户表
- `teams` - 球队表
- `players` - 球员表
- `matches` - 赛程表
- `posts` - 资讯/帖子表（包含 `media` JSONB 字段存储多媒体）
- `comments` - 评论表

完整结构见 `db/schema.sql`

## 开发

### 运行测试

```bash
# 单元测试
npm run test:unit

# API 测试
npm run test:api

# 集成测试
npm run test:integration
```

### 代码结构

```
src/
├── api/          # 路由定义
├── controllers/  # 控制器
├── services/     # 业务逻辑
├── middleware/   # 中间件
├── config/       # 配置文件
└── utils/        # 工具函数
```

## 常见问题

### 1. 数据库连接失败

检查：
- PostgreSQL 服务是否运行
- 数据库连接信息是否正确
- 数据库是否存在

### 2. `column "media" does not exist` 错误

说明 `posts` 表缺少 `media` 字段，执行：

```bash
psql -U postgres -d csports_db -f db/migrate_add_media.sql
```

### 3. 文件上传失败

检查：
- `uploads/` 目录是否存在
- 目录是否有写入权限
- 文件大小是否超过 50MB 限制

## License

ISC



