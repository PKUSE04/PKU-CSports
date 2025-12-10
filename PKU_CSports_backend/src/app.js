const express = require('express');
const authRoutes = require('./api/auth');
const newsRoutes = require('./api/news');
const matchRoutes = require('./api/matches');
const standingRoutes = require('./api/standings');
const commentRoutes = require('./api/comments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/comments', commentRoutes);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

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
