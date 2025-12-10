const request = require('supertest');
const app = require('../../src/app');

describe('认证接口功能测试', () => {
  it('POST /api/auth/login 应拒绝空用户名或密码', async () => {
    const res1 = await request(app)
      .post('/api/auth/login')
      .send({ username: '', password: '123456' });
    expect(res1.status).toBe(400);

    const res2 = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });
    expect(res2.status).toBe(400);
  });

  it('POST /api/auth/login 应拒绝错误密码', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login 应成功登录并返回 token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: '123456' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user.username).toBe('testuser');
    expect(res.body.data.user.role).toBe('user');
  });

  it('POST /api/auth/login 协会用户应正确返回角色', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'assoc', password: '123456' });
    
    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('association');
  });
});

