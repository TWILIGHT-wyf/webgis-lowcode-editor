<template>
  <div class="group-container">
    <!-- 组合只显示边框，实际渲染由子组件各自完成 -->
    <div class="group-placeholder">组合</div>
  </div>
</template>

<script setup lang="ts">
// Group组件是一个容器，不直接渲染内容
// 子组件仍然保持独立渲染，但位置跟随组合移动
</script>

<style scoped>
.group-container {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: relative;
}

.group-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-size: 12px;
  opacity: 0.5;
  pointer-events: none;
}
</style>
