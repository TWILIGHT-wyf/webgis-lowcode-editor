# vProgress 进度条

进度条组件，支持线性和环形两种模式。

## 基础用法

```vue
<script setup>
import { vProgress } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vProgress :percentage="70" />
</template>
```

## 自定义颜色

```vue
<template>
  <vProgress :percentage="80" color="#67c23a" />
  <vProgress :percentage="50" color="#e6a23c" />
  <vProgress :percentage="30" color="#f56c6c" />
</template>
```

## 环形进度

```vue
<template>
  <vProgress :percentage="75" type="circle" :width="120" />
</template>
```

## Props

| 属性              | 类型                             | 默认值      | 说明           |
| ----------------- | -------------------------------- | ----------- | -------------- |
| `percentage`      | `number`                         | `0`         | 百分比 (0-100) |
| `type`            | `'line' \| 'circle'`             | `'line'`    | 类型           |
| `color`           | `string`                         | `'#409eff'` | 进度条颜色     |
| `backgroundColor` | `string`                         | `'#e9ecef'` | 背景色         |
| `strokeWidth`     | `number`                         | `6`         | 线条宽度       |
| `width`           | `number`                         | `120`       | 环形进度的直径 |
| `showText`        | `boolean`                        | `true`      | 是否显示文字   |
| `format`          | `(percentage: number) => string` | —           | 自定义文字格式 |
