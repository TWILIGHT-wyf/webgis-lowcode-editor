# vLegend 图例

地图图例组件。

## 基础用法

```vue
<script setup>
import { vMap, vLegend } from '@twi1i9ht/visual-lib'

const items = [
  { label: '高', color: '#ff0000' },
  { label: '中', color: '#ffff00' },
  { label: '低', color: '#00ff00' },
]
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vLegend :items="items" title="等级" position="bottomright" />
  </vMap>
</template>
```

## Props

| 属性       | 类型                                                       | 默认值          | 说明   |
| ---------- | ---------------------------------------------------------- | --------------- | ------ |
| `items`    | `Array<{ label: string, color: string }>`                  | —               | 图例项 |
| `title`    | `string`                                                   | —               | 标题   |
| `position` | `'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'bottomright'` | 位置   |
