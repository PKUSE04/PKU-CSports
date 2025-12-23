const express = require('express');
const path = require('path');
const authRoutes = require('./api/auth');
const newsRoutes = require('./api/news');
const matchRoutes = require('./api/matches');
const standingRoutes = require('./api/standings');
const commentRoutes = require('./api/comments');
const uploadRoutes = require('./api/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 中间件（需要在路由之前）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

// Middleware to parse JSON bodies
app.use(express.json());

// 静态文件服务：提供上传文件的访问
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);

// A simple welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the CSports API!');
});

// 404 JSON
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// 错误兜底
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Server Error' });
});

// 仅在直接运行时启动监听，测试中可直接 import app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
