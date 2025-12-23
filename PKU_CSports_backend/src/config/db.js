const { Pool } = require('pg');

// IMPORTANT: Replace with your actual PostgreSQL credentials.
// It's highly recommended to use environment variables for this in production.
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '', // 请使用环境变量 PG_PASSWORD
  database: process.env.PG_DATABASE || 'csports_db',
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
  max: 30, // 增加连接池大小以支持高并发
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // 连接超时时间
  allowExitOnIdle: false, // 保持连接池活跃
});

// 测试连接
const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL database connected successfully!');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
  }
};
testConnection();

// 添加连接池错误处理
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// 导出 query 方法，自动处理连接获取和释放
pool.query = pool.query.bind(pool);

module.exports = pool;

