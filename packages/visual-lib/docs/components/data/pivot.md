# vPivot 透视表

透视表/数据透视组件。

## 基础用法

```vue
<script setup>
import { vPivot } from '@twi1i9ht/visual-lib'

const data = [
  { region: '华东', product: 'A', sales: 100 },
  { region: '华东', product: 'B', sales: 150 },
  { region: '华北', product: 'A', sales: 200 },
]

const config = {
  rows: ['region'],
  cols: ['product'],
  values: [{ field: 'sales', aggregator: 'sum' }],
}
</script>

<template>
  <vPivot :data="data" :config="config" />
</template>
```

## Props

| 属性     | 类型                         | 默认值 | 说明     |
| -------- | ---------------------------- | ------ | -------- |
| `data`   | `Array<Record<string, any>>` | —      | 原始数据 |
| `config` | `PivotConfig`                | —      | 透视配置 |

### PivotConfig 类型

```ts
interface PivotConfig {
  rows: string[] // 行维度字段
  cols: string[] // 列维度字段
  values: Array<{
    field: string // 值字段
    aggregator: 'sum' | 'count' | 'avg' | 'min' | 'max'
  }>
}
```
