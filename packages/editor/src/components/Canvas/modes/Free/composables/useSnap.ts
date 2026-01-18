import { useComponent } from '@/stores/component'
import { computed } from 'vue'
import type { Box, SnapComp } from '@vela/core/types/snap'
import type { NodeSchema } from '@vela/core'

type SnapResult = {
  position: { x: number; y: number }
  lines: { x?: number; y?: number }[]
}

/**
 * Helper to extract position/size from NodeSchema style
 */
function getNodePosition(node: NodeSchema): { x: number; y: number } {
  const style = node.style || {}
  return {
    x: (style.x as number) ?? 0,
    y: (style.y as number) ?? 0,
  }
}

function getNodeSize(node: NodeSchema): { width: number; height: number } {
  const style = node.style || {}
  return {
    width: (style.width as number) ?? 100,
    height: (style.height as number) ?? 100,
  }
}

function getNodeRotation(node: NodeSchema): number {
  const style = node.style || {}
  return (style.rotation as number) ?? 0
}

/**
 * 吸附计算 Composable
 * 提供网格吸附和邻居组件吸附的纯计算逻辑
 */
export function useSnap() {
  const store = useComponent()

  function deg2rad(deg: number): number {
    return (deg * Math.PI) / 180
  }

  // ========== 响应式数据 ==========
  const comps = computed(() => {
    const allNodes = store.componentStore
    return allNodes.map((node: NodeSchema) => ({
      id: node.id,
      position: getNodePosition(node),
      size: getNodeSize(node),
      rotation: deg2rad(getNodeRotation(node)),
    })) as SnapComp[]
  })

  const meComp = computed(() => {
    const selected = store.selectedNode
    if (!selected) {
      return {
        id: '',
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
      }
    }
    return {
      id: selected.id,
      position: getNodePosition(selected),
      size: getNodeSize(selected),
      rotation: deg2rad(getNodeRotation(selected)),
    }
  })

  const meBox = computed(() => toBox(meComp.value))

  const boxCache = computed(() => {
    const cache = new Map<string, Box>()
    comps.value.forEach((c) => cache.set(c.id, toBox(c)))
    return cache
  })

  // ========== 核心计算函数 ==========

  /**
   * 将组件转换为包围盒（支持旋转）
   */
  function toBox(com: SnapComp): Box {
    const { x, y } = com.position
    const { width, height } = com.size
    const rotation = com.rotation || 0

    const halfW = width / 2
    const halfH = height / 2
    const cx0 = x + halfW
    const cy0 = y + halfH

    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)

    const localCorners = [
      { x: -halfW, y: -halfH },
      { x: halfW, y: -halfH },
      { x: halfW, y: halfH },
      { x: -halfW, y: halfH },
    ]

    const transformedCorners = localCorners.map((p) => ({
      x: p.x * cos - p.y * sin + cx0,
      y: p.x * sin + p.y * cos + cy0,
    }))

    const xs = transformedCorners.map((p) => p.x)
    const ys = transformedCorners.map((p) => p.y)
    const minx = Math.min(...xs)
    const maxx = Math.max(...xs)
    const miny = Math.min(...ys)
    const maxy = Math.max(...ys)
    const cx = (minx + maxx) / 2
    const cy = (miny + maxy) / 2

    return { minx, miny, maxx, maxy, cx, cy, corners: transformedCorners }
  }

  /**
   * 获取组件的辅助线位置
   */
  function getGuideLines(box: Box): { xLines: number[]; yLines: number[] } {
    const xSet = new Set<number>([box.minx, box.cx, box.maxx])
    const ySet = new Set<number>([box.miny, box.cy, box.maxy])
    box.corners.forEach((p) => {
      xSet.add(p.x)
      ySet.add(p.y)
    })
    return { xLines: Array.from(xSet), yLines: Array.from(ySet) }
  }

  /**
   * 找到可能产生吸附的邻居组件
   */
  function findSnapNeighbors(targetBox: Box, threshold: number = 10): { box: Box; id: string }[] {
    const neighbors: { box: Box; id: string }[] = []
    const myId = meComp.value.id

    boxCache.value.forEach((box, id) => {
      if (!id || id === myId) return

      const searchDist = threshold + 10

      const isCloseX =
        Math.abs(box.cx - targetBox.cx) <
        (box.maxx - box.minx + targetBox.maxx - targetBox.minx) / 2 + searchDist
      const isCloseY =
        Math.abs(box.cy - targetBox.cy) <
        (box.maxy - box.miny + targetBox.maxy - targetBox.miny) / 2 + searchDist

      if (isCloseX && isCloseY) {
        neighbors.push({ box, id })
      }
    })
    return neighbors
  }

  /**
   * 网格对齐
   */
  function snapToGrid(
    previewPos: { x: number; y: number },
    gridSize: number = 20,
  ): { position: { x: number; y: number }; lines: { x?: number; y?: number }[] } {
    const snappedX = Math.round(previewPos.x / gridSize) * gridSize
    const snappedY = Math.round(previewPos.y / gridSize) * gridSize
    const lines: { x?: number; y?: number }[] = []

    if (Math.abs(snappedX - previewPos.x) < 2) {
      lines.push({ x: snappedX })
    }
    if (Math.abs(snappedY - previewPos.y) < 2) {
      lines.push({ y: snappedY })
    }
    return { position: { x: snappedX, y: snappedY }, lines }
  }

  /**
   * 计算与邻居组件的最佳吸附
   */
  function snapToNeighbors(
    threshold: number = 10,
    previewPos?: { x: number; y: number },
  ): SnapResult | null {
    const meCompEffective: SnapComp = previewPos
      ? { ...meComp.value, position: previewPos }
      : meComp.value
    const me = toBox(meCompEffective)
    const mePos = meCompEffective.position
    const myXAnchors = [me.minx, me.cx, me.maxx, ...me.corners.map((p) => p.x)]
    const myYAnchors = [me.miny, me.cy, me.maxy, ...me.corners.map((p) => p.y)]

    let bestDx: number | null = null
    let bestDy: number | null = null
    let bestDxDist = threshold + 1
    let bestDyDist = threshold + 1
    let xLine: number | undefined
    let yLine: number | undefined

    const candidateBoxes = findSnapNeighbors(me, threshold)
    const currentComp = store.selectedNode
    const childrenIds = currentComp?.children?.map((c: NodeSchema) => c.id) || []

    candidateBoxes.forEach(({ box, id }) => {
      if (!id || id === meComp.value.id || childrenIds.includes(id)) return

      const { xLines: guideXs, yLines: guideYs } = getGuideLines(box)

      for (const myX of myXAnchors) {
        for (const gx of guideXs) {
          const dx = gx - myX
          const dist = Math.abs(dx)
          if (dist < bestDxDist && dist <= threshold) {
            bestDxDist = dist
            bestDx = dx
            xLine = gx
          }
        }
      }

      for (const myY of myYAnchors) {
        for (const gy of guideYs) {
          const dy = gy - myY
          const dist = Math.abs(dy)
          if (dist < bestDyDist && dist <= threshold) {
            bestDyDist = dist
            bestDy = dy
            yLine = gy
          }
        }
      }
    })

    if (bestDx == null && bestDy == null) return null

    const nx = mePos.x + (bestDx ?? 0)
    const ny = mePos.y + (bestDy ?? 0)
    const lines: { x?: number; y?: number }[] = []
    if (xLine !== undefined) lines.push({ x: xLine })
    if (yLine !== undefined) lines.push({ y: yLine })

    return { position: { x: nx, y: ny }, lines }
  }

  return {
    comps,
    meComp,
    meBox,
    boxCache,
    findSnapNeighbors,
    snapToNeighbors,
    snapToGrid,
  }
}
