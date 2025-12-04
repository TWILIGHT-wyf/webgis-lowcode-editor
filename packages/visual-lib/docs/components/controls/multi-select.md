# vMultiSelect 多选

多选下拉组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vMultiSelect } from '@twi1i9ht/visual-lib'

const value = ref([])
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]
</script>

<template>
  <vMultiSelect v-model="value" :options="options" />
</template>
```

## Props

| 属性           | 类型                                                | 默认值     | 说明         |
| -------------- | --------------------------------------------------- | ---------- | ------------ |
| `modelValue`   | `Array<string \| number>`                           | `[]`       | 绑定值       |
| `options`      | `Array<{ label: string, value: string \| number }>` | —          | 选项         |
| `placeholder`  | `string`                                            | `'请选择'` | 占位符       |
| `disabled`     | `boolean`                                           | `false`    | 禁用         |
| `max`          | `number`                                            | —          | 最多选择数量 |
| `collapseTags` | `boolean`                                           | `false`    | 折叠标签     |

## Events

| 事件名              | 参数      | 说明       |
| ------------------- | --------- | ---------- |
| `update:modelValue` | `value[]` | 值变化     |
| `change`            | `value[]` | 选中值变化 |
