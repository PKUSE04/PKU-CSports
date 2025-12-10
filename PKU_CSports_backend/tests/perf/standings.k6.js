import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 15,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'] // 错误率应小于 1%
  }
}

export default function () {
  // 测试积分榜接口
  const standingsRes = http.get('http://localhost:3000/api/standings?league=新生杯')
  check(standingsRes, {
    'standings status 200': r => r.status === 200,
    'standings has team_name': r => r.body.includes('team_name'),
    'standings has points': r => r.body.includes('points')
  })

  // 测试球员榜接口
  const playersRes = http.get('http://localhost:3000/api/standings/players?league=新生杯&sort=goals')
  check(playersRes, {
    'players status 200': r => r.status === 200,
    'players has player_name': r => r.body.includes('player_name')
  })

  sleep(1)
}

