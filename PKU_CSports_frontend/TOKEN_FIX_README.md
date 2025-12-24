# Token 过期问题修复说明

> 更新：后端服务地址已变更为 `http://10.129.82.168:3000`，前端已在 `utils/request.js` 中统一配置 `baseURL`，依赖该地址的上传等功能也通过 `baseURL` 拼接。

## 问题原因

之前的 token 过期时间设置为 1 小时，如果用户登录后超过 1 小时未操作，token 就会过期，导致无法获取用户信息。

## 已修复的问题

1. **延长 token 有效期**：从 1 小时延长到 7 天
2. **统一 JWT Secret**：确保登录和验证使用相同的 secret
3. **自动处理 token 过期**：当 token 过期时，系统会自动：
   - 清除本地存储的 token 和用户信息
   - 显示提示信息
   - 自动跳转到登录页

## 解决方案

### 对于当前用户

如果遇到 "凭证无效或已过期" 的错误，请：

1. **重新登录**：系统会自动跳转到登录页，或者手动前往登录页重新登录
2. **获取新 token**：登录后会获得新的 token，有效期 7 天

### 测试步骤

1. 清除旧的 token（可选）：
   ```javascript
   // 在浏览器控制台或 uni-app 调试工具中执行
   uni.removeStorageSync('token');
   uni.removeStorageSync('userInfo');
   ```

2. 重新登录获取新 token

3. 验证功能：
   - 访问个人主页，应该能正常显示用户信息
   - 访问资讯列表，应该能正常显示
   - token 有效期现在是 7 天

## 技术细节

### 后端修改

- `src/services/userService.js`：
  - token 过期时间从 `1h` 改为 `7d`
  - JWT secret 统一使用 `process.env.JWT_SECRET || 'your_jwt_secret'`

### 前端修改

- `utils/request.js`：
  - 添加了 401 错误的统一处理
  - 自动清除过期 token 并跳转登录页

- `pages/profile/profile.uvue`：
  - 改进了错误处理逻辑
  - 避免在 token 过期时显示重复的错误提示

## 注意事项

1. **开发环境**：如果使用环境变量 `JWT_SECRET`，确保前后端使用相同的值
2. **生产环境**：建议设置环境变量 `JWT_SECRET` 以提高安全性
3. **用户体验**：7 天的有效期可以大大减少用户需要重新登录的频率

## 如果问题仍然存在

1. 检查后端服务是否正常运行
2. 检查数据库迁移是否完成（参考 `PKU_CSports_backend/db/MIGRATION_GUIDE.md`）
3. 清除浏览器/应用的缓存和存储
4. 重新登录获取新 token

