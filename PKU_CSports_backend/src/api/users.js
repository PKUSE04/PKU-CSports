const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 用户信息
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

// 关注相关
router.post('/follow', userController.toggleFollow);
router.get('/followings', userController.getFollowings);
router.get('/followers', userController.getFollowers);

// 收藏相关
router.post('/favorite', userController.toggleFavorite);
router.get('/favorites', userController.getFavorites);

// 点赞相关
router.post('/like', userController.toggleLike);

module.exports = router;


