const matchService = require('../services/matchService');

exports.list = async (req, res) => {
  try {
    const { status = '', league = '', round = '', page = 1, pageSize = 20 } = req.query;
    const data = await matchService.list({ status, league, round, page, pageSize });
    res.json({ success: true, data });
  } catch (err) {
    console.error('match list error', err);
    res.status(500).json({ success: false, message: '获取赛程失败' });
  }
};

exports.detail = async (req, res) => {
  try {
    const data = await matchService.detail(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: '未找到比赛' });
    res.json({ success: true, data });
  } catch (err) {
    console.error('match detail error', err);
    res.status(500).json({ success: false, message: '获取详情失败' });
  }
};

exports.upsertResult = async (req, res) => {
  try {
    const data = await matchService.upsertResult(req.params.id, req.body || {});
    res.json({ success: true, data });
  } catch (err) {
    console.error('match result error', err);
    res.status(500).json({ success: false, message: '更新比分失败' });
  }
};

exports.upsertLineup = async (req, res) => {
  try {
    const data = await matchService.upsertLineup(req.params.id, req.body || {});
    res.json({ success: true, data });
  } catch (err) {
    console.error('match lineup error', err);
    res.status(500).json({ success: false, message: '更新阵容失败' });
  }
};

exports.addLineupItem = async (req, res) => {
  try {
    const item = req.body || {};
    const data = await matchService.addLineupItem(req.params.id, item);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('add lineup item error', err);
    res.status(500).json({ success: false, message: '添加阵容失败' });
  }
};

exports.updateLineupItem = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const payload = req.body || {};
    const data = await matchService.updateLineupItem(req.params.id, playerId, payload);
    if (!data) return res.status(404).json({ success: false, message: '未找到该阵容条目' });
    res.json({ success: true, data });
  } catch (err) {
    console.error('update lineup item error', err);
    res.status(500).json({ success: false, message: '更新阵容项失败' });
  }
};

exports.deleteLineupItem = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const result = await matchService.deleteLineupItem(req.params.id, playerId);
    if (!result) return res.status(404).json({ success: false, message: '未找到该阵容条目' });
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    console.error('delete lineup item error', err);
    res.status(500).json({ success: false, message: '删除阵容项失败' });
  }
};

