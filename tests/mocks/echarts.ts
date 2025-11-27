// tests/mocks/echarts.ts
// 在测试时为全局提供一个简单的 echarts 替身，供集成测试使用
import { vi } from 'vitest'

const chartInstance = {
  setOption: vi.fn(),
  dispose: vi.fn(),
  on: vi.fn(),
  getModel: () => ({ option: {} }),
}

const echarts = {
  init: () => chartInstance,
  connect: vi.fn(),
  disconnect: vi.fn(),
  // For convenience in tests
  _instance: chartInstance,
}

;(globalThis as unknown as { echarts: typeof echarts }).echarts = echarts

export default echarts
// 简易 echarts Mock（供测试使用）
export function init() {
  return {
    setOption: () => {},
    dispose: () => {},
    on: () => {},
    getModel: () => ({ option: {} }),
  }
}

export const connect = () => {}
export const disconnect = () => {}
