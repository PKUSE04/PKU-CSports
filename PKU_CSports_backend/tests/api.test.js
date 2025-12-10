const request = require('supertest');
const app = require('../src/app');

// 依赖 seed.js 插入的测试数据：用户 testuser/assoc，联赛“新生杯”，两场比赛

describe('API 基础回归', () => {
  // 只测 GET 接口，避免改动数据

  it('健康检查 / 返回欢迎文案', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Welcome to the CSports API');
  });

  it('/api/matches 应返回带球队名称的赛程列表', async () => {
    const res = await request(app).get('/api/matches').query({ pageSize: 5 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const first = res.body.data[0];
    expect(first).toHaveProperty('home_team_name');
    expect(first).toHaveProperty('away_team_name');
  });

  it('/api/standings 返回积分榜并包含球队名称', async () => {
    const res = await request(app).get('/api/standings').query({ league: '新生杯' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const first = res.body.data[0];
    expect(first).toHaveProperty('team_name');
    expect(first).toHaveProperty('points');
  });

  it('/api/standings/players 返回球员榜并包含球员与球队名称', async () => {
    const res = await request(app).get('/api/standings/players').query({ league: '新生杯', sort: 'goals' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const first = res.body.data[0];
    expect(first).toHaveProperty('player_name');
    expect(first).toHaveProperty('team_name');
  });
});

