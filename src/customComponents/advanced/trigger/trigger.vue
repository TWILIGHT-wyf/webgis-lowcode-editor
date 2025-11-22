<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
// import { extractWithFallback } from '@/datasource/dataUtils' // 预留

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源(预留)
const dataSourceRef = computed(() => comp.value?.dataSource)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 预留:触发条件(未来可用于条件判断)
// const triggerCondition = computed(() => {
//   if (dataSourceData.value) {
//     const conditionField: string = (comp.value?.dataSource?.conditionField as string) || 'condition'
//     return extractWithFallback<string>(dataSourceData.value, conditionField, '')
//   }
//   return String(comp.value?.props?.condition || '')
// })

// 触发日志
const logs = ref<
  Array<{ time: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>
>([])

// 添加日志
const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ time, message, type })
  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

// 触发器状态
const isEnabled = computed(() => comp.value?.props?.enabled !== false)
const triggerType = computed(() => String(comp.value?.props?.triggerType || 'manual'))

// 定时器
let intervalId: number | undefined

// 手动触发
const manualTrigger = () => {
  addLog('手动触发执行', 'success')
  executeTrigger()
}

// 执行触发器
const executeTrigger = () => {
  if (!isEnabled.value) {
    addLog('触发器已禁用', 'warning')
    return
  }

  const action = String(comp.value?.props?.action || 'log')
  const actionData = String(comp.value?.props?.actionData || '')

  switch (action) {
    case 'log':
      addLog(`执行日志: ${actionData || '触发器已执行'}`, 'info')
      break
    case 'alert':
      addLog('执行弹窗提示', 'success')
      // alert(actionData || '触发器已执行') // 实际项目中可以用 ElMessage
      break
    case 'dispatch':
      addLog(`派发事件: ${actionData}`, 'success')
      // 实际项目中可以派发自定义事件
      break
    case 'api':
      addLog(`调用 API: ${actionData}`, 'info')
      // 实际项目中可以调用 API
      break
    default:
      addLog('未知动作类型', 'error')
  }
}

// 定时触发
const startInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }

  const interval = Number(comp.value?.props?.interval || 5000)
  if (interval > 0 && triggerType.value === 'interval') {
    intervalId = window.setInterval(() => {
      executeTrigger()
    }, interval)
    addLog(`启动定时触发 (间隔: ${interval}ms)`, 'info')
  }
}

// 清除日志
const clearLogs = () => {
  logs.value = []
  addLog('日志已清除', 'info')
}

// 生命周期
onMounted(() => {
  addLog('触发器已初始化', 'info')
  if (triggerType.value === 'interval') {
    startInterval()
  }
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || '#1a1a1a'),
    color: String(s.textColor || '#e0e0e0'),
    fontSize: `${s.fontSize || 13}px`,
    lineHeight: String(s.lineHeight || 1.5),
    borderRadius: `${s.borderRadius || 4}px`,
    border: String(s.border || '1px solid #3c3c3c'),
    overflow: 'hidden',
    fontFamily: String(s.fontFamily || 'Consolas, Monaco, "Courier New", monospace'),
  }
})
</script>

<template>
  <div :style="containerStyle">
    <div class="trigger-container">
      <div class="header">
        <span class="title">
          <el-icon><Timer /></el-icon>
          触发器
        </span>
        <div class="controls">
          <el-tag :type="isEnabled ? 'success' : 'info'" size="small">
            {{ isEnabled ? '已启用' : '已禁用' }}
          </el-tag>
          <el-button
            v-if="triggerType === 'manual'"
            type="primary"
            size="small"
            @click="manualTrigger"
            :disabled="!isEnabled"
          >
            触发
          </el-button>
          <el-button
            size="small"
            @click="clearLogs"
            :icon="comp?.props?.showClearButton !== false ? 'Delete' : undefined"
          >
            清除
          </el-button>
        </div>
      </div>

      <div class="info-section">
        <div class="info-item">
          <span class="label">类型:</span>
          <el-tag size="small">{{ triggerType === 'manual' ? '手动' : '定时' }}</el-tag>
        </div>
        <div v-if="triggerType === 'interval'" class="info-item">
          <span class="label">间隔:</span>
          <span>{{ comp?.props?.interval || 5000 }}ms</span>
        </div>
        <div class="info-item">
          <span class="label">动作:</span>
          <span>{{ comp?.props?.action || 'log' }}</span>
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
            <span>{{ comp?.props?.placeholder || '暂无执行记录' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
