<template>
  <div class="progress-container" :style="containerStyle">
    <div v-if="showText && textPosition === 'left'" class="progress-text" :style="textStyle">
      {{ displayText }}
    </div>
    <div class="progress-wrapper" :class="{ vertical: isVertical }" :style="wrapperStyle">
      <div class="progress-track" :style="trackStyle">
        <div class="progress-bar" :style="barStyle">
          <div v-if="showStripe" class="progress-stripe" :class="{ animated: animateStripe }"></div>
        </div>
      </div>
    </div>
    <div v-if="showText && textPosition === 'right'" class="progress-text" :style="textStyle">
      {{ displayText }}
    </div>
    <div
      v-if="showText && textPosition === 'inside' && !isVertical"
      class="progress-text-inside"
      :style="textInsideStyle"
    >
      {{ displayText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractNumber } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 进度值
const progressValue = computed<number>(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as number) ?? 0

  let val = localValue
  if (ds?.enabled && remoteData.value) {
    val = extractNumber(remoteData.value, ds.valuePath, localValue)
  }

  return Math.max(0, Math.min(100, val)) // 限制在0-100之间
})

// 组件属性
const type = computed<string>(() => (comp.value?.props.type as string) ?? 'line')
const showText = computed<boolean>(() => (comp.value?.props.showText as boolean) ?? true)
const textPosition = computed<string>(() => (comp.value?.props.textPosition as string) ?? 'right')
const textFormat = computed<string>(() => (comp.value?.props.textFormat as string) ?? '{value}%')
const showStripe = computed<boolean>(() => (comp.value?.props.showStripe as boolean) ?? false)
const animateStripe = computed<boolean>(() => (comp.value?.props.animateStripe as boolean) ?? false)
const isVertical = computed<boolean>(() => type.value === 'vertical')

// 显示文本
const displayText = computed(() => {
  return textFormat.value.replace('{value}', progressValue.value.toFixed(0))
})

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'flex',
    flexDirection: isVertical.value ? 'column' : 'row',
    alignItems: isVertical.value ? 'center' : 'center',
    gap: '10px',
    padding: `${(s.padding as number) ?? 0}px`,
  }
})

const wrapperStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  if (isVertical.value) {
    return {
      width: `${(s.strokeWidth as number) ?? 20}px`,
      height: '100%',
      flex: 1,
    }
  }
  return {
    flex: 1,
    height: `${(s.strokeWidth as number) ?? 20}px`,
  }
})

const trackStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    backgroundColor: (s.trackColor as string) ?? '#e4e7ed',
    borderRadius: `${(s.borderRadius as number) ?? 10}px`,
  }
})

const barStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  const percentage = progressValue.value

  // 根据状态设置颜色
  let barColor = (s.barColor as string) ?? '#409eff'
  const status = comp.value?.props.status as string
  if (status === 'success') barColor = (s.successColor as string) ?? '#67c23a'
  else if (status === 'warning') barColor = (s.warningColor as string) ?? '#e6a23c'
  else if (status === 'exception') barColor = (s.exceptionColor as string) ?? '#f56c6c'

  if (isVertical.value) {
    return {
      width: '100%',
      height: `${percentage}%`,
      backgroundColor: barColor,
      borderRadius: `${(s.borderRadius as number) ?? 10}px`,
      transition: 'height 0.3s ease',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    }
  }

  return {
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: barColor,
    borderRadius: `${(s.borderRadius as number) ?? 10}px`,
    transition: 'width 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }
})

const textStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.textColor as string) ?? '#606266',
    fontSize: `${(s.textFontSize as number) ?? 14}px`,
    fontWeight: (s.textFontWeight as string) ?? 'normal',
    minWidth: '50px',
    textAlign: textPosition.value === 'left' ? 'right' : 'left',
  }
})

const textInsideStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: (s.textInsideColor as string) ?? '#fff',
    fontSize: `${(s.textFontSize as number) ?? 12}px`,
    fontWeight: (s.textFontWeight as string) ?? 'bold',
  }
})
</script>

<style scoped>
.progress-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.progress-wrapper {
  position: relative;
}

.progress-wrapper.vertical {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.progress-track {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  position: relative;
}

.progress-stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}

.progress-stripe.animated {
  animation: progress-stripe-animation 1s linear infinite;
}

@keyframes progress-stripe-animation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px;
  }
}

.progress-text {
  white-space: nowrap;
}

.progress-text-inside {
  pointer-events: none;
}
</style>
