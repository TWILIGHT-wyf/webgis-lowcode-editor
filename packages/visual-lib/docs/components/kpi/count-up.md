# vCountUp 数字滚动

数字滚动动画组件，适用于数据大屏展示。

## 基础用法

```vue
<script setup>
import { vCountUp } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vCountUp :end-val="12345" />
</template>
```

## 自定义配置

```vue
<template>
  <vCountUp :end-val="99999" :duration="3" prefix="¥" :decimals="2" separator="," />
</template>
```

## Props

| 属性        | 类型      | 默认值 | 说明          |
| ----------- | --------- | ------ | ------------- |
| `startVal`  | `number`  | `0`    | 起始值        |
| `endVal`    | `number`  | —      | 结束值        |
| `duration`  | `number`  | `2`    | 动画时长 (秒) |
| `decimals`  | `number`  | `0`    | 小数位数      |
| `separator` | `string`  | `','`  | 千分位分隔符  |
| `prefix`    | `string`  | —      | 前缀          |
| `suffix`    | `string`  | —      | 后缀          |
| `autoplay`  | `boolean` | `true` | 自动播放      |
| `fontSize`  | `number`  | `32`   | 字体大小      |
| `color`     | `string`  | —      | 文字颜色      |

## Methods

| 方法       | 说明     |
| ---------- | -------- |
| `start()`  | 开始动画 |
| `reset()`  | 重置动画 |
| `pause()`  | 暂停动画 |
| `resume()` | 继续动画 |
