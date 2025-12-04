# vBadge 徽章

徽章/角标组件，可包裹子组件。

## 基础用法

```vue
<script setup>
import { vBadge } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vBadge :value="5">
    <button>消息</button>
  </vBadge>

  <vBadge :value="99" :max="99">
    <button>通知</button>
  </vBadge>

  <vBadge dot>
    <button>设置</button>
  </vBadge>
</template>
```

## Props

| 属性     | 类型                                                        | 默认值     | 说明                  |
| -------- | ----------------------------------------------------------- | ---------- | --------------------- |
| `value`  | `number \| string`                                          | —          | 徽章内容              |
| `max`    | `number`                                                    | —          | 最大值，超过显示 max+ |
| `dot`    | `boolean`                                                   | `false`    | 是否只显示小圆点      |
| `hidden` | `boolean`                                                   | `false`    | 是否隐藏              |
| `type`   | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'danger'` | 类型                  |
| `offset` | `[number, number]`                                          | —          | 偏移量 [x, y]         |

## Slots

| 插槽名    | 说明         |
| --------- | ------------ |
| `default` | 被包裹的内容 |
