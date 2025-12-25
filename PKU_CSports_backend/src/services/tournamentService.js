const db = require('../config/db');

// 创建或更新赛事配置
exports.createOrUpdate = async (payload) => {
  const { name, type, year, gender, stage, groups, createdBy } = payload;
  
  let client;
  try {
    client = await db.connect();
    
    // 检查是否已存在
    const existing = await client.query(
      'SELECT id FROM tournaments WHERE name = $1 AND year = $2 AND gender = $3',
      [name, year, gender]
    );
    
    if (existing.rows.length > 0) {
      // 更新
      const groupsJson = JSON.stringify(groups || []);
      const result = await client.query(
        `UPDATE tournaments 
         SET type = $1, stage = $2, groups = $3::JSONB, updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [type, stage, groupsJson, existing.rows[0].id]
      );
      return result.rows[0];
    } else {
      // 创建
      const groupsJson = JSON.stringify(groups || []);
      const result = await client.query(
        `INSERT INTO tournaments (name, type, year, gender, stage, groups, created_by)
         VALUES ($1, $2, $3, $4, $5, $6::JSONB, $7)
         RETURNING *`,
        [name, type, year, gender, stage, groupsJson, createdBy]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error('Create/update tournament error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取赛事列表
exports.list = async ({ year, type, gender, stage }) => {
  let client;
  try {
    client = await db.connect();
    
    const params = [];
    const where = [];
    
    if (year) {
      params.push(year);
      where.push(`year = $${params.length}`);
    }
    if (type) {
      params.push(type);
      where.push(`type = $${params.length}`);
    }
    if (gender) {
      params.push(gender);
      where.push(`gender = $${params.length}`);
    }
    if (stage) {
      params.push(stage);
      where.push(`stage = $${params.length}`);
    }
    
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT t.*, u.username as created_by_name
      FROM tournaments t
      LEFT JOIN users u ON t.created_by = u.id
      ${whereSql}
      ORDER BY year DESC, type, gender
    `;
    
    const result = await client.query(sql, params);
    
    // 处理 groups JSONB 字段
    return result.rows.map(row => ({
      ...row,
      groups: typeof row.groups === 'string' ? JSON.parse(row.groups) : (row.groups || [])
    }));
  } catch (error) {
    console.error('List tournaments error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取赛事详情
exports.detail = async (id) => {
  let client;
  try {
    client = await db.connect();
    const result = await client.query(
      `SELECT t.*, u.username as created_by_name
       FROM tournaments t
       LEFT JOIN users u ON t.created_by = u.id
       WHERE t.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    row.groups = typeof row.groups === 'string' ? JSON.parse(row.groups) : (row.groups || []);
    
    return row;
  } catch (error) {
    console.error('Get tournament detail error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取可用的筛选选项
exports.getFilterOptions = async () => {
  let client;
  try {
    client = await db.connect();
    
    // 获取所有年份
    const yearsResult = await client.query(
      'SELECT DISTINCT year FROM tournaments ORDER BY year DESC'
    );
    
    // 获取所有类型
    const typesResult = await client.query(
      'SELECT DISTINCT type FROM tournaments ORDER BY type'
    );
    
    // 获取所有性别分组
    const gendersResult = await client.query(
      'SELECT DISTINCT gender FROM tournaments ORDER BY gender'
    );
    
    return {
      years: yearsResult.rows.map(r => r.year),
      types: typesResult.rows.map(r => r.type),
      genders: gendersResult.rows.map(r => r.gender)
    };
  } catch (error) {
    console.error('Get filter options error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};


