<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import L from 'leaflet'

export interface TileLayerProps {
  /** 瓦片URL模板 */
  url: string
  /** 属性信息 */
  attribution?: string
  /** 透明度 */
  opacity?: number
  /** 最小缩放级别 */
  minZoom?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 子域名 */
  subdomains?: string | string[]
  /** 层级 */
  zIndex?: number
}

const props = withDefaults(defineProps<TileLayerProps>(), {
  attribution: '',
  opacity: 1,
  minZoom: 0,
  maxZoom: 18,
  subdomains: 'abc',
  zIndex: 1,
})

// 从父组件注入地图实例
const mapContext = inject<Ref<L.Map | null>>('mapContext')

let tileLayer: L.TileLayer | null = null

// 创建瓦片层
function createTileLayer() {
  const map = mapContext?.value
  if (!map || !props.url) return

  // 移除旧瓦片层
  removeTileLayer()

  // 创建新瓦片层
  tileLayer = L.tileLayer(props.url, {
    attribution: props.attribution,
    opacity: props.opacity,
    minZoom: props.minZoom,
    maxZoom: props.maxZoom,
    subdomains: props.subdomains,
  }).addTo(map)

  if (props.zIndex) {
    tileLayer.setZIndex(props.zIndex)
  }
}

// 移除瓦片层
function removeTileLayer() {
  if (tileLayer && mapContext?.value) {
    mapContext.value.removeLayer(tileLayer)
    tileLayer = null
  }
}

// 监听URL变化
watch(
  () => props.url,
  (newUrl) => {
    if (tileLayer && newUrl) {
      tileLayer.setUrl(newUrl)
    } else {
      createTileLayer()
    }
  },
)

// 监听透明度变化
watch(
  () => props.opacity,
  (newOpacity) => {
    if (tileLayer) {
      tileLayer.setOpacity(newOpacity)
    }
  },
)

// 监听层级变化
watch(
  () => props.zIndex,
  (newZIndex) => {
    if (tileLayer && newZIndex !== undefined) {
      tileLayer.setZIndex(newZIndex)
    }
  },
)

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map) {
      createTileLayer()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (mapContext?.value) {
    createTileLayer()
  }
})

onBeforeUnmount(() => {
  removeTileLayer()
})

defineExpose({
  getLayer: () => tileLayer,
  setOpacity: (opacity: number) => tileLayer?.setOpacity(opacity),
  setUrl: (url: string) => tileLayer?.setUrl(url),
})
</script>
