<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, shallowRef, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type {
  MarkerPoint,
  GeoJSONFeatureCollection,
  ClusterLayerConfig,
  ClusterIconConfig,
  ClusterStyleConfig,
  MapBounds,
  ClusterClickEvent,
  MarkerClickEvent,
} from '../../types/gis'

// ==================== 重新导出类型 ====================
export type { MarkerPoint as ClusterMarkerData }
export interface ClusterLayerProps {
  /** 标记数据（支持 MarkerPoint[] 或 GeoJSON） */
  markers?: MarkerPoint[]
  /** GeoJSON 数据源 */
  geojson?: GeoJSONFeatureCollection
  /** 数据版本号，用于增量更新检测 */
  dataVersion?: number
  /** 最大聚合半径 */
  maxClusterRadius?: number
  /** 禁用聚合的缩放级别 */
  disableClusteringAtZoom?: number
  /** 最大缩放时展开为蜘蛛网形式 */
  spiderfyOnMaxZoom?: boolean
  /** 鼠标悬停时显示聚合范围 */
  showCoverageOnHover?: boolean
  /** 点击聚合簇时缩放到边界 */
  zoomToBoundsOnClick?: boolean
  /** 是否启用分块加载（大数据量优化） */
  chunkedLoading?: boolean
  /** 图标配置 */
  iconConfig?: ClusterIconConfig
  /** 聚合簇样式配置 */
  clusterStyle?: ClusterStyleConfig
  /** 是否启用图层 */
  enabled?: boolean
  /** 选中的标记 ID */
  selectedId?: string | number
}

const props = withDefaults(defineProps<ClusterLayerProps>(), {
  maxClusterRadius: 80,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
  enabled: true,
})

// ==================== Emits ====================
const emit = defineEmits<{
  ready: [layer: L.MarkerClusterGroup]
  markerClick: [event: MarkerClickEvent]
  clusterClick: [event: ClusterClickEvent]
  selectionChange: [id: string | number | null]
}>()

// ==================== 注入地图实例 ====================
const mapContext = inject<Ref<L.Map | null>>('mapContext')

// ==================== 内部状态 ====================
const markerClusterGroup = shallowRef<L.MarkerClusterGroup | null>(null)

// Icon 实例缓存（避免重复创建）
const iconCache = new Map<string, L.Icon | L.DivIcon>()
let defaultIcon: L.Icon | null = null

// 标记实例映射（用于增量更新和选中状态）
const markerMap = new Map<string | number, L.Marker>()

let lastDataVersion = -1
let lastDataLength = -1

// ==================== Icon 管理 ====================

/** 获取或创建默认图标 */
function getDefaultIcon(): L.Icon {
  if (!defaultIcon) {
    defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
  }
  return defaultIcon
}

/** 获取或创建图标实例（带缓存） */
function getIcon(config?: ClusterIconConfig, customUrl?: string): L.Icon | L.DivIcon {
  const url = customUrl || config?.iconUrl
  if (!url) return getDefaultIcon()

  // 生成缓存 key
  const cacheKey = `${url}_${config?.iconSize?.join(',') || ''}_${config?.iconAnchor?.join(',') || ''}`

  if (!iconCache.has(cacheKey)) {
    iconCache.set(
      cacheKey,
      L.icon({
        iconUrl: url,
        iconSize: config?.iconSize || [25, 41],
        iconAnchor: config?.iconAnchor || [12, 41],
        popupAnchor: config?.popupAnchor || [1, -34],
      }),
    )
  }

  return iconCache.get(cacheKey)!
}

/** 创建聚合簇图标工厂函数 */
function createClusterIconFactory(
  style?: ClusterStyleConfig,
): (cluster: L.MarkerCluster) => L.DivIcon {
  const smallThreshold = style?.smallThreshold ?? 10
  const mediumThreshold = style?.mediumThreshold ?? 100

  const smallStyle = style?.smallStyle ?? {
    backgroundColor: 'rgba(110, 204, 57, 0.7)',
    color: '#fff',
    size: 30,
  }
  const mediumStyle = style?.mediumStyle ?? {
    backgroundColor: 'rgba(240, 194, 12, 0.7)',
    color: '#fff',
    size: 40,
  }
  const largeStyle = style?.largeStyle ?? {
    backgroundColor: 'rgba(241, 128, 23, 0.7)',
    color: '#fff',
    size: 50,
  }

  return (cluster: L.MarkerCluster) => {
    const count = cluster.getChildCount()
    let styleConfig = largeStyle
    let className = 'marker-cluster-large'

    if (count < smallThreshold) {
      styleConfig = smallStyle
      className = 'marker-cluster-small'
    } else if (count < mediumThreshold) {
      styleConfig = mediumStyle
      className = 'marker-cluster-medium'
    }

    return L.divIcon({
      html: `<div style="
        background-color: ${styleConfig.backgroundColor};
        color: ${styleConfig.color};
        width: ${styleConfig.size ?? 40}px;
        height: ${styleConfig.size ?? 40}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: ${Math.max(12, (styleConfig.size ?? 40) / 3)}px;
      ">${count}</div>`,
      className: `marker-cluster ${className}`,
      iconSize: L.point(styleConfig.size ?? 40, styleConfig.size ?? 40),
    })
  }
}

// ==================== 数据转换 ====================

/** 从 GeoJSON 提取 MarkerPoint */
function extractMarkersFromGeoJSON(geojson: GeoJSONFeatureCollection): MarkerPoint[] {
  return geojson.features
    .filter((f) => f.geometry.type === 'Point')
    .map((f) => {
      const coords = f.geometry.coordinates as [number, number]
      return {
        id: f.id,
        lat: coords[1],
        lng: coords[0],
        label: f.properties?.label as string | undefined,
        popup: f.properties?.popup as string | undefined,
        icon: f.properties?.icon as string | undefined,
        data: f.properties,
      }
    })
}

/** 获取有效的标记数据 */
function getEffectiveMarkers(): MarkerPoint[] {
  if (props.geojson) {
    return extractMarkersFromGeoJSON(props.geojson)
  }
  return props.markers || []
}

// ==================== 图层生命周期 ====================

/** 创建聚合图层 */
function createClusterLayer() {
  const map = mapContext?.value
  if (!map || !props.enabled) return

  // 移除旧图层
  removeClusterLayer()

  const markers = getEffectiveMarkers()
  if (markers.length === 0) return

  // 创建聚合组
  markerClusterGroup.value = L.markerClusterGroup({
    maxClusterRadius: props.maxClusterRadius,
    disableClusteringAtZoom: props.disableClusteringAtZoom,
    spiderfyOnMaxZoom: props.spiderfyOnMaxZoom,
    showCoverageOnHover: props.showCoverageOnHover,
    zoomToBoundsOnClick: props.zoomToBoundsOnClick,
    chunkedLoading: props.chunkedLoading,
    iconCreateFunction: createClusterIconFactory(props.clusterStyle),
  })

  // 批量添加标记
  const leafletMarkers: L.Marker[] = []

  markers.forEach((markerData, index) => {
    const id = markerData.id ?? index
    const marker = L.marker([markerData.lat, markerData.lng], {
      icon: getIcon(props.iconConfig, markerData.icon),
    })

    // 弹窗
    if (markerData.popup) {
      marker.bindPopup(markerData.popup)
    }

    // 标签
    if (markerData.label) {
      marker.bindTooltip(markerData.label)
    }

    // 点击事件
    marker.on('click', (e) => {
      emit('markerClick', {
        marker: markerData,
        index,
        originalEvent: e.originalEvent,
      })
      emit('selectionChange', id)
    })

    // 选中状态
    if (props.selectedId === id) {
      marker.setOpacity(1)
      marker.setZIndexOffset(1000)
    }

    markerMap.set(id, marker)
    leafletMarkers.push(marker)
  })

  // 使用 addLayers 批量添加（性能优化）
  markerClusterGroup.value.addLayers(leafletMarkers)

  // 绑定聚合簇点击事件
  markerClusterGroup.value.on('clusterclick', (e: L.LeafletEvent) => {
    const cluster = e as unknown as { layer: L.MarkerCluster }
    const bounds = cluster.layer.getBounds()
    const childMarkers = cluster.layer.getAllChildMarkers()

    emit('clusterClick', {
      center: {
        lat: cluster.layer.getLatLng().lat,
        lng: cluster.layer.getLatLng().lng,
      },
      count: cluster.layer.getChildCount(),
      bounds: {
        northEast: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
        southWest: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
      },
      markers: childMarkers.map((m, i) => {
        const latlng = m.getLatLng()
        return { lat: latlng.lat, lng: latlng.lng, id: i }
      }),
    })
  })

  map.addLayer(markerClusterGroup.value)
  lastDataLength = markers.length
  lastDataVersion = props.dataVersion ?? -1

  emit('ready', markerClusterGroup.value)
}

/** 移除聚合图层 */
function removeClusterLayer() {
  if (markerClusterGroup.value && mapContext?.value) {
    mapContext.value.removeLayer(markerClusterGroup.value)
    markerClusterGroup.value = null
  }
  markerMap.clear()
}

/** 增量更新标记 */
function updateMarkers() {
  if (!markerClusterGroup.value) {
    createClusterLayer()
    return
  }

  const markers = getEffectiveMarkers()
  if (markers.length === 0) {
    removeClusterLayer()
    return
  }

  // 简单的增量更新策略：比较数量变化
  // 对于复杂场景，可以实现更精细的 diff 算法
  if (markers.length !== lastDataLength) {
    createClusterLayer()
    return
  }

  // 数据长度相同，假设数据已更新
  createClusterLayer()
}

/** 更新选中状态 */
function updateSelection(newId: string | number | null | undefined) {
  markerMap.forEach((marker, id) => {
    if (id === newId) {
      marker.setOpacity(1)
      marker.setZIndexOffset(1000)
    } else {
      marker.setOpacity(0.8)
      marker.setZIndexOffset(0)
    }
  })
}

// ==================== 监听器 ====================

// 监听数据变化
watch(
  [() => props.markers, () => props.geojson, () => props.dataVersion],
  () => {
    updateMarkers()
  },
  { flush: 'post' },
)

// 监听配置变化
watch(
  [
    () => props.maxClusterRadius,
    () => props.disableClusteringAtZoom,
    () => props.spiderfyOnMaxZoom,
    () => props.showCoverageOnHover,
    () => props.zoomToBoundsOnClick,
    () => props.iconConfig,
    () => props.clusterStyle,
  ],
  () => {
    createClusterLayer()
  },
)

// 监听启用状态
watch(
  () => props.enabled,
  (enabled) => {
    if (enabled) {
      createClusterLayer()
    } else {
      removeClusterLayer()
    }
  },
)

// 监听选中状态
watch(
  () => props.selectedId,
  (newId) => {
    updateSelection(newId)
  },
)

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map && props.enabled) {
      createClusterLayer()
    }
  },
  { immediate: true },
)

// ==================== 生命周期 ====================
onMounted(() => {
  if (mapContext?.value && props.enabled) {
    createClusterLayer()
  }
})

onBeforeUnmount(() => {
  removeClusterLayer()
  iconCache.clear()
  defaultIcon = null
})

// ==================== 暴露方法 ====================
defineExpose({
  /** 获取聚合图层实例 */
  getLayer: () => markerClusterGroup.value,
  /** 获取指定 ID 的标记 */
  getMarker: (id: string | number) => markerMap.get(id),
  /** 缩放到所有标记的边界 */
  fitBounds: (options?: L.FitBoundsOptions) => {
    if (markerClusterGroup.value && mapContext?.value) {
      mapContext.value.fitBounds(markerClusterGroup.value.getBounds(), options)
    }
  },
  /** 强制刷新 */
  refresh: () => createClusterLayer(),
  /** 清除选中 */
  clearSelection: () => {
    updateSelection(null)
    emit('selectionChange', null)
  },
})
</script>

<style>
/* 聚合簇基础样式 */
.marker-cluster {
  background-clip: padding-box;
}
</style>
