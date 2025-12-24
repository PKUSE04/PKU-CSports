const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const db = require('../config/db'); // Import the database connection pool
const { hashPassword } = require('../utils/password');

/**
 * Handles user login verification by querying the database.
 * @param {string} username The user's username.
 * @param {string} password The user's password.
 * @returns {Promise<object>} An object containing success status, and data (token, user) or a message.
 */
exports.loginUser = async (username, password) => {
  let client;
  try {
    // 1. Get a client from the pool
    client = await db.connect();

    // 2. Find user by username from the database (PostgreSQL uses $1 for parameterized queries)
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return { success: false, message: '用户不存在' };
    }
    const user = result.rows[0];

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return { success: false, message: '密码错误' };
    }

    // 4. Generate a JWT token
    const payload = { id: user.id, username: user.username, role: user.role };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    // 延长 token 过期时间到 7 天，提升用户体验
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    // 5. Prepare user data to return (omitting the password)
    const userToReturn = { ...user };
    delete userToReturn.password;

    return {
      success: true,
      token,
      user: userToReturn,
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw new Error('Error during login process.');
  } finally {
    // 6. Release the client back to the pool
    if (client) {
      client.release();
    }
  }
};

exports.registerUser = async (username, password) => {
  let client;
  try {
    client = await db.connect();

    // Check if username already exists
    const exists = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    if (exists.rows.length > 0) {
      return { success: false, message: '用户名已存在' };
    }

    // Hash password and insert new user
    const hashed = await hashPassword(password);
    const insertRes = await client.query(
      `INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *`,
      [username, hashed, 'user']
    );
    const user = insertRes.rows[0];

    // Generate token
    const payload = { id: user.id, username: user.username, role: user.role };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    // 延长 token 过期时间到 7 天，提升用户体验
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    const userToReturn = { ...user };
    delete userToReturn.password;

    return { success: true, token, user: userToReturn };
  } catch (error) {
    console.error('Register Service Error:', error);
    throw new Error('Error during register process.');
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取用户信息（包含统计数据）
exports.getUserProfile = async (userId) => {
  let client;
  try {
    client = await db.connect();
    
    // 获取用户基本信息
    const userResult = await client.query(
      `SELECT id, username, role, avatar, bio, fav_team_id, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return null;
    }
    
    const user = userResult.rows[0];
    
    // 获取统计数据
    const [followsCount, followersCount, postsCount, favoritesCount] = await Promise.all([
      client.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [userId]),
      client.query('SELECT COUNT(*) as count FROM follows WHERE following_id = $1', [userId]),
      client.query('SELECT COUNT(*) as count FROM posts WHERE author_id = $1', [userId]),
      client.query('SELECT COUNT(*) as count FROM favorites WHERE user_id = $1', [userId])
    ]);
    
    // 获取主队信息
    let teamInfo = null;
    if (user.fav_team_id) {
      const teamResult = await client.query('SELECT * FROM teams WHERE id = $1', [user.fav_team_id]);
      if (teamResult.rows.length > 0) {
        teamInfo = teamResult.rows[0];
      }
    }
    
    return {
      ...user,
      stats: {
        follows: parseInt(followsCount.rows[0].count),
        followers: parseInt(followersCount.rows[0].count),
        posts: parseInt(postsCount.rows[0].count),
        favorites: parseInt(favoritesCount.rows[0].count)
      },
      fav_team: teamInfo
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 更新用户信息
exports.updateUserProfile = async (userId, updates) => {
  let client;
  try {
    client = await db.connect();
    
    const allowedFields = ['avatar', 'bio', 'fav_team_id'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }
    
    if (updateFields.length === 0) {
      return { success: false, message: '没有可更新的字段' };
    }
    
    values.push(userId);
    const result = await client.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, username, role, avatar, bio, fav_team_id, created_at`,
      values
    );
    
    if (result.rows.length === 0) {
      return { success: false, message: '用户不存在' };
    }
    
    const user = result.rows[0];
    
    // 获取主队信息
    let teamInfo = null;
    if (user.fav_team_id) {
      const teamResult = await client.query('SELECT * FROM teams WHERE id = $1', [user.fav_team_id]);
      if (teamResult.rows.length > 0) {
        teamInfo = teamResult.rows[0];
      }
    }
    
    return {
      success: true,
      user: {
        ...user,
        fav_team: teamInfo
      }
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 关注/取消关注
exports.toggleFollow = async (followerId, followingId) => {
  let client;
  try {
    client = await db.connect();
    
    if (followerId === followingId) {
      return { success: false, message: '不能关注自己' };
    }
    
    // 检查是否已关注
    const existing = await client.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );
    
    if (existing.rows.length > 0) {
      // 取消关注
      await client.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
        [followerId, followingId]
      );
      return { success: true, isFollowing: false };
    } else {
      // 关注
      await client.query(
        'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
        [followerId, followingId]
      );
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    console.error('Toggle follow error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取关注列表
exports.getFollowings = async (userId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      `SELECT u.id, u.username, u.avatar, u.bio, f.created_at 
       FROM follows f 
       JOIN users u ON f.following_id = u.id 
       WHERE f.follower_id = $1 
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get followings error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取粉丝列表
exports.getFollowers = async (userId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      `SELECT u.id, u.username, u.avatar, u.bio, f.created_at 
       FROM follows f 
       JOIN users u ON f.follower_id = u.id 
       WHERE f.following_id = $1 
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get followers error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 收藏/取消收藏
exports.toggleFavorite = async (userId, postId) => {
  let client;
  try {
    client = await db.connect();
    
    const existing = await client.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    
    if (existing.rows.length > 0) {
      await client.query(
        'DELETE FROM favorites WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
      return { success: true, isFavorited: false };
    } else {
      await client.query(
        'INSERT INTO favorites (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );
      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取收藏列表
exports.getFavorites = async (userId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      `SELECT p.*, u.username as author_name, u.avatar as author_avatar, f.created_at as favorited_at
       FROM favorites f
       JOIN posts p ON f.post_id = p.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    
    // 处理media字段
    return result.rows.map(row => ({
      ...row,
      media: typeof row.media === 'string' ? JSON.parse(row.media) : (row.media || [])
    }));
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 点赞/取消点赞
exports.toggleLike = async (userId, postId) => {
  let client;
  try {
    client = await db.connect();
    
    const existing = await client.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    
    if (existing.rows.length > 0) {
      await client.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
      return { success: true, isLiked: false };
    } else {
      await client.query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );
      return { success: true, isLiked: true };
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取帖子的点赞数
exports.getPostLikesCount = async (postId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = $1',
      [postId]
    );
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Get post likes count error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 检查用户是否点赞了某个帖子
exports.isLiked = async (userId, postId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check like error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 检查用户是否收藏了某个帖子
exports.isFavorited = async (userId, postId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check favorite error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 检查用户是否关注了某个用户
exports.isFollowing = async (followerId, followingId) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check follow error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};