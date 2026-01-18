<template>
  <el-input-number
    :model-value="modelValue ?? 0"
    @update:model-value="$emit('update:modelValue', $event ?? 0)"
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
