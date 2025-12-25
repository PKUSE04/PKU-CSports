const tournamentService = require('../services/tournamentService');

exports.createOrUpdate = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const result = await tournamentService.createOrUpdate(payload);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Create/update tournament error:', error);
    res.status(500).json({ success: false, message: '操作失败' });
  }
};

exports.list = async (req, res) => {
  try {
    const { year, type, gender, stage } = req.query;
    const data = await tournamentService.list({ year, type, gender, stage });
    res.json({ success: true, data });
  } catch (error) {
    console.error('List tournaments error:', error);
    res.status(500).json({ success: false, message: '获取列表失败' });
  }
};

exports.detail = async (req, res) => {
  try {
    const tournament = await tournamentService.detail(req.params.id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: '赛事不存在' });
    }
    res.json({ success: true, data: tournament });
  } catch (error) {
    console.error('Get tournament detail error:', error);
    res.status(500).json({ success: false, message: '获取详情失败' });
  }
};

exports.getFilterOptions = async (req, res) => {
  try {
    const options = await tournamentService.getFilterOptions();
    res.json({ success: true, data: options });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ success: false, message: '获取筛选选项失败' });
  }
};


