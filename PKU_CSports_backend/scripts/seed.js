/**
 * 初始化测试数据：
 * - 普通用户 testuser / 123456 (role=user)
 * - 协会用户 assoc / 123456 (role=association)
 * - 基础球队、球员、赛程、积分、球员数据、示例帖子与评论
 *
 * 运行：node scripts/seed.js
 * 注意：会清空相关表数据。
 */
const db = require('../src/config/db');
const { hashPassword } = require('../src/utils/password');

async function seed() {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // 清空表
    await client.query('TRUNCATE TABLE lineups, comments, posts, matches, player_stats, standings, players, teams, users RESTART IDENTITY CASCADE');

    // 用户
    const userPwd = await hashPassword('123456');
    const assocPwd = await hashPassword('123456');
    await client.query(
      `INSERT INTO users (username, password, role, bio) VALUES
        ('testuser', $1, 'user', '普通测试用户'),
        ('assoc', $2, 'association', '协会方测试用户')
      `,
      [userPwd, assocPwd]
    );

    // 球队
    const teamsRes = await client.query(
      `INSERT INTO teams (name, logo, league) VALUES
        ('信工联队', '', '新生杯'),
        ('元社联队', '', '新生杯'),
        ('一地花生', '', '新生杯'),
        ('经数联队', '', '新生杯')
      RETURNING id, name`
    );
    const teamId = (name) => teamsRes.rows.find(t => t.name === name).id;

    // 球员（少量示例）
    await client.query(
      `INSERT INTO players (team_id, name, number, position) VALUES
        ($1,'张俊哲',9,'F'),
        ($1,'王锐杰',7,'F'),
        ($2,'Florian Oswald',10,'F'),
        ($3,'翁正豪',11,'F'),
        ($4,'王俣涵',10,'F')`,
      [teamId('信工联队'), teamId('元社联队'), teamId('一地花生'), teamId('经数联队')]
    );

    // 赛程示例
    const matchesRes = await client.query(
      `INSERT INTO matches (league, round, date_time, venue, status, home_team_id, away_team_id, score_home, score_away)
       VALUES
       ('新生杯','小组赛第三轮','2025-10-17 19:00','邱德拔B2综合训练大厅','已结束',$1,$2,4,2),
       ('新生杯','小组赛第二轮','2025-10-18 20:00','邱德拔B2综合训练大厅','直播中',$3,$4,NULL,NULL)
       RETURNING id, home_team_id, away_team_id`,
      [teamId('信工联队'), teamId('元社联队'), teamId('一地花生'), teamId('经数联队')]
    );
    const matchId = matchesRes.rows[0].id;

    // 积分/球员数据
    await client.query(
      `INSERT INTO standings (league, team_id, played, win, draw, loss, goals_for, goals_against, points) VALUES
        ('新生杯',$1,3,2,0,1,14,8,6),
        ('新生杯',$2,3,2,0,1,10,7,6),
        ('新生杯',$3,3,2,0,1,12,13,6),
        ('新生杯',$4,3,0,0,3,9,17,0)`,
      [teamId('信工联队'), teamId('一地花生'), teamId('元社联队'), teamId('经数联队')]
    );

    await client.query(
      `INSERT INTO player_stats (league, player_id, goals, assists) VALUES
        ('新生杯',1,9,3),
        ('新生杯',2,7,2),
        ('新生杯',3,7,1),
        ('新生杯',4,6,2),
        ('新生杯',5,4,1)`
    );

    // 示例帖子/资讯（包含 media 字段）
    await client.query(
      `INSERT INTO posts (title, content, type, tags, media, author_id, status) VALUES
        ('信工开局强势，禁区爆射破门！','比赛刚开场即破门，士气高涨','flash', ARRAY['热门','进球'], '[]'::JSONB, 2, 'published'),
        ('信工 4-2 元社联队 战报','双方对攻，信工收获关键胜利','report', ARRAY['战报','新生杯'], '[]'::JSONB, 2, 'published'),
        ('训练日志','周末加练，准备下一场硬仗','post', ARRAY['训练'], '[]'::JSONB, 2, 'published')
      `
    );

    // 示例评论
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES
        (1,1,'精彩！'),
        (2,1,'期待下一场'),
        (3,1,'加油！')`
    );

    // 示例阵容：为第一场比赛添加首发与替补（使用前 5 个球员）
    await client.query(
      `INSERT INTO lineups (match_id, player_id, side, is_starter) VALUES
        ($1,1,'home',true),
        ($1,2,'home',true),
        ($1,3,'away',true),
        ($1,4,'away',true),
        ($1,5,'away',false)`,
      [matchId]
    );

    await client.query('COMMIT');
    console.log('✅ Seed data inserted.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seed();

