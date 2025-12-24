<template>
  <BaseMap v-bind="mapProps" :bounds="dataBounds">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Histogram /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 热力图层 -->
    <BaseHeatLayer
      v-if="normalizedHeatData.length > 0"
      :data="normalizedHeatData"
      :data-version="dataVersion"
      :radius="heatConfig.radius"
      :blur="heatConfig.blur"
      :max-zoom="heatConfig.maxZoom"
      :max="heatConfig.max"
      :min-opacity="heatConfig.minOpacity"
      :gradient="heatConfig.gradient"
      :enabled="heatLayerEnabled"
      @ready="handleHeatLayerReady"
      @update="handleHeatDataUpdate"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Histogram } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vHeatLayer as BaseHeatLayer,
  useDataSource,
  extractWithFallback,
  getValueByPath,
} from '@twi1i9ht/visual-lib'
import type {
  HeatPoint,
  HeatGradient,
  HeatLayerConfig,
  MapBounds,
  HeatDataMapping,
} from '@twi1i9ht/visual-lib'

// ==================== Props ====================
const props = defineProps<{ id: string }>()

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
const heatLayerEnabled = ref(true)

// ==================== 数据适配器 ====================

/**
 * 数据映射配置
 * 用于将任意 JSON 数组转换为标准 HeatPoint 格式
 */
const dataMapping = computed((): HeatDataMapping => {
  const ds = dataSourceConfig.value
  return {
    latField: (ds?.latField as string) || 'lat',
    lngField: (ds?.lngField as string) || 'lng',
    intensityField: (ds?.intensityField as string) || 'intensity',
  }
})

/**
 * 从数据源提取原始热力数据
 */
const rawHeatData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.heatDataField as string | undefined
    if (field) {
      return extractWithFallback<unknown[]>(dataSourceData.value, field, [])
    }
    // 如果是数组直接返回
    if (Array.isArray(dataSourceData.value)) {
      return dataSourceData.value
    }
  }
  return (comp.value?.props.heatData as unknown as unknown[]) || []
})

/**
 * 数据标准化：将任意格式转换为 HeatPoint[]
 * 这是 Smart 组件的核心职责
 */
const normalizedHeatData = computed((): HeatPoint[] => {
  const raw = rawHeatData.value
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return []
  }

  const mapping = dataMapping.value

  return raw
    .map((item) => {
      if (typeof item !== 'object' || item === null) return null

      const lat = getValueByPath(item, mapping.latField)
      const lng = getValueByPath(item, mapping.lngField)

      // 验证坐标有效性
      if (typeof lat !== 'number' || typeof lng !== 'number') return null
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

      const intensity = mapping.intensityField
        ? getValueByPath(item, mapping.intensityField)
        : undefined

      return {
        lat,
        lng,
        intensity: typeof intensity === 'number' ? Math.max(0, Math.min(1, intensity)) : 1,
      } as HeatPoint
    })
    .filter((point): point is HeatPoint => point !== null)
})

// 监听数据变化，更新版本号
watch(
  () => normalizedHeatData.value,
  () => {
    dataVersion.value++
  },
  { deep: false }, // 浅比较，依赖 computed 的引用变化
)

/**
 * 计算数据边界，用于自动适应视口
 */
const dataBounds = computed((): MapBounds | undefined => {
  const data = normalizedHeatData.value
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

  // 添加 padding
  const latPadding = (maxLat - minLat) * 0.1 || 0.01
  const lngPadding = (maxLng - minLng) * 0.1 || 0.01

  return {
    northEast: { lat: maxLat + latPadding, lng: maxLng + lngPadding },
    southWest: { lat: minLat - latPadding, lng: minLng - lngPadding },
  }
})

// ==================== 热力图配置映射 ====================

/** 预定义渐变色方案 */
const gradientPresets: Record<string, HeatGradient> = {
  default: { 0.0: 'blue', 0.5: 'lime', 1.0: 'red' },
  thermal: { 0.0: '#0000ff', 0.25: '#00ffff', 0.5: '#00ff00', 0.75: '#ffff00', 1.0: '#ff0000' },
  cool: { 0.0: '#00008b', 0.5: '#00bfff', 1.0: '#87ceeb' },
  warm: { 0.0: '#ffff00', 0.5: '#ff8c00', 1.0: '#ff0000' },
  grayscale: { 0.0: '#ffffff', 0.5: '#888888', 1.0: '#000000' },
}

/**
 * 解析渐变色配置
 */
const resolvedGradient = computed((): HeatGradient => {
  const p = comp.value?.props || {}
  const gradientConfig = p.gradient

  // 如果是字符串，使用预设
  if (typeof gradientConfig === 'string' && gradientPresets[gradientConfig]) {
    return gradientPresets[gradientConfig]
  }

  // 如果是对象，直接使用
  if (typeof gradientConfig === 'object' && gradientConfig !== null) {
    return gradientConfig as HeatGradient
  }

  return gradientPresets.default as HeatGradient
})

/**
 * 聚合热力图配置
 */
const heatConfig = computed((): HeatLayerConfig => {
  const p = comp.value?.props || {}
  return {
    radius: (p.radius as number) ?? 25,
    blur: (p.blur as number) ?? 15,
    maxZoom: (p.maxZoom as number) ?? 17,
    max: (p.max as number) ?? 1.0,
    minOpacity: (p.minOpacity as number) ?? 0.4,
    gradient: resolvedGradient.value,
  }
})

// ==================== 占位文本 ====================
const placeholder = computed(() => {
  if (dataLoading.value) return '热力数据加载中...'
  if (dataError.value) return '热力数据加载失败'
  if (normalizedHeatData.value.length === 0) return '暂无热力数据'
  return (comp.value?.props.placeholder as string) || '配置热力数据以显示热力图'
})

// ==================== Map 属性 ====================
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  return {
    centerLat: (p.centerLat as number) ?? 39.9,
    centerLng: (p.centerLng as number) ?? 116.4,
    zoom: (p.zoom as number) ?? 10,
    zoomControl: true,
    placeholder: placeholder.value,
    preferCanvas: true,
  }
})

// ==================== 事件处理 ====================
const handleHeatLayerReady = () => {
  // 热力图层就绪
}

const handleHeatDataUpdate = () => {
  // 热力数据更新
}

// ==================== 暴露方法 ====================
defineExpose({
  /** 获取标准化后的热力数据 */
  getHeatData: () => normalizedHeatData.value,
  /** 获取数据数量 */
  getDataCount: () => normalizedHeatData.value.length,
  /** 启用/禁用热力图层 */
  setEnabled: (enabled: boolean) => {
    heatLayerEnabled.value = enabled
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
