<template>
  <div class="countup-container" :style="containerStyle">
    <div v-if="showPrefix && prefix" class="countup-prefix" :style="prefixStyle">{{ prefix }}</div>
    <div class="countup-value" :style="valueStyle">{{ displayValue }}</div>
    <div v-if="showSuffix && suffix" class="countup-suffix" :style="suffixStyle">{{ suffix }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, watch, ref } from 'vue'
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

// 当前显示值（用于动画）
const animatedValue = ref(0)

// 目标值
const targetValue = computed<number>(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as number) ?? 0

  if (ds?.enabled && remoteData.value) {
    return extractNumber(remoteData.value, ds.valuePath, localValue)
  }
  return localValue
})

// 组件属性
const startValue = computed<number>(() => (comp.value?.props.startValue as number) ?? 0)
const duration = computed<number>(() => (comp.value?.props.duration as number) ?? 2000)
const decimals = computed<number>(() => (comp.value?.props.decimals as number) ?? 0)
const separator = computed<string>(() => (comp.value?.props.separator as string) ?? ',')
const prefix = computed<string>(() => (comp.value?.props.prefix as string) ?? '')
const suffix = computed<string>(() => (comp.value?.props.suffix as string) ?? '')
const showPrefix = computed<boolean>(() => (comp.value?.props.showPrefix as boolean) ?? true)
const showSuffix = computed<boolean>(() => (comp.value?.props.showSuffix as boolean) ?? true)
const useEasing = computed<boolean>(() => (comp.value?.props.useEasing as boolean) ?? true)

// 缓动函数
function easeOutExpo(t: number, b: number, c: number, d: number): number {
  return c * (-Math.pow(2, (-10 * t) / d) + 1) + b
}

// 数字动画
function animateValue(start: number, end: number) {
  const startTime = Date.now()
  const dur = duration.value

  function update() {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime

    if (elapsed < dur) {
      const progress = elapsed / dur
      if (useEasing.value) {
        animatedValue.value = easeOutExpo(elapsed, start, end - start, dur)
      } else {
        animatedValue.value = start + (end - start) * progress
      }
      requestAnimationFrame(update)
    } else {
      animatedValue.value = end
    }
  }

  update()
}

// 格式化显示值
const displayValue = computed(() => {
  const val = animatedValue.value
  let result = val.toFixed(decimals.value)

  // 添加千分位分隔符
  if (separator.value) {
    const parts = result.split('.')
    if (parts[0]) {
      parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, separator.value)
      result = parts.join('.')
    }
  }

  return result
})

// 监听目标值变化
watch(
  targetValue,
  (newVal, oldVal) => {
    const start = oldVal ?? startValue.value
    animateValue(start, newVal)
  },
  { immediate: true },
)

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'flex',
    backgroundColor: (s.backgroundColor as string) ?? 'transparent',
    borderColor: (s.borderColor as string) ?? 'transparent',
    borderWidth: `${(s.borderWidth as number) ?? 0}px`,
    borderStyle: 'solid',
    borderRadius: `${(s.borderRadius as number) ?? 0}px`,
    padding: `${(s.padding as number) ?? 10}px`,
    justifyContent: (s.align as string) ?? 'center',
    alignItems: 'center',
  }
})

const valueStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.valueColor as string) ?? '#303133',
    fontSize: `${(s.valueFontSize as number) ?? 32}px`,
    fontWeight: (s.valueFontWeight as string) ?? 'bold',
    fontFamily: (s.fontFamily as string) ?? 'inherit',
  }
})

const prefixStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.prefixColor as string) ?? '#909399',
    fontSize: `${(s.prefixFontSize as number) ?? 16}px`,
    fontWeight: (s.prefixFontWeight as string) ?? 'normal',
    marginRight: '8px',
  }
})

const suffixStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.suffixColor as string) ?? '#909399',
    fontSize: `${(s.suffixFontSize as number) ?? 16}px`,
    fontWeight: (s.suffixFontWeight as string) ?? 'normal',
    marginLeft: '8px',
  }
})
</script>

<style scoped>
.countup-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.countup-value {
  line-height: 1;
}

.countup-prefix,
.countup-suffix {
  line-height: 1;
}
</style>
