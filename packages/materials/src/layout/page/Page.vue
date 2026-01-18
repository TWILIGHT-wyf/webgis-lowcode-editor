<template>
  <div class="lc-page" :style="pageStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    backgroundColor?: string
    padding?: number | string
    minHeight?: string
    width?: string
    height?: string
  }>(),
  {
    backgroundColor: 'transparent',
    padding: 0,
    minHeight: '100%',
    width: '100%',
    height: '100%',
  },
)

const pageStyle = computed(() => ({
  width: props.width,
  height: props.height,
  minHeight: props.minHeight,
  backgroundColor: props.backgroundColor,
  padding: typeof props.padding === 'number' ? `${props.padding}px` : props.padding,
  position: 'relative' as const,
  boxSizing: 'border-box' as const,
  overflow: 'auto',
}))
</script>

<style scoped>
.lc-page {
  display: block;
}
</style>
