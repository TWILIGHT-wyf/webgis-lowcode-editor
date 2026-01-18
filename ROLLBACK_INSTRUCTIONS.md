# 回滚指令 - 如果页面仍然卡死

## 快速回滚到简单版本

如果修复后页面仍然卡死，执行以下回滚：

### 选项1: 最小化Wrapper组件 (推荐)

将Button和Container wrapper改为最简单的直接透传：

```vue
<!-- packages/materials/src/basic/button/Button.vue -->
<template>
  <vButton v-bind="$attrs">
    <slot />
  </vButton>
</template>

<script setup lang="ts">
import { vButton } from '@vela/ui'
defineOptions({ inheritAttrs: false })
</script>
```

```vue
<!-- packages/materials/src/basic/container/Container.vue -->
<template>
  <vContainer v-bind="$attrs">
    <slot />
  </vContainer>
</template>

<script setup lang="ts">
import { vContainer } from '@vela/ui'
defineOptions({ inheritAttrs: false })
</script>
```

### 选项2: 移除Wrapper层

如果选项1仍有问题，直接在registry中返回vButton/vContainer：

```typescript
// packages/materials/src/registry.ts 第86行附近
export function getComponent(name: string): Component | string {
  console.log(`[Registry] getComponent called with: ${name}`)

  // 特殊处理：Button和Container直接返回UI组件
  if (name === 'Button') {
    return (uiComponentRegistry as any)['vButton']
  }
  if (name === 'Container') {
    return (uiComponentRegistry as any)['vContainer']
  }

  // 1. 优先使用 materials 中的包装组件
  if (componentMap[name]) {
    console.log(`[Registry] Found in componentMap: ${name}`)
    return componentMap[name]
  }

  // ... 其余代码
}
```

### 选项3: 使用ShapeWrapper v1 (旧版shape.vue)

如果问题出在ShapeWrapper，切换回使用shape.vue：

```vue
<!-- packages/editor/src/components/Canvas/modes/Free/FreeRenderer.vue -->
<template>
  <Shape :id="node.id" @open-context-menu="handleContextMenu">
    <component v-if="isResolved" :is="componentRef" v-bind="node.props" :style="componentStyle">
      <!-- ... -->
    </component>
  </Shape>
</template>

<script setup>
import Shape from './Shape/shape.vue' // 使用旧版
</script>
```

## 诊断命令

```bash
# 查看错误日志
cd packages/editor
pnpm dev 2>&1 | grep -i "error\|warn"

# 检查进程CPU使用
top -b -n 1 | grep node

# 清理并重启
pkill -f "node.*vite"
rm -rf node_modules/.vite
pnpm dev
```

## 联系信息

如果以上方案都无效，请提供：

1. 浏览器控制台完整错误信息
2. 网络面板中加载失败的资源
3. 具体操作步骤导致卡死
