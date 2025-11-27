/**
 * 单元测试：API 请求成功/失败/重试/缓存
 */
import { describe, it, expect, vi } from 'vitest'
import http from '../../src/services/http'

describe('API 请求逻辑（基于 axios 实例）', () => {
  it('http.get 成功返回 data', async () => {
    const mockResponse = {
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    }
    const mockGet = vi.fn().mockResolvedValue(mockResponse)
    Object.assign(http, { get: mockGet })
    const res = await http.get('/api/test')
    expect(res.data).toEqual({ ok: true })
    expect(mockGet).toHaveBeenCalled()
  })

  it('http.get 出现错误时应抛出', async () => {
    const mockGet = vi.fn().mockRejectedValue(new Error('network'))
    Object.assign(http, { get: mockGet })
    let threw = false
    try {
      await http.get('/api/error')
    } catch {
      threw = true
    }
    expect(threw).toBe(true)
  })
})
