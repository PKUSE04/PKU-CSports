const db = require('../config/db');

exports.list = async ({ type, tag, page = 1, pageSize = 10 }) => {
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
    SELECT id, title, content, type, tags, cover, media, created_at, updated_at, author_id
    FROM posts
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;
  const result = await db.query(sql, params);
  // 确保 media 字段是数组格式
  return result.rows.map(row => ({
    ...row,
    media: row.media || []
  }));
};

exports.detail = async (id) => {
  const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
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

