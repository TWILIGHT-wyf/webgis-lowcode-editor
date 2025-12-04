# vStat 统计卡片

用于展示统计数值的卡片组件。

## 基础用法

```vue
<script setup>
import { vStat } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vStat label="总销售额" :value="126560" prefix="¥" :precision="2" />
</template>
```

## 带趋势

```vue
<template>
  <vStat label="周同比" :value="12.5" suffix="%" trend="up" :trend-value="3.2" />
</template>
```

## Props

| 属性         | 类型               | 默认值 | 说明         |
| ------------ | ------------------ | ------ | ------------ |
| `label`      | `string`           | —      | 标签文字     |
| `value`      | `number \| string` | —      | 数值         |
| `prefix`     | `string`           | —      | 前缀（如 ¥） |
| `suffix`     | `string`           | —      | 后缀（如 %） |
| `precision`  | `number`           | `0`    | 小数位数     |
| `trend`      | `'up' \| 'down'`   | —      | 趋势方向     |
| `trendValue` | `number`           | —      | 趋势值       |
| `valueColor` | `string`           | —      | 数值颜色     |
| `labelColor` | `string`           | —      | 标签颜色     |
| `valueSize`  | `number`           | `32`   | 数值字号     |
| `labelSize`  | `number`           | `14`   | 标签字号     |
