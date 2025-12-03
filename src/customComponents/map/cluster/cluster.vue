<template>
  <BaseMap v-bind="mapProps">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Connection /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- 聚合图层 -->
    <BaseClusterLayer
      v-if="markers && markers.length > 0"
      :markers="markers"
      :max-cluster-radius="clusterOptions.maxClusterRadius"
      :spiderfy-on-max-zoom="clusterOptions.spiderfyOnMaxZoom"
      :show-coverage-on-hover="clusterOptions.showCoverageOnHover"
      :zoom-to-bounds-on-click="clusterOptions.zoomToBoundsOnClick"
      :disable-clustering-at-zoom="clusterOptions.disableClusteringAtZoom"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Connection } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vClusterLayer as BaseClusterLayer,
  useDataSource,
  getValueByPath,
} from '@twi1i9ht/visual-lib'

interface MarkerData {
  lat: number
  lng: number
  label?: string
  popup?: string | Record<string, unknown>
}

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const markers = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.markersField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as MarkerData[]) : undefined
    }
  }
  return comp.value?.props.markers as MarkerData[] | undefined
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置标记点数据以显示聚合',
)

const clusterOptions = computed(() => {
  const p = comp.value?.props || {}
  return {
    maxClusterRadius: (p.maxClusterRadius as number) ?? 80,
    disableClusteringAtZoom: p.disableClusteringAtZoom as number | undefined,
    spiderfyOnMaxZoom: (p.spiderfyOnMaxZoom as boolean) ?? true,
    showCoverageOnHover: (p.showCoverageOnHover as boolean) ?? true,
    zoomToBoundsOnClick: (p.zoomToBoundsOnClick as boolean) ?? true,
  }
})

// Map 属性
const mapProps = computed(() => {
  const p = comp.value?.props || {}
  return {
    centerLat: (p.centerLat as number) ?? 39.9,
    centerLng: (p.centerLng as number) ?? 116.4,
    zoom: (p.zoom as number) ?? 5,
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
