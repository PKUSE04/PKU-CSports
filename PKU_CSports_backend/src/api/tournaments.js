const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

// 获取筛选选项（公开）
router.get('/filters', tournamentController.getFilterOptions);

// 获取赛事列表（公开）
router.get('/', tournamentController.list);

// 获取赛事详情（公开）
router.get('/:id', tournamentController.detail);

// 创建或更新赛事配置（需要协会权限）
router.post('/', authMiddleware, allowRoles('association', 'admin'), tournamentController.createOrUpdate);
router.patch('/:id', authMiddleware, allowRoles('association', 'admin'), tournamentController.createOrUpdate);

module.exports = router;


