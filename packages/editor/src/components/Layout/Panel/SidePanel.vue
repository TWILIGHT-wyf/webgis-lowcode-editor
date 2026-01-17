<template>
  <div class="vela-side-panel">
    <div class="panel-header">
      <span class="panel-title">{{ title }}</span>
      <div class="panel-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="panel-body">
      <el-scrollbar>
        <slot />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
.vela-side-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  flex-shrink: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-fill-color-blank);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.panel-body {
  flex: 1;
  overflow: hidden;
}

/* 确保 el-scrollbar 充满高度 */
.panel-body :deep(.el-scrollbar) {
  height: 100%;
}

.panel-body :deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
