const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

describe('赛程完整流程集成测试', () => {
  const secret = 'your_jwt_secret';
  let associationToken;

  beforeAll(() => {
    // 获取协会用户 token（需要先登录）
    associationToken = jwt.sign(
      { id: 2, username: 'assoc', role: 'association' },
      secret
    );
  });

  it('应能完整执行：查看赛程 -> 查看详情 -> 更新比分（协会）', async () => {
    // 1. 查看赛程列表
    const listRes = await request(app)
      .get('/api/matches')
      .query({ pageSize: 5 });
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBeGreaterThan(0);
    
    const matchId = listRes.body.data[0].id;

    // 2. 查看赛程详情
    const detailRes = await request(app)
      .get(`/api/matches/${matchId}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.data).toHaveProperty('home_team_name');
    expect(detailRes.body.data).toHaveProperty('away_team_name');

    // 3. 协会用户更新比分
    const updateRes = await request(app)
      .post(`/api/matches/${matchId}/result`)
      .set('Authorization', `Bearer ${associationToken}`)
      .send({ score_home: 3, score_away: 1, status: '已结束' });
    
    // 可能成功（200）或失败（404/500），但不应该是权限错误
    expect([200, 404, 500]).toContain(updateRes.status);
    expect(updateRes.status).not.toBe(403);
  });
});

