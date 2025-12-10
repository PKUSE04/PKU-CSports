import { describe, it, expect } from 'vitest'

// 测试工具函数示例
describe('工具函数单元测试', () => {
  it('日期格式化示例', () => {
    const date = '2025-10-17 19:00:00'
    const datePart = date.slice(5, 10) // MM-DD
    const timePart = date.slice(11, 16) // HH:mm
    expect(datePart).toBe('10-17')
    expect(timePart).toBe('19:00')
  })

  it('数组过滤示例', () => {
    const matches = [
      { status: '已结束', league: '新生杯' },
      { status: '直播中', league: '新生杯' },
      { status: '已结束', league: '北大杯' }
    ]
    const filtered = matches.filter(m => m.status === '已结束')
    expect(filtered).toHaveLength(2)
    expect(filtered.every(m => m.status === '已结束')).toBe(true)
  })

  it('对象属性提取示例', () => {
    const match = {
      home_team_name: '信工联队',
      away_team_name: '元社联队',
      home_team_id: 1
    }
    const home = match.home_team_name || match.home_team_id
    expect(home).toBe('信工联队')
  })
})

