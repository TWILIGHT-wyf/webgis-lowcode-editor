# vText 文本

基础文本显示组件。

## 基础用法

```vue
<script setup>
import { vText } from '@twi1i9ht/visual-lib'
</script>

<template>
  <vText content="Hello World" />
</template>
```

## 自定义样式

```vue
<template>
  <vText
    content="重要提示"
    :font-size="24"
    color="#ff6b6b"
    font-weight="bold"
    text-align="center"
  />
</template>
```

## Props

| 属性         | 类型                            | 默认值     | 说明          |
| ------------ | ------------------------------- | ---------- | ------------- |
| `content`    | `string`                        | —          | 文本内容      |
| `fontSize`   | `number`                        | `14`       | 字体大小 (px) |
| `color`      | `string`                        | `'#333'`   | 文字颜色      |
| `fontWeight` | `string \| number`              | `'normal'` | 字体粗细      |
| `textAlign`  | `'left' \| 'center' \| 'right'` | `'left'`   | 对齐方式      |
| `lineHeight` | `number`                        | —          | 行高          |
| `fontFamily` | `string`                        | —          | 字体          |
