<template>
  <div :style="textStyle">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 优先使用远程数据，否则使用本地配置的文本
const content = computed(() => {
  if (
    comp.value?.dataSource?.enabled &&
    remoteData.value !== null &&
    remoteData.value !== undefined
  ) {
    return typeof remoteData.value === 'string'
      ? remoteData.value
      : JSON.stringify(remoteData.value, null, 2)
  }

  return (comp.value?.props.text as string) ?? '示例文本'
})
const textStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'block',
    fontSize: (s.fontSize ?? 16) + 'px',
    color: (s.fontColor ?? '#000000') as string,
    fontWeight: (s.fontWeight ?? 'normal') as CSSProperties['fontWeight'],
    textAlign: (s.textAlign ?? 'left') as CSSProperties['textAlign'],
    letterSpacing: (s.letterSpacing ?? 0) + 'px',
    lineHeight: (s.lineHeight ?? 1.2) as CSSProperties['lineHeight'],
    padding: `${s.paddingY ?? 0}px ${s.paddingX ?? 0}px`,
    width: '100%',
    height: '100%',
    userSelect: (s.locked ? 'none' : 'text') as CSSProperties['userSelect'],
    pointerEvents: (s.locked ? 'none' : 'auto') as CSSProperties['pointerEvents'],
    overflow: 'hidden',
  }
})
</script>
