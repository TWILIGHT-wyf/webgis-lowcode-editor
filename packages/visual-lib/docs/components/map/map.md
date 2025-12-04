# vMap 地图容器

基于 Leaflet 的地图容器组件，是所有地图图层组件的父容器。

## 基础用法

```vue
<script setup>
import { vMap } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12" style="width: 100%; height: 400px;" />
</template>
```

## 添加标记

```vue
<script setup>
import { vMap, vMarker } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vMarker :lat="39.9" :lng="116.4" title="北京" />
    <vMarker :lat="31.2" :lng="121.5" title="上海" />
  </vMap>
</template>
```

## 自定义瓦片图层

```vue
<template>
  <vMap
    :center-lat="39.9"
    :center-lng="116.4"
    :zoom="12"
    tile-url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    attribution="&copy; CartoDB"
  />
</template>
```

## Props

| 属性              | 类型      | 默认值   | 说明             |
| ----------------- | --------- | -------- | ---------------- |
| `centerLat`       | `number`  | `39.9`   | 中心点纬度       |
| `centerLng`       | `number`  | `116.4`  | 中心点经度       |
| `zoom`            | `number`  | `13`     | 缩放级别         |
| `minZoom`         | `number`  | `1`      | 最小缩放级别     |
| `maxZoom`         | `number`  | `18`     | 最大缩放级别     |
| `tileUrl`         | `string`  | OSM 瓦片 | 瓦片图层 URL     |
| `attribution`     | `string`  | —        | 版权信息         |
| `zoomControl`     | `boolean` | `true`   | 是否显示缩放控件 |
| `dragging`        | `boolean` | `true`   | 是否可拖动       |
| `scrollWheelZoom` | `boolean` | `true`   | 是否允许滚轮缩放 |
| `doubleClickZoom` | `boolean` | `true`   | 是否允许双击缩放 |
| `placeholder`     | `string`  | —        | 加载占位文本     |
| `borderRadius`    | `number`  | `0`      | 边框圆角         |
| `border`          | `string`  | `'none'` | 边框样式         |

## Events

| 事件名    | 参数                       | 说明           |
| --------- | -------------------------- | -------------- |
| `ready`   | `map: L.Map`               | 地图初始化完成 |
| `click`   | `e: L.LeafletMouseEvent`   | 地图点击       |
| `moveend` | `center: {lat, lng}, zoom` | 移动结束       |
| `zoomend` | `zoom: number`             | 缩放结束       |

## Methods

通过 ref 调用：

```vue
<script setup>
import { ref } from 'vue'
import { vMap } from '@twi1i9ht/visual-lib'

const mapRef = ref()

function flyToShanghai() {
  mapRef.value?.flyTo(31.2, 121.5, 12)
}
</script>

<template>
  <vMap ref="mapRef" :center-lat="39.9" :center-lng="116.4" />
  <button @click="flyToShanghai">飞到上海</button>
</template>
```

| 方法                          | 参数             | 说明                  |
| ----------------------------- | ---------------- | --------------------- |
| `getMap()`                    | —                | 获取 Leaflet Map 实例 |
| `flyTo(lat, lng, zoom?)`      | 经纬度, 缩放级别 | 飞行到指定位置        |
| `setView(lat, lng, zoom?)`    | 经纬度, 缩放级别 | 设置视图              |
| `fitBounds(bounds, options?)` | 边界, 选项       | 适配边界              |

## Slots

| 插槽名        | 说明                                   |
| ------------- | -------------------------------------- |
| `default`     | 地图图层组件（vMarker, vHeatLayer 等） |
| `placeholder` | 加载占位内容                           |

## 注意事项

1. 必须引入 Leaflet 样式：`import 'leaflet/dist/leaflet.css'`
2. 地图容器必须有明确的宽高
