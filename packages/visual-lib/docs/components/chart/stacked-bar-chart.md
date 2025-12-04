# StackedBarChart 堆叠柱状图

基于 ECharts 封装的堆叠柱状图组件。

## 基础用法

```vue
<script setup>
import { stackedBarChart } from '@twi1i9ht/visual-lib'

const xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const seriesNames = ['邮件营销', '联盟广告', '视频广告']
const seriesData = [
  [120, 132, 101, 134, 90, 230, 210],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 232, 201, 154, 190, 330, 410],
]
</script>

<template>
  <stackedBarChart
    :x-axis-data="xAxisData"
    :series-names="seriesNames"
    :series-data="seriesData"
    title="周广告数据"
  />
</template>
```

## Props

| 属性          | 类型            | 默认值 | 说明               |
| ------------- | --------------- | ------ | ------------------ |
| `xAxisData`   | `string[]`      | —      | X 轴类目数据       |
| `seriesNames` | `string[]`      | —      | 系列名称数组       |
| `seriesData`  | `number[][]`    | —      | 系列数据，二维数组 |
| `title`       | `string`        | —      | 图表标题           |
| `colors`      | `string[]`      | —      | 颜色数组           |
| `showTooltip` | `boolean`       | `true` | 是否显示提示框     |
| `showLegend`  | `boolean`       | `true` | 是否显示图例       |
| `option`      | `EChartsOption` | —      | 高级配置           |
