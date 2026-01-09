# vSelect 下拉选择

下拉选择器组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vSelect } from '@twi1i9ht/visual-lib'

const value = ref('')
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]
</script>

<template>
  <vSelect v-model="value" :options="options" placeholder="请选择" />
</template>
```

## Props

| 属性          | 类型                                                                    | 默认值      | 说明   |
| ------------- | ----------------------------------------------------------------------- | ----------- | ------ |
| `modelValue`  | `string \| number`                                                      | —           | 绑定值 |
| `options`     | `Array<{ label: string, value: string \| number, disabled?: boolean }>` | —           | 选项   |
| `placeholder` | `string`                                                                | `'请选择'`  | 占位符 |
| `disabled`    | `boolean`                                                               | `false`     | 禁用   |
| `clearable`   | `boolean`                                                               | `false`     | 可清空 |
| `filterable`  | `boolean`                                                               | `false`     | 可搜索 |
| `size`        | `'small' \| 'default' \| 'large'`                                       | `'default'` | 尺寸   |

## Events

| 事件名              | 参数    | 说明       |
| ------------------- | ------- | ---------- |
| `update:modelValue` | `value` | 值变化     |
| `change`            | `value` | 选中值变化 |
| `clear`             | —       | 清空       |
