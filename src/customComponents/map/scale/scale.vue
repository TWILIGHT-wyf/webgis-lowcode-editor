<template>
  <div class="scale-control" :style="containerStyle">
    <div class="scale-bar">
      <div
        class="scale-segment"
        v-for="(segment, index) in segments"
        :key="index"
        :style="{
          width: segmentWidth + 'px',
          borderBottom: `2px solid ${lineColor}`,
          borderLeft: index === 0 ? `2px solid ${lineColor}` : 'none',
          borderRight: `2px solid ${lineColor}`,
          borderTop: index % 2 === 0 ? `2px solid ${lineColor}` : 'none',
        }"
      >
        <span class="scale-label" :style="{ color: textColor }">{{ segment.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  maxWidth?: number
  metric?: boolean
  imperial?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  backgroundColor?: string
  lineColor?: string
  textColor?: string
  fontSize?: number
  segments?: number
  zoom?: number
}>()

// 根据缩放级别计算比例尺
const scale = computed(() => {
  const zoom = props.zoom ?? 10
  // 简化的比例尺计算（实际应根据纬度调整）
  const metersPerPixel = (156543.03392 * Math.cos((0 * Math.PI) / 180)) / Math.pow(2, zoom)
  return metersPerPixel
})

// 生成比例尺段
const segments = computed(() => {
  const maxWidth = props.maxWidth ?? 100
  const numSegments = props.segments ?? 4
  const segmentPixels = maxWidth / numSegments
  const segmentMeters = segmentPixels * scale.value

  // 格式化距离
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(1)} km`
  }

  const result = []
  for (let i = 0; i <= numSegments; i++) {
    result.push({
      label: formatDistance(i * segmentMeters),
    })
  }
  return result
})

const segmentWidth = computed(() => {
  const maxWidth = props.maxWidth ?? 100
  const numSegments = props.segments ?? 4
  return maxWidth / numSegments
})

const lineColor = computed(() => props.lineColor || '#303133')
const textColor = computed(() => props.textColor || '#303133')

const containerStyle = computed(() => ({
  backgroundColor: props.backgroundColor || 'rgba(255, 255, 255, 0.8)',
  padding: '5px 10px',
  borderRadius: '4px',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
  fontSize: `${props.fontSize ?? 11}px`,
}))
</script>

<style scoped lang="scss">
.scale-control {
  display: inline-block;
}

.scale-bar {
  display: flex;
  align-items: flex-end;
  height: 20px;
}

.scale-segment {
  position: relative;
  height: 10px;
  box-sizing: border-box;

  .scale-label {
    position: absolute;
    top: -14px;
    right: -5px;
    font-size: inherit;
    white-space: nowrap;
  }

  &:first-child .scale-label {
    left: -5px;
    right: auto;
  }
}
</style>
