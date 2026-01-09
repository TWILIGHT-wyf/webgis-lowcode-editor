# vModal 弹窗

模态框组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vModal } from '@twi1i9ht/visual-lib'

const visible = ref(false)
</script>

<template>
  <button @click="visible = true">打开弹窗</button>

  <vModal v-model:visible="visible" title="弹窗标题">
    <p>弹窗内容</p>
  </vModal>
</template>
```

## Props

| 属性             | 类型               | 默认值  | 说明             |
| ---------------- | ------------------ | ------- | ---------------- |
| `visible`        | `boolean`          | `false` | 是否显示         |
| `title`          | `string`           | —       | 标题             |
| `width`          | `string \| number` | `'50%'` | 宽度             |
| `closable`       | `boolean`          | `true`  | 是否显示关闭按钮 |
| `maskClosable`   | `boolean`          | `true`  | 点击遮罩关闭     |
| `centered`       | `boolean`          | `false` | 垂直居中         |
| `destroyOnClose` | `boolean`          | `false` | 关闭时销毁内容   |

## Events

| 事件名           | 参数               | 说明         |
| ---------------- | ------------------ | ------------ |
| `update:visible` | `visible: boolean` | 显示状态变化 |
| `close`          | —                  | 关闭时触发   |

## Slots

| 插槽名    | 说明       |
| --------- | ---------- |
| `default` | 弹窗内容   |
| `header`  | 自定义头部 |
| `footer`  | 自定义底部 |
