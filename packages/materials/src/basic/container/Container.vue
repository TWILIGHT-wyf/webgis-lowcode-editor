<template>
  <div class="container-wrapper">
    <vContainer v-bind="$attrs">
      <slot />
    </vContainer>
  </div>
</template>

<script setup lang="ts">
import { vContainer } from '@vela/ui'

// 禁用属性继承，由内部vContainer接收
defineOptions({
  inheritAttrs: false,
})
</script>

<style scoped>
.container-wrapper {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
}

.container-wrapper :deep(.v-container) {
  width: 100%;
  height: 100%;
}
</style>
