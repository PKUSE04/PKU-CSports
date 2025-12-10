const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

describe('赛程接口权限测试', () => {
  const secret = 'your_jwt_secret';
  
  const getToken = (role = 'user') => {
    return jwt.sign({ id: 1, username: 'test', role }, secret);
  };

  it('GET /api/matches/:id/result 应拒绝未认证请求', async () => {
    const res = await request(app)
      .post('/api/matches/1/result')
      .send({ score_home: 2, score_away: 1 });
    expect(res.status).toBe(401);
  });

  it('POST /api/matches/:id/result 应拒绝普通用户', async () => {
    const token = getToken('user');
    const res = await request(app)
      .post('/api/matches/1/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ score_home: 2, score_away: 1 });
    expect(res.status).toBe(403);
  });

  it('POST /api/matches/:id/result 应允许协会用户', async () => {
    const token = getToken('association');
    const res = await request(app)
      .post('/api/matches/1/result')
      .set('Authorization', `Bearer ${token}`)
      .send({ score_home: 2, score_away: 1 });
    // 可能 404（比赛不存在）或 200（成功），但不应该是 403
    expect([200, 404]).toContain(res.status);
    expect(res.status).not.toBe(403);
  });
});

