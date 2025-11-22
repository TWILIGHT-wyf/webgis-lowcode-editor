<template>
  <div class="box-container" :style="containerStyle">
    <div class="box-content" :style="contentStyle">
      {{ displayContent }}
    </div>
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

// 显示内容
const displayContent = computed<string>(() => {
  const ds = comp.value?.dataSource
  const localContent = (comp.value?.props.content as string) ?? '占位盒'

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.dataPath, localContent) as string
  }
  return localContent
})

// 容器样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'flex',
    backgroundColor: (s.backgroundColor as string) ?? '#ffffff',
    borderColor: (s.borderColor as string) ?? '#dcdfe6',
    borderWidth: `${(s.borderWidth as number) ?? 1}px`,
    borderStyle: (s.borderStyle as string) ?? 'solid',
    borderRadius: `${(s.borderRadius as number) ?? 4}px`,
    padding: `${(s.padding as number) ?? 16}px`,
    boxShadow: (s.boxShadow as string) ?? 'none',
  }
})

// 内容样式
const contentStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  const textAlign = (s.textAlign as string) ?? 'center'
  return {
    fontSize: `${(s.fontSize as number) ?? 14}px`,
    color: (s.textColor as string) ?? '#606266',
    fontWeight: (s.fontWeight as string) ?? 'normal',
    textAlign: textAlign as 'left' | 'center' | 'right' | 'justify',
    lineHeight: (s.lineHeight as number) ?? 1.5,
  }
})
</script>

<style scoped>
.box-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-content {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
