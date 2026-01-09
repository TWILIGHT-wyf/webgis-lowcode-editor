# RadarChart 雷达图

基于 ECharts 封装的雷达图组件，适用于多维度数据对比。

## 基础用法

```vue
<script setup>
import { radarChart } from '@twi1i9ht/visual-lib'

const indicators = [
  { name: '销售', max: 6500 },
  { name: '管理', max: 16000 },
  { name: '信息技术', max: 30000 },
  { name: '客服', max: 38000 },
  { name: '研发', max: 52000 },
  { name: '市场', max: 25000 },
]

const seriesData = [
  { name: '预算', value: [4200, 3000, 20000, 35000, 50000, 18000] },
  { name: '实际开销', value: [5000, 14000, 28000, 26000, 42000, 21000] },
]
</script>

<template>
  <radarChart :indicators="indicators" :series-data="seriesData" title="预算与开销" />
</template>
```

## Props

| 属性            | 类型                                       | 默认值      | 说明             |
| --------------- | ------------------------------------------ | ----------- | ---------------- |
| `indicators`    | `Array<{ name: string, max: number }>`     | —           | 指示器配置       |
| `seriesData`    | `Array<{ name: string, value: number[] }>` | —           | 系列数据         |
| `title`         | `string`                                   | —           | 图表标题         |
| `seriesName`    | `string`                                   | —           | 系列名称         |
| `radarShape`    | `'polygon' \| 'circle'`                    | `'polygon'` | 雷达图形状       |
| `splitNumber`   | `number`                                   | `5`         | 分割段数         |
| `axisNameColor` | `string`                                   | —           | 指示器名称颜色   |
| `showArea`      | `boolean`                                  | `true`      | 是否显示填充区域 |
| `areaOpacity`   | `number`                                   | `0.3`       | 填充区域透明度   |
| `option`        | `EChartsOption`                            | —           | 高级配置         |
