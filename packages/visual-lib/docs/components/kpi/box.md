# vBox 盒子

基础容器组件，可设置背景、边框、阴影等样式。

## 基础用法

```vue
<script setup>
import { vBox } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vBox :padding="20" background="#f5f5f5" :border-radius="8">
    <p>盒子内容</p>
  </vBox>
</template>
```

## Props

| 属性           | 类型               | 默认值          | 说明     |
| -------------- | ------------------ | --------------- | -------- |
| `background`   | `string`           | `'transparent'` | 背景色   |
| `padding`      | `number \| string` | `0`             | 内边距   |
| `borderRadius` | `number`           | `0`             | 圆角     |
| `border`       | `string`           | —               | 边框样式 |
| `boxShadow`    | `string`           | —               | 阴影     |

## Slots

| 插槽名    | 说明     |
| --------- | -------- |
| `default` | 默认内容 |
