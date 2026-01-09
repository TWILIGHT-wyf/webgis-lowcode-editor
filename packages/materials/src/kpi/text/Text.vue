<template>
  <VText v-bind="textProps" />
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { vText as VText, useDataSource, extractWithFallback } from '@twi1i9ht/visual-lib'

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

// 聚合所有 Props 传递给 Dumb 组件
const textProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  return {
    content: content.value,
    fontSize: s.fontSize ?? 16,
    fontColor: s.fontColor ?? '#000000',
    fontWeight: s.fontWeight ?? 'normal',
    textAlign: s.textAlign ?? 'left',
    letterSpacing: s.letterSpacing ?? 0,
    lineHeight: s.lineHeight ?? 1.2,
    paddingX: s.paddingX ?? 0,
    paddingY: s.paddingY ?? 0,
    opacity: s.opacity ?? 100,
    visible: s.visible !== false,
    locked: s.locked ?? false,
  }
})
</script>
