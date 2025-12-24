<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, shallowRef, type Ref } from 'vue'
import L from 'leaflet'
import 'leaflet.heat'
import type { HeatPoint, HeatGradient, HeatLayerConfig } from '../../types/gis'

// ==================== 重新导出类型供外部使用 ====================
export type { HeatPoint, HeatGradient, HeatLayerConfig }

// ==================== Props 定义 ====================
export interface HeatLayerProps {
  /** 热力数据点 */
  data: HeatPoint[]
  /** 数据版本号，用于增量更新检测 */
  dataVersion?: number
  /** 热力点半径（像素） */
  radius?: number
  /** 模糊程度（像素） */
  blur?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 最大强度值 */
  max?: number
  /** 最小透明度 */
  minOpacity?: number
  /** 渐变色配置 */
  gradient?: HeatGradient
  /** 是否启用图层 */
  enabled?: boolean
}

// Leaflet.heat 类型扩展
interface LeafletHeat extends L.Layer {
  setLatLngs(latlngs: Array<[number, number, number]>): this
  setOptions(options: Partial<HeatLayerConfig>): this
  redraw(): this
  _latlngs?: Array<[number, number, number]>
}

const props = withDefaults(defineProps<HeatLayerProps>(), {
  radius: 25,
  blur: 15,
  maxZoom: 17,
  max: 1.0,
  minOpacity: 0.4,
  enabled: true,
  gradient: () => ({
    0.0: 'blue',
    0.5: 'lime',
    1.0: 'red',
  }),
})

// ==================== Emits ====================
const emit = defineEmits<{
  ready: [layer: LeafletHeat]
  update: [pointCount: number]
}>()

// ==================== 注入地图实例 ====================
const mapContext = inject<Ref<L.Map | null>>('mapContext')

// ==================== 内部状态 ====================
// 使用 shallowRef 避免深度响应式
const heatLayer = shallowRef<LeafletHeat | null>(null)
let lastDataVersion = -1
let lastDataLength = -1

// ==================== 数据转换 ====================

/** 将 HeatPoint 数组转换为 Leaflet.heat 格式 */
function transformData(data: HeatPoint[]): Array<[number, number, number]> {
  return data.map((point) => [point.lat, point.lng, point.intensity ?? 1])
}

/** 比较数据是否需要更新（避免深度比较） */
function shouldUpdateData(): boolean {
  // 通过版本号判断
  if (props.dataVersion !== undefined && props.dataVersion !== lastDataVersion) {
    lastDataVersion = props.dataVersion
    return true
  }

  // 通过数据长度快速判断
  if (props.data.length !== lastDataLength) {
    lastDataLength = props.data.length
    return true
  }

  return false
}

// ==================== 图层生命周期 ====================

/** 创建热力图层 */
function createHeatLayer() {
  const map = mapContext?.value
  if (!map || !props.enabled) return

  // 移除旧图层
  removeHeatLayer()

  if (!props.data || props.data.length === 0) return

  // 转换数据
  const heatPoints = transformData(props.data)
  lastDataLength = props.data.length
  lastDataVersion = props.dataVersion ?? -1

  // 创建热力图层
  const layer = (
    L as unknown as {
      heatLayer: (
        latlngs: Array<[number, number, number]>,
        options?: Record<string, unknown>,
      ) => LeafletHeat
    }
  ).heatLayer(heatPoints, {
    radius: props.radius,
    blur: props.blur,
    maxZoom: props.maxZoom,
    max: props.max,
    minOpacity: props.minOpacity,
    gradient: props.gradient,
  })

  layer.addTo(map)
  heatLayer.value = layer

  emit('ready', layer)
  emit('update', heatPoints.length)
}

/** 移除热力图层 */
function removeHeatLayer() {
  if (heatLayer.value && mapContext?.value) {
    mapContext.value.removeLayer(heatLayer.value)
    heatLayer.value = null
  }
}

/** 增量更新数据（不销毁重建图层） */
function updateData() {
  if (!heatLayer.value) {
    createHeatLayer()
    return
  }

  if (!props.data || props.data.length === 0) {
    removeHeatLayer()
    return
  }

  // 使用 setLatLngs 进行增量更新
  const heatPoints = transformData(props.data)
  heatLayer.value.setLatLngs(heatPoints)
  lastDataLength = props.data.length
  lastDataVersion = props.dataVersion ?? -1

  emit('update', heatPoints.length)
}

/** 更新配置（不销毁重建图层） */
function updateConfig() {
  if (!heatLayer.value) return

  // leaflet.heat 不支持 setOptions，需要重建
  // 但我们可以通过检测变化来最小化重建
  createHeatLayer()
}

// ==================== 监听器 ====================

// 监听数据变化（浅比较 + 版本号）
watch(
  [() => props.data, () => props.dataVersion],
  () => {
    if (shouldUpdateData()) {
      updateData()
    }
  },
  { flush: 'post' },
)

// 监听配置变化（需要重建图层）
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
    updateConfig()
  },
)

// 监听启用状态
watch(
  () => props.enabled,
  (enabled) => {
    if (enabled) {
      createHeatLayer()
    } else {
      removeHeatLayer()
    }
  },
)

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map && props.enabled) {
      createHeatLayer()
    }
  },
  { immediate: true },
)

// ==================== 生命周期 ====================
onMounted(() => {
  if (mapContext?.value && props.enabled) {
    createHeatLayer()
  }
})

onBeforeUnmount(() => {
  removeHeatLayer()
})

// ==================== 暴露方法 ====================
defineExpose({
  /** 获取图层实例 */
  getLayer: () => heatLayer.value,
  /** 强制刷新 */
  refresh: () => createHeatLayer(),
  /** 重绘 */
  redraw: () => heatLayer.value?.redraw(),
})
</script>
