const express = require('express');
const router = express.Router();
const matchEventController = require('../controllers/matchEventController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

// 所有路由都需要认证和协会权限
router.use(authMiddleware);
router.use(allowRoles('association', 'admin'));

// 创建比赛事件
router.post('/', matchEventController.create);

// 获取比赛的所有事件
router.get('/match/:matchId', matchEventController.getByMatch);

// 删除比赛事件（使用PATCH方法，因为uni-app可能不支持DELETE）
router.patch('/:id/delete', matchEventController.delete);
router.delete('/:id', matchEventController.delete);

module.exports = router;

