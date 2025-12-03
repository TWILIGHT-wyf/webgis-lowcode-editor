<template>
  <BaseMap v-bind="mapProps">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Histogram /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 热力图层 -->
    <BaseHeatLayer v-if="heatData && heatData.length > 0" v-bind="heatLayerProps" />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Histogram } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vHeatLayer as BaseHeatLayer,
  useDataSource,
  extractWithFallback,
} from '@twi1i9ht/visual-lib'
import type { HeatPoint } from '@twi1i9ht/visual-lib'

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const heatData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.heatDataField as string | undefined
    if (field) {
      return extractWithFallback<HeatPoint[]>(dataSourceData.value, field, [])
    }
  }
  return (comp.value?.props.heatData as unknown as HeatPoint[]) || []
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置热力数据以显示热力图',
)

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

// HeatLayer 属性
const heatLayerProps = computed(() => {
  const p = comp.value?.props || {}
  return {
    data: heatData.value,
    radius: (p.radius as number) ?? 25,
    blur: (p.blur as number) ?? 15,
    maxZoom: (p.maxZoom as number) ?? 17,
    max: (p.max as number) ?? 1.0,
    minOpacity: (p.minOpacity as number) ?? 0.4,
    gradient: (p.gradient as Record<number, string>) ?? {
      0.0: 'blue',
      0.5: 'lime',
      1.0: 'red',
    },
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
