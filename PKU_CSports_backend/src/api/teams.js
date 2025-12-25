const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authMiddleware, allowRoles } = require('../middleware/auth');

// 获取所有队伍列表（公开）
router.get('/', teamController.getAllTeams);

// 需要认证的路由
router.use(authMiddleware);

// 获取用户的主队信息
router.get('/myteam', teamController.getUserTeam);

// 协会权限的路由
router.post('/accounts', authMiddleware, allowRoles('association', 'admin'), teamController.createTeamAccount);
router.get('/accounts', authMiddleware, allowRoles('association', 'admin'), teamController.getTeamAccounts);

module.exports = router;


