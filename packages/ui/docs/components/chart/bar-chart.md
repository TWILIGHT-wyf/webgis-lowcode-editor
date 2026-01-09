# BarChart 柱状图

基于 ECharts 封装的柱状图组件。

## 基础用法

```vue
<script setup>
import { barChart } from '@twi1i9ht/visual-lib'
</script>

<template>
  <barChart
    :data="[120, 200, 150, 80, 70, 110, 130]"
    :x-axis-data="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
    title="周销售额"
  />
</template>
```

## 自定义颜色

```vue
<template>
  <barChart
    :data="[320, 302, 301, 334, 390, 330, 320]"
    :x-axis-data="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
    bar-color="#91cc75"
    :bar-width="30"
  />
</template>
```

## 横向柱状图

```vue
<template>
  <barChart
    :data="[18203, 23489, 29034, 104970, 131744]"
    :x-axis-data="['Brazil', 'Indonesia', 'USA', 'India', 'China']"
    horizontal
  />
</template>
```

## Props

| 属性          | 类型               | 默认值      | 说明           |
| ------------- | ------------------ | ----------- | -------------- |
| `data`        | `number[]`         | —           | 数据数组       |
| `xAxisData`   | `string[]`         | —           | X 轴类目数据   |
| `seriesName`  | `string`           | `'Series'`  | 系列名称       |
| `title`       | `string`           | —           | 图表标题       |
| `barColor`    | `string`           | `'#5470c6'` | 柱子颜色       |
| `barWidth`    | `number \| string` | —           | 柱子宽度       |
| `horizontal`  | `boolean`          | `false`     | 是否横向显示   |
| `showTooltip` | `boolean`          | `true`      | 是否显示提示框 |
| `showLegend`  | `boolean`          | `true`      | 是否显示图例   |
| `showGrid`    | `boolean`          | `true`      | 是否显示网格   |
| `option`      | `EChartsOption`    | —           | 高级配置       |

## Events

同 [LineChart](/components/chart/line-chart#events)
