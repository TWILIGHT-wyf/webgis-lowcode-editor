// Snap related shared types
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface SnapOptions {
  // 吸附阈值（像素），小于等于该距离会触发吸附
  threshold?: number
}

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
