# FunnelChart 漏斗图

基于 ECharts 封装的漏斗图组件，适用于展示转化率等数据。

## 基础用法

```vue
<script setup>
import { funnelChart } from '@twi1i9ht/visual-lib'

const data = [
  { value: 100, name: '展现' },
  { value: 80, name: '点击' },
  { value: 60, name: '访问' },
  { value: 40, name: '咨询' },
  { value: 20, name: '订单' },
]
</script>

<template>
  <funnelChart :data="data" title="转化漏斗" />
</template>
```

## Props

| 属性            | 类型                                     | 默认值         | 说明         |
| --------------- | ---------------------------------------- | -------------- | ------------ |
| `data`          | `Array<{ value: number, name: string }>` | —              | 数据数组     |
| `title`         | `string`                                 | —              | 图表标题     |
| `sort`          | `'ascending' \| 'descending' \| 'none'`  | `'descending'` | 排序方式     |
| `orient`        | `'vertical' \| 'horizontal'`             | `'vertical'`   | 方向         |
| `gap`           | `number`                                 | `2`            | 间隔         |
| `showLabel`     | `boolean`                                | `true`         | 是否显示标签 |
| `labelPosition` | `'left' \| 'right' \| 'inside'`          | `'right'`      | 标签位置     |
| `option`        | `EChartsOption`                          | —              | 高级配置     |
