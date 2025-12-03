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
import { computed, type CSSProperties } from 'vue'

export interface ScaleProps {
  /** 最大宽度 */
  maxWidth?: number
  /** 缩放级别 */
  zoom?: number
  /** 纬度（用于计算比例尺） */
  latitude?: number
  /** 段数 */
  segmentCount?: number
  /** 线条颜色 */
  lineColor?: string
  /** 文字颜色 */
  textColor?: string
  /** 背景色 */
  backgroundColor?: string
  /** 字体大小 */
  fontSize?: number
}

const props = withDefaults(defineProps<ScaleProps>(), {
  maxWidth: 100,
  zoom: 10,
  latitude: 0,
  segmentCount: 4,
  lineColor: '#303133',
  textColor: '#303133',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  fontSize: 11,
})

// 根据缩放级别计算比例尺
const scale = computed(() => {
  // 基于 Web Mercator 投影的计算
  const metersPerPixel =
    (156543.03392 * Math.cos((props.latitude * Math.PI) / 180)) / Math.pow(2, props.zoom)
  return metersPerPixel
})

// 生成比例尺段
const segments = computed(() => {
  const segmentPixels = props.maxWidth / props.segmentCount
  const segmentMeters = segmentPixels * scale.value

  // 格式化距离
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(1)} km`
  }

  const result = []
  for (let i = 0; i <= props.segmentCount; i++) {
    result.push({
      label: formatDistance(i * segmentMeters),
    })
  }
  return result
})

const segmentWidth = computed(() => props.maxWidth / props.segmentCount)

const lineColor = computed(() => props.lineColor)
const textColor = computed(() => props.textColor)

const containerStyle = computed<CSSProperties>(() => ({
  backgroundColor: props.backgroundColor,
  padding: '5px 10px',
  borderRadius: '4px',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
  fontSize: `${props.fontSize}px`,
}))
</script>

<style scoped>
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
}

.scale-label {
  position: absolute;
  top: -14px;
  right: -5px;
  font-size: inherit;
  white-space: nowrap;
}

.scale-segment:first-child .scale-label {
  left: -5px;
  right: auto;
}
</style>
