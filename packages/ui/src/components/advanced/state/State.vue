<template>
  <div :style="containerStyle">
    <div class="state-container">
      <div class="header">
        <span class="title">
          <el-icon><DataLine /></el-icon>
          {{ title }}
        </span>
        <el-tag size="small" type="info"> {{ stateItems.length }} 项 </el-tag>
      </div>

      <div v-if="viewMode === 'list'" class="state-list">
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

      <div v-else-if="viewMode === 'json'" class="json-view">
        <pre class="json-block">{{ jsonValue }}</pre>
      </div>

      <div v-else-if="viewMode === 'table'" class="table-view">
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
        <span>{{ placeholder }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { DataLine, Key, FolderOpened } from '@element-plus/icons-vue'

export interface StateItem {
  key: string
  value: unknown
  type: string
}

export interface StateProps {
  title?: string
  stateData?: Record<string, unknown>
  viewMode?: 'list' | 'json' | 'table'
  placeholder?: string
  // 样式
  padding?: number
  backgroundColor?: string
  textColor?: string
  fontSize?: number
  lineHeight?: number
  borderRadius?: number
  border?: string
  fontFamily?: string
}

const props = withDefaults(defineProps<StateProps>(), {
  title: '状态管理器',
  stateData: () => ({}),
  viewMode: 'list',
  placeholder: '暂无状态数据',
  padding: 16,
  backgroundColor: '#2d2d2d',
  textColor: '#cccccc',
  fontSize: 14,
  lineHeight: 1.6,
  borderRadius: 4,
  border: '1px solid #3c3c3c',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
})

const containerStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  padding: `${props.padding}px`,
  backgroundColor: props.backgroundColor,
  color: props.textColor,
  fontSize: `${props.fontSize}px`,
  lineHeight: props.lineHeight,
  borderRadius: `${props.borderRadius}px`,
  border: props.border,
  overflow: 'auto',
  fontFamily: props.fontFamily,
}))

const stateItems = computed<StateItem[]>(() => {
  return Object.entries(props.stateData).map(([key, value]) => ({
    key,
    value,
    type: typeof value,
  }))
})

const jsonValue = computed(() => {
  return JSON.stringify(props.stateData, null, 2)
})

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
