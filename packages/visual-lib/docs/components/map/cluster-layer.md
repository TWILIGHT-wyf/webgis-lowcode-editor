# vClusterLayer 聚合图层

基于 Leaflet.markercluster 的标记点聚合图层。

## 基础用法

```vue
<script setup>
import { vMap, vClusterLayer } from '@twi1i9ht/visual-lib'

const markers = [
  { lat: 39.9, lng: 116.4, title: '点位1' },
  { lat: 39.91, lng: 116.41, title: '点位2' },
  { lat: 39.89, lng: 116.39, title: '点位3' },
]
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="10">
    <vClusterLayer :data="markers" />
  </vMap>
</template>
```

## Props

| 属性                      | 类型                                                                  | 默认值 | 说明               |
| ------------------------- | --------------------------------------------------------------------- | ------ | ------------------ |
| `data`                    | `Array<{ lat: number, lng: number, title?: string, popup?: string }>` | —      | 标记点数据         |
| `showCoverageOnHover`     | `boolean`                                                             | `true` | 悬停显示覆盖范围   |
| `maxClusterRadius`        | `number`                                                              | `80`   | 最大聚合半径       |
| `disableClusteringAtZoom` | `number`                                                              | —      | 禁用聚合的缩放级别 |
| `spiderfyOnMaxZoom`       | `boolean`                                                             | `true` | 最大缩放时展开     |

## Events

| 事件名          | 参数               | 说明         |
| --------------- | ------------------ | ------------ |
| `marker-click`  | `{ data, marker }` | 点击单个标记 |
| `cluster-click` | `{ cluster }`      | 点击聚合点   |
