# vCardGrid 卡片网格

卡片网格布局组件。

## 基础用法

```vue
<script setup>
import { vCardGrid } from '@twi1i9ht/visual-lib'

const cards = [
  { title: '卡片1', content: '内容1', image: '/img1.jpg' },
  { title: '卡片2', content: '内容2', image: '/img2.jpg' },
]
</script>

<template>
  <vCardGrid :cards="cards" :columns="3" :gap="16" />
</template>
```

## Props

| 属性        | 类型                                                                         | 默认值 | 说明     |
| ----------- | ---------------------------------------------------------------------------- | ------ | -------- |
| `cards`     | `Array<{ title: string, content?: string, image?: string, extra?: string }>` | —      | 卡片数据 |
| `columns`   | `number`                                                                     | `3`    | 列数     |
| `gap`       | `number`                                                                     | `16`   | 间距     |
| `hoverable` | `boolean`                                                                    | `true` | 悬停效果 |

## Events

| 事件名       | 参数              | 说明     |
| ------------ | ----------------- | -------- |
| `card-click` | `{ card, index }` | 点击卡片 |
