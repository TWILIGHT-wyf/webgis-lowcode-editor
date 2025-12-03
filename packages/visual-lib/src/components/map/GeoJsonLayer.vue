<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import L from 'leaflet'
import type { GeoJsonObject, Feature } from 'geojson'

export interface GeoJsonLayerProps {
  /** GeoJSON 数据 */
  data: GeoJsonObject | null
  /** 样式配置 */
  style?: {
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
  }
  /** 是否显示弹窗 */
  showPopup?: boolean
  /** 弹窗显示字段 */
  popupFields?: string[]
  /** 是否自适应边界 */
  fitBounds?: boolean
  /** 自适应边界的 padding */
  fitBoundsPadding?: [number, number]
}

const props = withDefaults(defineProps<GeoJsonLayerProps>(), {
  style: () => ({
    color: '#3388ff',
    weight: 2,
    opacity: 0.8,
    fillColor: '#3388ff',
    fillOpacity: 0.4,
  }),
  showPopup: true,
  fitBounds: true,
  fitBoundsPadding: () => [50, 50],
})

const emit = defineEmits<{
  featureClick: [feature: Feature, layer: L.Layer]
}>()

// 从父组件注入地图实例
const mapContext = inject<Ref<L.Map | null>>('mapContext')

let geojsonLayer: L.GeoJSON | null = null

// 创建 GeoJSON 图层
function createGeoJsonLayer() {
  const map = mapContext?.value
  if (!map || !props.data) return

  // 移除旧图层
  removeGeoJsonLayer()

  // 添加新图层
  geojsonLayer = L.geoJSON(props.data, {
    style: () => ({
      color: props.style?.color ?? '#3388ff',
      weight: props.style?.weight ?? 2,
      opacity: props.style?.opacity ?? 0.8,
      fillColor: props.style?.fillColor ?? '#3388ff',
      fillOpacity: props.style?.fillOpacity ?? 0.4,
    }),
    onEachFeature: (feature, layer) => {
      // 绑定弹窗
      if (props.showPopup && feature.properties) {
        const fields = props.popupFields || Object.keys(feature.properties)
        const popupContent = fields
          .filter((field) => feature.properties && feature.properties[field] !== undefined)
          .map((field) => `<strong>${field}:</strong> ${feature.properties![field]}`)
          .join('<br>')
        if (popupContent) {
          layer.bindPopup(popupContent)
        }
      }

      // 点击事件
      layer.on('click', () => {
        emit('featureClick', feature, layer)
      })
    },
  }).addTo(map)

  // 自适应边界
  if (props.fitBounds && geojsonLayer.getBounds().isValid()) {
    map.fitBounds(geojsonLayer.getBounds(), { padding: props.fitBoundsPadding })
  }
}

// 移除 GeoJSON 图层
function removeGeoJsonLayer() {
  if (geojsonLayer && mapContext?.value) {
    mapContext.value.removeLayer(geojsonLayer)
    geojsonLayer = null
  }
}

// 监听数据变化
watch(() => props.data, createGeoJsonLayer, { deep: true })

// 监听样式变化
watch(() => props.style, createGeoJsonLayer, { deep: true })

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map) {
      createGeoJsonLayer()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (mapContext?.value) {
    createGeoJsonLayer()
  }
})

onBeforeUnmount(() => {
  removeGeoJsonLayer()
})

defineExpose({
  getLayer: () => geojsonLayer,
})
</script>
