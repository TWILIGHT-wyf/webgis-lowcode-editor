<template>
  <div class="panel-loading">
    <el-icon class="loading-icon" :size="32">
      <Loading />
    </el-icon>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
})
</script>

<style scoped>
.panel-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 32px;
}

.loading-icon {
  color: var(--el-color-primary);
  animation: rotating 1.5s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
