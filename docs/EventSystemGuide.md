# 组件事件系统使用文档

## 概述

本系统实现了完整的组件间事件通信机制，支持点击、悬停、双击等预定义事件，以及用户自定义事件。系统基于 Vue 3 的 provide/inject 模式，实现了解耦的事件驱动架构。

## 核心功能

### 1. 预定义事件类型

- **点击事件 (click)**: 组件被点击时触发
- **悬停事件 (hover)**: 鼠标悬停在组件上时触发
- **双击事件 (doubleClick)**: 组件被双击时触发
- **自定义事件 (custom)**: 用户可以定义任意名称的事件

### 2. 支持的动作类型

#### 基础动作

- `toggle-visibility`: 显示/隐藏目标组件
- `scroll-to`: 滚动到目标组件位置
- `refresh-data`: 触发数据源刷新
- `play-animation`: 播放目标组件的动画
- `open-modal`: 打开模态组件

#### 交互动作

- `show-tooltip`: 显示提示信息
- `highlight`: 高亮显示目标组件
- `show-detail`: 显示详情面板
- `preview`: 预览内容

#### 高级动作

- `fullscreen`: 进入全屏模式
- `edit-mode`: 进入编辑模式
- `expand-detail`: 展开详情
- `custom-event`: 触发自定义事件
- `custom-script`: 执行自定义 JavaScript 代码

### 3. 高级特性

#### 延迟执行

为每个动作设置延迟时间（毫秒），实现定时触发效果。

#### 条件触发

通过 JavaScript 表达式设置触发条件，只有条件满足时才执行动作。

示例条件表达式：

```javascript
component.props.value > 100
component.style.visible === true
component.type === 'Button'
```

## 使用指南

### 在事件面板中配置事件

1. **选择组件**: 在画布中选中要配置事件的组件
2. **打开事件面板**: 点击右侧边栏的"事件"标签
3. **添加事件**: 点击对应事件类型的"添加"按钮
4. **配置动作**:
   - 选择动作类型
   - 选择目标组件（如需要）
   - 设置延迟时间（可选）
   - 配置触发条件（可选）
5. **保存**: 配置会自动保存到组件数据中

### 在代码中使用事件系统

#### 1. 提供事件上下文（在根组件）

```typescript
import { provideComponentEvents } from '@/composables/useComponentEvents'

onMounted(() => {
  provideComponentEvents()
})
```

#### 2. 在组件中使用事件处理器

```typescript
import { useComponentEventHandlers } from '@/composables/useComponentEvents'

const props = defineProps<{ id: string }>()
const eventHandlers = useComponentEventHandlers(props.id)

// 在模板中绑定事件
async function handleClick() {
  await eventHandlers.handleClick()
}

async function handleDoubleClick() {
  await eventHandlers.handleDoubleClick()
}

async function handleMouseEnter() {
  await eventHandlers.handleMouseEnter()
}
```

#### 3. 触发自定义事件

```typescript
// 触发当前组件的自定义事件
await eventHandlers.emitCustomEvent('myCustomEvent')

// 监听来自其他组件的事件
eventHandlers.onEvent('data-refresh', (params) => {
  console.log('Data refresh event received:', params)
})

// 取消监听
eventHandlers.offEvent('data-refresh')
```

#### 4. 直接使用事件上下文

```typescript
import { useComponentEvents } from '@/composables/useComponentEvents'

const eventContext = useComponentEvents()

// 触发其他组件的事件
eventContext.emitComponentEvent(targetComponentId, 'custom-event', { data: 'value' })

// 手动执行动作
await eventContext.executeAction(
  {
    id: 'action-1',
    type: 'toggle-visibility',
    targetId: 'component-123',
  },
  currentComponent,
)
```

## 数据结构

### EventAction 接口

```typescript
interface EventAction {
  id: string // 动作唯一ID
  type: string // 动作类型
  targetId?: string // 目标组件ID
  eventName?: string // 自定义事件名称
  eventParams?: string // 自定义事件参数（JSON字符串）
  content?: string // 内容（提示文本或脚本）
  condition?: {
    // 条件触发
    enabled: boolean // 是否启用
    expression: string // 条件表达式
  }
  delay?: number // 延迟执行（毫秒）
}
```

### ComponentEvents 接口

```typescript
interface ComponentEvents {
  click?: EventAction[] // 点击事件动作列表
  hover?: EventAction[] // 悬停事件动作列表
  doubleClick?: EventAction[] // 双击事件动作列表
  custom?: {
    // 自定义事件
    [eventName: string]: EventAction[]
  }
}
```

## 实际应用场景

### 场景 1: 点击按钮显示隐藏面板

1. 选中按钮组件
2. 在事件面板中添加点击事件
3. 选择动作类型: "显示/隐藏组件"
4. 选择目标组件: 要显示/隐藏的面板
5. 保存

### 场景 2: 悬停显示提示信息

1. 选中需要提示的组件
2. 添加悬停事件
3. 选择动作类型: "显示提示"
4. 输入提示内容
5. 可选：设置延迟 500ms 再显示
6. 保存

### 场景 3: 数据联动刷新

1. 选中触发组件
2. 添加点击事件
3. 选择动作类型: "自定义事件"
4. 输入事件名称: "triggerRefresh"
5. 在目标组件中监听此事件:

```typescript
eventHandlers.onEvent('triggerRefresh', async () => {
  // 刷新数据逻辑
  await fetchData()
})
```

### 场景 4: 条件触发动画

1. 选中组件
2. 添加点击事件
3. 选择动作类型: "执行动画"
4. 选择目标组件
5. 启用条件触发
6. 输入条件: `component.props.status === 'active'`
7. 设置延迟: 300ms
8. 保存

### 场景 5: 自定义脚本执行

1. 选中组件
2. 添加自定义事件
3. 命名事件: "complexAction"
4. 添加动作，选择类型: "自定义脚本"
5. 输入脚本:

```javascript
console.log('Current component:', component)
const target = components.find((c) => c.type === 'Chart')
if (target) {
  emit(target.id, 'update-data', { value: 100 })
}
```

## 最佳实践

### 1. 事件命名规范

- 使用 kebab-case: `data-refresh`, `user-login`
- 语义明确: `chart-update` 而不是 `update1`
- 避免过长: 控制在 3-4 个单词内

### 2. 性能优化

- 避免在高频事件（如 hover）中执行复杂操作
- 合理使用延迟执行，避免事件风暴
- 及时清理不再使用的事件监听器

### 3. 安全性

- 条件表达式应避免执行危险操作
- 自定义脚本需要经过审核
- 生产环境应限制或沙箱化脚本执行

### 4. 调试技巧

- 在浏览器控制台查看事件日志
- 使用条件断点调试事件流
- 检查组件的 events 字段确认配置正确

## 扩展开发

### 添加新的动作类型

1. 在 `useComponentEvents.ts` 的 `executeAction` 函数中添加新的 case:

```typescript
case 'my-custom-action':
  if (action.targetId) {
    // 实现自定义动作逻辑
    const target = components.value.find(c => c.id === action.targetId)
    // ...
  }
  break
```

2. 在 `events.vue` 的动作类型选项中添加:

```vue
<el-option label="我的自定义动作" value="my-custom-action" />
```

### 添加新的事件类型

1. 在 `component.ts` 的 `ComponentEvents` 接口中添加:

```typescript
export interface ComponentEvents {
  // ... 现有字段
  myEvent?: EventAction[]
}
```

2. 在 `events.vue` 中添加对应的面板区域

3. 在 `shape.vue` 中添加事件绑定:

```vue
<div @myevent="handleMyEvent"></div>
```

4. 在 `useComponentEventHandlers` 中添加处理函数:

```typescript
async function handleMyEvent() {
  const comp = component.value
  if (!comp?.events?.myEvent) return
  for (const action of comp.events.myEvent) {
    await eventContext.executeAction(action, comp)
  }
}
```

## 故障排查

### 问题: 事件没有触发

- 检查组件是否正确配置了事件
- 确认 provideComponentEvents 已在根组件调用
- 查看浏览器控制台是否有错误信息

### 问题: 动作执行失败

- 检查目标组件 ID 是否正确
- 确认条件表达式语法正确
- 查看动作类型是否拼写正确

### 问题: 自定义事件不工作

- 确认事件名称在发送和接收端一致
- 检查是否正确调用了 registerListener
- 确认组件 ID 正确

## 总结

本事件系统提供了强大而灵活的组件间通信机制，支持：

- ✅ 多种预定义事件类型
- ✅ 丰富的动作类型
- ✅ 条件触发和延迟执行
- ✅ 自定义事件和脚本
- ✅ 完整的 provide/inject 架构
- ✅ 类型安全的 TypeScript 支持

通过合理使用这些特性，可以构建出复杂的交互式数据可视化应用。
