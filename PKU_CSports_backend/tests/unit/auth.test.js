const jwt = require('jsonwebtoken');
const { authMiddleware, allowRoles } = require('../../src/middleware/auth');

describe('认证中间件单元测试', () => {
  const secret = 'your_jwt_secret';
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('authMiddleware 应拒绝无 token 的请求', () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: '未提供凭证'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('authMiddleware 应拒绝无效 token', () => {
    req.headers.authorization = 'Bearer invalid_token';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authMiddleware 应接受有效 token 并附加用户信息', () => {
    const payload = { id: 1, username: 'test', role: 'user' };
    const token = jwt.sign(payload, secret);
    req.headers.authorization = `Bearer ${token}`;
    
    authMiddleware(req, res, next);
    expect(req.user).toEqual(expect.objectContaining({
      id: 1,
      username: 'test',
      role: 'user'
    }));
    expect(next).toHaveBeenCalled();
  });

  it('allowRoles 应拒绝无权限角色', () => {
    req.user = { role: 'user' };
    const middleware = allowRoles('association', 'admin');
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: '无访问权限'
    });
  });

  it('allowRoles 应允许有权限角色', () => {
    req.user = { role: 'association' };
    const middleware = allowRoles('association', 'admin');
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

