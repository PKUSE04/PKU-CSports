import { describe, it, expect, vi, beforeEach } from 'vitest'
// 使用相对路径，避免测试环境解析 @ alias 失败
import { request } from '../../utils/request.js'

// 测试环境下补充 uni 变量引用
const uni: any = (globalThis as any).uni

describe('utils/request', () => {
  beforeEach(() => {
    globalThis.uni.request = vi.fn((opts) => {
      // 模拟成功回调
      opts.success && opts.success({ statusCode: 200, data: { ok: true } })
    })
    globalThis.uni.getStorageSync = vi.fn(() => 'token-123')
  })

  it('应自动拼接 baseURL 并带上 token', async () => {
    await request({ url: '/api/test', method: 'GET' })
    expect(uni.request).toHaveBeenCalledTimes(1)
    const call = uni.request.mock.calls[0][0]
    expect(call.url).toBe('http://10.129.82.168:3000/api/test')
    expect(call.header.Authorization).toBe('Bearer token-123')
  })
})

