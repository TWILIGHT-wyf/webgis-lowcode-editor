<template>
  <BaseMap
    v-bind="mapProps"
    @ready="handleMapReady"
    @click="handleMapClick"
    @moveend="handleMoveEnd"
    @zoomend="handleZoomEnd"
  >
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Location /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <slot></slot>
  </BaseMap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Location } from '@element-plus/icons-vue'
import type L from 'leaflet'
import { useComponent } from '@/stores/component'
import { vMap as BaseMap, useDataSource, extractWithFallback } from '@one/visual-lib'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  ready: [map: L.Map]
  click: [e: L.LeafletMouseEvent]
  moveend: [center: { lat: number; lng: number }, zoom: number]
  zoomend: [zoom: number]
}>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源处理
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 合并属性和数据源
const centerLat = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.centerLatField as string) || 'centerLat'
    return extractWithFallback<number>(dataSourceData.value, field, 39.9)
  }
  return (comp.value?.props?.centerLat as number) ?? 39.9
})

const centerLng = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.centerLngField as string) || 'centerLng'
    return extractWithFallback<number>(dataSourceData.value, field, 116.4)
  }
  return (comp.value?.props?.centerLng as number) ?? 116.4
})

const zoom = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.zoomField as string) || 'zoom'
    return extractWithFallback<number>(dataSourceData.value, field, 13)
  }
  return (comp.value?.props?.zoom as number) ?? 13
})

const tileUrl = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.tileUrlField as string) || 'tileUrl'
    return extractWithFallback<string>(
      dataSourceData.value,
      field,
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    )
  }
  return (
    (comp.value?.props?.tileUrl as string) || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  )
})

const placeholder = computed(
  () => (comp.value?.props?.placeholder as string) || '配置地图中心点以显示底图',
)

// 聚合 Map 属性
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    centerLat: centerLat.value,
    centerLng: centerLng.value,
    zoom: zoom.value,
    minZoom: (p.minZoom as number) ?? 1,
    maxZoom: (p.maxZoom as number) ?? 18,
    tileUrl: tileUrl.value,
    attribution: (p.attribution as string) || '&copy; OpenStreetMap contributors',
    zoomControl: (p.zoomControl as boolean) ?? true,
    dragging: (p.dragging as boolean) ?? true,
    scrollWheelZoom: (p.scrollWheelZoom as boolean) ?? true,
    doubleClickZoom: (p.doubleClickZoom as boolean) ?? true,
    placeholder: placeholder.value,
    borderRadius: Number(s.borderRadius || 0),
    border: String(s.border || 'none'),
  }
})

// 事件处理
const handleMapReady = (map: L.Map) => {
  emit('ready', map)
}

const handleMapClick = (e: L.LeafletMouseEvent) => {
  emit('click', e)
}

const handleMoveEnd = (center: { lat: number; lng: number }, zoomLevel: number) => {
  emit('moveend', center, zoomLevel)
}

const handleZoomEnd = (zoomLevel: number) => {
  emit('zoomend', zoomLevel)
}
</script>

<style scoped lang="scss">
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
