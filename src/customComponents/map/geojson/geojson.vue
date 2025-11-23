<template>
  <div ref="mapContainer" class="geojson-layer-map">
    <div v-if="!geojsonData" class="map-placeholder">
      <el-icon class="placeholder-icon"><Document /></el-icon>
      <div class="placeholder-text">{{ placeholder || '配置GeoJSON数据以显示图层' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Document } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let geojsonLayer: L.GeoJSON | null = null

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const geojsonData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.geojsonDataField as string | undefined
    if (field) return getValueByPath(dataSourceData.value, field)
  }
  return comp.value?.props.geojsonData
})

const placeholder = computed(() => comp.value?.props.placeholder as string)

// 初始化地图
function initMap() {
  if (!mapContainer.value) return

  if (map) {
    map.remove()
    map = null
  }

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

  // 添加GeoJSON图层
  addGeoJSONLayer()
}

// 添加GeoJSON图层
function addGeoJSONLayer() {
  if (!map || !geojsonData.value) return

  // 清除旧图层
  if (geojsonLayer) {
    map.removeLayer(geojsonLayer)
    geojsonLayer = null
  }

  // 添加新图层
  const style = comp.value?.props.style as Record<string, unknown> | undefined
  geojsonLayer = L.geoJSON(geojsonData.value as GeoJSON.GeoJsonObject, {
    style: () => ({
      color: (style?.color as string) ?? '#3388ff',
      weight: (style?.weight as number) ?? 2,
      opacity: (style?.opacity as number) ?? 0.8,
      fillColor: (style?.fillColor as string) ?? '#3388ff',
      fillOpacity: (style?.fillOpacity as number) ?? 0.4,
    }),
    onEachFeature: (feature, layer) => {
      const showPopup = comp.value?.props.showPopup as boolean
      if (showPopup && feature.properties) {
        const popupFields = comp.value?.props.popupFields as string[] | undefined
        const fields = popupFields || Object.keys(feature.properties)
        const popupContent = fields
          .filter((field) => feature.properties[field] !== undefined)
          .map((field) => `<strong>${field}:</strong> ${feature.properties[field]}`)
          .join('<br>')
        layer.bindPopup(popupContent)
      }
    },
  }).addTo(map)

  // 自适应视图
  map.fitBounds(geojsonLayer.getBounds(), { padding: [50, 50] })
}

// 监听数据变化
watch(geojsonData, () => {
  if (map) {
    addGeoJSONLayer()
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
.geojson-layer-map {
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
