# 🏆 校园体育赛事数据平台 (PKU-CSports)

## 🌟 简介

本项目旨在构建一个集资讯、数据、社区和工具于一体的校园体育生态平台，解决传统校园赛事数据分散、信息滞后的痛点。平台服务于**教练员、运动员和观众**多方需求，致力于提升校园体育赛事的数字化体验。

## 快速开始（补充）

### 环境要求
- Node.js >= 14
- PostgreSQL >= 12
- 可选：Nginx 用于生产反向代理与 HTTPS

### 后端（PKU_CSports_backend）快速启动
1. 克隆并进入后端目录：
```bash
git clone https://github.com/PKUSE04/PKU-CSports.git
cd PKU-CSports/PKU_CSports_backend
npm install
```

2. 创建 .env（示例）：
```env
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=your_password
PG_DATABASE=csports_db
PG_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

3. 初始化数据库（新库）：
```bash
createdb csports_db
psql -U postgres -d csports_db -f db/schema.sql
```
若已有数据库但缺少 media 字段：
```bash
psql -U postgres -d csports_db -f db/migrate_add_media.sql
```

4. 可选：初始化测试数据
```bash
node scripts/seed.js
# 测试用户：
# - 普通用户: testuser / 123456
# - 协会用户: assoc / 123456
```

5. 启动服务：
```bash
# 开发
npm run dev

# 生产
npm start
```
默认地址：http://localhost:3000

### 前端（如果存在前端目录）
```bash
cd path/to/frontend
npm install
npm run dev
# 构建生产包
npm run build
```

## API 快速参考
- POST /api/auth/register — 用户注册
- POST /api/auth/login — 用户登录
- GET /api/news — 获取资讯列表
- POST /api/news — 创建资讯（需协会/管理员权限）
- GET /api/news/:id — 资讯详情
- POST /api/upload — 上传图片/视频
- GET /api/matches — 赛程列表
- GET /api/standings — 积分榜

详细 API 请参考仓库中的 API_DOC.md（如无请考虑补充）

## 测试
后端测试脚本示例：
```bash
# 单元测试
npm run test:unit

# API 测试
npm run test:api

# 集成测试
npm run test:integration

# 所有测试
npm test
```
性能/压力测试（k6）：
```bash
npm run test:perf:standings
npm run test:perf:news
npm run test:perf:stress
```

## 部署建议
- 使用 PM2 或 systemd 管理后端进程
- Nginx 做静态资源与反向代理并配置 HTTPS
- uploads/ 目录放在持久化存储或使用对象存储（S3/MinIO），并做好备份与权限控制
- 在生产环境，关闭详细调试日志并使用环境变量管理密钥

## 贡献指南（简要）
欢迎贡献！建议流程：
1. Fork 仓库
2. 新建分支：git checkout -b feat/your-feature
3. 提交并推送：git commit -am "描述" && git push origin feat/your-feature
4. 发起 PR，并在 PR 描述中写明变更点与测试方法

## 常见问题（补充）
- 数据库连接失败：确认 PostgreSQL 已启动并检查 .env 配置
- column "media" does not exist：执行 db/migrate_add_media.sql
- 文件上传失败：检查 uploads/ 目录权限与大小限制（默认 50MB）

## 联系方式
有问题请在 Issues 里提，或直接发起 PR 补充文档。
