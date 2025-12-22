const userService = require('../services/userService');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '请求失败，用户名和密码为必填项' 
      });
    }

    // Call the service layer to perform login
    const result = await userService.loginUser(username, password);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.message });
    }

    // Login successful, send back token and user info
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token: result.token,
        user: result.user,
      },
    });

  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码为必填项' });
    }

    const result = await userService.registerUser(username, password);

    if (!result.success) {
      // 用户已存在 -> 409 Conflict
      return res.status(409).json({ success: false, message: result.message });
    }

    // 注册成功，返回 token 和用户信息
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token: result.token,
        user: result.user,
      },
    });

  } catch (error) {
    console.error('Register controller error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};
