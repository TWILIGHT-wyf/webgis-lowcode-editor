# vMarker 标记点

地图标记点组件，需要在 vMap 内使用。

## 基础用法

```vue
<script setup>
import { vMap, vMarker } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vMarker :lat="39.9" :lng="116.4" title="北京" />
  </vMap>
</template>
```

## 带弹窗

```vue
<template>
  <vMap :center-lat="39.9" :center-lng="116.4" :zoom="12">
    <vMarker
      :lat="39.9"
      :lng="116.4"
      title="天安门"
      popup-content="<b>天安门广场</b><br>中国北京"
      :popup-open="true"
    />
  </vMap>
</template>
```

## 自定义图标

```vue
<template>
  <vMarker
    :lat="39.9"
    :lng="116.4"
    :icon-url="'/marker-icon.png'"
    :icon-size="[32, 32]"
    :icon-anchor="[16, 32]"
  />
</template>
```

## Props

| 属性           | 类型               | 默认值  | 说明             |
| -------------- | ------------------ | ------- | ---------------- |
| `lat`          | `number`           | —       | 纬度             |
| `lng`          | `number`           | —       | 经度             |
| `title`        | `string`           | —       | 标题（悬停显示） |
| `popupContent` | `string`           | —       | 弹窗 HTML 内容   |
| `popupOpen`    | `boolean`          | `false` | 是否默认打开弹窗 |
| `draggable`    | `boolean`          | `false` | 是否可拖拽       |
| `iconUrl`      | `string`           | —       | 自定义图标 URL   |
| `iconSize`     | `[number, number]` | —       | 图标尺寸         |
| `iconAnchor`   | `[number, number]` | —       | 图标锚点         |

## Events

| 事件名    | 参数                     | 说明     |
| --------- | ------------------------ | -------- |
| `click`   | `e: L.LeafletMouseEvent` | 点击标记 |
| `dragend` | `{ lat, lng }`           | 拖拽结束 |
