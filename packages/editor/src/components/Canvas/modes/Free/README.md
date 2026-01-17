# Free Mode 重构说明

## 重构目标

采用 **Component Co-location (组件内聚)** 和 **Composables (组合式函数)** 原则，解决原有代码的"过度设计"问题：

1. 消除逻辑与模板割裂（删除 `.ts` + `.vue` 分离模式）
2. 提取通用逻辑为标准 Composables，提高复用性

## 重构结果

### 新目录结构

```
modes/Free/
├── composables/                      # [新建] 存放纯逻辑 Hook
│   ├── useCanvasInteraction.ts       # 画布交互：缩放/平移/拖拽
│   └── useSnap.ts                    # 吸附计算：网格吸附/组件吸附
├── Shape/
│   └── Shape.vue                     # [合并] 组件包装器，包含完整逻辑
├── Snap/
│   └── SnapLine.vue                  # [重命名] 纯 UI 组件，只负责渲染辅助线
├── ContextMenu/
│   └── ContextMenu.vue               # [合并] 右键菜单组件
└── FreeCanvas.vue                    # [入口] 画布主组件，使用 Hooks 和组件
```

### 已删除文件

- ❌ `canvasInteraction.ts` → ✅ `composables/useCanvasInteraction.ts`
- ❌ `Shape/shape.ts` → ✅ 逻辑合并到 `Shape/Shape.vue`
- ❌ `Snap/snap.ts` → ✅ 计算逻辑提取到 `composables/useSnap.ts`
- ❌ `Snap/snap.vue` → ✅ UI 重构为 `Snap/SnapLine.vue`
- ❌ `ContextMenu/contextMenu.ts` → ✅ 逻辑移动到 `FreeCanvas.vue`

## Composables 说明

### useCanvasInteraction

**职责**: 提供画布交互能力

**功能**:

- ✅ 滚轮缩放
- ✅ 鼠标拖拽平移
- ✅ 组件拖拽
- ✅ Drop 事件处理

**返回值**:

```typescript
{
  panX: Ref<number> // 画布 X 轴平移量
  panY: Ref<number> // 画布 Y 轴平移量
  isPanning: Ref<boolean> // 是否正在平移
  isDragging: Ref<boolean> // 是否正在拖拽
  // ... 其他事件处理函数
}
```

**使用示例**:

```typescript
const { panX, panY, isPanning } = useCanvasInteraction(wrapRef, scale, {
  enablePan: true,
  enableZoom: true,
  dragCallback: (x, y) => {
    /* 处理拖拽 */
  },
})
```

### useSnap

**职责**: 提供吸附计算逻辑（纯数学/逻辑，无 UI）

**功能**:

- ✅ 计算组件包围盒（支持旋转）
- ✅ 查找邻居组件
- ✅ 网格对齐计算
- ✅ 组件对齐计算

**返回值**:

```typescript
{
  comps: ComputedRef<SnapComp[]>     // 所有组件的吸附数据
  meComp: ComputedRef<SnapComp>      // 当前选中组件
  boxCache: ComputedRef<Map>         // 组件包围盒缓存
  snapToGrid: (pos, gridSize) => { position, lines }
  snapToNeighbors: (threshold, pos?) => { position, lines } | null
}
```

**使用示例**:

```typescript
const { snapToNeighbors, snapLines } = useSnap()

// 在拖拽时计算吸附
watch(
  () => [isDragging.value, position.value],
  () => {
    const snap = snapToNeighbors(10)
    if (snap) {
      snapLines.value = snap.lines // 传给 SnapLine 组件渲染
    }
  },
)
```

## 组件说明

### Shape.vue

**特点**: ✅ **逻辑内聚** - 所有逻辑直接在 `<script setup>` 中

**功能**:

- 组件拖拽（调用 `useCanvasInteraction`）
- 缩放/旋转手柄
- 吸附逻辑（调用 `useSnap`）
- 容器检测（Alt + 拖拽）
- 动画样式应用

**Props**:

```typescript
{
  id: string
}
```

**Emits**:

```typescript
{ 'open-context-menu': { id: string; event: MouseEvent } }
```

### SnapLine.vue

**特点**: ✅ **纯 UI 组件** - 只负责渲染，不包含计算逻辑

**功能**:

- 接收辅助线数据并渲染 SVG

**Props**:

```typescript
{
  lines: { x?: number; y?: number }[]
}
```

**示例**:

```vue
<SnapLine :lines="snapLines" />
```

### ContextMenu.vue

**特点**: ✅ **纯展示组件** - 接收状态，发射事件

**功能**:

- 显示右键菜单
- 支持多选操作
- 组合/取消组合

**Props**:

```typescript
{
  x: number
  y: number
  visible: boolean
  targetId?: string
}
```

**Emits**:

```typescript
{
  action: string
} // 'copy' | 'paste' | 'delete' | 'group' | ...
```

### FreeCanvas.vue

**特点**: ✅ **入口组件** - 组合 Hooks 和子组件

**职责**:

1. 调用 `useCanvasInteraction` 处理画布交互
2. 调用 `useSnap` 计算吸附线
3. 管理右键菜单状态
4. 协调 Shape 和 SnapLine 组件

**架构**:

```vue
<template>
  <div @drop="handleDrop" @contextmenu="onContextMenu">
    <RecursiveRenderer />
    <!-- 渲染组件树 -->
    <SnapLine :lines="snapLines" />
    <!-- 吸附辅助线 -->
    <ContextMenu @action="onMenuAction" />
    <!-- 右键菜单 -->
  </div>
</template>

<script setup>
// 1. 画布交互
const { panX, panY, isPanning } = useCanvasInteraction(...)

// 2. 吸附计算
const { snapToNeighbors } = useSnap()
const snapLines = ref([])

// 3. 右键菜单逻辑
const menuState = ref({ visible: false, ... })

// 4. 事件处理
function handleDrop(e) { ... }
function onMenuAction(action) { ... }
</script>
```

## 优势对比

### 重构前

❌ **问题**:

- `shape.ts` + `shape.vue` 分离，维护时需要跳转文件
- `snap.ts` 混合了计算和 UI 逻辑
- `contextMenu.ts` 导出 Hook 但只在一处使用
- 代码复用性差，逻辑难以测试

### 重构后

✅ **优势**:

1. **组件内聚**: Shape.vue 包含所有相关逻辑，上下文清晰
2. **职责单一**: SnapLine.vue 只负责渲染，逻辑在 useSnap 中
3. **易于复用**: Composables 可独立导入，支持单元测试
4. **类型安全**: 显式的参数和返回类型
5. **性能优化**: 响应式数据精确控制，避免不必要的计算

## 最佳实践

### 何时使用 Composable？

✅ **适合**:

- 纯逻辑计算（如 `useSnap`）
- 可复用的状态管理（如 `useCanvasInteraction`）
- 需要在多个组件间共享的逻辑

❌ **不适合**:

- 单一组件专属的简单逻辑
- 与模板紧密耦合的 UI 逻辑

### 何时保持组件内聚？

✅ **推荐**:

- 组件的核心逻辑（如 Shape 的拖拽/缩放）
- UI 状态管理（如 ContextMenu 的显示/隐藏）
- 事件处理函数

## 迁移注意事项

1. ⚠️ **导入路径变更**:

   ```typescript
   // 旧
   import { useShape } from './shape'

   // 新 (逻辑已合并到组件内)
   // 无需导入
   ```

2. ⚠️ **Snap 组件用法变更**:

   ```vue
   <!-- 旧 -->
   <Snap ref="snapRef" />
   <!-- 内部包含计算逻辑 -->

   <!-- 新 -->
   <SnapLine :lines="snapLines" />
   <!-- 纯 UI，外部传入数据 -->
   ```

3. ⚠️ **ContextMenu 逻辑位置变更**:

   ```typescript
   // 旧: 在 contextMenu.ts 中定义 useContextMenu
   const { menuState, openContextMenu } = useContextMenu(wrap)

   // 新: 逻辑直接在 FreeCanvas.vue 中
   const menuState = ref({ visible: false, ... })
   function onContextMenu(e) { ... }
   ```

## 文件变更记录

| 旧路径                        | 新路径                                | 操作                            |
| ----------------------------- | ------------------------------------- | ------------------------------- |
| `canvasInteraction.ts`        | `composables/useCanvasInteraction.ts` | 移动 + 重命名                   |
| `Shape/shape.ts`              | -                                     | 删除（逻辑合并到 Shape.vue）    |
| `Shape/shape.vue`             | `Shape/Shape.vue`                     | 合并逻辑                        |
| `Snap/snap.ts`                | `composables/useSnap.ts`              | 提取计算逻辑                    |
| `Snap/snap.vue`               | `Snap/SnapLine.vue`                   | 重构为纯 UI                     |
| `ContextMenu/contextMenu.ts`  | -                                     | 删除（逻辑移到 FreeCanvas.vue） |
| `ContextMenu/contextMenu.vue` | `ContextMenu/ContextMenu.vue`         | 保留为纯展示组件                |

## 验证

✅ **TypeScript 编译**: 无错误
✅ **目录结构**: 符合预期
✅ **功能完整性**: 所有交互功能保留
