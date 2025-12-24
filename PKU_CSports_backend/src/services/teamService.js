const db = require('../config/db');
const { hashPassword } = require('../utils/password');

// 创建队伍账号（协会权限）
exports.createTeamAccount = async (teamId, username, password, createdBy) => {
  let client;
  try {
    client = await db.connect();
    
    // 检查队伍是否存在
    const teamResult = await client.query('SELECT * FROM teams WHERE id = $1', [teamId]);
    if (teamResult.rows.length === 0) {
      return { success: false, message: '队伍不存在' };
    }
    
    // 检查用户名是否已存在
    const userExists = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return { success: false, message: '用户名已存在' };
    }
    
    // 检查该队伍是否已有账号
    const accountExists = await client.query(
      'SELECT id FROM team_accounts WHERE team_id = $1',
      [teamId]
    );
    if (accountExists.rows.length > 0) {
      return { success: false, message: '该队伍已有官方账号' };
    }
    
    // 创建用户账号（角色为user，但通过team_accounts表关联）
    const hashed = await hashPassword(password);
    const userResult = await client.query(
      `INSERT INTO users (username, password, role) VALUES ($1, $2, 'user') RETURNING *`,
      [username, hashed]
    );
    const user = userResult.rows[0];
    
    // 创建队伍账号关联
    await client.query(
      `INSERT INTO team_accounts (team_id, user_id, created_by) VALUES ($1, $2, $3)`,
      [teamId, user.id, createdBy]
    );
    
    const userToReturn = { ...user };
    delete userToReturn.password;
    
    return {
      success: true,
      user: userToReturn,
      team: teamResult.rows[0]
    };
  } catch (error) {
    console.error('Create team account error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取队伍账号列表（协会权限）
exports.getTeamAccounts = async (createdBy) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      `SELECT ta.*, t.name as team_name, t.logo as team_logo, u.username, u.avatar, u.bio
       FROM team_accounts ta
       JOIN teams t ON ta.team_id = t.id
       JOIN users u ON ta.user_id = u.id
       WHERE ta.created_by = $1
       ORDER BY ta.created_at DESC`,
      [createdBy]
    );
    return result.rows;
  } catch (error) {
    console.error('Get team accounts error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取用户的主队信息
exports.getUserTeam = async (userId) => {
  let client;
  try {
    client = await db.connect();
    
    // 获取用户的主队ID
    const userResult = await client.query('SELECT fav_team_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0 || !userResult.rows[0].fav_team_id) {
      return null;
    }
    
    const teamId = userResult.rows[0].fav_team_id;
    
    // 获取队伍信息
    const teamResult = await client.query('SELECT * FROM teams WHERE id = $1', [teamId]);
    if (teamResult.rows.length === 0) {
      return null;
    }
    
    const team = teamResult.rows[0];
    
    // 获取队伍账号信息
    const accountResult = await client.query(
      `SELECT u.id, u.username, u.avatar, u.bio
       FROM team_accounts ta
       JOIN users u ON ta.user_id = u.id
       WHERE ta.team_id = $1`,
      [teamId]
    );
    
    // 获取队伍最近的帖子
    const postsResult = await client.query(
      `SELECT p.*, u.username as author_name, u.avatar as author_avatar
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.author_id IN (SELECT user_id FROM team_accounts WHERE team_id = $1)
       ORDER BY p.created_at DESC
       LIMIT 10`,
      [teamId]
    );
    
    // 获取队伍最近的比赛
    const matchesResult = await client.query(
      `SELECT m.*, 
       ht.name as home_team_name, ht.logo as home_team_logo,
       at.name as away_team_name, at.logo as away_team_logo
       FROM matches m
       LEFT JOIN teams ht ON m.home_team_id = ht.id
       LEFT JOIN teams at ON m.away_team_id = at.id
       WHERE (m.home_team_id = $1 OR m.away_team_id = $1)
       ORDER BY m.date_time DESC
       LIMIT 10`,
      [teamId]
    );
    
    // 处理posts的media字段
    const posts = postsResult.rows.map(row => ({
      ...row,
      media: typeof row.media === 'string' ? JSON.parse(row.media) : (row.media || [])
    }));
    
    return {
      ...team,
      account: accountResult.rows.length > 0 ? accountResult.rows[0] : null,
      recent_posts: posts,
      recent_matches: matchesResult.rows
    };
  } catch (error) {
    console.error('Get user team error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取所有队伍列表
exports.getAllTeams = async () => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query('SELECT * FROM teams ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Get all teams error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

