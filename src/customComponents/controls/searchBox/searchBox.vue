<template>
  <BaseSearchBox
    v-bind="searchBoxProps"
    @input="handleInput"
    @change="handleChange"
    @clear="handleClear"
    @search="handleSearch"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { vSearchBox as BaseSearchBox } from '@twi1i9ht/visual-lib'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

// 从 store 获取组件配置
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 搜索值
const searchValue = ref<string>('')

// 监听默认值变化
watch(
  () => comp.value?.props.defaultValue,
  (newVal) => {
    if (newVal) {
      searchValue.value = String(newVal)
    }
  },
  { immediate: true },
)

// 聚合 props
const searchBoxProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    modelValue: searchValue.value,
    placeholder: p.placeholder || '请输入搜索内容',
    size: p.size || 'default',
    clearable: p.clearable ?? true,
    disabled: p.disabled ?? false,
    prefixIcon: p.prefixIcon || undefined,
    suffixIcon: p.suffixIcon || undefined,
    maxlength: p.maxlength,
    showWordLimit: p.showWordLimit ?? false,
    showSearchButton: p.showSearchButton ?? true,
    buttonText: p.buttonText || '搜索',
    buttonType: p.buttonType || 'primary',
    padding: s.padding || 16,
    backgroundColor: s.backgroundColor || 'transparent',
    borderColor: s.borderColor || '#dcdfe6',
    borderFocusColor: s.borderFocusColor || '#409eff',
    borderHoverColor: s.borderHoverColor || '#c0c4cc',
    textColor: s.textColor || '#606266',
    placeholderColor: s.placeholderColor || '#a8abb2',
    fontSize: s.fontSize || 14,
    inputWidth: s.inputWidth || '100%',
  }
})

// 事件处理
const handleInput = (value: string) => {
  searchValue.value = value
  console.log('SearchBox input:', value)
}

const handleChange = (value: string) => {
  console.log('SearchBox change:', value)
}

const handleClear = () => {
  searchValue.value = ''
  console.log('SearchBox cleared')
}

const handleSearch = (value: string) => {
  console.log('SearchBox search:', value)
}

const handleFocus = () => {
  console.log('SearchBox focused')
}

const handleBlur = () => {
  console.log('SearchBox blurred')
}
</script>
