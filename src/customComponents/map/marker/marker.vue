<template>
  <BaseMap v-bind="mapProps" @ready="handleMapReady">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><LocationFilled /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 渲染所有标记点 -->
    <BaseMarker
      v-for="(marker, index) in markers"
      :key="index"
      :lat="marker.lat"
      :lng="marker.lng"
      :label="marker.label"
      :show-label="showLabel"
      :popup="formatPopup(marker.popup)"
      :icon-url="marker.icon || iconUrl"
      :icon-size="iconSize"
      :icon-anchor="iconAnchor"
      :popup-anchor="popupAnchor"
      :color="marker.color"
      :draggable="draggableMarkers"
      @click="() => handleMarkerClick(marker, index)"
      @dragend="(latlng) => handleMarkerDrag(latlng, index)"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { LocationFilled } from '@element-plus/icons-vue'
import type L from 'leaflet'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vMarker as BaseMarker,
  useDataSource,
  extractWithFallback,
} from '@one/visual-lib'

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

const mapRef = ref<L.Map | null>(null)

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const markers = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.markersField as string | undefined
    if (field) {
      return extractWithFallback<MarkerData[]>(dataSourceData.value, field, [])
    }
  }
  return (comp.value?.props.markers as MarkerData[]) || []
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置标记点数据以显示',
)
const showLabel = computed(() => (comp.value?.props.showLabel as boolean) ?? false)
const draggableMarkers = computed(() => (comp.value?.props.draggableMarkers as boolean) ?? false)
const iconUrl = computed(() => comp.value?.props.iconUrl as string | undefined)
const iconSize = computed(() => (comp.value?.props.iconSize as [number, number]) ?? [25, 41])
const iconAnchor = computed(() => (comp.value?.props.iconAnchor as [number, number]) ?? [12, 41])
const popupAnchor = computed(() => (comp.value?.props.popupAnchor as [number, number]) ?? [1, -34])

// Map 属性
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  return {
    centerLat: (p.centerLat as number) ?? 39.9,
    centerLng: (p.centerLng as number) ?? 116.4,
    zoom: (p.zoom as number) ?? 10,
    zoomControl: true,
    placeholder: placeholder.value,
  }
})

// 格式化弹窗内容
function formatPopup(popup: string | Record<string, unknown> | undefined): string | undefined {
  if (!popup) return undefined
  if (typeof popup === 'string') return popup
  return Object.entries(popup)
    .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
    .join('<br>')
}

// 事件处理
function handleMapReady(map: L.Map) {
  mapRef.value = map
  // 自适应视图
  if (markers.value.length > 0) {
    const bounds = markers.value.map((m) => [m.lat, m.lng] as [number, number])
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

function handleMarkerClick(marker: MarkerData, index: number) {
  emit('markerClick', { ...marker, index })
}

function handleMarkerDrag(latlng: { lat: number; lng: number }, index: number) {
  emit('markerDrag', { ...latlng, index })
}

// 监听标记变化，自适应视图
watch(markers, (newMarkers) => {
  if (mapRef.value && newMarkers.length > 0) {
    const bounds = newMarkers.map((m) => [m.lat, m.lng] as [number, number])
    mapRef.value.fitBounds(bounds, { padding: [50, 50] })
  }
})
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
