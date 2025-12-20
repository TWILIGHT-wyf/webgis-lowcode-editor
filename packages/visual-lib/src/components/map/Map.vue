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
    <!-- 地图实例就绪后渲染子组件 -->
    <slot v-if="isReady"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, provide, type CSSProperties } from 'vue'
import L from 'leaflet'


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
  /** 瓦片图层URL */
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
})

const emit = defineEmits<{
  ready: [map: L.Map]
  click: [e: L.LeafletMouseEvent]
  moveend: [center: { lat: number; lng: number }, zoom: number]
  zoomend: [zoom: number]
}>()

const mapContainer = ref<HTMLDivElement>()
const mapInstance = ref<L.Map | null>(null)
const isReady = ref(false)

// 提供地图实例给子组件
provide('mapContext', mapInstance)

const containerStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined,
  border: props.border,
}))

// 初始化地图
function initMap() {
  if (!mapContainer.value) return

  // 销毁旧地图
  destroyMap()

  // 创建新地图
  const map = L.map(mapContainer.value, {
    center: [props.centerLat, props.centerLng],
    zoom: props.zoom,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    zoomControl: props.zoomControl,
    dragging: props.dragging,
    scrollWheelZoom: props.scrollWheelZoom,
    doubleClickZoom: props.doubleClickZoom,
  })

  // 添加瓦片层
  L.tileLayer(props.tileUrl, {
    attribution: props.attribution,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
  }).addTo(map)

  // 绑定事件
  map.on('click', (e) => emit('click', e))
  map.on('moveend', () => {
    const center = map.getCenter()
    emit('moveend', { lat: center.lat, lng: center.lng }, map.getZoom())
  })
  map.on('zoomend', () => emit('zoomend', map.getZoom()))

  mapInstance.value = map
  isReady.value = true
  emit('ready', map)
}

// 销毁地图
function destroyMap() {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
    isReady.value = false
  }
}

// 更新视图
function updateView() {
  if (mapInstance.value) {
    mapInstance.value.flyTo([props.centerLat, props.centerLng], props.zoom, {
      animate: true,
      duration: 0.5,
    })
  }
}

// 监听配置变化
watch([() => props.centerLat, () => props.centerLng, () => props.zoom], () => {
  if (mapInstance.value) {
    updateView()
  }
})

// 监听瓦片URL变化，需要重新初始化
watch(
  () => props.tileUrl,
  () => {
    initMap()
  },
)

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  destroyMap()
})

// 暴露方法给父组件
defineExpose({
  getMap: () => mapInstance.value,
  flyTo: (lat: number, lng: number, zoom?: number) => {
    mapInstance.value?.flyTo([lat, lng], zoom ?? props.zoom)
  },
  setView: (lat: number, lng: number, zoom?: number) => {
    mapInstance.value?.setView([lat, lng], zoom ?? props.zoom)
  },
  fitBounds: (bounds: L.LatLngBoundsExpression, options?: L.FitBoundsOptions) => {
    mapInstance.value?.fitBounds(bounds, options)
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
