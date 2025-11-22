<template>
  <div class="pivot-container" :style="containerStyle">
    <div v-if="pivotData.length === 0" class="empty-state">
      <el-empty :description="emptyText" :image-size="80" />
    </div>
    <el-table
      v-else
      :data="pivotData"
      :stripe="stripe"
      :border="border"
      :size="tableSize"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :height="height === 'auto' ? undefined : height"
      :max-height="maxHeight || undefined"
      :style="tableStyle"
    >
      <!-- 行表头列 -->
      <el-table-column
        v-for="rowHeader in rowHeaders"
        :key="rowHeader"
        :prop="rowHeader"
        :label="getColumnLabel(rowHeader)"
        :width="rowHeaderWidth"
        :fixed="fixedRowHeaders"
        :align="rowHeaderAlign"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="col in dataColumns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :align="col.align || 'center'"
        :sortable="col.sortable"
      >
        <template #default="{ row }">
          <span :style="getCellStyle(row[col.prop])">
            {{ formatValue(row[col.prop]) }}
          </span>
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
import type { TableColumnCtx } from 'element-plus'

interface Column {
  prop: string
  label: string
  width?: number
  align?: string
  sortable?: boolean
}

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 透视表数据
const pivotData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  if (localData.length > 0) return localData

  // 默认示例数据
  return [
    { category: '产品A', region: '华东', q1: 1200, q2: 1500, q3: 1800, q4: 2100 },
    { category: '产品A', region: '华南', q1: 1100, q2: 1300, q3: 1600, q4: 1900 },
    { category: '产品B', region: '华东', q1: 900, q2: 1100, q3: 1300, q4: 1500 },
    { category: '产品B', region: '华南', q1: 800, q2: 1000, q3: 1200, q4: 1400 },
  ]
})

// 配置项
const stripe = computed(() => (comp.value?.props.stripe as boolean) ?? true)
const border = computed(() => (comp.value?.props.border as boolean) ?? true)
const tableSize = computed(
  () => (comp.value?.props.size as 'large' | 'default' | 'small') ?? 'default',
)
const showSummary = computed(() => (comp.value?.props.showSummary as boolean) ?? true)
const emptyText = computed(() => (comp.value?.props.emptyText as string) ?? '暂无数据')
const height = computed(() => (comp.value?.props.height as string) ?? 'auto')
const maxHeight = computed(() => (comp.value?.props.maxHeight as string) ?? '')
const rowHeaderWidth = computed(() => (comp.value?.props.rowHeaderWidth as number) ?? 120)
const fixedRowHeaders = computed(() => (comp.value?.props.fixedRowHeaders as boolean) ?? true)
const rowHeaderAlign = computed(() => (comp.value?.props.rowHeaderAlign as string) ?? 'left')
const valueFormat = computed(() => (comp.value?.props.valueFormat as string) ?? 'number')
const highlightThreshold = computed(() => (comp.value?.props.highlightThreshold as number) ?? 0)

// 行表头和数据列
const rowHeaders = computed(() => {
  const headers = comp.value?.props.rowHeaders as string[] | string
  if (Array.isArray(headers)) return headers
  if (typeof headers === 'string') return headers.split(',').map((s) => s.trim())
  return ['category', 'region']
})

const dataColumns = computed(() => {
  const columns = comp.value?.props.dataColumns
  if (Array.isArray(columns)) return columns as Column[]

  // 从第一行数据推断列
  if (pivotData.value.length > 0) {
    const firstRow = pivotData.value[0]
    if (!firstRow) return []
    const cols: Column[] = []

    Object.keys(firstRow).forEach((key) => {
      if (!rowHeaders.value.includes(key)) {
        cols.push({
          prop: key,
          label: key.toUpperCase(),
          width: 100,
          align: 'center',
          sortable: true,
        })
      }
    })

    return cols
  }

  return []
})

// 获取列标签
function getColumnLabel(prop: string): string {
  const labelMap = comp.value?.props.columnLabels as Record<string, string> | undefined
  return labelMap?.[prop] || prop
}

// 格式化值
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'

  const numValue = Number(value)
  if (isNaN(numValue)) return String(value)

  switch (valueFormat.value) {
    case 'number':
      return numValue.toLocaleString()
    case 'percent':
      return `${(numValue * 100).toFixed(2)}%`
    case 'currency':
      return `¥${numValue.toLocaleString()}`
    default:
      return String(value)
  }
}

// 获取单元格样式
function getCellStyle(value: unknown): CSSProperties {
  const s = comp.value?.style || {}
  const numValue = Number(value)

  if (!isNaN(numValue) && highlightThreshold.value > 0) {
    if (numValue >= highlightThreshold.value) {
      return {
        color: (s.highlightColor as string) ?? '#67c23a',
        fontWeight: 'bold',
      }
    }
  }

  return {}
}

// 合计行
function getSummaries(param: {
  columns: TableColumnCtx<Record<string, unknown>>[]
  data: Record<string, unknown>[]
}) {
  const { columns, data } = param
  const sums: string[] = []

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    if (rowHeaders.value.includes(column.property)) {
      sums[index] = ''
      return
    }

    const values = data.map((item) => Number(item[column.property]))
    if (values.every((value) => !isNaN(value))) {
      const sum = values.reduce((prev, curr) => prev + curr, 0)
      sums[index] = formatValue(sum)
    } else {
      sums[index] = '-'
    }
  })

  return sums
}

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'block',
    width: '100%',
    height: '100%',
    backgroundColor: (s.backgroundColor as string) ?? '#ffffff',
    borderRadius: `${(s.borderRadius as number) ?? 4}px`,
    padding: `${(s.padding as number) ?? 0}px`,
    overflow: 'hidden',
  }
})

const tableStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    '--el-table-header-bg-color': (s.headerBackgroundColor as string) ?? '#f5f7fa',
    '--el-table-header-text-color': (s.headerColor as string) ?? '#909399',
    '--el-table-row-hover-bg-color': (s.hoverBackgroundColor as string) ?? '#f5f7fa',
    '--el-table-border-color': (s.borderColor as string) ?? '#ebeef5',
  } as CSSProperties
})
</script>

<style scoped>
.pivot-container {
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
</style>
