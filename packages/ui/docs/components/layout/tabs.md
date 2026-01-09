# vTabs 标签页

标签页切换组件。

## 基础用法

```vue
<script setup>
import { vTabs } from '@twi1i9ht/visual-lib'

const tabs = [
  { key: 'tab1', label: '标签1', content: '内容1' },
  { key: 'tab2', label: '标签2', content: '内容2' },
  { key: 'tab3', label: '标签3', content: '内容3' },
]
</script>

<template>
  <vTabs :tabs="tabs" />
</template>
```

## Props

| 属性        | 类型                                                      | 默认值   | 说明         |
| ----------- | --------------------------------------------------------- | -------- | ------------ |
| `tabs`      | `Array<{ key: string, label: string, content?: string }>` | —        | 标签配置     |
| `activeKey` | `string`                                                  | —        | 当前激活标签 |
| `type`      | `'line' \| 'card'`                                        | `'line'` | 标签类型     |
| `position`  | `'top' \| 'bottom' \| 'left' \| 'right'`                  | `'top'`  | 标签位置     |

## Events

| 事件名   | 参数          | 说明     |
| -------- | ------------- | -------- |
| `change` | `key: string` | 标签切换 |

## Slots

| 插槽名  | 说明                   |
| ------- | ---------------------- |
| `[key]` | 具名插槽，对应 tab key |
