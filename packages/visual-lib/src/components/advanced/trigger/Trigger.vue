<template>
  <div :style="containerStyle">
    <div class="trigger-container">
      <div class="header">
        <span class="title">
          <el-icon><Timer /></el-icon>
          {{ title }}
        </span>
        <div class="controls">
          <el-tag :type="enabled ? 'success' : 'info'" size="small">
            {{ enabled ? '已启用' : '已禁用' }}
          </el-tag>
          <el-button
            v-if="triggerType === 'manual'"
            type="primary"
            size="small"
            @click="$emit('trigger')"
            :disabled="!enabled"
          >
            触发
          </el-button>
          <el-button v-if="showClearButton" size="small" @click="$emit('clear')"> 清除 </el-button>
        </div>
      </div>

      <div class="info-section">
        <div class="info-item">
          <span class="label">类型:</span>
          <el-tag size="small">{{ triggerType === 'manual' ? '手动' : '定时' }}</el-tag>
        </div>
        <div v-if="triggerType === 'interval'" class="info-item">
          <span class="label">间隔:</span>
          <span>{{ interval }}ms</span>
        </div>
        <div class="info-item">
          <span class="label">动作:</span>
          <span>{{ action }}</span>
        </div>
      </div>

      <div class="logs-section">
        <div class="section-title">执行日志 ({{ logs.length }})</div>
        <div class="logs-container">
          <div
            v-for="(log, index) in logs"
            :key="index"
            class="log-item"
            :class="`log-${log.type}`"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
          <div v-if="logs.length === 0" class="placeholder">
            <el-icon><DocumentCopy /></el-icon>
            <span>{{ placeholder }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { Timer, DocumentCopy } from '@element-plus/icons-vue'

export interface TriggerLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface TriggerProps {
  title?: string
  enabled?: boolean
  triggerType?: 'manual' | 'interval'
  interval?: number
  action?: string
  logs?: TriggerLog[]
  showClearButton?: boolean
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

const props = withDefaults(defineProps<TriggerProps>(), {
  title: '触发器',
  enabled: true,
  triggerType: 'manual',
  interval: 5000,
  action: 'log',
  logs: () => [],
  showClearButton: true,
  placeholder: '暂无执行记录',
  padding: 16,
  backgroundColor: '#1a1a1a',
  textColor: '#e0e0e0',
  fontSize: 13,
  lineHeight: 1.5,
  borderRadius: 4,
  border: '1px solid #3c3c3c',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
})

defineEmits<{
  trigger: []
  clear: []
}>()

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
  overflow: 'hidden',
  fontFamily: props.fontFamily,
}))
</script>

<style scoped>
.trigger-container {
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

.controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.info-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label {
  opacity: 0.7;
  font-size: 12px;
}

.section-title {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.logs-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.logs-container {
  flex: 1;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 8px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 3px;
  font-size: 12px;
  border-left: 3px solid transparent;
}

.log-info {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
}

.log-success {
  background: rgba(34, 197, 94, 0.1);
  border-left-color: #22c55e;
}

.log-warning {
  background: rgba(251, 191, 36, 0.1);
  border-left-color: #fbbf24;
}

.log-error {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.log-time {
  opacity: 0.6;
  flex-shrink: 0;
  width: 80px;
}

.log-message {
  flex: 1;
  word-break: break-all;
}

.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 8px;
  opacity: 0.5;
}

.placeholder .el-icon {
  font-size: 32px;
}
</style>
