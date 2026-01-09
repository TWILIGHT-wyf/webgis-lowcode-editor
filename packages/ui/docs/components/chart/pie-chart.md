# PieChart 饼图

基于 ECharts 封装的饼图组件。

## 基础用法

```vue
<script setup>
import { pieChart } from '@twi1i9ht/visual-lib'

const data = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
  { value: 484, name: '联盟广告' },
  { value: 300, name: '视频广告' },
]
</script>

<template>
  <pieChart :data="data" title="访问来源" />
</template>
```

## 南丁格尔玫瑰图

```vue
<template>
  <pieChart :data="data" rose-type="area" />
</template>
```

## Props

| 属性            | 类型                                     | 默认值           | 说明           |
| --------------- | ---------------------------------------- | ---------------- | -------------- |
| `data`          | `Array<{ value: number, name: string }>` | —                | 数据数组       |
| `title`         | `string`                                 | —                | 图表标题       |
| `radius`        | `string \| string[]`                     | `'50%'`          | 饼图半径       |
| `center`        | `string[]`                               | `['50%', '50%']` | 饼图中心位置   |
| `roseType`      | `'radius' \| 'area' \| false`            | `false`          | 玫瑰图类型     |
| `showLabel`     | `boolean`                                | `true`           | 是否显示标签   |
| `labelPosition` | `'outside' \| 'inside' \| 'center'`      | `'outside'`      | 标签位置       |
| `showTooltip`   | `boolean`                                | `true`           | 是否显示提示框 |
| `showLegend`    | `boolean`                                | `true`           | 是否显示图例   |
| `option`        | `EChartsOption`                          | —                | 高级配置       |

## Events

同 [LineChart](/components/chart/line-chart#events)
