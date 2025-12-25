const matchEventService = require('../services/matchEventService');

exports.create = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user.id
    };
    
    const result = await matchEventService.create(payload);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create match event error:', error);
    res.status(500).json({ success: false, message: '创建事件失败' });
  }
};

exports.getByMatch = async (req, res) => {
  try {
    const events = await matchEventService.getByMatch(req.params.matchId);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Get match events error:', error);
    res.status(500).json({ success: false, message: '获取事件列表失败' });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await matchEventService.delete(req.params.id, req.user.id);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete match event error:', error);
    res.status(500).json({ success: false, message: '删除事件失败' });
  }
};


