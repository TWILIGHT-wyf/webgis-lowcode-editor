# vScale 比例尺

地图比例尺组件。

## 基础用法

```vue
<script setup>
import { vMap, vScale } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vScale position="bottomleft" />
  </vMap>
</template>
```

## Props

| 属性       | 类型                                                       | 默认值         | 说明             |
| ---------- | ---------------------------------------------------------- | -------------- | ---------------- |
| `position` | `'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'bottomleft'` | 位置             |
| `maxWidth` | `number`                                                   | `100`          | 最大宽度         |
| `metric`   | `boolean`                                                  | `true`         | 是否显示公制单位 |
| `imperial` | `boolean`                                                  | `false`        | 是否显示英制单位 |
