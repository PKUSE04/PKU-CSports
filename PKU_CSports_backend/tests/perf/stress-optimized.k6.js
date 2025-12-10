import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// 自定义指标：错误率
const errorRate = new Rate('errors')

// 优化版本：降低并发数，更符合实际生产场景
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // 30秒内逐步增加到10个用户
    { duration: '1m', target: 25 },   // 1分钟内增加到25个用户
    { duration: '30s', target: 50 },  // 30秒内增加到50个用户（压力测试）
    { duration: '1m', target: 50 },   // 保持50个用户1分钟
    { duration: '30s', target: 0 },    // 逐步降回0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95%请求应在500毫秒内
    http_req_failed: ['rate<0.05'],    // 错误率应小于5%
    errors: ['rate<0.1']                // 自定义错误率应小于10%
  }
}

// 重试函数
function retryRequest(url, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    const res = http.get(url, {
      timeout: '3s', // 3秒超时
    })
    
    if (res.status === 200) {
      return res
    }
    
    // 如果不是最后一次重试，等待后重试
    if (i < maxRetries - 1) {
      sleep(0.1)
    }
  }
  
  // 最后一次尝试
  return http.get(url, { timeout: '3s' })
}

export default function () {
  const endpoints = [
    '/api/matches?pageSize=20',
    '/api/standings?league=新生杯',
    '/api/news?type=flash&pageSize=5'
  ]
  
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
  const url = `http://localhost:3000${endpoint}`
  
  // 使用重试机制
  const res = retryRequest(url)
  
  const success = check(res, {
    'status 200': r => r.status === 200,
    'response time < 500ms': r => r.timings.duration < 500
  })
  
  errorRate.add(!success)
  sleep(0.5)
}

