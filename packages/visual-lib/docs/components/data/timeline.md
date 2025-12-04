# vTimeline 时间线

时间线组件。

## 基础用法

```vue
<script setup>
import { vTimeline } from '@twi1i9ht/visual-lib'

const items = [
  { time: '2024-01-01', title: '创建项目', content: '项目正式启动' },
  { time: '2024-02-15', title: '发布 v1.0', content: '第一个稳定版本' },
  { time: '2024-03-20', title: '发布 v2.0', content: '新增多项功能' },
]
</script>

<template>
  <vTimeline :items="items" />
</template>
```

## Props

| 属性      | 类型                                                                       | 默认值   | 说明       |
| --------- | -------------------------------------------------------------------------- | -------- | ---------- |
| `items`   | `Array<{ time: string, title: string, content?: string, color?: string }>` | —        | 时间线数据 |
| `mode`    | `'left' \| 'right' \| 'alternate'`                                         | `'left'` | 模式       |
| `reverse` | `boolean`                                                                  | `false`  | 是否倒序   |
