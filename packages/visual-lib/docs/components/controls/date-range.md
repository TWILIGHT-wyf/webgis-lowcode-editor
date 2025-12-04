# vDateRange 日期范围

日期范围选择器组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vDateRange } from '@twi1i9ht/visual-lib'

const dateRange = ref(['', ''])
</script>

<template>
  <vDateRange v-model="dateRange" />
</template>
```

## Props

| 属性           | 类型                      | 默认值                     | 说明                |
| -------------- | ------------------------- | -------------------------- | ------------------- |
| `modelValue`   | `[string, string]`        | —                          | 绑定值 [开始, 结束] |
| `format`       | `string`                  | `'YYYY-MM-DD'`             | 日期格式            |
| `placeholder`  | `[string, string]`        | `['开始日期', '结束日期']` | 占位符              |
| `disabled`     | `boolean`                 | `false`                    | 禁用                |
| `clearable`    | `boolean`                 | `true`                     | 可清空              |
| `disabledDate` | `(date: Date) => boolean` | —                          | 禁用日期函数        |

## Events

| 事件名              | 参数           | 说明     |
| ------------------- | -------------- | -------- |
| `update:modelValue` | `[start, end]` | 值变化   |
| `change`            | `[start, end]` | 日期变化 |
