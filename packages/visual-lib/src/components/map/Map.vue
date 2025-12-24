<template>
  <div ref="mapContainer" class="base-map" :style="containerStyle">
    <div v-if="!isReady" class="map-placeholder">
      <slot name="placeholder">
        <div class="placeholder-content">
          <span class="placeholder-icon">🗺️</span>
          <div class="placeholder-text">{{ placeholder }}</div>
        </div>
      </slot>
    </div>
    <!-- 地图实例就绪后渲染子组件（图层） -->
    <slot v-if="isReady"></slot>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  shallowRef,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
  type CSSProperties,
} from 'vue'
import L from 'leaflet'
import type { GISPoint, MapBounds, TileLayerConfig } from '../../types/gis'

// ==================== Props 定义 ====================
export interface MapProps {
  /** 中心点纬度 */
  centerLat?: number
  /** 中心点经度 */
  centerLng?: number
  /** 缩放级别 */
  zoom?: number
  /** 最小缩放级别 */
  minZoom?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 瓦片图层配置 */
  tileConfig?: TileLayerConfig
  /** 瓦片图层URL（简化配置） */
  tileUrl?: string
  /** 瓦片图层属性 */
  attribution?: string
  /** 是否显示缩放控件 */
  zoomControl?: boolean
  /** 是否可拖动 */
  dragging?: boolean
  /** 是否允许滚轮缩放 */
  scrollWheelZoom?: boolean
  /** 是否允许双击缩放 */
  doubleClickZoom?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 边框圆角 */
  borderRadius?: number
  /** 边框 */
  border?: string
  /** 自动适应边界 */
  bounds?: MapBounds
  /** 适应边界时的内边距 */
  boundsPadding?: [number, number]
  /** 是否使用 Canvas 渲染器（高性能模式） */
  preferCanvas?: boolean
  /** 是否显示比例尺 */
  showScale?: boolean
}

const props = withDefaults(defineProps<MapProps>(), {
  centerLat: 39.9,
  centerLng: 116.4,
  zoom: 13,
  minZoom: 1,
  maxZoom: 18,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
  zoomControl: true,
  dragging: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  placeholder: '配置地图中心点以显示底图',
  borderRadius: 0,
  border: 'none',
  boundsPadding: () => [50, 50],
  preferCanvas: true,
  showScale: false,
})

// ==================== Emits 定义 ====================
const emit = defineEmits<{
  ready: [map: L.Map]
  click: [event: { latlng: GISPoint; layerPoint: L.Point; containerPoint: L.Point }]
  moveend: [center: GISPoint, zoom: number]
  zoomend: [zoom: number]
  layeradd: [layer: L.Layer]
  layerremove: [layer: L.Layer]
}>()

// ==================== 响应式状态 ====================
const mapContainer = ref<HTMLDivElement>()
// 使用 shallowRef 避免深度响应式，提升性能
const mapInstance = shallowRef<L.Map | null>(null)
const isReady = ref(false)

// Canvas 渲染器实例（复用）
let canvasRenderer: L.Canvas | null = null
let scaleControl: L.Control.Scale | null = null

// 提供地图实例和渲染器给子组件
provide('mapContext', mapInstance)
provide('mapCanvasRenderer', () => canvasRenderer)

// ==================== 计算属性 ====================
const containerStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
  border: props.border,
}))

// 合并瓦片配置
const effectiveTileConfig = computed<TileLayerConfig>(() => {
  if (props.tileConfig) {
    return props.tileConfig
  }
  return {
    url: props.tileUrl,
    attribution: props.attribution,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
  }
})

// ==================== 地图生命周期方法 ====================

/** 初始化地图 */
function initMap() {
  if (!mapContainer.value) return

  // 销毁旧地图
  destroyMap()

  // 创建 Canvas 渲染器（高性能模式）
  if (props.preferCanvas) {
    canvasRenderer = L.canvas({ padding: 0.5 })
  }

  // 创建地图实例
  const map = L.map(mapContainer.value, {
    center: [props.centerLat, props.centerLng],
    zoom: props.zoom,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    zoomControl: props.zoomControl,
    dragging: props.dragging,
    scrollWheelZoom: props.scrollWheelZoom,
    doubleClickZoom: props.doubleClickZoom,
    // 性能优化配置
    preferCanvas: props.preferCanvas,
    renderer: canvasRenderer || undefined,
    fadeAnimation: false,
    zoomAnimation: true,
    markerZoomAnimation: false,
  } as L.MapOptions)

  // 添加瓦片层
  const tileConfig = effectiveTileConfig.value
  L.tileLayer(tileConfig.url, {
    attribution: tileConfig.attribution,
    minZoom: tileConfig.minZoom ?? props.minZoom,
    maxZoom: tileConfig.maxZoom ?? props.maxZoom,
    subdomains: tileConfig.subdomains ?? ['a', 'b', 'c'],
    opacity: tileConfig.opacity ?? 1,
    keepBuffer: 2,
  } as L.TileLayerOptions).addTo(map)

  // 添加比例尺控件
  if (props.showScale) {
    scaleControl = L.control.scale({ imperial: false }).addTo(map)
  }

  // 绑定事件
  bindMapEvents(map)

  mapInstance.value = map
  isReady.value = true

  // 如果有边界配置，自动适应
  if (props.bounds) {
    fitToBounds(props.bounds)
  }

  emit('ready', map)
}

/** 销毁地图 */
function destroyMap() {
  if (mapInstance.value) {
    // 移除所有事件监听
    mapInstance.value.off()
    mapInstance.value.remove()
    mapInstance.value = null
    isReady.value = false
  }
  canvasRenderer = null
  scaleControl = null
}

/** 绑定地图事件 */
function bindMapEvents(map: L.Map) {
  map.on('click', (e: L.LeafletMouseEvent) => {
    emit('click', {
      latlng: { lat: e.latlng.lat, lng: e.latlng.lng },
      layerPoint: e.layerPoint,
      containerPoint: e.containerPoint,
    })
  })

  map.on('moveend', () => {
    const center = map.getCenter()
    emit('moveend', { lat: center.lat, lng: center.lng }, map.getZoom())
  })

  map.on('zoomend', () => {
    emit('zoomend', map.getZoom())
  })

  map.on('layeradd', (e: L.LayerEvent) => {
    emit('layeradd', e.layer)
  })

  map.on('layerremove', (e: L.LayerEvent) => {
    emit('layerremove', e.layer)
  })
}

// ==================== 视图控制方法 ====================

/** 更新视图（平滑过渡） */
function updateView(animate = true) {
  if (mapInstance.value) {
    mapInstance.value.flyTo([props.centerLat, props.centerLng], props.zoom, {
      animate,
      duration: animate ? 0.5 : 0,
    })
  }
}

/** 适应到指定边界 */
function fitToBounds(bounds: MapBounds, options?: L.FitBoundsOptions) {
  if (!mapInstance.value) return

  const leafletBounds = L.latLngBounds(
    [bounds.southWest.lat, bounds.southWest.lng],
    [bounds.northEast.lat, bounds.northEast.lng],
  )

  mapInstance.value.fitBounds(leafletBounds, {
    padding: props.boundsPadding,
    animate: true,
    ...options,
  })
}

/** 获取当前视口边界 */
function getCurrentBounds(): MapBounds | null {
  if (!mapInstance.value) return null

  const bounds = mapInstance.value.getBounds()
  return {
    northEast: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
    southWest: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
  }
}

/** 使地图失效并重绘（用于容器大小变化后） */
function invalidateSize() {
  mapInstance.value?.invalidateSize()
}

// ==================== 监听器 ====================

// 监听中心点和缩放变化（不使用 deep watch）
watch([() => props.centerLat, () => props.centerLng, () => props.zoom], () => {
  if (mapInstance.value) {
    updateView()
  }
})

// 监听边界变化
watch(
  () => props.bounds,
  (newBounds) => {
    if (newBounds && mapInstance.value) {
      fitToBounds(newBounds)
    }
  },
)

// 监听瓦片配置变化，需要重新初始化
watch([() => props.tileUrl, () => props.tileConfig], () => {
  initMap()
})

// 监听比例尺显示变化
watch(
  () => props.showScale,
  (show) => {
    if (!mapInstance.value) return
    if (show && !scaleControl) {
      scaleControl = L.control.scale({ imperial: false }).addTo(mapInstance.value)
    } else if (!show && scaleControl) {
      scaleControl.remove()
      scaleControl = null
    }
  },
)

// ==================== 生命周期 ====================
onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  destroyMap()
})

// ==================== 暴露方法 ====================
defineExpose({
  /** 获取地图实例 */
  getMap: () => mapInstance.value,
  /** 获取 Canvas 渲染器 */
  getCanvasRenderer: () => canvasRenderer,
  /** 飞行到指定位置 */
  flyTo: (lat: number, lng: number, zoom?: number) => {
    mapInstance.value?.flyTo([lat, lng], zoom ?? props.zoom)
  },
  /** 设置视图（无动画） */
  setView: (lat: number, lng: number, zoom?: number) => {
    mapInstance.value?.setView([lat, lng], zoom ?? props.zoom, { animate: false })
  },
  /** 适应到边界 */
  fitBounds: fitToBounds,
  /** 获取当前边界 */
  getBounds: getCurrentBounds,
  /** 使地图失效并重绘 */
  invalidateSize,
  /** 获取当前缩放级别 */
  getZoom: () => mapInstance.value?.getZoom() ?? props.zoom,
  /** 获取当前中心点 */
  getCenter: (): GISPoint | null => {
    const center = mapInstance.value?.getCenter()
    return center ? { lat: center.lat, lng: center.lng } : null
  },
})
</script>

<style scoped>
.base-map {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.base-map :deep(.leaflet-container) {
  width: 100%;
  height: 100%;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #909399;
  background-color: #f9f9f9;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.placeholder-icon {
  font-size: 48px;
}

.placeholder-text {
  font-size: 14px;
}
</style>
