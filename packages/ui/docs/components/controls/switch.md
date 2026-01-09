# vSwitch 开关

开关切换组件。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { vSwitch } from '@twi1i9ht/visual-lib'

const checked = ref(false)
</script>

<template>
  <vSwitch v-model="checked" />
</template>
```

## 带文字

```vue
<template>
  <vSwitch v-model="checked" active-text="开" inactive-text="关" />
</template>
```

## Props

| 属性            | 类型                              | 默认值      | 说明         |
| --------------- | --------------------------------- | ----------- | ------------ |
| `modelValue`    | `boolean`                         | `false`     | 绑定值       |
| `disabled`      | `boolean`                         | `false`     | 禁用         |
| `activeText`    | `string`                          | —           | 打开时的文字 |
| `inactiveText`  | `string`                          | —           | 关闭时的文字 |
| `activeColor`   | `string`                          | `'#409eff'` | 打开时的颜色 |
| `inactiveColor` | `string`                          | `'#c0ccda'` | 关闭时的颜色 |
| `size`          | `'small' \| 'default' \| 'large'` | `'default'` | 尺寸         |

## Events

| 事件名              | 参数    | 说明     |
| ------------------- | ------- | -------- |
| `update:modelValue` | `value` | 值变化   |
| `change`            | `value` | 状态变化 |
