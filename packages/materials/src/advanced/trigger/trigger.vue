<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vTrigger as BaseTrigger, useDataSource } from '@twi1i9ht/visual-lib'
import type { TriggerLog } from '@twi1i9ht/visual-lib'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源(预留)
const dataSourceRef = computed(() => comp.value?.dataSource)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 触发日志
const logs = ref<TriggerLog[]>([])

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
      break
    case 'dispatch':
      addLog(`派发事件: ${actionData}`, 'success')
      break
    case 'api':
      addLog(`调用 API: ${actionData}`, 'info')
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

// 聚合属性
const componentProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    title: String(p.title || '触发器'),
    enabled: isEnabled.value,
    triggerType: triggerType.value as 'manual' | 'interval',
    interval: Number(p.interval || 5000),
    action: String(p.action || 'log'),
    logs: logs.value,
    showClearButton: p.showClearButton !== false,
    placeholder: String(p.placeholder || '暂无执行记录'),
    // 样式
    padding: Number(s.padding || 16),
    backgroundColor: String(s.backgroundColor || '#1a1a1a'),
    textColor: String(s.textColor || '#e0e0e0'),
    fontSize: Number(s.fontSize || 13),
    lineHeight: Number(s.lineHeight || 1.5),
    borderRadius: Number(s.borderRadius || 4),
    border: String(s.border || '1px solid #3c3c3c'),
    fontFamily: String(s.fontFamily || 'Consolas, Monaco, "Courier New", monospace'),
  }
})
</script>

<template>
  <BaseTrigger v-bind="componentProps" @trigger="manualTrigger" @clear="clearLogs" />
</template>
