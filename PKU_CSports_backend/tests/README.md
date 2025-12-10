# 后端测试说明

## 测试结构

```
tests/
├── api/              # API 接口功能测试
│   ├── api.test.js           # 基础接口回归测试
│   ├── auth.test.js          # 认证接口测试
│   └── matches-auth.test.js  # 赛程接口权限测试
├── unit/             # 单元测试
│   ├── password.test.js      # 密码工具函数测试
│   └── auth.test.js          # 认证中间件测试
├── integration/      # 集成测试
│   └── match-flow.test.js    # 赛程完整流程测试
└── perf/             # 性能与压力测试
    ├── standings.k6.js       # 积分榜性能测试
    ├── news.k6.js            # 新闻接口性能测试
    └── stress.k6.js          # 压力测试（阶梯式负载）
```

## 运行测试

### 单元测试
```bash
npm run test:unit
```

### API 功能测试
```bash
npm run test:api
```

### 集成测试
```bash
npm run test:integration
```

### 所有测试
```bash
npm test
```

### 性能测试
```bash
# 积分榜性能测试（15并发，30秒）
npm run test:perf:standings

# 新闻接口性能测试（10并发，30秒）
npm run test:perf:news

# 压力测试（阶梯式：20->50->100用户）
npm run test:perf:stress
```

## 测试说明

### 单元测试
- **password.test.js**: 测试密码哈希和验证功能
- **auth.test.js**: 测试 JWT 认证中间件和角色权限控制

### API 功能测试
- **api.test.js**: 基础接口回归测试（健康检查、赛程、积分榜、球员榜）
- **auth.test.js**: 登录接口测试（成功/失败场景）
- **matches-auth.test.js**: 赛程接口权限测试（普通用户 vs 协会用户）

### 集成测试
- **match-flow.test.js**: 完整业务流程测试（查看列表 -> 查看详情 -> 更新比分）

### 性能测试
- **standings.k6.js**: 积分榜和球员榜接口性能测试
- **news.k6.js**: 新闻接口性能测试
- **stress.k6.js**: 压力测试，模拟阶梯式负载增长

## 注意事项

1. 运行测试前需确保已执行 `node scripts/seed.js` 初始化测试数据
2. 性能测试需要后端服务运行在 `http://localhost:3000`
3. 压力测试会逐步增加负载，注意观察服务器资源使用情况

