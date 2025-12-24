<template>
  <BaseMap v-bind="mapProps" :bounds="dataBounds">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Connection /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 聚合图层 -->
    <BaseClusterLayer
      v-if="normalizedMarkers.length > 0"
      :markers="normalizedMarkers"
      :geojson="geojsonData"
      :data-version="dataVersion"
      :max-cluster-radius="clusterConfig.maxClusterRadius"
      :spiderfy-on-max-zoom="clusterConfig.spiderfyOnMaxZoom"
      :show-coverage-on-hover="clusterConfig.showCoverageOnHover"
      :zoom-to-bounds-on-click="clusterConfig.zoomToBoundsOnClick"
      :disable-clustering-at-zoom="clusterConfig.disableClusteringAtZoom"
      :chunked-loading="clusterConfig.chunkedLoading"
      :icon-config="clusterConfig.iconConfig"
      :cluster-style="clusterConfig.clusterStyle"
      :enabled="clusterLayerEnabled"
      :selected-id="selectedMarkerId"
      @ready="handleClusterReady"
      @marker-click="handleMarkerClick"
      @cluster-click="handleClusterClick"
      @selection-change="handleSelectionChange"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Connection } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vClusterLayer as BaseClusterLayer,
  useDataSource,
  getValueByPath,
  extractWithFallback,
} from '@twi1i9ht/visual-lib'
import type {
  MarkerPoint,
  GeoJSONFeatureCollection,
  MapBounds,
  ClusterLayerConfig,
  ClusterIconConfig,
  ClusterStyleConfig,
  MarkerClickEvent,
  ClusterClickEvent,
  MarkerDataMapping,
} from '@twi1i9ht/visual-lib'

// ==================== Props ====================
const props = defineProps<{ id: string }>()

// ==================== Emits ====================
const emit = defineEmits<{
  markerClick: [event: MarkerClickEvent]
  clusterClick: [event: ClusterClickEvent]
  selectionChange: [id: string | number | null]
}>()

// ==================== Store ====================
const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// ==================== 数据源 ====================
const dataSourceConfig = computed(() => comp.value?.dataSource)
const {
  data: dataSourceData,
  loading: dataLoading,
  error: dataError,
} = useDataSource(dataSourceConfig)

// ==================== 内部状态 ====================
const dataVersion = ref(0)
const clusterLayerEnabled = ref(true)
const selectedMarkerId = ref<string | number | null>(null)

// ==================== 数据适配器 ====================

/**
 * 数据映射配置
 */
const dataMapping = computed((): MarkerDataMapping => {
  const ds = dataSourceConfig.value
  return {
    idField: (ds?.idField as string) || 'id',
    latField: (ds?.latField as string) || 'lat',
    lngField: (ds?.lngField as string) || 'lng',
    labelField: (ds?.labelField as string) || 'label',
    popupField: (ds?.popupField as string) || 'popup',
    iconField: (ds?.iconField as string) || 'icon',
    dataFields: (ds?.dataFields as string[]) || [],
  }
})

/**
 * 从数据源提取原始标记数据
 */
const rawMarkerData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.markersField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? value : []
    }
    if (Array.isArray(dataSourceData.value)) {
      return dataSourceData.value
    }
  }
  return (comp.value?.props.markers as unknown[]) || []
})

/**
 * 数据标准化：将任意格式转换为 MarkerPoint[]
 */
const normalizedMarkers = computed((): MarkerPoint[] => {
  const raw = rawMarkerData.value
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return []
  }

  const mapping = dataMapping.value

  return raw
    .map((item, index) => {
      if (typeof item !== 'object' || item === null) return null

      const lat = getValueByPath(item, mapping.latField)
      const lng = getValueByPath(item, mapping.lngField)

      // 验证坐标有效性
      if (typeof lat !== 'number' || typeof lng !== 'number') return null
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

      const id = mapping.idField ? getValueByPath(item, mapping.idField) : index
      const label = mapping.labelField ? getValueByPath(item, mapping.labelField) : undefined
      const icon = mapping.iconField ? getValueByPath(item, mapping.iconField) : undefined

      // 构建 popup 内容
      let popup: string | undefined
      if (mapping.popupField) {
        const popupValue = getValueByPath(item, mapping.popupField)
        if (typeof popupValue === 'string') {
          popup = popupValue
        } else if (typeof popupValue === 'object') {
          // 将对象转换为 HTML 表格
          popup = buildPopupContent(popupValue as Record<string, unknown>)
        }
      }

      // 提取附加数据
      const data: Record<string, unknown> = {}
      if (mapping.dataFields && mapping.dataFields.length > 0) {
        mapping.dataFields.forEach((field) => {
          data[field] = getValueByPath(item, field)
        })
      } else {
        // 保留原始数据
        Object.assign(data, item)
      }

      return {
        id,
        lat,
        lng,
        label: typeof label === 'string' ? label : undefined,
        popup,
        icon: typeof icon === 'string' ? icon : undefined,
        data,
      } as MarkerPoint
    })
    .filter((point): point is MarkerPoint => point !== null)
})

/**
 * 构建 Popup HTML 内容
 */
function buildPopupContent(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`)
    .join('')

  return `<table class="popup-table">${rows}</table>`
}

/**
 * GeoJSON 数据（如果数据源直接是 GeoJSON 格式）
 */
const geojsonData = computed((): GeoJSONFeatureCollection | undefined => {
  if (dataSourceData.value && typeof dataSourceData.value === 'object') {
    const data = dataSourceData.value as Record<string, unknown>
    if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
      return dataSourceData.value as GeoJSONFeatureCollection
    }
  }
  return undefined
})

// 监听数据变化，更新版本号
watch(
  () => normalizedMarkers.value,
  () => {
    dataVersion.value++
  },
  { deep: false },
)

/**
 * 计算数据边界
 */
const dataBounds = computed((): MapBounds | undefined => {
  const data = normalizedMarkers.value
  if (data.length === 0) return undefined

  let minLat = Infinity,
    maxLat = -Infinity
  let minLng = Infinity,
    maxLng = -Infinity

  for (const point of data) {
    minLat = Math.min(minLat, point.lat)
    maxLat = Math.max(maxLat, point.lat)
    minLng = Math.min(minLng, point.lng)
    maxLng = Math.max(maxLng, point.lng)
  }

  const latPadding = (maxLat - minLat) * 0.1 || 0.01
  const lngPadding = (maxLng - minLng) * 0.1 || 0.01

  return {
    northEast: { lat: maxLat + latPadding, lng: maxLng + lngPadding },
    southWest: { lat: minLat - latPadding, lng: minLng - lngPadding },
  }
})

// ==================== 聚合配置 ====================

/**
 * 图标配置
 */
const iconConfig = computed((): ClusterIconConfig | undefined => {
  const p = comp.value?.props || {}
  if (!p.iconUrl) return undefined

  return {
    iconUrl: p.iconUrl as string,
    iconSize: (p.iconSize as [number, number]) || [25, 41],
    iconAnchor: (p.iconAnchor as [number, number]) || [12, 41],
    popupAnchor: (p.popupAnchor as [number, number]) || [1, -34],
  }
})

/**
 * 聚合簇样式配置
 */
const clusterStyle = computed((): ClusterStyleConfig | undefined => {
  const p = comp.value?.props || {}
  if (!p.clusterStyle) return undefined

  return p.clusterStyle as ClusterStyleConfig
})

/**
 * 聚合图层配置
 */
const clusterConfig = computed((): ClusterLayerConfig => {
  const p = comp.value?.props || {}
  return {
    maxClusterRadius: (p.maxClusterRadius as number) ?? 80,
    disableClusteringAtZoom: p.disableClusteringAtZoom as number | undefined,
    spiderfyOnMaxZoom: (p.spiderfyOnMaxZoom as boolean) ?? true,
    showCoverageOnHover: (p.showCoverageOnHover as boolean) ?? true,
    zoomToBoundsOnClick: (p.zoomToBoundsOnClick as boolean) ?? true,
    chunkedLoading: (p.chunkedLoading as boolean) ?? true,
    iconConfig: iconConfig.value,
    clusterStyle: clusterStyle.value,
  }
})

// ==================== 占位文本 ====================
const placeholder = computed(() => {
  if (dataLoading.value) return '标记点数据加载中...'
  if (dataError.value) return '标记点数据加载失败'
  if (normalizedMarkers.value.length === 0) return '暂无标记点数据'
  return (comp.value?.props.placeholder as string) || '配置标记点数据以显示聚合'
})

// ==================== Map 属性 ====================
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  return {
    centerLat: (p.centerLat as number) ?? 39.9,
    centerLng: (p.centerLng as number) ?? 116.4,
    zoom: (p.zoom as number) ?? 5,
    zoomControl: true,
    placeholder: placeholder.value,
    preferCanvas: true,
  }
})

// ==================== 事件处理 ====================

const handleClusterReady = (layer: any) => {
  // 聚合图层就绪
  // layer: MarkerClusterGroup instance
}

const handleMarkerClick = (event: MarkerClickEvent) => {
  selectedMarkerId.value = event.marker.id ?? event.index
  emit('markerClick', event)

  // 业务联动：可以在这里触发其他组件的更新
  // 例如：更新详情面板、高亮相关数据等
}

const handleClusterClick = (event: ClusterClickEvent) => {
  emit('clusterClick', event)
}

const handleSelectionChange = (id: string | number | null) => {
  selectedMarkerId.value = id
  emit('selectionChange', id)
}

// ==================== 暴露方法 ====================
defineExpose({
  /** 获取标准化后的标记数据 */
  getMarkers: () => normalizedMarkers.value,
  /** 获取数据数量 */
  getMarkerCount: () => normalizedMarkers.value.length,
  /** 启用/禁用聚合图层 */
  setEnabled: (enabled: boolean) => {
    clusterLayerEnabled.value = enabled
  },
  /** 设置选中的标记 */
  setSelectedId: (id: string | number | null) => {
    selectedMarkerId.value = id
  },
  /** 获取选中的标记 */
  getSelectedMarker: () => {
    if (selectedMarkerId.value === null) return null
    return normalizedMarkers.value.find((m) => m.id === selectedMarkerId.value) || null
  },
  /** 强制刷新数据 */
  refreshData: () => {
    dataVersion.value++
  },
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

<style>
/* Popup 表格样式（全局） */
.popup-table {
  border-collapse: collapse;
  font-size: 12px;
}

.popup-table td {
  padding: 4px 8px;
  border-bottom: 1px solid #eee;
}

.popup-table tr:last-child td {
  border-bottom: none;
}
</style>
