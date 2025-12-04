# vPanel 面板

可折叠的面板容器组件。

## 基础用法

```vue
<script setup>
import { vPanel } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vPanel title="面板标题" collapsible>
    <p>面板内容</p>
  </vPanel>
</template>
```

## Props

| 属性               | 类型      | 默认值  | 说明         |
| ------------------ | --------- | ------- | ------------ |
| `title`            | `string`  | —       | 标题         |
| `collapsible`      | `boolean` | `false` | 是否可折叠   |
| `collapsed`        | `boolean` | `false` | 默认折叠状态 |
| `bordered`         | `boolean` | `true`  | 是否显示边框 |
| `headerBackground` | `string`  | —       | 头部背景色   |

## Events

| 事件名   | 参数                 | 说明         |
| -------- | -------------------- | ------------ |
| `toggle` | `collapsed: boolean` | 折叠状态变化 |

## Slots

| 插槽名    | 说明             |
| --------- | ---------------- |
| `default` | 面板内容         |
| `header`  | 自定义头部       |
| `extra`   | 头部右侧额外内容 |
