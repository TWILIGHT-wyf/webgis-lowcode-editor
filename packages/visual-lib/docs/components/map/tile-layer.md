# vTileLayer 瓦片图层

自定义瓦片图层组件。

## 基础用法

```vue
<script setup>
import { vMap, vTileLayer } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vTileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution="&copy; CartoDB"
    />
  </vMap>
</template>
```

## Props

| 属性          | 类型                 | 默认值  | 说明          |
| ------------- | -------------------- | ------- | ------------- |
| `url`         | `string`             | —       | 瓦片 URL 模板 |
| `attribution` | `string`             | —       | 版权信息      |
| `minZoom`     | `number`             | `0`     | 最小缩放级别  |
| `maxZoom`     | `number`             | `18`    | 最大缩放级别  |
| `opacity`     | `number`             | `1`     | 透明度        |
| `zIndex`      | `number`             | —       | 层级          |
| `subdomains`  | `string \| string[]` | `'abc'` | 子域名        |
