<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet.heat'

export interface HeatPoint {
  lat: number
  lng: number
  intensity?: number
}

export interface HeatLayerProps {
  /** 热力数据点 */
  data: HeatPoint[]
  /** 热力点半径 */
  radius?: number
  /** 模糊程度 */
  blur?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 最大强度值 */
  max?: number
  /** 最小透明度 */
  minOpacity?: number
  /** 渐变色配置 */
  gradient?: Record<number, string>
}

interface LeafletHeat extends L.Layer {
  setLatLngs(latlngs: Array<[number, number, number]>): this
}

const props = withDefaults(defineProps<HeatLayerProps>(), {
  radius: 25,
  blur: 15,
  maxZoom: 17,
  max: 1.0,
  minOpacity: 0.4,
  gradient: () => ({
    0.0: 'blue',
    0.5: 'lime',
    1.0: 'red',
  }),
})

// 从父组件注入地图实例
const mapContext = inject<Ref<L.Map | null>>('mapContext')

let heatLayer: LeafletHeat | null = null

// 创建热力层
function createHeatLayer() {
  const map = mapContext?.value
  if (!map || !props.data || props.data.length === 0) return

  // 移除旧热力层
  removeHeatLayer()

  // 转换数据格式：[lat, lng, intensity]
  const heatPoints: Array<[number, number, number]> = props.data.map((point) => [
    point.lat,
    point.lng,
    point.intensity ?? 1,
  ])

  // 创建热力层
  heatLayer = (
    L as unknown as {
      heatLayer: (
        latlngs: Array<[number, number, number]>,
        options?: Record<string, unknown>,
      ) => LeafletHeat
    }
  )
    .heatLayer(heatPoints, {
      radius: props.radius,
      blur: props.blur,
      maxZoom: props.maxZoom,
      max: props.max,
      minOpacity: props.minOpacity,
      gradient: props.gradient,
    })
    .addTo(map)
}

// 移除热力层
function removeHeatLayer() {
  if (heatLayer && mapContext?.value) {
    mapContext.value.removeLayer(heatLayer)
    heatLayer = null
  }
}

// 更新热力数据
function updateData() {
  if (heatLayer && props.data) {
    const heatPoints: Array<[number, number, number]> = props.data.map((point) => [
      point.lat,
      point.lng,
      point.intensity ?? 1,
    ])
    heatLayer.setLatLngs(heatPoints)
  } else {
    createHeatLayer()
  }
}

// 监听数据变化
watch(() => props.data, updateData, { deep: true })

// 监听配置变化，需要重建热力层
watch(
  [
    () => props.radius,
    () => props.blur,
    () => props.maxZoom,
    () => props.max,
    () => props.minOpacity,
    () => props.gradient,
  ],
  () => {
    createHeatLayer()
  },
)

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map) {
      createHeatLayer()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (mapContext?.value) {
    createHeatLayer()
  }
})

onBeforeUnmount(() => {
  removeHeatLayer()
})

defineExpose({
  getLayer: () => heatLayer,
})
</script>
