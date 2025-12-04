# DoughnutChart 环形图

基于 ECharts 封装的环形图（空心饼图）组件。

## 基础用法

```vue
<script setup>
import { doughnutChart } from '@twi1i9ht/visual-lib'

const data = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
]
</script>

<template>
  <doughnutChart :data="data" title="流量来源" />
</template>
```

## 自定义内外半径

```vue
<template>
  <doughnutChart :data="data" :inner-radius="'40%'" :outer-radius="'70%'" />
</template>
```

## Props

| 属性          | 类型                                     | 默认值  | 说明           |
| ------------- | ---------------------------------------- | ------- | -------------- |
| `data`        | `Array<{ value: number, name: string }>` | —       | 数据数组       |
| `title`       | `string`                                 | —       | 图表标题       |
| `innerRadius` | `string`                                 | `'40%'` | 内半径         |
| `outerRadius` | `string`                                 | `'70%'` | 外半径         |
| `showLabel`   | `boolean`                                | `true`  | 是否显示标签   |
| `showTooltip` | `boolean`                                | `true`  | 是否显示提示框 |
| `showLegend`  | `boolean`                                | `true`  | 是否显示图例   |
| `option`      | `EChartsOption`                          | —       | 高级配置       |
