const userService = require('../services/userService');

// 获取用户信息
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await userService.getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    const result = await userService.updateUserProfile(userId, updates);
    
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    
    res.json({ success: true, data: result.user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 关注/取消关注
exports.toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { following_id } = req.body;
    
    if (!following_id) {
      return res.status(400).json({ success: false, message: '缺少following_id参数' });
    }
    
    const result = await userService.toggleFollow(followerId, following_id);
    
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    
    res.json({ success: true, data: { isFollowing: result.isFollowing } });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取关注列表
exports.getFollowings = async (req, res) => {
  try {
    const userId = req.user.id;
    const followings = await userService.getFollowings(userId);
    res.json({ success: true, data: followings });
  } catch (error) {
    console.error('Get followings error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取粉丝列表
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await userService.getFollowers(userId);
    res.json({ success: true, data: followers });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 收藏/取消收藏
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.body;
    
    if (!post_id) {
      return res.status(400).json({ success: false, message: '缺少post_id参数' });
    }
    
    const result = await userService.toggleFavorite(userId, post_id);
    res.json({ success: true, data: { isFavorited: result.isFavorited } });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取收藏列表
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await userService.getFavorites(userId);
    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 点赞/取消点赞
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.body;
    
    if (!post_id) {
      return res.status(400).json({ success: false, message: '缺少post_id参数' });
    }
    
    const result = await userService.toggleLike(userId, post_id);
    res.json({ success: true, data: { isLiked: result.isLiked } });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};


