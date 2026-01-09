# vSlider 滑块

滑动选择器组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vSlider } from '@twi1i9ht/visual-lib'

const value = ref(50)
</script>

<template>
  <vSlider v-model="value" />
</template>
```

## 范围选择

```vue
<script setup>
const rangeValue = ref([20, 80])
</script>

<template>
  <vSlider v-model="rangeValue" range />
</template>
```

## Props

| 属性          | 类型                         | 默认值  | 说明           |
| ------------- | ---------------------------- | ------- | -------------- |
| `modelValue`  | `number \| [number, number]` | `0`     | 绑定值         |
| `min`         | `number`                     | `0`     | 最小值         |
| `max`         | `number`                     | `100`   | 最大值         |
| `step`        | `number`                     | `1`     | 步长           |
| `range`       | `boolean`                    | `false` | 是否为范围选择 |
| `disabled`    | `boolean`                    | `false` | 禁用           |
| `showTooltip` | `boolean`                    | `true`  | 显示提示       |
| `showInput`   | `boolean`                    | `false` | 显示输入框     |

## Events

| 事件名              | 参数    | 说明           |
| ------------------- | ------- | -------------- |
| `update:modelValue` | `value` | 值变化         |
| `change`            | `value` | 拖动结束时触发 |
