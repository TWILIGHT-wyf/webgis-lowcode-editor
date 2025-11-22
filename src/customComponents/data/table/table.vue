<template>
  <div class="table-container" :style="containerStyle">
    <el-table
      :data="tableData"
      :stripe="showStripe"
      :border="showBorder"
      :size="tableSize"
      :height="autoHeight ? undefined : '100%'"
      :max-height="maxHeight"
      :highlight-current-row="highlightCurrentRow"
      :show-header="showHeader"
      :empty-text="emptyText"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="(col, index) in columns"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align"
        :sortable="col.sortable"
        :fixed="col.fixed"
      >
        <template v-if="col.type === 'index'" #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
    </el-table>
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

// 表格列配置
interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  type?: 'index' | 'selection'
}

// 列定义
const columns = computed<TableColumn[]>(() => {
  const cols = comp.value?.props.columns as TableColumn[] | undefined
  if (cols && cols.length > 0) return cols

  // 默认列
  return [
    { prop: 'name', label: '名称', align: 'left' },
    { prop: 'value', label: '数值', align: 'right' },
    { prop: 'status', label: '状态', align: 'center' },
  ]
})

// 表格数据
const tableData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  if (localData.length > 0) return localData

  // 默认示例数据
  return [
    { name: '数据1', value: 100, status: '正常' },
    { name: '数据2', value: 200, status: '正常' },
    { name: '数据3', value: 150, status: '警告' },
  ]
})

// 表格配置
const showStripe = computed(() => (comp.value?.props.stripe as boolean) ?? true)
const showBorder = computed(() => (comp.value?.props.border as boolean) ?? true)
const tableSize = computed(() => (comp.value?.props.size as 'large' | 'default' | 'small') ?? 'default')
const autoHeight = computed(() => (comp.value?.props.autoHeight as boolean) ?? false)
const maxHeight = computed(() => (comp.value?.props.maxHeight as number) ?? undefined)
const highlightCurrentRow = computed(() => (comp.value?.props.highlightCurrentRow as boolean) ?? true)
const showHeader = computed(() => (comp.value?.props.showHeader as boolean) ?? true)
const emptyText = computed(() => (comp.value?.props.emptyText as string) ?? '暂无数据')

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'block',
    width: '100%',
    height: '100%',
  }
})

const headerCellStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    backgroundColor: (s.headerBackgroundColor as string) ?? '#f5f7fa',
    color: (s.headerTextColor as string) ?? '#606266',
    fontSize: `${(s.headerFontSize as number) ?? 14}px`,
    fontWeight: (s.headerFontWeight as string) ?? 'bold',
  }
})

const cellStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.fontSize as number) ?? 14}px`,
    color: (s.textColor as string) ?? '#606266',
  }
})

const rowStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    backgroundColor: (s.rowBackgroundColor as string) ?? '#ffffff',
  }
})

// 事件
function handleRowClick(row: Record<string, unknown>) {
  console.log('Row clicked:', row)
}
</script>

<style scoped>
.table-container {
  box-sizing: border-box;
  padding: 0;
}

:deep(.el-table) {
  width: 100%;
  height: 100%;
}
</style>
