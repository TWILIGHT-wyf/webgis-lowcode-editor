<template>
  <div class="legend-control" :style="containerStyle">
    <div v-if="!items || items.length === 0" class="legend-placeholder">
      <el-icon class="placeholder-icon"><Menu /></el-icon>
      <div class="placeholder-text">{{ placeholder || '配置图例项以显示' }}</div>
    </div>
    <div v-else class="legend-content">
      <div v-if="title" class="legend-title">{{ title }}</div>
      <div class="legend-items">
        <div v-for="(item, index) in items" :key="index" class="legend-item">
          <div
            class="legend-symbol"
            :style="{
              backgroundColor: item.color,
              width: symbolWidth + 'px',
              height: symbolHeight + 'px',
              borderRadius: symbolShape === 'circle' ? '50%' : '0',
            }"
          ></div>
          <span class="legend-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Menu } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

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

const placeholder = computed(() => comp.value?.props.placeholder as string)

const symbolWidth = computed(() => (comp.value?.props.symbolWidth as number) ?? 20)
const symbolHeight = computed(() => (comp.value?.props.symbolHeight as number) ?? 20)
const symbolShape = computed(
  () => (comp.value?.props.symbolShape as 'square' | 'circle') ?? 'square',
)

const containerStyle = computed(() => ({
  backgroundColor: (comp.value?.props.backgroundColor as string) || '#ffffff',
  color: (comp.value?.props.textColor as string) || '#303133',
  border: `1px solid ${(comp.value?.props.borderColor as string) || '#dcdfe6'}`,
  fontSize: `${(comp.value?.props.fontSize as number) ?? 14}px`,
  padding: `${(comp.value?.props.padding as number) ?? 12}px`,
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}))
</script>

<style scoped lang="scss">
.legend-control {
  display: inline-block;
  min-width: 120px;
  max-width: 300px;
}

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

.legend-content {
  .legend-title {
    font-weight: 600;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;
  }

  .legend-items {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .legend-symbol {
      flex-shrink: 0;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .legend-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
