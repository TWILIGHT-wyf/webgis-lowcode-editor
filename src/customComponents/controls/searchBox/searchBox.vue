<template>
  <div :style="containerStyle">
    <el-input
      v-model="searchValue"
      :placeholder="placeholder"
      :size="size"
      :clearable="clearable"
      :disabled="disabled"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :maxlength="maxlength"
      :show-word-limit="showWordLimit"
      @input="handleInput"
      @change="handleChange"
      @clear="handleClear"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template v-if="showSearchButton" #append>
        <el-button :icon="Search" :type="buttonType" @click="handleSearch">
          {{ buttonText }}
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

// 从 store 获取组件配置
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || 'transparent'),
  }
})

const inputStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    '--el-input-border-color': String(s.borderColor || '#dcdfe6'),
    '--el-input-focus-border-color': String(s.borderFocusColor || '#409eff'),
    '--el-input-hover-border-color': String(s.borderHoverColor || '#c0c4cc'),
    '--el-input-text-color': String(s.textColor || '#606266'),
    '--el-input-placeholder-color': String(s.placeholderColor || '#a8abb2'),
    fontSize: `${s.fontSize || 14}px`,
    width: String(s.inputWidth || '100%'),
  }
})

// 组件属性
const placeholder = computed(() => comp.value?.props.placeholder || '请输入搜索内容')
const size = computed(() => comp.value?.props.size || 'default')
const clearable = computed(() => comp.value?.props.clearable ?? true)
const disabled = computed(() => comp.value?.props.disabled ?? false)
const prefixIcon = computed(() => comp.value?.props.prefixIcon || '')
const suffixIcon = computed(() => comp.value?.props.suffixIcon || '')
const maxlength = computed(() => comp.value?.props.maxlength || undefined)
const showWordLimit = computed(() => comp.value?.props.showWordLimit ?? false)
const showSearchButton = computed(() => comp.value?.props.showSearchButton ?? true)
const buttonText = computed(() => comp.value?.props.buttonText || '搜索')
const buttonType = computed(() => comp.value?.props.buttonType || 'primary')
const defaultValue = computed(() => comp.value?.props.defaultValue || '')

// 搜索值
const searchValue = ref<string>('')

// 监听默认值变化
watch(
  defaultValue,
  (newVal) => {
    if (newVal) {
      searchValue.value = String(newVal)
    }
  },
  { immediate: true },
)

// 事件处理
const handleInput = (value: string) => {
  console.log('SearchBox input:', value)
}

const handleChange = (value: string) => {
  console.log('SearchBox change:', value)
}

const handleClear = () => {
  console.log('SearchBox cleared')
}

const handleSearch = () => {
  console.log('SearchBox search:', searchValue.value)
}

const handleFocus = () => {
  console.log('SearchBox focused')
}

const handleBlur = () => {
  console.log('SearchBox blurred')
}
</script>

<style scoped>
.el-input {
  width: v-bind('inputStyle.width');
  font-size: v-bind('inputStyle.fontSize');
}

:deep(.el-input__wrapper) {
  --el-input-border-color: v-bind('inputStyle["--el-input-border-color"]');
  --el-input-focus-border-color: v-bind('inputStyle["--el-input-focus-border-color"]');
  --el-input-hover-border-color: v-bind('inputStyle["--el-input-hover-border-color"]');
}

:deep(.el-input__inner) {
  color: v-bind('inputStyle["--el-input-text-color"]');
}

:deep(.el-input__inner::placeholder) {
  color: v-bind('inputStyle["--el-input-placeholder-color"]');
}
</style>
