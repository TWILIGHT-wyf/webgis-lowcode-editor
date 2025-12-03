<template>
  <BaseMap v-bind="mapProps">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Grid /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 额外瓦片图层 -->
    <BaseTileLayer
      v-if="tileUrl"
      :url="tileUrl"
      :opacity="opacity"
      :min-zoom="tileOptions.minZoom"
      :max-zoom="tileOptions.maxZoom"
      :z-index="tileOptions.zIndex"
      :attribution="tileOptions.attribution"
      :subdomains="tileOptions.subdomains"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Grid } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vTileLayer as BaseTileLayer,
  useDataSource,
  getValueByPath,
} from '@one/visual-lib'

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源处理
const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

// 从store获取属性
const tileUrl = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.tileUrlField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'string' ? value : ''
    }
  }
  return (comp.value?.props.tileUrl as string) || ''
})

const opacity = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.opacityField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'number' ? value : 1
    }
  }
  return (comp.value?.props.opacity as number) ?? 1
})

const centerLat = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.centerLatField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'number' ? value : 39.9
    }
  }
  return (comp.value?.props.centerLat as number) ?? 39.9
})

const centerLng = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.centerLngField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'number' ? value : 116.4
    }
  }
  return (comp.value?.props.centerLng as number) ?? 116.4
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置瓦片URL以显示图层',
)

const tileOptions = computed(() => {
  const p = comp.value?.props || {}
  return {
    attribution: p.attribution as string | undefined,
    minZoom: p.minZoom as number | undefined,
    maxZoom: p.maxZoom as number | undefined,
    zIndex: p.zIndex as number | undefined,
    subdomains: p.subdomains as string | undefined,
  }
})

// Map 属性
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  return {
    centerLat: centerLat.value,
    centerLng: centerLng.value,
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
