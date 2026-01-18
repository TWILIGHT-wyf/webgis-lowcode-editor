<template>
  <div class="button-wrapper">
    <vButton v-bind="$attrs">
      <slot />
    </vButton>
  </div>
</template>

<script setup lang="ts">
import { vButton } from '@vela/ui'

// 禁用属性继承，由内部vButton接收
defineOptions({
  inheritAttrs: false,
})
</script>

<style scoped>
.button-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
}

.button-wrapper :deep(.el-button) {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
