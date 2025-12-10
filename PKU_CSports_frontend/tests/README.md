# 前端测试说明

## 测试结构

```
tests/
├── unit/             # 单元测试
│   ├── request.spec.ts       # 请求工具函数测试
│   └── utils.spec.ts         # 通用工具函数测试
├── e2e/              # 端到端测试
│   ├── matches.cy.ts         # 赛事页面测试
│   ├── data.cy.ts            # 数据中心页面测试
│   └── tools.cy.ts            # 工具页面权限测试
└── perf/             # 性能测试
    ├── matches.k6.js         # 赛程接口性能测试
    └── lighthouse.js         # 页面性能审计
```

## 运行测试

### 单元测试
```bash
# 运行一次
npm run test:unit

# 监听模式
npm run test:unit:watch
```

### 端到端测试
```bash
# 命令行运行
npm run test:e2e

# 打开 Cypress GUI
npm run test:e2e:open
```

### 性能测试
```bash
# k6 接口性能测试
npm run test:perf:k6

# Lighthouse 页面性能测试
npm run test:perf:lh
```

### 运行所有测试
```bash
npm run test:all
```

## 测试说明

### 单元测试
- **request.spec.ts**: 测试请求工具函数（URL 拼接、token 添加）
- **utils.spec.ts**: 测试通用工具函数（日期格式化、数组过滤等）

### 端到端测试
- **matches.cy.ts**: 测试赛事页面加载和数据展示
- **data.cy.ts**: 测试数据中心页面切换和数据展示
- **tools.cy.ts**: 测试工具页面基于角色的权限控制（发布按钮显示/隐藏）

### 性能测试
- **matches.k6.js**: 赛程接口性能测试（10并发，30秒）
- **lighthouse.js**: 使用 Lighthouse 审计页面性能指标（LCP、TTI等）

## 前置条件

### E2E 测试
1. 启动后端服务：`cd ../PKU_CSports_backend && npm start`
2. 启动前端开发服务器（H5模式）
3. 确保测试数据已初始化（执行 `node scripts/seed.js`）

### 性能测试
- k6 测试需要后端服务运行
- Lighthouse 测试需要前端 H5 预览运行（默认 `http://localhost:4173`）

## 注意事项

1. E2E 测试使用 `cy.intercept()` 拦截接口，避免依赖网络稳定性
2. 工具页面权限测试通过 `localStorage` 模拟不同用户角色
3. 性能测试阈值可根据实际需求调整

