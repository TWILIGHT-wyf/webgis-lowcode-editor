# vCheckboxGroup 复选框组

复选框组组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vCheckboxGroup } from '@twi1i9ht/visual-lib'

const checked = ref(['a'])
const options = [
  { label: '选项A', value: 'a' },
  { label: '选项B', value: 'b' },
  { label: '选项C', value: 'c' },
]
</script>

<template>
  <vCheckboxGroup v-model="checked" :options="options" />
</template>
```

## Props

| 属性         | 类型                                                                    | 默认值         | 说明         |
| ------------ | ----------------------------------------------------------------------- | -------------- | ------------ |
| `modelValue` | `Array<string \| number>`                                               | `[]`           | 绑定值       |
| `options`    | `Array<{ label: string, value: string \| number, disabled?: boolean }>` | —              | 选项         |
| `disabled`   | `boolean`                                                               | `false`        | 全部禁用     |
| `min`        | `number`                                                                | —              | 最少选择数量 |
| `max`        | `number`                                                                | —              | 最多选择数量 |
| `direction`  | `'horizontal' \| 'vertical'`                                            | `'horizontal'` | 排列方向     |

## Events

| 事件名              | 参数      | 说明       |
| ------------------- | --------- | ---------- |
| `update:modelValue` | `value[]` | 值变化     |
| `change`            | `value[]` | 选中值变化 |
