const db = require('../config/db');

// 创建比赛事件
exports.create = async (payload) => {
  const { match_id, event_type, minute, side, player_id, player_number, description, created_by } = payload;
  
  let client;
  try {
    client = await db.connect();
    
    const result = await client.query(
      `INSERT INTO match_events 
       (match_id, event_type, minute, side, player_id, player_number, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [match_id, event_type, minute, side, player_id, player_number, description, created_by]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Create match event error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 获取比赛的所有事件
exports.getByMatch = async (matchId) => {
  let client;
  try {
    client = await db.connect();
    
    const result = await client.query(
      `SELECT e.*, 
       p.name as player_name, p.number as player_number_display,
       u.username as created_by_name
       FROM match_events e
       LEFT JOIN players p ON e.player_id = p.id
       LEFT JOIN users u ON e.created_by = u.id
       WHERE e.match_id = $1
       ORDER BY e.minute ASC, e.created_at ASC`,
      [matchId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Get match events error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// 删除比赛事件
exports.delete = async (eventId, userId) => {
  let client;
  try {
    client = await db.connect();
    
    // 检查权限（只有创建者或管理员可以删除）
    const eventResult = await client.query(
      'SELECT created_by FROM match_events WHERE id = $1',
      [eventId]
    );
    
    if (eventResult.rows.length === 0) {
      return { success: false, message: '事件不存在' };
    }
    
    // 这里可以添加权限检查逻辑
    await client.query('DELETE FROM match_events WHERE id = $1', [eventId]);
    
    return { success: true };
  } catch (error) {
    console.error('Delete match event error:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};


