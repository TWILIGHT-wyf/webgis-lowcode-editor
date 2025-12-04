# vRow 行

栅格系统行组件，与 vCol 配合使用。

## 基础用法

```vue
<script setup>
import { vRow, vCol } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vRow :gutter="20">
    <vCol :span="8">col-8</vCol>
    <vCol :span="8">col-8</vCol>
    <vCol :span="8">col-8</vCol>
  </vRow>
</template>
```

## Props

| 属性      | 类型                                                                                  | 默认值    | 说明     |
| --------- | ------------------------------------------------------------------------------------- | --------- | -------- |
| `gutter`  | `number`                                                                              | `0`       | 列间距   |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | 水平对齐 |
| `align`   | `'top' \| 'middle' \| 'bottom'`                                                       | `'top'`   | 垂直对齐 |

## Slots

| 插槽名    | 说明      |
| --------- | --------- |
| `default` | vCol 组件 |
