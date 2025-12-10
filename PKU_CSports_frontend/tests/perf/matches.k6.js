import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<600']
  }
}

export default function () {
  const res = http.get('http://localhost:3000/api/matches?pageSize=20')
  check(res, {
    'status 200': r => r.status === 200,
    'has home_team_name': r => r.body.includes('home_team_name')
  })
  sleep(1)
}

