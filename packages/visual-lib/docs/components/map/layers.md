# vLayers 图层控制

地图图层切换控制组件。

## 基础用法

```vue
<script setup>
import { vMap, vLayers } from '@twi1i9ht/visual-lib'

const baseLayers = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    active: true,
  },
  { name: 'CartoDB Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
]

const overlays = [
  { name: '标注层', visible: true },
  { name: '热力层', visible: false },
]
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vLayers :base-layers="baseLayers" :overlays="overlays" />
  </vMap>
</template>
```

## Props

| 属性         | 类型                                                       | 默认值       | 说明         |
| ------------ | ---------------------------------------------------------- | ------------ | ------------ |
| `baseLayers` | `Array<{ name: string, url: string, active?: boolean }>`   | —            | 底图图层     |
| `overlays`   | `Array<{ name: string, visible?: boolean }>`               | —            | 叠加图层     |
| `position`   | `'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'topright'` | 位置         |
| `collapsed`  | `boolean`                                                  | `true`       | 是否默认折叠 |

## Events

| 事件名           | 参数                | 说明       |
| ---------------- | ------------------- | ---------- |
| `base-change`    | `{ name, url }`     | 切换底图   |
| `overlay-change` | `{ name, visible }` | 切换叠加层 |
