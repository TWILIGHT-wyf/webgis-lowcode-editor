<template>
  <el-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$attrs"
    clearable
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
