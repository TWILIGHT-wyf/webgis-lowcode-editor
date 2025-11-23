<template>
  <div ref="mapContainer" class="heat-map" :style="containerStyle">
    <div v-if="!heatData || heatData.length === 0" class="map-placeholder">
      <icon class="placeholder-icon"><Histogram /></icon>
      <div class="placeholder-text">{{ placeholder || '配置热力数据以显示热力图' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { Histogram } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

interface HeatPoint {
  lat: number
  lng: number
  intensity?: number
}

interface LeafletHeat extends L.Layer {
  setLatLngs(latlngs: Array<[number, number, number]>): this
}

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let heatLayer: LeafletHeat | null = null

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const heatData = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.heatDataField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as HeatPoint[]) : undefined
    }
  }
  return comp.value?.props.heatData as HeatPoint[] | undefined
})

const placeholder = computed(() => comp.value?.props.placeholder as string)

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
}))

// 初始化地图
function initMap() {
  if (!mapContainer.value) return

  // 销毁旧地图
  if (map) {
    map.remove()
    map = null
  }

  // 创建新地图
  map = L.map(mapContainer.value, {
    center: [
      (comp.value?.props.centerLat as number) ?? 39.9,
      (comp.value?.props.centerLng as number) ?? 116.4,
    ],
    zoom: (comp.value?.props.zoom as number) ?? 10,
    zoomControl: true,
  })

  // 添加底图
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)

  // 添加热力层
  addHeatLayer()
}

// 添加热力层
function addHeatLayer() {
  if (!map || !heatData.value || !Array.isArray(heatData.value)) return

  // 清除旧热力层
  if (heatLayer) {
    map.removeLayer(heatLayer)
    heatLayer = null
  }

  // 转换数据格式：[lat, lng, intensity]
  const heatPoints: Array<[number, number, number]> = heatData.value.map((point: HeatPoint) => [
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
      radius: (comp.value?.props.radius as number) ?? 25,
      blur: (comp.value?.props.blur as number) ?? 15,
      maxZoom: (comp.value?.props.maxZoom as number) ?? 17,
      max: (comp.value?.props.max as number) ?? 1.0,
      minOpacity: (comp.value?.props.minOpacity as number) ?? 0.4,
      gradient: (comp.value?.props.gradient as Record<number, string>) ?? {
        0.0: 'blue',
        0.5: 'lime',
        1.0: 'red',
      },
    })
    .addTo(map)
}

// 监听数据变化
watch(heatData, () => {
  if (map) {
    addHeatLayer()
  }
})

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped lang="scss">
.heat-map {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

  :deep(.leaflet-container) {
    width: 100%;
    height: 100%;
  }
}

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
