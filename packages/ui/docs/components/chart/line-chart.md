# LineChart 折线图

基于 ECharts 封装的折线图组件，支持数据展示、面积填充、平滑曲线等功能。

## 基础用法

<div class="demo-container">
  <div class="demo-block" style="height: 300px; background: #fff;">
    <!-- 实际使用时这里会渲染图表 -->
    <img src="https://echarts.apache.org/examples/data/thumb/line-simple.webp" alt="折线图示例" style="max-width: 100%; max-height: 100%;" />
  </div>
</div>

```vue
<script setup>
import { lineChart } from '@twi1i9ht/visual-lib'
</script>

<template>
  <lineChart
    :data="[150, 230, 224, 218, 135, 147, 260]"
    :x-axis-data="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
    series-name="访问量"
    title="周访问量统计"
  />
</template>
```

## 面积图

设置 `show-area` 属性显示面积填充。

```vue
<template>
  <lineChart
    :data="[820, 932, 901, 934, 1290, 1330, 1320]"
    :x-axis-data="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
    :show-area="true"
    :area-opacity="0.3"
    line-color="#91cc75"
  />
</template>
```

## 自定义样式

```vue
<template>
  <lineChart
    :data="[120, 200, 150, 80, 70, 110, 130]"
    :x-axis-data="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
    line-color="#ee6666"
    :line-width="3"
    line-type="dashed"
    :symbol-size="10"
    :smooth="false"
  />
</template>
```

## 高级配置

使用 `option` prop 可以完全自定义 ECharts 配置：

```vue
<script setup>
import { lineChart } from '@twi1i9ht/visual-lib'

const customOption = {
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
  yAxis: { type: 'value' },
  series: [
    { name: '2023', type: 'line', data: [120, 132, 101, 134] },
    { name: '2024', type: 'line', data: [220, 182, 191, 234] },
  ],
}
</script>

<template>
  <lineChart :option="customOption" />
</template>
```

## Props

| 属性             | 类型                                     | 默认值                                | 说明                       |
| ---------------- | ---------------------------------------- | ------------------------------------- | -------------------------- |
| `data`           | `number[]`                               | `[150, 230, 224, 218, 135, 147, 260]` | Y 轴数据                   |
| `xAxisData`      | `string[]`                               | `['Mon', 'Tue', ...]`                 | X 轴类目数据               |
| `seriesName`     | `string`                                 | `'Series'`                            | 系列名称                   |
| `title`          | `string`                                 | —                                     | 图表标题                   |
| `lineColor`      | `string`                                 | `'#5470c6'`                           | 线条颜色                   |
| `smooth`         | `boolean`                                | `true`                                | 是否平滑曲线               |
| `showArea`       | `boolean`                                | `false`                               | 是否显示面积填充           |
| `areaOpacity`    | `number`                                 | `0.3`                                 | 面积填充透明度             |
| `showTooltip`    | `boolean`                                | `true`                                | 是否显示提示框             |
| `showLegend`     | `boolean`                                | `true`                                | 是否显示图例               |
| `legendPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'`                               | 图例位置                   |
| `showGrid`       | `boolean`                                | `true`                                | 是否显示网格线             |
| `xAxisName`      | `string`                                 | —                                     | X 轴名称                   |
| `yAxisName`      | `string`                                 | —                                     | Y 轴名称                   |
| `showXAxisLine`  | `boolean`                                | `true`                                | 是否显示 X 轴线            |
| `showXAxisLabel` | `boolean`                                | `true`                                | 是否显示 X 轴标签          |
| `showYAxisLine`  | `boolean`                                | `true`                                | 是否显示 Y 轴线            |
| `showYAxisLabel` | `boolean`                                | `true`                                | 是否显示 Y 轴标签          |
| `symbolSize`     | `number`                                 | `6`                                   | 数据点大小                 |
| `lineWidth`      | `number`                                 | `2`                                   | 线条宽度                   |
| `lineType`       | `'solid' \| 'dashed' \| 'dotted'`        | `'solid'`                             | 线条类型                   |
| `showSymbol`     | `boolean`                                | `true`                                | 是否显示数据点             |
| `option`         | `EChartsOption`                          | —                                     | 高级配置，完全覆盖默认配置 |

## Events

该组件基于 vue-echarts，支持所有 ECharts 事件。可通过 ref 获取 ECharts 实例后绑定：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { lineChart } from '@twi1i9ht/visual-lib'

const chartRef = ref()

onMounted(() => {
  // 获取 ECharts 实例
  const chart = chartRef.value?.$el?.querySelector('.echart')?.__vueParentComponent?.ctx
  // 绑定事件...
})
</script>

<template>
  <lineChart ref="chartRef" :data="[10, 20, 30]" />
</template>
```

## 注意事项

1. 确保容器有明确的宽高，组件默认 `width: 100%; height: 100%`
2. 需要安装 peer dependencies: `echarts` 和 `vue-echarts`
