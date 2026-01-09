# vHeatLayer 热力图层

基于 Leaflet.heat 的热力图图层组件。

## 基础用法

```vue
<script setup>
import { vMap, vHeatLayer } from '@twi1i9ht/visual-lib'

const heatData = [
  { lat: 39.9, lng: 116.4, intensity: 1 },
  { lat: 39.91, lng: 116.41, intensity: 0.8 },
  { lat: 39.89, lng: 116.39, intensity: 0.6 },
]
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vHeatLayer :data="heatData" />
  </vMap>
</template>
```

## 自定义样式

```vue
<template>
  <vHeatLayer
    :data="heatData"
    :radius="25"
    :blur="15"
    :max-zoom="17"
    :gradient="{
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red',
    }"
  />
</template>
```

## Props

| 属性         | 类型                                                      | 默认值 | 说明         |
| ------------ | --------------------------------------------------------- | ------ | ------------ |
| `data`       | `Array<{ lat: number, lng: number, intensity?: number }>` | —      | 热力点数据   |
| `radius`     | `number`                                                  | `25`   | 热力点半径   |
| `blur`       | `number`                                                  | `15`   | 模糊半径     |
| `maxZoom`    | `number`                                                  | `18`   | 最大缩放级别 |
| `max`        | `number`                                                  | `1`    | 最大强度值   |
| `minOpacity` | `number`                                                  | `0.05` | 最小透明度   |
| `gradient`   | `Record<number, string>`                                  | —      | 颜色渐变配置 |
