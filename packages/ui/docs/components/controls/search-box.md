# vSearchBox 搜索框

搜索输入框组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vSearchBox } from '@twi1i9ht/visual-lib'

const keyword = ref('')

function handleSearch(value) {
  console.log('搜索:', value)
}
</script>

<template>
  <vSearchBox v-model="keyword" @search="handleSearch" />
</template>
```

## Props

| 属性          | 类型      | 默认值             | 说明          |
| ------------- | --------- | ------------------ | ------------- |
| `modelValue`  | `string`  | `''`               | 绑定值        |
| `placeholder` | `string`  | `'请输入搜索内容'` | 占位符        |
| `clearable`   | `boolean` | `true`             | 可清空        |
| `disabled`    | `boolean` | `false`            | 禁用          |
| `loading`     | `boolean` | `false`            | 加载状态      |
| `debounce`    | `number`  | `300`              | 防抖延迟 (ms) |

## Events

| 事件名              | 参数    | 说明     |
| ------------------- | ------- | -------- |
| `update:modelValue` | `value` | 值变化   |
| `search`            | `value` | 触发搜索 |
| `clear`             | —       | 清空     |
