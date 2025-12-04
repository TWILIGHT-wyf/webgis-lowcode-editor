# vGeoJsonLayer GeoJSON 图层

用于渲染 GeoJSON 数据的图层组件。

## 基础用法

```vue
<script setup>
import { vMap, vGeoJsonLayer } from '@twi1i9ht/visual-lib'

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: '区域1' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.3, 39.8],
            [116.5, 39.8],
            [116.5, 40.0],
            [116.3, 40.0],
            [116.3, 39.8],
          ],
        ],
      },
    },
  ],
}
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="10">
    <vGeoJsonLayer :data="geojson" />
  </vMap>
</template>
```

## 自定义样式

```vue
<template>
  <vGeoJsonLayer
    :data="geojson"
    :style="{
      color: '#ff7800',
      weight: 2,
      opacity: 0.8,
      fillColor: '#ff7800',
      fillOpacity: 0.3,
    }"
  />
</template>
```

## Props

| 属性            | 类型                        | 默认值 | 说明           |
| --------------- | --------------------------- | ------ | -------------- |
| `data`          | `GeoJSON.FeatureCollection` | —      | GeoJSON 数据   |
| `style`         | `L.PathOptions \| Function` | —      | 样式配置       |
| `pointToLayer`  | `Function`                  | —      | 点要素转换函数 |
| `onEachFeature` | `Function`                  | —      | 每个要素的回调 |
| `filter`        | `Function`                  | —      | 过滤函数       |

## Events

| 事件名          | 参数                        | 说明     |
| --------------- | --------------------------- | -------- |
| `feature-click` | `{ feature, layer, event }` | 点击要素 |
