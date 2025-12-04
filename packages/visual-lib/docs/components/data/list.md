# vList 列表

列表组件。

## 基础用法

```vue
<script setup>
import { vList } from '@twi1i9ht/visual-lib'

const items = [
  { title: '项目1', description: '描述1' },
  { title: '项目2', description: '描述2' },
]
</script>

<template>
  <vList :items="items" />
</template>
```

## Props

| 属性       | 类型                                                             | 默认值      | 说明           |
| ---------- | ---------------------------------------------------------------- | ----------- | -------------- |
| `items`    | `Array<{ title: string, description?: string, extra?: string }>` | —           | 列表数据       |
| `bordered` | `boolean`                                                        | `false`     | 是否显示边框   |
| `split`    | `boolean`                                                        | `true`      | 是否显示分割线 |
| `size`     | `'small' \| 'default' \| 'large'`                                | `'default'` | 尺寸           |

## Events

| 事件名       | 参数              | 说明       |
| ------------ | ----------------- | ---------- |
| `item-click` | `{ item, index }` | 点击列表项 |
