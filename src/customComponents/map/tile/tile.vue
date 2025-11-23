<template>
  <div ref="mapContainer" class="tile-layer-map">
    <div v-if="!tileUrl" class="map-placeholder">
      <el-icon class="placeholder-icon"><Grid /></el-icon>
      <div class="placeholder-text">{{ placeholder || '配置瓦片URL以显示图层' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Grid } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源处理
const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

// 从store获取属性
const tileUrl = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.tileUrlField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'string' ? value : ''
    }
  }
  return (comp.value?.props.tileUrl as string) || ''
})

const opacity = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.opacityField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'number' ? value : 1
    }
  }
  return (comp.value?.props.opacity as number) ?? 1
})

const centerLat = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.centerLatField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'number' ? value : 39.9
    }
  }
  return (comp.value?.props.centerLat as number) ?? 39.9
})

const centerLng = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.centerLngField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'number' ? value : 116.4
    }
  }
  return (comp.value?.props.centerLng as number) ?? 116.4
})

const placeholder = computed(() => comp.value?.props.placeholder as string)

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let tileLayer: L.TileLayer | null = null

// 初始化地图
function initMap() {
  if (!mapContainer.value || !tileUrl.value) return

  // 销毁旧地图
  if (map) {
    map.remove()
    map = null
  }

  // 创建新地图
  map = L.map(mapContainer.value, {
    center: [centerLat.value, centerLng.value],
    zoom: (comp.value?.props.zoom as number) ?? 10,
    zoomControl: true,
  })

  // 添加底图
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    opacity: 0.3,
  }).addTo(map)

  // 添加瓦片层
  tileLayer = L.tileLayer(tileUrl.value, {
    attribution: comp.value?.props.attribution as string,
    opacity: opacity.value,
    minZoom: comp.value?.props.minZoom as number,
    maxZoom: comp.value?.props.maxZoom as number,
    subdomains: comp.value?.props.subdomains as string,
  }).addTo(map)

  const zIndex = comp.value?.props.zIndex as number
  if (zIndex) {
    tileLayer.setZIndex(zIndex)
  }
}

// 监听配置变化
watch([tileUrl, opacity], () => {
  if (tileLayer) {
    if (tileUrl.value) {
      tileLayer.setUrl(tileUrl.value)
    }
    tileLayer.setOpacity(opacity.value)
  } else {
    initMap()
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
.tile-layer-map {
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
