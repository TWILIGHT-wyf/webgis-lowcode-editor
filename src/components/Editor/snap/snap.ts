import { useComponent } from '@/stores/component'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

export type Box = {
  minx: number
  miny: number
  maxx: number
  maxy: number
  cx: number
  cy: number
  corners: { x: number; y: number }[]
}

export interface SnapComp {
  id: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation?: number
}

type SnapResult = {
  position: { x: number; y: number }
  lines: { x?: number; y?: number }[]
}

export function useSnap() {
  const store = useComponent()
  const { componentStore, selectComponent } = storeToRefs(store)

  function deg2rad(deg: number): number {
    return (deg * Math.PI) / 180
  }

  const comps = computed(
    () =>
      componentStore.value.map((com) => ({
        id: com.id,
        position: com.position,
        size: com.size,
        rotation: deg2rad(com.rotation ?? 0),
      })) as SnapComp[],
  )

  const meComp = computed(() => ({
    id: selectComponent.value?.id ?? '',
    position: selectComponent.value?.position ?? { x: 0, y: 0 },
    size: selectComponent.value?.size ?? { width: 0, height: 0 },
    rotation: deg2rad(selectComponent.value?.rotation ?? 0),
  }))

  const meBox = computed(() => toBox(meComp.value))

  const boxCache = computed(() => {
    const cache = new Map<string, Box>()
    comps.value.forEach((c) => cache.set(c.id, toBox(c)))
    return cache
  })

  // 将组件转为Box（绕中心旋转）
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

    // 以中心为原点的局部四角点
    const localCorners = [
      { x: -halfW, y: -halfH },
      { x: halfW, y: -halfH },
      { x: halfW, y: halfH },
      { x: -halfW, y: halfH },
    ]

    // 旋转并平移回世界坐标
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

  function getGuideLines(box: Box): { xLines: number[]; yLines: number[] } {
    const xSet = new Set<number>([box.minx, box.cx, box.maxx])
    const ySet = new Set<number>([box.miny, box.cy, box.maxy])
    box.corners.forEach((p) => {
      xSet.add(p.x)
      ySet.add(p.y)
    })
    return { xLines: Array.from(xSet), yLines: Array.from(ySet) }
  }

  // 找邻居
  function findSnapNeighbors(threshold: number = 10): Box[] {
    const neighbors: Box[] = []
    const me = meBox.value
    const myId = meComp.value.id
    boxCache.value.forEach((box, id) => {
      if (!id || id === myId) return
      // 中心距离或边距距离在阈值内
      const dx = box.cx - me.cx
      const dy = box.cy - me.cy
      const centerDist = Math.hypot(dx, dy)
      const horizontalDist = Math.min(
        Math.abs(box.minx - me.maxx),
        Math.abs(box.maxx - me.minx),
        Math.abs(box.cx - me.cx),
      )
      const verticalDist = Math.min(
        Math.abs(box.miny - me.maxy),
        Math.abs(box.maxy - me.miny),
        Math.abs(box.cy - me.cy),
      )
      if (centerDist < threshold || horizontalDist < threshold || verticalDist < threshold) {
        neighbors.push(box)
      }
    })
    return neighbors
  }

  // 网格对齐功能
  function snapToGrid(
    previewPos: { x: number; y: number },
    gridSize: number = 20,
  ): { position: { x: number; y: number }; lines: { x?: number; y?: number }[] } {
    const snappedX = Math.round(previewPos.x / gridSize) * gridSize
    const snappedY = Math.round(previewPos.y / gridSize) * gridSize
    const lines: { x?: number; y?: number }[] = []
    // 只在对齐时显示辅助线
    if (Math.abs(snappedX - previewPos.x) < 2) {
      lines.push({ x: snappedX })
    }
    if (Math.abs(snappedY - previewPos.y) < 2) {
      lines.push({ y: snappedY })
    }
    return { position: { x: snappedX, y: snappedY }, lines }
  }

  // 计算最佳吸附
  function snapToNeighbors(
    threshold: number = 10,
    previewPos?: { x: number; y: number },
  ): SnapResult | null {
    // 使用预览位置（拖拽中的临时位置）计算 me 的包围盒
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

    // 获取当前组件的子组件ID列表(如果是容器)
    const currentComp = componentStore.value.find(c => c.id === meComp.value.id)
    const childrenIds = currentComp?.children || []

    boxCache.value.forEach((box, id) => {
      // 排除自己和自己的子组件
      if (!id || id === meComp.value.id || childrenIds.includes(id)) return

      const { xLines: guideXs, yLines: guideYs } = getGuideLines(box)

      // 水平方向：我的各个锚点(min/cx/max/四角x) 对齐到 对方的边/中心/四角x
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

      // 垂直方向：我的各个锚点(min/cy/max/四角y) 对齐到 对方的边/中心/四角y
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
