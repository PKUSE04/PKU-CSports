const db = require('../config/db');
const userService = require('./userService');

exports.list = async ({ type, tag, page = 1, pageSize = 10, userId = null }) => {
  const offset = (page - 1) * pageSize;
  const params = [];
  const where = [];

  if (type && type !== 'all') {
    params.push(type);
    where.push(`type = $${params.length}`);
  }
  if (tag) {
    params.push(tag);
    where.push(`$${params.length} = ANY(tags)`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT p.id, p.title, p.content, p.type, p.tags, p.cover, p.media, 
           p.created_at, p.updated_at, p.author_id,
           u.username as author_name, u.avatar as author_avatar,
           (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
           (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favorites_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    ${whereSql}
    ORDER BY p.created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;
  const result = await db.query(sql, params);
  
  // 处理结果，添加用户交互状态
  const posts = await Promise.all(result.rows.map(async (row) => {
    const post = {
      ...row,
      media: row.media || []
    };
    
    // 如果提供了userId，检查是否点赞、收藏、关注
    if (userId) {
      post.is_liked = await userService.isLiked(userId, row.id);
      post.is_favorited = await userService.isFavorited(userId, row.id);
      if (row.author_id) {
        post.is_following_author = await userService.isFollowing(userId, row.author_id);
      }
    } else {
      post.is_liked = false;
      post.is_favorited = false;
      post.is_following_author = false;
    }
    
    return post;
  }));
  
  return posts;
};

exports.detail = async (id, userId = null) => {
  const result = await db.query(
    `SELECT p.*, 
     u.username as author_name, u.avatar as author_avatar,
     (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
     (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favorites_count
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (row) {
    // 确保 media 字段是数组格式
    if (row.media && typeof row.media === 'string') {
      try {
        row.media = JSON.parse(row.media);
      } catch (e) {
        row.media = [];
      }
    } else if (!row.media) {
      row.media = [];
    }
    
    // 如果提供了userId，检查是否点赞、收藏、关注
    if (userId) {
      row.is_liked = await userService.isLiked(userId, id);
      row.is_favorited = await userService.isFavorited(userId, id);
      if (row.author_id) {
        row.is_following_author = await userService.isFollowing(userId, row.author_id);
      }
    } else {
      row.is_liked = false;
      row.is_favorited = false;
      row.is_following_author = false;
    }
  }
  return row;
};

exports.create = async (payload) => {
  const { 
    title = '', 
    content = '', 
    type = 'post', 
    tags = [], 
    cover = '', 
    media = [],
    authorId 
  } = payload;
  
  // 将 media 数组转换为 JSONB
  const mediaJson = JSON.stringify(media || []);
  
  // 如果没有 media 但有 cover，将 cover 作为第一个媒体项
  let finalMedia = media || [];
  if (finalMedia.length === 0 && cover) {
    finalMedia = [{ type: 'image', url: cover }];
  }
  const finalMediaJson = JSON.stringify(finalMedia);
  
  const result = await db.query(
    `INSERT INTO posts (title, content, type, tags, cover, media, author_id, status) 
     VALUES ($1,$2,$3,$4,$5,$6::JSONB,$7,'published') RETURNING *`,
    [title, content, type, tags, cover, finalMediaJson, authorId]
  );
  
  // 确保返回的 media 是数组格式
  const row = result.rows[0];
  if (row.media && typeof row.media === 'string') {
    try {
      row.media = JSON.parse(row.media);
    } catch (e) {
      row.media = [];
    }
  } else if (!row.media) {
    row.media = [];
  }
  
  return row;
};

exports.update = async (id, payload) => {
  const { title, content, type, tags, cover, media, status } = payload;
  
  // 构建更新 SQL，media 需要特殊处理
  const updates = [];
  const params = [];
  let paramIndex = 1;
  
  if (title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    params.push(title);
  }
  if (content !== undefined) {
    updates.push(`content = $${paramIndex++}`);
    params.push(content);
  }
  if (type !== undefined) {
    updates.push(`type = $${paramIndex++}`);
    params.push(type);
  }
  if (tags !== undefined) {
    updates.push(`tags = $${paramIndex++}`);
    params.push(tags);
  }
  if (cover !== undefined) {
    updates.push(`cover = $${paramIndex++}`);
    params.push(cover);
  }
  if (media !== undefined) {
    updates.push(`media = $${paramIndex++}::JSONB`);
    params.push(JSON.stringify(media));
  }
  if (status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  
  updates.push(`updated_at = NOW()`);
  params.push(id);
  
  const sql = `UPDATE posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const result = await db.query(sql, params);
  
  // 确保返回的 media 是数组格式
  const row = result.rows[0];
  if (row && row.media) {
    if (typeof row.media === 'string') {
      try {
        row.media = JSON.parse(row.media);
      } catch (e) {
        row.media = [];
      }
    }
  } else if (row) {
    row.media = [];
  }
  
  return row;
};

