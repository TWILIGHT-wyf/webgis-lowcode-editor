<template>
  <div :class="['node-wrapper', { selected: isSelected }]" @click.stop="handleClick">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  nodeId: string
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
})

const emit = defineEmits<{
  select: [id: string]
}>()

/**
 * 处理点击 - 选中组件
 */
const handleClick = () => {
  emit('select', props.nodeId)
}
</script>

<style scoped>
.node-wrapper {
  position: relative;
  cursor: pointer;
  transition: outline 0.2s ease;
}

.node-wrapper.selected {
  outline: 2px solid #409eff;
  outline-offset: 2px;
  border-radius: 4px;
}

.node-wrapper:hover:not(.selected) {
  outline: 1px solid #c0c4cc;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
