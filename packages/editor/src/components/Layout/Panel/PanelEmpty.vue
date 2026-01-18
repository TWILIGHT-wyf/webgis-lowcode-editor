<template>
  <div class="panel-empty">
    <el-icon class="empty-icon" :size="48" :color="iconColor">
      <component :is="icon" />
    </el-icon>
    <p class="empty-text">{{ text }}</p>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <slot v-if="hasAction" name="action" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Box, Document, Picture, DataLine } from '@element-plus/icons-vue'

interface Props {
  text?: string
  description?: string
  type?: 'default' | 'data' | 'component' | 'image'
  hasAction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '暂无数据',
  description: '',
  type: 'default',
  hasAction: false,
})

const iconMap = {
  default: Box,
  data: DataLine,
  component: Document,
  image: Picture,
}

const icon = computed(() => iconMap[props.type])
const iconColor = computed(() => {
  const colors = {
    default: 'var(--el-color-info)',
    data: 'var(--el-color-success)',
    component: 'var(--el-color-primary)',
    image: 'var(--el-color-warning)',
  }
  return colors[props.type]
})
</script>

<style scoped>
.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
  text-align: center;
  gap: 12px;
}

.empty-icon {
  opacity: 0.5;
  margin-bottom: 8px;
}

.empty-text {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.empty-description {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  max-width: 240px;
}
</style>
