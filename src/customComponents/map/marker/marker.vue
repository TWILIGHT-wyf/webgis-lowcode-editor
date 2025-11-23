<template>
  <div ref="mapContainer" class="marker-map" :style="containerStyle">
    <div v-if="!markers || markers.length === 0" class="map-placeholder">
      <el-icon class="placeholder-icon"><LocationFilled /></el-icon>
      <div class="placeholder-text">{{ placeholder || '配置标记点数据以显示' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { LocationFilled } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

interface MarkerData {
  lat: number
  lng: number
  label?: string
  icon?: string
  color?: string
  popup?: string | Record<string, unknown>
}

const props = defineProps<{ id: string }>()

const emit = defineEmits<{
  markerDrag: [marker: { lat: number; lng: number; index: number }]
  markerClick: [marker: MarkerData & { index: number }]
}>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
const markerLayers: L.Marker[] = []

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const markers = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.markersField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as MarkerData[]) : undefined
    }
  }
  return comp.value?.props.markers as MarkerData[] | undefined
})

const placeholder = computed(() => comp.value?.props.placeholder as string)

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
}))

// 创建自定义图标
function createIcon(marker: MarkerData): L.Icon | L.DivIcon {
  if (marker.icon) {
    return L.icon({
      iconUrl: marker.icon,
      iconSize: (comp.value?.props.iconSize as [number, number]) ?? [25, 41],
      iconAnchor: (comp.value?.props.iconAnchor as [number, number]) ?? [12, 41],
      popupAnchor: (comp.value?.props.popupAnchor as [number, number]) ?? [1, -34],
    })
  }

  if (marker.color) {
    return L.divIcon({
      html: `<div style="background-color: ${marker.color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  const iconUrl = comp.value?.props.iconUrl as string | undefined
  if (iconUrl) {
    return L.icon({
      iconUrl,
      iconSize: (comp.value?.props.iconSize as [number, number]) ?? [25, 41],
      iconAnchor: (comp.value?.props.iconAnchor as [number, number]) ?? [12, 41],
      popupAnchor: (comp.value?.props.popupAnchor as [number, number]) ?? [1, -34],
    })
  }

  return new L.Icon.Default()
}

// 初始化地图
function initMap() {
  if (!mapContainer.value) return

  // 销毁旧地图
  if (map) {
    map.remove()
    map = null
  }

  // 创建新地图
  map = L.map(mapContainer.value, {
    center: [
      (comp.value?.props.centerLat as number) ?? 39.9,
      (comp.value?.props.centerLng as number) ?? 116.4,
    ],
    zoom: (comp.value?.props.zoom as number) ?? 10,
    zoomControl: true,
  })

  // 添加底图
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)

  // 添加标记点
  addMarkers()
}

// 添加标记点
function addMarkers() {
  if (!map || !markers.value) return

  // 清除旧标记
  markerLayers.forEach((marker) => map?.removeLayer(marker))
  markerLayers.length = 0

  // 添加新标记
  markers.value.forEach((markerData: MarkerData, index: number) => {
    const marker = L.marker([markerData.lat, markerData.lng], {
      icon: createIcon(markerData),
      draggable: (comp.value?.props.draggableMarkers as boolean) ?? false,
    })

    // 标签
    const showLabel = comp.value?.props.showLabel as boolean
    if (showLabel && markerData.label) {
      marker.bindTooltip(markerData.label, {
        permanent: true,
        direction: 'top',
        className: 'marker-label',
      })
    }

    // 弹窗
    if (markerData.popup) {
      const popupContent =
        typeof markerData.popup === 'string'
          ? markerData.popup
          : Object.entries(markerData.popup)
              .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
              .join('<br>')
      marker.bindPopup(popupContent)
    }

    // 事件
    marker.on('click', () => {
      emit('markerClick', { ...markerData, index })
    })

    marker.on('dragend', () => {
      const latlng = marker.getLatLng()
      emit('markerDrag', { lat: latlng.lat, lng: latlng.lng, index })
    })

    marker.addTo(map!)
    markerLayers.push(marker)
  })

  // 自适应视图
  if (markerLayers.length > 0) {
    const group = L.featureGroup(markerLayers)
    map!.fitBounds(group.getBounds(), { padding: [50, 50] })
  }
}

// 监听数据变化
watch(markers, () => {
  if (map) {
    addMarkers()
  }
})

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped lang="scss">
.marker-map {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

  :deep(.leaflet-container) {
    width: 100%;
    height: 100%;
  }

  :deep(.marker-label) {
    background: transparent;
    border: none;
    box-shadow: none;
    font-weight: 500;
    color: #303133;
    text-shadow:
      1px 1px 2px white,
      -1px -1px 2px white;
  }

  :deep(.custom-marker-icon) {
    background: transparent;
    border: none;
  }
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

  .placeholder-icon {
    font-size: 48px;
    margin-bottom: 12px;
    color: #c0c4cc;
  }

  .placeholder-text {
    font-size: 14px;
  }
}
</style>
