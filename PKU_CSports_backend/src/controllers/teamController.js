const teamService = require('../services/teamService');
const { allowRoles } = require('../middleware/auth');

// 创建队伍账号（协会权限）
exports.createTeamAccount = async (req, res) => {
  try {
    const createdBy = req.user.id;
    const { team_id, username, password } = req.body;
    
    if (!team_id || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数：team_id, username, password' 
      });
    }
    
    const result = await teamService.createTeamAccount(team_id, username, password, createdBy);
    
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create team account error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取队伍账号列表（协会权限）
exports.getTeamAccounts = async (req, res) => {
  try {
    const createdBy = req.user.id;
    const accounts = await teamService.getTeamAccounts(createdBy);
    res.json({ success: true, data: accounts });
  } catch (error) {
    console.error('Get team accounts error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取用户的主队信息
exports.getUserTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const team = await teamService.getUserTeam(userId);
    
    if (!team) {
      return res.json({ success: true, data: null });
    }
    
    res.json({ success: true, data: team });
  } catch (error) {
    console.error('Get user team error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取所有队伍列表
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.json({ success: true, data: teams });
  } catch (error) {
    console.error('Get all teams error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

