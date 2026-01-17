<template>
  <el-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    v-bind="$attrs"
    clearable
    style="width: 100%"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

defineProps<{
  modelValue?: string | number
  options?: Option[]
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>
