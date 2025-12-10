import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<400']
  }
}

export default function () {
  // 测试快讯接口
  const flashRes = http.get('http://localhost:3000/api/news?type=flash&pageSize=5')
  check(flashRes, {
    'flash status 200': r => r.status === 200,
    'flash has data': r => {
      const body = JSON.parse(r.body)
      return body.success === true && Array.isArray(body.data)
    }
  })

  // 测试战报接口
  const reportRes = http.get('http://localhost:3000/api/news?type=report&pageSize=5')
  check(reportRes, {
    'report status 200': r => r.status === 200,
    'report has title': r => r.body.includes('title')
  })

  sleep(1)
}

