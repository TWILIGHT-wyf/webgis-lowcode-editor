# vTable 表格

数据表格组件。

## 基础用法

```vue
<script setup>
import { vTable } from '@twi1i9ht/visual-lib'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'address', title: '地址' },
]

const data = [
  { name: '张三', age: 28, address: '北京市' },
  { name: '李四', age: 32, address: '上海市' },
]
</script>

<template>
  <vTable :columns="columns" :data="data" />
</template>
```

## Props

| 属性        | 类型                                                    | 默认值       | 说明           |
| ----------- | ------------------------------------------------------- | ------------ | -------------- |
| `columns`   | `Array<{ key: string, title: string, width?: number }>` | —            | 列配置         |
| `data`      | `Array<Record<string, any>>`                            | —            | 数据源         |
| `bordered`  | `boolean`                                               | `true`       | 是否显示边框   |
| `striped`   | `boolean`                                               | `false`      | 是否显示斑马纹 |
| `loading`   | `boolean`                                               | `false`      | 加载状态       |
| `emptyText` | `string`                                                | `'暂无数据'` | 空数据提示     |
