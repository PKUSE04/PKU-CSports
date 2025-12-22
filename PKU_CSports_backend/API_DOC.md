# PKU CSports 后端接口文档

## 一、后端作用

本后端服务基于 Node.js + Express + PostgreSQL，主要负责：
- 提供校园体育赛事平台的用户认证、数据存储与业务逻辑处理。
- 为前端（Web/移动端）提供统一的 RESTful API。
- 保障数据安全（如密码加密、Token 认证等）。

---

## 二、已实现接口

下面按统一格式列出已实现的主要接口：接口地址、示例、请求类型、请求头、请求体/参数、成功与失败响应示例以及简要说明。

### 1. 登录

#### 1) 登录

- **接口地址**：POST /api/auth/login
- **完整示例**：http://localhost:3000/api/auth/login
- **请求类型**：POST
- **请求头**：Content-Type: application/json
- **请求体参数**：

```json
{
  "username": "testuser",
  "password": "password123"
}
```

- **成功响应示例**：

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "<JWT_TOKEN>",
    "user": { 
      "id": 1, 
      "username": "testuser", 
      "role": "user" 
    }
  }
}
```

- **失败响应示例**：

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

- **说明**：
  - 登录成功后，前端保存 `token`，后续需要认证的请求在请求头加入 `Authorization: Bearer <token>`。
  - 用户对象不会包含密码字段。

#### 2) 注册

- **接口地址**：POST /api/auth/register
- **完整示例**：http://localhost:3000/api/auth/register
- **请求类型**：POST
- **请求头**：Content-Type: application/json
- **请求体参数**：

```json
{
  "username": "testuser",
  "password": "password123"
}
```

- **成功响应示例**：

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "username": "testuser",
      "role": "user"
    }
  }
}
```

- **说明**：注册成功时后端会返回 `token`（JWT）和 `user` 对象，前端保存该 `token` 以直接进入登录态

- **失败响应示例**：

```json
{
  "success": false,
  "message": "用户名已存在"
}
```

- **说明**：
  - 前端通常通过 `post('/api/auth/register', { username, password })` 发送请求。

### 2. 资讯 News

#### 1) 列表
- **接口地址**：GET /api/news
- **完整示例**：http://localhost:3000/api/news?type=all&tag=&page=1&pageSize=10
- **请求类型**：GET
- **请求头**：无特殊要求（可带 Authorization 用于提权查看草稿或私有内容）
- **请求参数（query）**：

  - `type`：flash|report|post|all（默认 all）
  - `tag`：标签过滤（可选）
  - `page`：页码（默认 1）
  - `pageSize`：每页大小（默认 10）

- **成功响应示例**：

```json
{
  "success": true,
  "data": [
    { "id": 12, "title": "示例", "type": "report", "tags": ["热门"], "cover": "", "created_at": "...", "author_id": 2 }
  ]
}
```

- **说明**：分页与过滤在服务层实现，返回的每项包含 `id, title, type, tags, cover, created_at, updated_at, author_id`。

#### 2) 详情
- **接口地址**：GET /api/news/:id
- **示例**：http://localhost:3000/api/news/12
- **请求类型**：GET
- **成功响应示例**：

```json
{
  "success": true,
  "data": { "id": 12, "title": "示例", "content": "...", "author_id": 2, "tags": [] }
}
```

- **失败**：若未找到返回 404 与 `{ success: false, message: '未找到资讯' }`。

#### 3) 创建（需角色 `association` 或 `admin`）
- **接口地址**：POST /api/news
- **示例**：http://localhost:3000/api/news
- **请求类型**：POST
- **请求头**：
  - Content-Type: application/json
  - Authorization: Bearer <token>（必须，且用户需为 association 或 admin）
- **请求体（JSON）**：

```json
{
  "title": "示例战报",
  "content": "内容",
  "type": "report",
  "tags": ["热门"],
  "cover": ""
}
```

- **成功响应示例**（创建成功，HTTP 201）：

```json
{
  "success": true,
  "data": { "id": 13, "title": "示例战报", "author_id": 2, "status": "published" }
}
```

- **说明**：路由使用 `authMiddleware` + `allowRoles('association','admin')` 做认证与授权，`newsController.create` 会把 `req.user.id` 作为 `authorId` 传入服务层。

#### 4) 更新（需角色 `association` 或 `admin`）
- **接口地址**：PATCH /api/news/:id
- **示例**：http://localhost:3000/api/news/13
- **请求类型**：PATCH
- **请求头**：Content-Type: application/json 和 Authorization: Bearer <token>
- **请求体（可部分包含字段）**：`{ title, content, type, tags, cover, status }`
- **成功响应示例**：返回更新后的文章对象 `{ success: true, data: {...} }`。

### 3. 赛程 Matches

#### 1) 列表
- **接口地址**：GET /api/matches
- **示例**：http://localhost:3000/api/matches?status=&league=&round=&page=1&pageSize=20
- **请求类型**：GET
- **请求参数（query）**：`status, league, round, page, pageSize`
- **成功响应示例**：`{ success: true, data: [ { id, league, status, round, home_team, away_team, ... } ] }`。

#### 2) 详情

- **接口地址**：GET /api/matches/:id
- **完整示例**：http://localhost:3000/api/matches/45
- **请求类型**：GET
- **请求头**：无特殊要求（Authorization 可选，用于查看受限信息）
- **请求参数**：路径参数 `id`（比赛 ID）
- **成功响应示例（HTTP 200）**：

```json
{
  "success": true,
  "data": {
    "id": 45,
    "league": "mens",
    "round": "Semi",
    "date_time": "2025-12-22T10:00:00.000Z",
    "venue": "Main Stadium",
    "status": "未开始",
    "home_team_id": 3,
    "home_team_name": "PKU Tigers",
    "home_logo": "https://example.com/logos/tigers.png",
    "away_team_id": 5,
    "away_team_name": "PKU Lions",
    "away_logo": "https://example.com/logos/lions.png",
    "score_home": null,
    "score_away": null,
    "lineup": {
      "starters": [
        { "side": "home", "player_id": 101, "is_starter": true, "name": "Zhang San", "number": 9, "position": "FW" }
      ],
      "bench": [
        { "side": "home", "player_id": 110, "is_starter": false, "name": "Li Si", "number": 18, "position": "MF" }
      ]
    }
  }
}
```

- **失败响应示例**：
```json
{
  "success": false,
  "message": "xxxxx"
}
```


- **说明**：`lineup` 来自 `lineups` 表与 `players` 表的联查，`starters`/`bench` 根据 `is_starter` 分组；若无阵容数据则返回空数组。

#### 3) 录入比分（需角色 `association` 或 `admin`）

- **接口地址**：POST /api/matches/:id/result
- **完整示例**：http://localhost:3000/api/matches/45/result
- **请求类型**：POST
- **请求头**：Content-Type: application/json，Authorization: Bearer <token>
- **请求体参数**：
```json
{
  "score_home": 2,
  "score_away": 1,
  "status": "已结束"
}
```

- **成功响应示例**：

```json
{
  "success": true,
  "data": {
    "id": 45,
    "score_home": 2,
    "score_away": 1,
    "status": "已结束",
    "updated_at": "2025-12-22T12:34:56.789Z"
  }
}
```

- **失败响应示例**：

```json
{
  "success": false,
  "message": "XXXX"
}
```

- **说明**：后端使用部分更新策略（SQL 中使用 `COALESCE`），允许只更新传入的字段；`updated_at` 会被设置为当前时间。该接口受 `authMiddleware` 与角色校验保护，只有 `association` 或 `admin` 能操作。

#### 4) 录入阵容（一次性录入完整阵容）（需角色 `association` 或 `admin`）

- **接口地址**：POST /api/matches/:id/lineup
- **完整示例**：http://localhost:3000/api/matches/45/lineup
- **请求类型**：POST
- **请求头**：Content-Type: application/json，Authorization: Bearer <token>
- **请求体参数（JSON）**：

```json
{
  "lineup": [
    { "player_id": 101, "side": "home", "is_starter": true },
    { "player_id": 102, "side": "home", "is_starter": true },
    { "player_id": 201, "side": "away", "is_starter": false }
  ]
}
```

- **成功响应示例（HTTP 200）**：

```json
{
  "success": true,
  "data": { "matchId": 45, "count": 3 }
}
```

- **失败响应示例**：
```json
{
  "success": false,
  "message": "XXXXX"
}
```

- **说明**：该接口在数据库事务中先删除原有 `lineups`（`DELETE FROM lineups WHERE match_id = $1`），再插入新的记录，保证替换操作的原子性。客户端需一次性提交完整阵容列表。

---

#### 5) 单条增删改（部分变更支持，需角色 `association` 或 `admin`）

- **新增单条阵容（Add single item）**

  - **接口地址**：POST /api/matches/:id/lineup/item
  - **完整示例**：http://localhost:3000/api/matches/45/lineup/item
  - **请求类型**：POST
  - **请求头**：
    - Content-Type: application/json
    - Authorization: Bearer <token>（必须，且用户需为 `association` 或 `admin`）
  - **请求体（JSON）**：

  ```json
  {
    "player_id": 110,
    "side": "home",
    "is_starter": false
  }
  ```

  - **成功响应示例（HTTP 201）**：返回新插入的 `lineups` 行对象

  ```json
  {
    "success": true,
    "data": {
      "id": 999,
      "match_id": 45,
      "player_id": 110,
      "side": "home",
      "is_starter": false
    }
  }
  ```

  - **说明**：用于在已有阵容外新增单个球员项，数据库直接插入一条记录。

- **更新单条阵容（Update single item）**

  - **接口地址**：PATCH /api/matches/:id/lineup/:playerId
  - **完整示例**：http://localhost:3000/api/matches/45/lineup/110
  - **请求类型**：PATCH
  - **请求头**：
    - Content-Type: application/json
    - Authorization: Bearer <token>（必须，且用户需为 `association` 或 `admin`）
  - **请求体（可部分包含字段）**：

  ```json
  {
    "side": "away",
    "is_starter": true
  }
  ```

  - **成功响应示例（HTTP 200）**：返回更新后的 `lineups` 行对象

  ```json
  {
    "success": true,
    "data": {
      "id": 999,
      "match_id": 45,
      "player_id": 110,
      "side": "away",
      "is_starter": true
    }
  }
  ```

  - **失败响应示例（未找到该条目，HTTP 404）**：

  ```json
  {
    "success": false,
    "message": "未找到该阵容条目"
  }
  ```

  - **说明**：支持部分字段更新（`side` / `is_starter`）；若对应 `match_id` + `player_id` 的条目不存在则返回 404。

- **删除单条阵容（Delete single item）**

  - **接口地址**：DELETE /api/matches/:id/lineup/:playerId
  - **完整示例**：http://localhost:3000/api/matches/45/lineup/110
  - **请求類型**：DELETE
  - **请求头**：Authorization: Bearer <token>（必须，且用户需为 `association` 或 `admin`）
  - **成功响应示例（HTTP 200）**：

  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

  - **失败响应示例（未找到该条目，HTTP 404）**：

  ```json
  {
    "success": false,
    "message": "未找到该阵容条目"
  }
  ```

  - **说明**：根据 `match_id` 与 `player_id` 删除单条阵容记录；成功返回简单消息。

**安全与注意事项**：
- 以上三个接口均受 `authMiddleware` 与 `allowRoles('association','admin')` 保护，请在请求头传 `Authorization: Bearer <token>`。
- 若客户端只需要局部修改，建议优先使用这些单条接口以避免一次性提交完整阵容带来的并发冲突。



### 4. 榜单 Standings

#### 1) 积分榜
- **接口地址**：GET /api/standings
- **示例**：http://localhost:3000/api/standings?league=mens
- **请求类型**：GET
- **请求参数**：`league`（可选）
- **成功响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "team_id": 3,
      "league": "mens",
      "played": 10,
      "win": 7,
      "draw": 2,
      "loss": 1,
      "goals_for": 23,
      "goals_against": 8,
      "points": 23,
      "team_name": "PKU Tigers",
      "team_logo": "https://..."
    }
  ]
}
```

- **说明**：服务层按 `s.points DESC`、净胜球降序排序；若未提供 `league` 则返回所有联赛对应数据。

#### 2) 球员榜
- **接口地址**：GET /api/standings/players
- **示例**：http://localhost:3000/api/standings/players?league=&sort=goals
- **请求类型**：GET
- **请求参数**：`league`（可选），`sort`（goals|assists，默认 goals）
- **成功响应**：`{ success: true, data: [ { player_id, league, goals, assists, player_name, team_id, position, team_name } ] }`。

### 5. 评论 Comments

#### 1) 列表
- **接口地址**：GET /api/comments/:postId
- **示例**：http://localhost:3000/api/comments/12
- **请求类型**：GET
- **说明**：返回文章/帖子下的评论数组。

#### 2) 发表（需登录）
- **接口地址**：POST /api/comments/:postId
- **示例**：http://localhost:3000/api/comments/12
- **请求类型**：POST
- **请求头**：Content-Type: application/json，Authorization: Bearer <token>
- **请求体**：`{ content, parentId }`
- **成功响应示例**：返回新创建的评论对象。

---

## 三、接口测试方法

### 1. 使用 curl 测试

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"testuser","password":"password123"}'
```

### 2. 使用 VS Code REST Client 插件

在 `requests_test.http` 文件中写入：

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

点击 `Send Request` 按钮即可看到响应。

---

## 四、后续扩展建议

- 增加注册、用户信息查询、赛事数据等接口。
- 所有敏感操作建议加上 JWT Token 校验。
- 数据库连接信息建议用环境变量管理，避免明文泄露。


## 六、运行与测试
1. 安装依赖：`npm install`
2. 准备数据库：创建 PostgreSQL 库 `csports_db`，执行 `db/schema.sql`
3. 环境变量（.env 可选）：
```
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=xxxx
PG_DATABASE=csports_db
PG_PORT=5432
JWT_SECRET=your_secret
```
4. 启动：`node src/app.js`
5. 测试：可用 `requests_test.http` 或 curl，例如：
```
GET http://localhost:3000/api/news
POST http://localhost:3000/api/news
Authorization: Bearer <token>
Content-Type: application/json

{ "title":"示例战报","content":"内容","type":"report","tags":["热门"] }
```

---

如需更多接口或有任何问题，请联系后端开发者。
