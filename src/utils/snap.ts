// 简单的吸附（snap）工具函数
// 提供一个纯函数接口，便于单元测试与独立计算吸附位置，不依赖于 Pinia 或 Vue 的响应式系统
import type { Rect, SnapOptions } from '@/types/snap'

/**
 * 计算吸附后的位置（纯函数）
 * - moving: 正在移动的目标矩形（左上角 x/y 与 width/height）
 * - targets: 候选吸附目标列表
 * - options.threshold: 吸附距离阈值（默认 10px）
 *
 * 当前实现策略：如果有目标的中心点在阈值内，则把 moving 的中心对齐到该目标中心，返回新的左上角坐标。
 * 这是一个简单且可测试的策略，适合作为单元测试的基准函数。
 */
export function computeSnap(moving: Rect, targets: Rect[], options: SnapOptions = {}) {
  const threshold = options.threshold ?? 10
  // 若存在第一个在阈值内的目标，则把 moving 的中心吸附到该目标中心
  for (const t of targets) {
    const targetCenterX = t.x + t.width / 2
    const targetCenterY = t.y + t.height / 2
    const movingCenterX = moving.x + moving.width / 2
    const movingCenterY = moving.y + moving.height / 2
    const dx = targetCenterX - movingCenterX
    const dy = targetCenterY - movingCenterY
    const dist = Math.hypot(dx, dy)
    if (dist <= threshold) {
      // 返回新的左上角坐标，使 moving 的中心与目标中心对齐
      return { x: targetCenterX - moving.width / 2, y: targetCenterY - moving.height / 2 }
    }
  }
  // 未吸附则返回原始位置
  return { x: moving.x, y: moving.y }
}
