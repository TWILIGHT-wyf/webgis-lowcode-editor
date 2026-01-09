# vGrid 网格布局

基于 CSS Grid 的布局容器组件。

## 基础用法

```vue
<script setup>
import { vGrid } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vGrid :columns="3" :gap="16">
    <div v-for="i in 6" :key="i">Item {{ i }}</div>
  </vGrid>
</template>
```

## Props

| 属性        | 类型               | 默认值 | 说明                         |
| ----------- | ------------------ | ------ | ---------------------------- |
| `columns`   | `number \| string` | `1`    | 列数或 grid-template-columns |
| `rows`      | `number \| string` | —      | 行数或 grid-template-rows    |
| `gap`       | `number \| string` | `0`    | 间距                         |
| `rowGap`    | `number \| string` | —      | 行间距                       |
| `columnGap` | `number \| string` | —      | 列间距                       |

## Slots

| 插槽名    | 说明       |
| --------- | ---------- |
| `default` | 网格子元素 |
