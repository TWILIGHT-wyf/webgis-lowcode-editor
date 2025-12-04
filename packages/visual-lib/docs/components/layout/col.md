# vCol 列

栅格系统列组件，需在 vRow 内使用。

## 基础用法

```vue
<script setup>
import { vRow, vCol } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vRow :gutter="20">
    <vCol :span="12">col-12</vCol>
    <vCol :span="12">col-12</vCol>
  </vRow>

  <vRow :gutter="20">
    <vCol :span="8">col-8</vCol>
    <vCol :span="8">col-8</vCol>
    <vCol :span="8">col-8</vCol>
  </vRow>
</template>
```

## Props

| 属性     | 类型     | 默认值 | 说明              |
| -------- | -------- | ------ | ----------------- |
| `span`   | `number` | `24`   | 栅格占位数 (1-24) |
| `offset` | `number` | `0`    | 左侧偏移数        |
| `push`   | `number` | `0`    | 右移格数          |
| `pull`   | `number` | `0`    | 左移格数          |

## Slots

| 插槽名    | 说明 |
| --------- | ---- |
| `default` | 内容 |
