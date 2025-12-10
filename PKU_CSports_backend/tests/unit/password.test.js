const { hashPassword, comparePassword } = require('../../src/utils/password');

describe('密码工具函数单元测试', () => {
  it('hashPassword 应生成不同的哈希值', async () => {
    const password = 'test123';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);
    
    expect(hash1).not.toBe(hash2); // 每次生成的盐不同，哈希值也不同
    expect(hash1.length).toBeGreaterThan(50); // bcrypt 哈希值长度
  });

  it('comparePassword 应正确验证密码', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    
    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
    
    const isInvalid = await comparePassword('wrong', hash);
    expect(isInvalid).toBe(false);
  });

  it('comparePassword 应处理空密码', async () => {
    const hash = await hashPassword('test');
    const result = await comparePassword('', hash);
    expect(result).toBe(false);
  });
});

