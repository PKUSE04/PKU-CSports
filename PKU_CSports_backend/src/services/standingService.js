const db = require('../config/db');

exports.listStandings = async ({ league }) => {
  const params = [];
  const where = [];
  if (league) { params.push(league); where.push(`s.league = $${params.length}`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT 
      s.team_id, s.league, s.played, s.win, s.draw, s.loss, 
      s.goals_for, s.goals_against, s.points,
      t.name AS team_name, t.logo AS team_logo
    FROM standings s
    LEFT JOIN teams t ON t.id = s.team_id
    ${whereSql}
    ORDER BY s.points DESC, (s.goals_for - s.goals_against) DESC
  `;
  const res = await db.query(sql, params);
  return res.rows;
};

exports.listPlayerStats = async ({ league, sort = 'goals' }) => {
  const allow = ['goals', 'assists'];
  const orderBy = allow.includes(sort) ? sort : 'goals';
  const params = [];
  const where = [];
  if (league) { params.push(league); where.push(`ps.league = $${params.length}`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT 
      ps.player_id, ps.league, ps.goals, ps.assists,
      p.name AS player_name, p.team_id, p.position,
      t.name AS team_name
    FROM player_stats ps
    LEFT JOIN players p ON p.id = ps.player_id
    LEFT JOIN teams t ON t.id = p.team_id
    ${whereSql}
    ORDER BY ${orderBy} DESC
    LIMIT 100
  `;
  const res = await db.query(sql, params);
  return res.rows;
};

