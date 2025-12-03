<template>
  <BaseLegend
    v-if="items && items.length > 0"
    :items="items"
    :title="title"
    :symbol-width="symbolWidth"
    :symbol-height="symbolHeight"
    :symbol-shape="symbolShape"
    :background-color="containerStyle.backgroundColor"
    :text-color="containerStyle.textColor"
    :border-color="containerStyle.borderColor"
    :font-size="containerStyle.fontSize"
    :padding="containerStyle.padding"
  />
  <div v-else class="legend-placeholder" :style="placeholderStyle">
    <el-icon class="placeholder-icon"><Menu /></el-icon>
    <div class="placeholder-text">{{ placeholder }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Menu } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import { vLegend as BaseLegend, useDataSource, getValueByPath } from '@one/visual-lib'

interface LegendItem {
  label: string
  color: string
}

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const items = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.itemsField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as LegendItem[]) : undefined
    }
  }
  return comp.value?.props.items as LegendItem[] | undefined
})

const title = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.titleField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'string' ? value : undefined
    }
  }
  return comp.value?.props.title as string
})

const placeholder = computed(() => (comp.value?.props.placeholder as string) || '配置图例项以显示')

const symbolWidth = computed(() => (comp.value?.props.symbolWidth as number) ?? 20)
const symbolHeight = computed(() => (comp.value?.props.symbolHeight as number) ?? 20)
const symbolShape = computed(
  () => (comp.value?.props.symbolShape as 'square' | 'circle') ?? 'square',
)

const containerStyle = computed(() => ({
  backgroundColor: (comp.value?.props.backgroundColor as string) || '#ffffff',
  textColor: (comp.value?.props.textColor as string) || '#303133',
  borderColor: (comp.value?.props.borderColor as string) || '#dcdfe6',
  fontSize: (comp.value?.props.fontSize as number) ?? 14,
  padding: (comp.value?.props.padding as number) ?? 12,
}))

const placeholderStyle = computed(() => ({
  backgroundColor: containerStyle.value.backgroundColor,
  color: containerStyle.value.textColor,
  border: `1px solid ${containerStyle.value.borderColor}`,
  fontSize: `${containerStyle.value.fontSize}px`,
  padding: `${containerStyle.value.padding}px`,
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  minWidth: '120px',
  maxWidth: '300px',
}))
</script>

<style scoped lang="scss">
.legend-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #909399;
  background-color: #f9f9f9;

  .placeholder-icon {
    font-size: 32px;
    margin-bottom: 8px;
    color: #c0c4cc;
  }

  .placeholder-text {
    font-size: 12px;
    text-align: center;
  }
}
</style>
