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
import { extractWithFallback } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 优先使用远程数据（根据 dataPath 提取），否则使用本地配置的文本
const content = computed(() => {
  const ds = comp.value?.dataSource
  const localText = (comp.value?.props.text as string) ?? '示例文本'

  if (ds?.enabled && remoteData.value) {
    // 使用工具函数提取数据，支持 dataPath
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localText)
    return typeof extracted === 'string' ? extracted : JSON.stringify(extracted, null, 2)
  }

  return localText
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
