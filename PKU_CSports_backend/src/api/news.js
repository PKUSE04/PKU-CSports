const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

// 可选认证中间件（用于列表和详情，如果已登录则返回交互状态）
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'your_jwt_secret';
      req.user = jwt.verify(token, secret);
    } catch (err) {
      // token无效，继续但不设置req.user
    }
  }
  next();
};

// 列表和详情支持可选认证（如果已登录则返回交互状态）
router.get('/', optionalAuth, newsController.list);
router.get('/:id', optionalAuth, newsController.detail);

// 所有登录用户都可以创建帖子，但普通用户只能创建type='post'的帖子
router.post('/', authMiddleware, newsController.create);
router.patch('/:id', authMiddleware, allowRoles('association', 'admin'), newsController.update);

module.exports = router;

