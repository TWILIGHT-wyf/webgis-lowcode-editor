/**
 * Snap/alignment types for the free canvas mode
 */

/**
 * A point with x and y coordinates
 */
export interface Point {
  x: number
  y: number
}

/**
 * A size with width and height
 */
export interface Size {
  width: number
  height: number
}

/**
 * A bounding box with min/max coordinates
 * Note: Uses lowercase property names (minx, miny, etc.) for compatibility with useSnap.ts
 */
export interface Box {
  minx: number
  miny: number
  maxx: number
  maxy: number
  cx: number
  cy: number
  corners: Point[]
}

/**
 * Component data for snap calculations
 */
export interface SnapComp {
  id: string
  position: Point
  size: Size
  rotation: number
}

/**
 * A snap line (horizontal or vertical)
 */
export interface SnapLine {
  x?: number
  y?: number
}

/**
 * Result of a snap calculation
 */
export interface SnapResult {
  position: Point
  lines: SnapLine[]
}

/**
 * Grid snap options
 */
export interface GridSnapOptions {
  enabled: boolean
  size: number
}

/**
 * Neighbor snap options
 */
export interface NeighborSnapOptions {
  enabled: boolean
  threshold: number
}
