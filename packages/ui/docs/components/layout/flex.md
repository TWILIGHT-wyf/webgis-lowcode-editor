# vFlex 弹性布局

基于 CSS Flexbox 的布局容器组件。

## 基础用法

```vue
<script setup>
import { vFlex } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vFlex direction="row" justify="space-between" align="center">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </vFlex>
</template>
```

## Props

| 属性        | 类型                                                                                            | 默认值         | 说明       |
| ----------- | ----------------------------------------------------------------------------------------------- | -------------- | ---------- |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'`                                        | `'row'`        | 主轴方向   |
| `justify`   | `'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'flex-start'` | 主轴对齐   |
| `align`     | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'baseline'`                             | `'stretch'`    | 交叉轴对齐 |
| `wrap`      | `'nowrap' \| 'wrap' \| 'wrap-reverse'`                                                          | `'nowrap'`     | 换行       |
| `gap`       | `number \| string`                                                                              | `0`            | 间距       |

## Slots

| 插槽名    | 说明   |
| --------- | ------ |
| `default` | 子元素 |
