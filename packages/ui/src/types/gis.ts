/**
 * GIS 通用类型定义
 * Smart 和 Dumb 组件之间的数据契约
 */

// ==================== 基础类型 ====================

/** 基础坐标点 */
export interface GISPoint {
  lat: number
  lng: number
}

/** 带强度的热力点 */
export interface HeatPoint extends GISPoint {
  /** 热力强度 0-1 */
  intensity?: number
}

/** 聚合/标记点数据 */
export interface MarkerPoint extends GISPoint {
  /** 唯一标识 */
  id?: string | number
  /** 标签文本 */
  label?: string
  /** 弹窗内容 */
  popup?: string
  /** 图标 URL */
  icon?: string
  /** 图标大小 [width, height] */
  iconSize?: [number, number]
  /** 图标锚点 [x, y] */
  iconAnchor?: [number, number]
  /** 自定义数据 */
  data?: Record<string, unknown>
}

// ==================== GeoJSON 类型 ====================

/** GeoJSON 几何类型 */
export type GeoJSONGeometryType =
  | 'Point'
  | 'MultiPoint'
  | 'LineString'
  | 'MultiLineString'
  | 'Polygon'
  | 'MultiPolygon'
  | 'GeometryCollection'

/** GeoJSON 几何对象 */
export interface GeoJSONGeometry {
  type: GeoJSONGeometryType
  coordinates: number[] | number[][] | number[][][] | number[][][][]
}

/** GeoJSON Feature */
export interface GeoJSONFeature<P = Record<string, unknown>> {
  type: 'Feature'
  geometry: GeoJSONGeometry
  properties: P
  id?: string | number
}

/** GeoJSON FeatureCollection */
export interface GeoJSONFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection'
  features: GeoJSONFeature<P>[]
}

/** GeoJSON 数据类型联合 */
export type GeoJSONData<P = Record<string, unknown>> =
  | GeoJSONFeature<P>
  | GeoJSONFeatureCollection<P>

// ==================== 地图配置类型 ====================

/** 边界框 */
export interface MapBounds {
  northEast: GISPoint
  southWest: GISPoint
}

/** 地图视口配置 */
export interface MapViewport {
  center: GISPoint
  zoom: number
  bounds?: MapBounds
}

/** 瓦片图层配置 */
export interface TileLayerConfig {
  url: string
  attribution?: string
  minZoom?: number
  maxZoom?: number
  subdomains?: string[]
  opacity?: number
}

/** 图层可见性配置 */
export interface LayerVisibility {
  id: string
  name: string
  visible: boolean
  type: 'tile' | 'heat' | 'cluster' | 'geojson' | 'vector'
}

// ==================== 热力图配置类型 ====================

/** 热力图渐变色配置 */
export interface HeatGradient {
  [stop: number]: string
}

/** 热力图配置 */
export interface HeatLayerConfig {
  /** 热力点半径（像素） */
  radius?: number
  /** 模糊程度（像素） */
  blur?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 最大强度值 */
  max?: number
  /** 最小透明度 */
  minOpacity?: number
  /** 渐变色配置 */
  gradient?: HeatGradient
}

// ==================== 聚合图配置类型 ====================

/** 聚合图标配置 */
export interface ClusterIconConfig {
  /** 默认图标 URL */
  iconUrl?: string
  /** 图标大小 */
  iconSize?: [number, number]
  /** 图标锚点 */
  iconAnchor?: [number, number]
  /** 弹窗锚点 */
  popupAnchor?: [number, number]
}

/** 聚合簇样式配置 */
export interface ClusterStyleConfig {
  /** 小聚合簇阈值 */
  smallThreshold?: number
  /** 中聚合簇阈值 */
  mediumThreshold?: number
  /** 小聚合簇样式 */
  smallStyle?: {
    backgroundColor?: string
    color?: string
    size?: number
  }
  /** 中聚合簇样式 */
  mediumStyle?: {
    backgroundColor?: string
    color?: string
    size?: number
  }
  /** 大聚合簇样式 */
  largeStyle?: {
    backgroundColor?: string
    color?: string
    size?: number
  }
}

/** 聚合图层配置 */
export interface ClusterLayerConfig {
  /** 最大聚合半径 */
  maxClusterRadius?: number
  /** 禁用聚合的缩放级别 */
  disableClusteringAtZoom?: number
  /** 最大缩放时展开为蜘蛛网形式 */
  spiderfyOnMaxZoom?: boolean
  /** 鼠标悬停时显示聚合范围 */
  showCoverageOnHover?: boolean
  /** 点击聚合簇时缩放到边界 */
  zoomToBoundsOnClick?: boolean
  /** 是否启用分块加载 */
  chunkedLoading?: boolean
  /** 图标配置 */
  iconConfig?: ClusterIconConfig
  /** 聚合簇样式 */
  clusterStyle?: ClusterStyleConfig
}

// ==================== 事件类型 ====================

/** 地图点击事件数据 */
export interface MapClickEvent {
  latlng: GISPoint
  layerPoint: { x: number; y: number }
  containerPoint: { x: number; y: number }
}

/** 标记点击事件数据 */
export interface MarkerClickEvent {
  marker: MarkerPoint
  index: number
  originalEvent?: MouseEvent
}

/** 聚合簇点击事件数据 */
export interface ClusterClickEvent {
  /** 聚合簇中心点 */
  center: GISPoint
  /** 聚合簇包含的标记数量 */
  count: number
  /** 聚合簇边界 */
  bounds: MapBounds
  /** 聚合簇内的所有标记 */
  markers: MarkerPoint[]
}

// ==================== 数据状态类型 ====================

/** 数据加载状态 */
export type DataLoadingState = 'idle' | 'loading' | 'success' | 'error'

/** 带状态的数据包装器 */
export interface DataWithState<T> {
  data: T
  state: DataLoadingState
  error?: string
  /** 数据版本号，用于增量更新检测 */
  version?: number
}

// ==================== 工具类型 ====================

/** 将普通数组转换为 HeatPoint 数组的映射配置 */
export interface HeatDataMapping {
  latField: string
  lngField: string
  intensityField?: string
}

/** 将普通数组转换为 MarkerPoint 数组的映射配置 */
export interface MarkerDataMapping {
  idField?: string
  latField: string
  lngField: string
  labelField?: string
  popupField?: string
  iconField?: string
  dataFields?: string[]
}
