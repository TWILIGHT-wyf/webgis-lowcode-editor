<template>
  <BaseMap
    v-bind="mapProps"
    :bounds="computedBounds"
    @ready="handleMapReady"
    @click="handleMapClick"
    @moveend="handleMoveEnd"
    @zoomend="handleZoomEnd"
    @layeradd="handleLayerAdd"
    @layerremove="handleLayerRemove"
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
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Location } from '@element-plus/icons-vue'
import type L from 'leaflet'
import { useComponent } from '@/stores/component'
import { vMap as BaseMap, useDataSource, extractWithFallback } from '@twi1i9ht/visual-lib'
import type { GISPoint, TileLayerConfig, LayerVisibility, MapBounds } from '@twi1i9ht/visual-lib'

// ==================== Props & Emits ====================
const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  ready: [map: L.Map]
  click: [event: { latlng: GISPoint; layerPoint: L.Point; containerPoint: L.Point }]
  moveend: [center: GISPoint, zoom: number]
  zoomend: [zoom: number]
  layerVisibilityChange: [layers: LayerVisibility[]]
}>()

// ==================== Store 数据 ====================
const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// ==================== 数据源处理 ====================
const dataSourceRef = computed(() => comp.value?.dataSource)
const {
  data: dataSourceData,
  loading: dataLoading,
  error: dataError,
} = useDataSource(dataSourceRef)

// ==================== 图层管理状态 ====================
const layerVisibility = ref<LayerVisibility[]>([])
const mapRef = ref<L.Map | null>(null)

// ==================== 数据适配器：从数据源提取配置 ====================

/** 提取中心点纬度 */
const centerLat = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.centerLatField as string) || 'centerLat'
    return extractWithFallback<number>(dataSourceData.value, field, 39.9)
  }
  return (comp.value?.props?.centerLat as number) ?? 39.9
})

/** 提取中心点经度 */
const centerLng = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.centerLngField as string) || 'centerLng'
    return extractWithFallback<number>(dataSourceData.value, field, 116.4)
  }
  return (comp.value?.props?.centerLng as number) ?? 116.4
})

/** 提取缩放级别 */
const zoom = computed(() => {
  if (dataSourceData.value) {
    const field = (comp.value?.dataSource?.zoomField as string) || 'zoom'
    return extractWithFallback<number>(dataSourceData.value, field, 13)
  }
  return (comp.value?.props?.zoom as number) ?? 13
})

/** 提取瓦片 URL */
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

/** 占位文本 */
const placeholder = computed(() => {
  if (dataLoading.value) return '地图数据加载中...'
  if (dataError.value) return '地图数据加载失败'
  return (comp.value?.props?.placeholder as string) || '配置地图中心点以显示底图'
})

/** 从数据源提取边界 */
const computedBounds = computed((): MapBounds | undefined => {
  // 优先使用数据源中的边界配置
  if (dataSourceData.value) {
    const boundsField = comp.value?.dataSource?.boundsField as string | undefined
    if (boundsField) {
      const bounds = extractWithFallback<MapBounds | undefined>(
        dataSourceData.value,
        boundsField,
        undefined,
      )
      if (bounds) return bounds
    }
  }

  // 使用 props 中的边界配置
  const propsBounds = comp.value?.props?.bounds as MapBounds | undefined
  return propsBounds
})

/** 瓦片图层配置 */
const tileConfig = computed((): TileLayerConfig => {
  const p = comp.value?.props || {}
  return {
    url: tileUrl.value,
    attribution: (p.attribution as string) || '&copy; OpenStreetMap contributors',
    minZoom: (p.minZoom as number) ?? 1,
    maxZoom: (p.maxZoom as number) ?? 18,
    opacity: (p.tileOpacity as number) ?? 1,
  }
})

// ==================== 聚合 Map Props ====================
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    centerLat: centerLat.value,
    centerLng: centerLng.value,
    zoom: zoom.value,
    minZoom: (p.minZoom as number) ?? 1,
    maxZoom: (p.maxZoom as number) ?? 18,
    tileConfig: tileConfig.value,
    zoomControl: (p.zoomControl as boolean) ?? true,
    dragging: (p.dragging as boolean) ?? true,
    scrollWheelZoom: (p.scrollWheelZoom as boolean) ?? true,
    doubleClickZoom: (p.doubleClickZoom as boolean) ?? true,
    placeholder: placeholder.value,
    borderRadius: Number(s.borderRadius || 0),
    border: String(s.border || 'none'),
    preferCanvas: (p.preferCanvas as boolean) ?? true,
    showScale: (p.showScale as boolean) ?? false,
    boundsPadding: (p.boundsPadding as [number, number]) ?? [50, 50],
  }
})

// ==================== 图层管理 ====================

/** 注册图层 */
function registerLayer(id: string, name: string, type: LayerVisibility['type'], visible = true) {
  const existing = layerVisibility.value.find((l) => l.id === id)
  if (!existing) {
    layerVisibility.value.push({ id, name, type, visible })
  }
}

/** 切换图层可见性 */
function toggleLayerVisibility(layerId: string, visible?: boolean) {
  const layer = layerVisibility.value.find((l) => l.id === layerId)
  if (layer) {
    layer.visible = visible ?? !layer.visible
    emit('layerVisibilityChange', [...layerVisibility.value])
  }
}

/** 获取图层可见性状态 */
function getLayerVisibility(layerId: string): boolean {
  return layerVisibility.value.find((l) => l.id === layerId)?.visible ?? true
}

// ==================== 事件处理 ====================
const handleMapReady = (map: L.Map) => {
  mapRef.value = map
  emit('ready', map)
}

const handleMapClick = (event: {
  latlng: GISPoint
  layerPoint: L.Point
  containerPoint: L.Point
}) => {
  emit('click', event)
}

const handleMoveEnd = (center: GISPoint, zoomLevel: number) => {
  emit('moveend', center, zoomLevel)
}

const handleZoomEnd = (zoomLevel: number) => {
  emit('zoomend', zoomLevel)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleLayerAdd = (_layer: L.Layer) => {
  // 可以在这里追踪添加的图层
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleLayerRemove = (_layer: L.Layer) => {
  // 可以在这里追踪移除的图层
}

// ==================== 暴露给父组件的方法 ====================
defineExpose({
  /** 获取地图实例 */
  getMap: () => mapRef.value,
  /** 图层管理 */
  registerLayer,
  toggleLayerVisibility,
  getLayerVisibility,
  /** 获取所有图层状态 */
  getLayers: () => [...layerVisibility.value],
  /** 数据状态 */
  isLoading: () => dataLoading.value,
  hasError: () => !!dataError.value,
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
