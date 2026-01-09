# vButtonGroup 按钮组

按钮组组件，支持单选和多选模式。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vButtonGroup } from '@twi1i9ht/visual-lib'

const selected = ref('a')
const options = [
  { label: '选项A', value: 'a' },
  { label: '选项B', value: 'b' },
  { label: '选项C', value: 'c' },
]
</script>

<template>
  <vButtonGroup v-model="selected" :options="options" />
</template>
```

## 多选模式

```vue
<script setup>
const multiSelected = ref(['a', 'b'])
</script>

<template>
  <vButtonGroup v-model="multiSelected" :options="options" multiple />
</template>
```

## Props

| 属性         | 类型                                                                    | 默认值      | 说明     |
| ------------ | ----------------------------------------------------------------------- | ----------- | -------- |
| `modelValue` | `string \| number \| Array`                                             | —           | 绑定值   |
| `options`    | `Array<{ label: string, value: string \| number, disabled?: boolean }>` | —           | 选项     |
| `multiple`   | `boolean`                                                               | `false`     | 是否多选 |
| `disabled`   | `boolean`                                                               | `false`     | 禁用     |
| `size`       | `'small' \| 'default' \| 'large'`                                       | `'default'` | 尺寸     |
| `type`       | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'`             | `'primary'` | 类型     |

## Events

| 事件名              | 参数    | 说明       |
| ------------------- | ------- | ---------- |
| `update:modelValue` | `value` | 值变化     |
| `change`            | `value` | 选中值变化 |
