/**
 * 单元测试：坐标变换 / 吸附算法 / 边框计算
 */
import { describe, it, expect } from 'vitest'
import { computeSnap } from '../../src/utils/snap'

describe('几何计算与吸附算法', () => {
  it('computeSnap 在中心距小于阈值时应吸附到目标中心', () => {
    const targets = [{ x: 0, y: 0, width: 100, height: 100 }]
    // moving 的中心为 60, 25；target 中心为 50,50 -> 距离 sqrt((10)^2+(25)^2) > 10
    // 调整到更接近的情况：将 moving 的中心接近 target center
    const moving2 = { x: 55, y: 45, width: 10, height: 10 }
    // 此时 moving2 中心为 (60,50)，target center=(50,50)，dx=10,dy=0, dist=10
    const result = computeSnap(moving2, targets, { threshold: 10 })
    // 对齐后应使 moving 的中心与 target center 对齐：x = 50 - width/2 = 45
    expect(result.x).toBe(45)
    expect(result.y).toBe(45)
  })
})
