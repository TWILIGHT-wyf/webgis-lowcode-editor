<template>
  <div ref="mapContainer" class="cluster-map" :style="containerStyle">
    <div v-if="!markers || markers.length === 0" class="map-placeholder">
      <icon class="placeholder-icon"><Connection /></icon>
      <div class="placeholder-text">{{ placeholder || '配置标记点数据以显示聚合' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Connection } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

interface MarkerData {
  lat: number
  lng: number
  label?: string
  popup?: string | Record<string, unknown>
}

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let markerClusterGroup: L.MarkerClusterGroup | null = null

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
    zoom: (comp.value?.props.zoom as number) ?? 5,
    zoomControl: true,
  })

  // 添加底图
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)

  // 添加聚合标记
  addClusterMarkers()
}

// 添加聚合标记
function addClusterMarkers() {
  if (!map || !markers.value || !Array.isArray(markers.value)) return

  // 清除旧聚合层
  if (markerClusterGroup) {
    map.removeLayer(markerClusterGroup)
    markerClusterGroup = null
  }

  // 创建聚合组
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: (comp.value?.props.maxClusterRadius as number) ?? 80,
    disableClusteringAtZoom: comp.value?.props.disableClusteringAtZoom as number | undefined,
    spiderfyOnMaxZoom: (comp.value?.props.spiderfyOnMaxZoom as boolean) ?? true,
    showCoverageOnHover: (comp.value?.props.showCoverageOnHover as boolean) ?? true,
    zoomToBoundsOnClick: (comp.value?.props.zoomToBoundsOnClick as boolean) ?? true,
  })

  // 添加标记到聚合组
  markers.value.forEach((markerData: MarkerData) => {
    const marker = L.marker([markerData.lat, markerData.lng])

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

    // 标签
    if (markerData.label) {
      marker.bindTooltip(markerData.label)
    }

    markerClusterGroup!.addLayer(marker)
  })

  map.addLayer(markerClusterGroup)
}

// 监听数据变化
watch(markers, () => {
  if (map) {
    addClusterMarkers()
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
.cluster-map {
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
