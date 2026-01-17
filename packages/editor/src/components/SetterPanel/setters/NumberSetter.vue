<template>
  <el-input-number
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$attrs"
    controls-position="right"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: number
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>
