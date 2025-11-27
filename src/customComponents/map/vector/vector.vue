<template>
  <div ref="mapContainer" class="vector-layer-map">
    <div v-if="!vectorData || vectorData.length === 0" class="map-placeholder">
      <el-icon class="placeholder-icon"><Pointer /></el-icon>
      <div class="placeholder-text">{{ placeholder || '配置矢量数据以显示图层' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Pointer } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

interface VectorFeature {
  type: 'point' | 'line' | 'polygon'
  coordinates: number[] | number[][] | number[][][]
  properties?: Record<string, unknown>
  style?: {
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
    radius?: number
  }
}

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
const vectorLayers: L.Layer[] = []

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const vectorData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.vectorDataField as string | undefined
    if (field && typeof field === 'string') {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as VectorFeature[]) : undefined
    }
  }
  return comp.value?.props.vectorData as VectorFeature[] | undefined
})

const placeholder = computed(() => comp.value?.props.placeholder as string)

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

  // 添加矢量数据
  addVectorLayers()
}

// 添加矢量图层
function addVectorLayers() {
  if (!map || !vectorData.value) return

  // 清除旧图层
  vectorLayers.forEach((layer) => map?.removeLayer(layer))
  vectorLayers.length = 0

  // 添加新图层
  vectorData.value.forEach((feature: VectorFeature) => {
    let layer: L.Layer | null = null

    const defaultStyle = comp.value?.props.defaultStyle as Record<string, unknown> | undefined
    const style = {
      ...defaultStyle,
      ...feature.style,
    }

    switch (feature.type) {
      case 'point':
        if (Array.isArray(feature.coordinates) && feature.coordinates.length === 2) {
          const [lng, lat] = feature.coordinates as [number, number]
          layer = L.circleMarker([lat, lng], {
            radius: style.radius ?? 8,
            color: style.color ?? '#3388ff',
            weight: style.weight ?? 2,
            opacity: style.opacity ?? 1,
            fillColor: style.fillColor ?? '#3388ff',
            fillOpacity: style.fillOpacity ?? 0.5,
          })
        }
        break

      case 'line':
        if (Array.isArray(feature.coordinates)) {
          const latlngs = (feature.coordinates as number[][]).map(([lng, lat]) => [lat, lng])
          layer = L.polyline(latlngs as [number, number][], {
            color: style.color ?? '#3388ff',
            weight: style.weight ?? 3,
            opacity: style.opacity ?? 0.8,
          })
        }
        break

      case 'polygon':
        if (Array.isArray(feature.coordinates)) {
          const coords = feature.coordinates as number[][][]
          const latlngs = coords[0] ? coords[0].map(([lng, lat]) => [lat, lng]) : []
          layer = L.polygon(latlngs as [number, number][], {
            color: style.color ?? '#3388ff',
            weight: style.weight ?? 2,
            opacity: style.opacity ?? 0.8,
            fillColor: style.fillColor ?? '#3388ff',
            fillOpacity: style.fillOpacity ?? 0.4,
          })
        }
        break
    }

    if (layer) {
      const showPopup = comp.value?.props.showPopup as boolean
      if (showPopup && feature.properties) {
        const popupContent = Object.entries(feature.properties)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join('<br>')
        layer.bindPopup(popupContent)
      }
      layer.addTo(map!)
      vectorLayers.push(layer)
    }
  })
  // 
  // 自适应视图
  if (vectorLayers.length > 0) {
    const group = L.featureGroup(vectorLayers)
    map!.fitBounds(group.getBounds(), { padding: [50, 50] })
  }
}

// 监听数据变化
watch(vectorData, () => {
  if (map) {
    addVectorLayers()
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
.vector-layer-map {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

  :deep(.leaflet-container) {
    width: 100%;
    height: 100%;
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
