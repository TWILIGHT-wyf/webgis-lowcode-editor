# vVectorLayer 矢量图层

用于绑定矢量数据的图层组件，支持点、线、面等要素。

## 基础用法

```vue
<script setup>
import { vMap, vVectorLayer } from '@twi1i9ht/visual-lib'

const features = [
  {
    type: 'polyline',
    coordinates: [
      [39.9, 116.4],
      [39.95, 116.45],
      [40.0, 116.5],
    ],
    style: { color: 'red', weight: 3 },
  },
  {
    type: 'polygon',
    coordinates: [
      [39.8, 116.3],
      [39.8, 116.5],
      [39.9, 116.4],
    ],
    style: { color: 'blue', fillOpacity: 0.3 },
  },
]
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="11">
    <vVectorLayer :features="features" />
  </vMap>
</template>
```

## Props

| 属性       | 类型              | 默认值 | 说明         |
| ---------- | ----------------- | ------ | ------------ |
| `features` | `VectorFeature[]` | —      | 矢量要素数组 |

### VectorFeature 类型

```ts
interface VectorFeature {
  type: 'marker' | 'polyline' | 'polygon' | 'circle' | 'rectangle'
  coordinates: [number, number] | [number, number][]
  style?: L.PathOptions
  popup?: string
}
```
