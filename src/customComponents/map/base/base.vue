<template>
  <div ref="mapContainer" class="base-map" :style="containerStyle">
    <div v-if="!centerLat || !centerLng" class="map-placeholder">
      <el-icon class="placeholder-icon"><Location /></el-icon>
      <div class="placeholder-text">{{ placeholder }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Location } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null

// 数据源处理
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 合并属性和数据源
const centerLat = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.centerLatField as string) || 'centerLat'
    const value = getValueByPath(dataSourceData.value, field)
    return typeof value === 'number' ? value : undefined
  }
  return comp.value?.props?.centerLat as number | undefined
})

const centerLng = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.centerLngField as string) || 'centerLng'
    const value = getValueByPath(dataSourceData.value, field)
    return typeof value === 'number' ? value : undefined
  }
  return comp.value?.props?.centerLng as number | undefined
})

const zoom = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.zoomField as string) || 'zoom'
    const value = getValueByPath(dataSourceData.value, field)
    return typeof value === 'number' ? value : 13
  }
  return (comp.value?.props?.zoom as number) ?? 13
})

const tileUrl = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.tileUrlField as string) || 'tileUrl'
    const value = getValueByPath(dataSourceData.value, field)
    return typeof value === 'string' ? value : undefined
  }
  return (
    (comp.value?.props?.tileUrl as string) || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  )
})

const placeholder = computed(
  () => (comp.value?.props?.placeholder as string) || '配置地图中心点以显示底图',
)

const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    borderRadius: `${s.borderRadius || 0}px`,
    border: String(s.border || 'none'),
  }
})

// 初始化地图
function initMap() {
  if (!mapContainer.value || !centerLat.value || !centerLng.value) return

  // 销毁旧地图
  if (map) {
    map.remove()
    map = null
  }

  // 创建新地图
  map = L.map(mapContainer.value, {
    center: [centerLat.value, centerLng.value],
    zoom: zoom.value,
    zoomControl: (comp.value?.props?.zoomControl as boolean) ?? true,
    dragging: (comp.value?.props?.dragging as boolean) ?? true,
    scrollWheelZoom: (comp.value?.props?.scrollWheelZoom as boolean) ?? true,
    doubleClickZoom: (comp.value?.props?.doubleClickZoom as boolean) ?? true,
  })

  // 添加瓦片层
  const tileUrlValue = tileUrl.value || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  L.tileLayer(tileUrlValue, {
    attribution: (comp.value?.props?.attribution as string) || '&copy; OpenStreetMap contributors',
    minZoom: comp.value?.props?.minZoom as number | undefined,
    maxZoom: comp.value?.props?.maxZoom as number | undefined,
  }).addTo(map)
}

// 监听配置变化
watch([centerLat, centerLng, zoom, tileUrl], () => {
  if (map && centerLat.value && centerLng.value) {
    map.setView([centerLat.value, centerLng.value], zoom.value)
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
.base-map {
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
