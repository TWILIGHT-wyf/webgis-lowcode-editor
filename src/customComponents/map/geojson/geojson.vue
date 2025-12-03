<template>
  <BaseMap v-bind="mapProps">
    <template #placeholder>
      <div class="map-placeholder">
        <el-icon class="placeholder-icon"><Document /></el-icon>
        <div class="placeholder-text">{{ placeholder }}</div>
      </div>
    </template>
    <!-- GeoJSON 图层 -->
    <BaseGeoJsonLayer
      v-if="geojsonData"
      :data="geojsonData"
      :style="geoStyle"
      :show-popup="showPopup"
      :popup-fields="popupFields"
      :fit-bounds="true"
      @feature-click="handleFeatureClick"
    />
  </BaseMap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Document } from '@element-plus/icons-vue'
import type L from 'leaflet'
import { useComponent } from '@/stores/component'
import {
  vMap as BaseMap,
  vGeoJsonLayer as BaseGeoJsonLayer,
  useDataSource,
  getValueByPath,
} from '@twi1i9ht/visual-lib'

const props = defineProps<{ id: string }>()

const emit = defineEmits<{
  featureClick: [feature: GeoJSON.Feature, layer: L.Layer]
}>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const geojsonData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.geojsonDataField as string | undefined
    if (field) {
      return getValueByPath(dataSourceData.value, field) as GeoJSON.GeoJsonObject | null
    }
  }
  return (comp.value?.props.geojsonData as unknown as GeoJSON.GeoJsonObject) || null
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置GeoJSON数据以显示图层',
)

const showPopup = computed(() => (comp.value?.props.showPopup as boolean) ?? true)
const popupFields = computed(() => comp.value?.props.popupFields as string[] | undefined)

const geoStyle = computed(() => {
  const style = comp.value?.props.style as Record<string, unknown> | undefined
  return {
    color: (style?.color as string) ?? '#3388ff',
    weight: (style?.weight as number) ?? 2,
    opacity: (style?.opacity as number) ?? 0.8,
    fillColor: (style?.fillColor as string) ?? '#3388ff',
    fillOpacity: (style?.fillOpacity as number) ?? 0.4,
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

function handleFeatureClick(feature: GeoJSON.Feature, layer: L.Layer) {
  emit('featureClick', feature, layer)
}
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
