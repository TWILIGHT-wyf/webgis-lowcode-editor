# SankeyChart 桑基图

基于 ECharts 封装的桑基图组件，适用于展示流量流向。

## 基础用法

```vue
<script setup>
import { sankeyChart } from '@twi1i9ht/visual-lib'

const nodes = [{ name: '访问' }, { name: '主站' }, { name: '商品页' }, { name: '订单' }]

const links = [
  { source: '访问', target: '主站', value: 100 },
  { source: '主站', target: '商品页', value: 80 },
  { source: '商品页', target: '订单', value: 40 },
]
</script>

<template>
  <sankeyChart :nodes="nodes" :links="links" title="用户流向" />
</template>
```

## Props

| 属性        | 类型                                                       | 默认值         | 说明     |
| ----------- | ---------------------------------------------------------- | -------------- | -------- |
| `nodes`     | `Array<{ name: string }>`                                  | —              | 节点数组 |
| `links`     | `Array<{ source: string, target: string, value: number }>` | —              | 连线数组 |
| `title`     | `string`                                                   | —              | 图表标题 |
| `orient`    | `'horizontal' \| 'vertical'`                               | `'horizontal'` | 方向     |
| `nodeWidth` | `number`                                                   | `20`           | 节点宽度 |
| `nodeGap`   | `number`                                                   | `8`            | 节点间距 |
| `option`    | `EChartsOption`                                            | —              | 高级配置 |
