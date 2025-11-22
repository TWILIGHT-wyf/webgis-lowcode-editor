<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 状态数据
const stateData = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const stateField: string = (comp.value?.dataSource?.stateField as string) || 'state'
    return extractWithFallback<Record<string, unknown>>(dataSourceData.value, stateField, {})
  }
  // 使用 props 中的 state
  const stateStr = String(comp.value?.props?.state || '{}')
  try {
    return JSON.parse(stateStr) as Record<string, unknown>
  } catch {
    return {}
  }
})

// 当前值显示
const currentValue = ref<string>('')

watch(
  stateData,
  (newState) => {
    currentValue.value = JSON.stringify(newState, null, 2)
  },
  { immediate: true },
)

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || '#2d2d2d'),
    color: String(s.textColor || '#cccccc'),
    fontSize: `${s.fontSize || 14}px`,
    lineHeight: String(s.lineHeight || 1.6),
    borderRadius: `${s.borderRadius || 4}px`,
    border: String(s.border || '1px solid #3c3c3c'),
    overflow: 'auto',
    fontFamily: String(s.fontFamily || 'Consolas, Monaco, "Courier New", monospace'),
  }
})

// 状态项列表
const stateItems = computed(() => {
  return Object.entries(stateData.value).map(([key, value]) => ({
    key,
    value,
    type: typeof value,
  }))
})
</script>

<template>
  <div :style="containerStyle">
    <div class="state-container">
      <div class="header">
        <span class="title">
          <el-icon><DataLine /></el-icon>
          状态管理器
        </span>
        <el-tag size="small" type="info"> {{ stateItems.length }} 项 </el-tag>
      </div>

      <div v-if="comp?.props?.viewMode === 'list' || !comp?.props?.viewMode" class="state-list">
        <div v-for="item in stateItems" :key="item.key" class="state-item">
          <div class="state-key">
            <el-icon><Key /></el-icon>
            {{ item.key }}
          </div>
          <div class="state-value">
            <el-tag :type="getTagType(item.type)" size="small">{{ item.type }}</el-tag>
            <span class="value-text">{{ formatValue(item.value) }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="comp?.props?.viewMode === 'json'" class="json-view">
        <pre class="json-block">{{ currentValue }}</pre>
      </div>

      <div v-else-if="comp?.props?.viewMode === 'table'" class="table-view">
        <el-table :data="stateItems" size="small" :border="true">
          <el-table-column prop="key" label="键" width="120" />
          <el-table-column prop="type" label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.type)" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值">
            <template #default="{ row }">
              {{ formatValue(row.value) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="stateItems.length === 0" class="placeholder">
        <el-icon><FolderOpened /></el-icon>
        <span>{{ comp?.props?.placeholder || '暂无状态数据' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 辅助函数
function getTagType(type: string): 'success' | 'info' | 'warning' | 'danger' | '' {
  const typeMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    string: 'success',
    number: 'info',
    boolean: 'warning',
    object: 'danger',
  }
  return typeMap[type] || ''
}

function formatValue(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
</script>

<style scoped>
.state-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #3c3c3c;
}

.title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 16px;
}

.state-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.state-item {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.state-key {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #4fc3f7;
}

.state-value {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 24px;
}

.value-text {
  flex: 1;
  word-break: break-all;
}

.json-view {
  flex: 1;
  overflow: auto;
}

.json-block {
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  white-space: pre;
  overflow-x: auto;
  color: #9cdcfe;
}

.table-view {
  flex: 1;
  overflow: auto;
}

.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 8px;
  opacity: 0.5;
}

.placeholder .el-icon {
  font-size: 32px;
}
</style>
