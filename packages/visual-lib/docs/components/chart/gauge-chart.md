# GaugeChart 仪表盘

基于 ECharts 封装的仪表盘组件，适用于展示进度或比率类数据。

## 基础用法

```vue
<script setup>
import { gaugeChart } from '@twi1i9ht/visual-lib'
</script>

<template>
  <gaugeChart :value="75" title="完成率" />
</template>
```

## 自定义样式

```vue
<template>
  <gaugeChart
    :value="85"
    :min="0"
    :max="100"
    unit="%"
    :colors="[
      [0.3, '#67e0e3'],
      [0.7, '#37a2da'],
      [1, '#fd666d'],
    ]"
  />
</template>
```

## Props

| 属性          | 类型                      | 默认值  | 说明         |
| ------------- | ------------------------- | ------- | ------------ |
| `value`       | `number`                  | `0`     | 当前值       |
| `min`         | `number`                  | `0`     | 最小值       |
| `max`         | `number`                  | `100`   | 最大值       |
| `title`       | `string`                  | —       | 标题         |
| `unit`        | `string`                  | —       | 单位         |
| `colors`      | `Array<[number, string]>` | —       | 颜色分段配置 |
| `radius`      | `string`                  | `'75%'` | 仪表盘半径   |
| `startAngle`  | `number`                  | `225`   | 起始角度     |
| `endAngle`    | `number`                  | `-45`   | 结束角度     |
| `splitNumber` | `number`                  | `10`    | 分割段数     |
| `option`      | `EChartsOption`           | —       | 高级配置     |
