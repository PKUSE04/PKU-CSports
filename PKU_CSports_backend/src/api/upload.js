const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authMiddleware } = require('../middleware/auth');

// 上传接口需要认证
router.post('/', 
  authMiddleware, 
  uploadController.uploadMiddleware, 
  (err, req, res, next) => {
    // 处理 multer 错误
    if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message || '文件上传失败' 
      });
    }
    next();
  },
  uploadController.upload
);

module.exports = router;

