<template>
  <BaseMap v-bind="mapProps">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Pointer /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 矢量图层 -->
    <BaseVectorLayer
      v-if="vectorData && vectorData.length > 0"
      :features="vectorData"
      :default-style="defaultStyle"
      :show-popup="showPopup"
      :fit-bounds="true"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Pointer } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vVectorLayer as BaseVectorLayer,
  useDataSource,
  getValueByPath,
} from '@twi1i9ht/visual-lib'

interface VectorFeature {
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

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const vectorData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.vectorDataField as string | undefined
    if (field && typeof field === 'string') {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as VectorFeature[]) : undefined
    }
  }
  return comp.value?.props.vectorData as VectorFeature[] | undefined
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置矢量数据以显示图层',
)

const showPopup = computed(() => (comp.value?.props.showPopup as boolean) ?? true)

const defaultStyle = computed(() => {
  const style = comp.value?.props.defaultStyle as Record<string, unknown> | undefined
  return {
    color: (style?.color as string) ?? '#3388ff',
    weight: (style?.weight as number) ?? 2,
    opacity: (style?.opacity as number) ?? 0.8,
    fillColor: (style?.fillColor as string) ?? '#3388ff',
    fillOpacity: (style?.fillOpacity as number) ?? 0.4,
    radius: (style?.radius as number) ?? 8,
  }
})

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
