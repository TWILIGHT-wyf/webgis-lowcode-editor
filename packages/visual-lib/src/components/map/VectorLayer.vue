<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import L from 'leaflet'

export interface VectorFeature {
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

export interface VectorLayerProps {
  /** 矢量数据 */
  data: VectorFeature[]
  /** 默认样式 */
  defaultStyle?: {
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
    radius?: number
  }
  /** 是否显示弹窗 */
  showPopup?: boolean
  /** 是否自适应边界 */
  fitBounds?: boolean
  /** 自适应边界的 padding */
  fitBoundsPadding?: [number, number]
}

const props = withDefaults(defineProps<VectorLayerProps>(), {
  defaultStyle: () => ({
    color: '#3388ff',
    weight: 2,
    opacity: 0.8,
    fillColor: '#3388ff',
    fillOpacity: 0.4,
    radius: 8,
  }),
  showPopup: true,
  fitBounds: true,
  fitBoundsPadding: () => [50, 50],
})

const emit = defineEmits<{
  featureClick: [feature: VectorFeature, index: number, layer: L.Layer]
}>()

// 从父组件注入地图实例
const mapContext = inject<Ref<L.Map | null>>('mapContext')

const vectorLayers: L.Layer[] = []

// 创建矢量图层
function createVectorLayers() {
  const map = mapContext?.value
  if (!map || !props.data || props.data.length === 0) return

  // 移除旧图层
  removeVectorLayers()

  // 添加新图层
  props.data.forEach((feature, index) => {
    let layer: L.Layer | null = null

    const style = {
      ...props.defaultStyle,
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
      // 绑定弹窗
      if (props.showPopup && feature.properties) {
        const popupContent = Object.entries(feature.properties)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join('<br>')
        layer.bindPopup(popupContent)
      }

      // 点击事件
      layer.on('click', () => {
        emit('featureClick', feature, index, layer!)
      })

      layer.addTo(map)
      vectorLayers.push(layer)
    }
  })

  // 自适应视图
  if (props.fitBounds && vectorLayers.length > 0) {
    const group = L.featureGroup(vectorLayers)
    if (group.getBounds().isValid()) {
      map.fitBounds(group.getBounds(), { padding: props.fitBoundsPadding })
    }
  }
}

// 移除矢量图层
function removeVectorLayers() {
  vectorLayers.forEach((layer) => {
    if (mapContext?.value) {
      mapContext.value.removeLayer(layer)
    }
  })
  vectorLayers.length = 0
}

// 监听数据变化
watch(() => props.data, createVectorLayers, { deep: true })

// 监听默认样式变化
watch(() => props.defaultStyle, createVectorLayers, { deep: true })

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map) {
      createVectorLayers()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (mapContext?.value) {
    createVectorLayers()
  }
})

onBeforeUnmount(() => {
  removeVectorLayers()
})

defineExpose({
  getLayers: () => vectorLayers,
})
</script>
