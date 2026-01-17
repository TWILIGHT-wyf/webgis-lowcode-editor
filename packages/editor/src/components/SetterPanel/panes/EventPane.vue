<template>
  <div class="event-pane">
    <el-empty v-if="!node" description="请选择一个组件" :image-size="80">
      <template #image>
        <el-icon :size="64"><Select /></el-icon>
      </template>
    </el-empty>

    <div v-else class="event-content">
      <div class="event-header">
        <el-button type="primary" size="small" :icon="Plus" @click="addEvent"> 添加事件 </el-button>
      </div>

      <el-empty v-if="events.length === 0" description="暂无事件配置" :image-size="60" />

      <div v-else class="event-list">
        <el-card v-for="(event, index) in events" :key="index" class="event-item" shadow="hover">
          <div class="event-item-header">
            <el-select v-model="event.trigger" placeholder="选择触发器" size="small">
              <el-option label="点击 (onClick)" value="onClick" />
              <el-option label="双击 (onDblClick)" value="onDblClick" />
              <el-option label="鼠标移入 (onMouseEnter)" value="onMouseEnter" />
              <el-option label="鼠标移出 (onMouseLeave)" value="onMouseLeave" />
              <el-option label="输入改变 (onChange)" value="onChange" />
            </el-select>

            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              circle
              @click="removeEvent(index)"
            />
          </div>

          <el-divider />

          <el-form-item label="动作类型" size="small">
            <el-select v-model="event.action" placeholder="选择动作">
              <el-option label="弹窗提示" value="alert" />
              <el-option label="打开链接" value="navigate" />
              <el-option label="调用接口" value="api" />
              <el-option label="更新数据" value="setState" />
              <el-option label="自定义代码" value="custom" />
            </el-select>
          </el-form-item>

          <el-form-item v-if="event.action === 'alert'" label="提示内容" size="small">
            <el-input v-model="event.params.message" placeholder="请输入提示内容" />
          </el-form-item>

          <el-form-item v-if="event.action === 'navigate'" label="跳转链接" size="small">
            <el-input v-model="event.params.url" placeholder="https://..." />
          </el-form-item>

          <el-form-item v-if="event.action === 'custom'" label="代码" size="small">
            <el-input
              v-model="event.params.code"
              type="textarea"
              :rows="4"
              placeholder="输入 JavaScript 代码"
            />
          </el-form-item>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NodeSchema } from '@vela/core'
import { Plus, Delete, Select } from '@element-plus/icons-vue'

interface Props {
  node?: NodeSchema | null
}

interface EventConfig {
  trigger: string
  action: string
  params: Record<string, any>
}

const props = defineProps<Props>()

const events = ref<EventConfig[]>([])

// 从节点加载事件配置
watch(
  () => props.node,
  (newNode) => {
    if (newNode && newNode.events) {
      events.value = Array.isArray(newNode.events) ? newNode.events : []
    } else {
      events.value = []
    }
  },
  { immediate: true },
)

// 同步事件到节点
watch(
  events,
  (newEvents) => {
    if (props.node) {
      ;(props.node as any).events = newEvents
    }
  },
  { deep: true },
)

const addEvent = () => {
  events.value.push({
    trigger: 'onClick',
    action: 'alert',
    params: { message: 'Hello!' },
  })
}

const removeEvent = (index: number) => {
  events.value.splice(index, 1)
}
</script>

<style scoped>
.event-pane {
  padding: 16px;
}

.event-header {
  margin-bottom: 16px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-item {
  border-radius: 8px;
}

.event-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.event-item-header .el-select {
  flex: 1;
}

.event-item :deep(.el-form-item) {
  margin-bottom: 12px;
}

.event-item :deep(.el-form-item__label) {
  font-size: 12px;
  font-weight: 500;
}
</style>
