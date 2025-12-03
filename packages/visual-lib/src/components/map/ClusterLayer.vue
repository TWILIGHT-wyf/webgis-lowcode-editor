<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

export interface ClusterMarkerData {
  lat: number
  lng: number
  label?: string
  popup?: string
}

export interface ClusterLayerProps {
  /** 标记数据 */
  markers: ClusterMarkerData[]
  /** 最大聚合半径 */
  maxClusterRadius?: number
  /** 禁用聚合的缩放级别 */
  disableClusteringAtZoom?: number
  /** 最大缩放时展开 */
  spiderfyOnMaxZoom?: boolean
  /** 悬停时显示覆盖范围 */
  showCoverageOnHover?: boolean
  /** 点击时缩放到边界 */
  zoomToBoundsOnClick?: boolean
}

const props = withDefaults(defineProps<ClusterLayerProps>(), {
  maxClusterRadius: 80,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
})

const emit = defineEmits<{
  markerClick: [marker: ClusterMarkerData, index: number]
}>()

// 从父组件注入地图实例
const mapContext = inject<Ref<L.Map | null>>('mapContext')

let markerClusterGroup: L.MarkerClusterGroup | null = null

// 创建聚合层
function createClusterLayer() {
  const map = mapContext?.value
  if (!map || !props.markers || props.markers.length === 0) return

  // 移除旧聚合层
  removeClusterLayer()

  // 创建聚合组
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: props.maxClusterRadius,
    disableClusteringAtZoom: props.disableClusteringAtZoom,
    spiderfyOnMaxZoom: props.spiderfyOnMaxZoom,
    showCoverageOnHover: props.showCoverageOnHover,
    zoomToBoundsOnClick: props.zoomToBoundsOnClick,
  })

  // 添加标记到聚合组
  props.markers.forEach((markerData, index) => {
    const marker = L.marker([markerData.lat, markerData.lng])

    // 弹窗
    if (markerData.popup) {
      marker.bindPopup(markerData.popup)
    }

    // 标签
    if (markerData.label) {
      marker.bindTooltip(markerData.label)
    }

    // 点击事件
    marker.on('click', () => {
      emit('markerClick', markerData, index)
    })

    markerClusterGroup!.addLayer(marker)
  })

  map.addLayer(markerClusterGroup)
}

// 移除聚合层
function removeClusterLayer() {
  if (markerClusterGroup && mapContext?.value) {
    mapContext.value.removeLayer(markerClusterGroup)
    markerClusterGroup = null
  }
}

// 监听数据变化
watch(() => props.markers, createClusterLayer, { deep: true })

// 监听配置变化
watch(
  [
    () => props.maxClusterRadius,
    () => props.disableClusteringAtZoom,
    () => props.spiderfyOnMaxZoom,
    () => props.showCoverageOnHover,
    () => props.zoomToBoundsOnClick,
  ],
  () => {
    createClusterLayer()
  },
)

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map) {
      createClusterLayer()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (mapContext?.value) {
    createClusterLayer()
  }
})

onBeforeUnmount(() => {
  removeClusterLayer()
})

defineExpose({
  getLayer: () => markerClusterGroup,
})
</script>
