# ScatterChart 散点图

基于 ECharts 封装的散点图组件。

## 基础用法

```vue
<script setup>
import { scatterChart } from '@twi1i9ht/visual-lib'

const data = [
  [10.0, 8.04],
  [8.07, 6.95],
  [13.0, 7.58],
  [9.05, 8.81],
  [11.0, 8.33],
  [14.0, 7.66],
  [13.4, 6.81],
  [10.0, 6.33],
]
</script>

<template>
  <scatterChart :data="data" title="散点分布" />
</template>
```

## Props

| 属性          | 类型                      | 默认值      | 说明              |
| ------------- | ------------------------- | ----------- | ----------------- |
| `data`        | `Array<[number, number]>` | —           | 散点数据 `[x, y]` |
| `title`       | `string`                  | —           | 图表标题          |
| `symbolSize`  | `number`                  | `10`        | 点的大小          |
| `color`       | `string`                  | `'#5470c6'` | 点的颜色          |
| `xAxisName`   | `string`                  | —           | X 轴名称          |
| `yAxisName`   | `string`                  | —           | Y 轴名称          |
| `showTooltip` | `boolean`                 | `true`      | 是否显示提示框    |
| `option`      | `EChartsOption`           | —           | 高级配置          |
