<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { inject, watch, onMounted, onBeforeUnmount, type Ref } from 'vue'
import L from 'leaflet'

export interface MarkerProps {
  /** 纬度 */
  lat: number
  /** 经度 */
  lng: number
  /** 标签文本 */
  label?: string
  /** 是否显示标签 */
  showLabel?: boolean
  /** 标签方向 */
  labelDirection?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto'
  /** 弹窗内容 */
  popup?: string
  /** 自定义图标URL */
  iconUrl?: string
  /** 图标大小 */
  iconSize?: [number, number]
  /** 图标锚点 */
  iconAnchor?: [number, number]
  /** 弹窗锚点 */
  popupAnchor?: [number, number]
  /** 标记颜色 (使用 divIcon) */
  color?: string
  /** 是否可拖动 */
  draggable?: boolean
  /** 透明度 */
  opacity?: number
}

const props = withDefaults(defineProps<MarkerProps>(), {
  showLabel: false,
  labelDirection: 'top',
  draggable: false,
  opacity: 1,
  iconSize: () => [25, 41],
  iconAnchor: () => [12, 41],
  popupAnchor: () => [1, -34],
})

const emit = defineEmits<{
  click: [e: L.LeafletMouseEvent]
  dragend: [latlng: { lat: number; lng: number }]
}>()

// 从父组件注入地图实例
const mapContext = inject<Ref<L.Map | null>>('mapContext')

let marker: L.Marker | null = null

// 创建图标
function createIcon(): L.Icon | L.DivIcon {
  // 使用自定义图标URL
  if (props.iconUrl) {
    return L.icon({
      iconUrl: props.iconUrl,
      iconSize: props.iconSize,
      iconAnchor: props.iconAnchor,
      popupAnchor: props.popupAnchor,
    })
  }

  // 使用颜色创建 divIcon
  if (props.color) {
    return L.divIcon({
      html: `<div style="background-color: ${props.color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  // 默认图标
  return new L.Icon.Default()
}

// 创建标记
function createMarker() {
  const map = mapContext?.value
  if (!map) return

  // 移除旧标记
  removeMarker()

  // 创建新标记
  marker = L.marker([props.lat, props.lng], {
    icon: createIcon(),
    draggable: props.draggable,
    opacity: props.opacity,
  })

  // 绑定标签
  if (props.showLabel && props.label) {
    marker.bindTooltip(props.label, {
      permanent: true,
      direction: props.labelDirection,
      className: 'marker-label',
    })
  }

  // 绑定弹窗
  if (props.popup) {
    marker.bindPopup(props.popup)
  }

  // 绑定事件
  marker.on('click', (e) => emit('click', e))
  marker.on('dragend', () => {
    if (marker) {
      const latlng = marker.getLatLng()
      emit('dragend', { lat: latlng.lat, lng: latlng.lng })
    }
  })

  marker.addTo(map)
}

// 移除标记
function removeMarker() {
  if (marker) {
    marker.remove()
    marker = null
  }
}

// 更新标记位置
function updatePosition() {
  if (marker) {
    marker.setLatLng([props.lat, props.lng])
  }
}

// 监听位置变化
watch([() => props.lat, () => props.lng], () => {
  updatePosition()
})

// 监听其他属性变化，需要重建标记
watch(
  [
    () => props.iconUrl,
    () => props.color,
    () => props.label,
    () => props.showLabel,
    () => props.popup,
    () => props.draggable,
  ],
  () => {
    createMarker()
  },
)

// 监听地图实例变化
watch(
  () => mapContext?.value,
  (map) => {
    if (map) {
      createMarker()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (mapContext?.value) {
    createMarker()
  }
})

onBeforeUnmount(() => {
  removeMarker()
})

// 暴露方法
defineExpose({
  getMarker: () => marker,
  openPopup: () => marker?.openPopup(),
  closePopup: () => marker?.closePopup(),
})
</script>

<style>
.custom-marker-icon {
  background: transparent;
  border: none;
}

.marker-label {
  background: transparent;
  border: none;
  box-shadow: none;
  font-weight: 500;
  color: #303133;
  text-shadow:
    1px 1px 2px white,
    -1px -1px 2px white;
}
</style>
