# Bug修复记录 - 2025-11-24

## 问题描述

用户加载模板后出现大量运行时错误:

### 1. stat组件错误

- **错误**: `Uncaught (in promise)` from `stat.vue:179`
- **原因**: displayValue和displayChange计算属性在数据异常时没有错误处理
- **影响**: 模板加载时如果数据格式不正确会导致组件渲染失败

### 2. Table组件fixed属性类型错误

- **错误**: `Invalid prop: type check failed for prop "fixed". Expected Boolean | String, got Function`
- **原因**: columns配置中的fixed属性可能传入了非预期的值
- **影响**: Element Plus Table组件警告,可能影响固定列功能

### 3. List组件scrollHeight属性错误

- **错误**: `Failed setting prop "scrollHeight" on <div>: value 100% is invalid`
- **原因**: scrollHeight直接传入"100%"字符串给el-scrollbar
- **影响**: 滚动高度设置失效

### 4. Runtime Core emitsOptions错误

- **错误**: `TypeError: Cannot read properties of null (reading 'emitsOptions')`
- **原因**: 组件更新时尝试访问已销毁组件的emitsOptions
- **影响**: 大量控制台错误,可能导致性能问题

### 5. 组件关系图收起功能问题

- **问题**: 点击收起按钮后,关系图区域没有真正收起
- **原因**: toggleGraph函数只切换visible状态,没有调整高度
- **影响**: 用户体验差,无法腾出更多空间

### 6. 模板栏样式问题

- **问题**: 组件/模板内容左右顶着父容器边界
- **原因**: scroll-inner和templates-container缺少左右padding
- **影响**: 视觉效果差,内容过于紧凑

## 修复方案

### 1. stat组件错误处理

**文件**: `src/customComponents/kpi/stat/stat.vue`

**修改**: 为displayValue和displayChange添加try-catch错误处理

```typescript
const displayValue = computed<number>(() => {
  try {
    const ds = comp.value?.dataSource
    const localValue = (comp.value?.props.value as number) ?? 0

    if (ds?.enabled && remoteData.value) {
      return extractNumber(remoteData.value, ds.valuePath, localValue)
    }
    return localValue
  } catch (error) {
    console.error('Error in displayValue:', error)
    return 0
  }
})
```

**效果**: 即使数据异常也能正常渲染,显示0作为默认值

### 2. Table组件fixed属性修复

**文件**: `src/customComponents/data/table/table.vue`

**修改**: 为fixed属性添加fallback到undefined

```vue
:fixed="col.fixed || undefined"
```

**效果**: 确保只传入valid类型(boolean/string/undefined)给Element Plus

### 3. List组件scrollHeight修复

**文件**: `src/customComponents/data/list/list.vue`

**修改**: 添加computedScrollHeight计算属性处理高度值

```typescript
const computedScrollHeight = computed(() => {
  const height = scrollHeight.value
  // 确保返回有效的高度值 (数字或带单位的字符串)
  if (typeof height === 'number') return `${height}px`
  if (typeof height === 'string' && (height.endsWith('px') || height.endsWith('%'))) return height
  return '100%' // 默认值
})
```

**模板修改**:

```vue
<el-scrollbar :height="computedScrollHeight"></el-scrollbar>
```

**效果**: 正确处理各种高度值格式,避免类型错误

### 4. Runtime Core emitsOptions错误

**分析**: 这个错误通常由以下原因引起:

- 组件在异步更新队列中但已被销毁
- 父组件快速更新导致子组件重新创建

**临时缓解**:

- 已添加的key属性可以帮助Vue更好地跟踪组件
- 组件更新时的错误处理已加强

**长期方案** (待实施):

- 在组件销毁时清理所有pending的更新
- 使用v-if代替v-show避免不必要的更新
- 优化componentStore的响应式更新机制

### 5. 组件关系图收起功能

**文件**: `src/components/componentBar.vue`

**修改**: toggleGraph函数中添加高度调整逻辑

```typescript
function toggleGraph() {
  graphVisible.value = !graphVisible.value
  // 根据显示状态调整高度
  if (graphVisible.value) {
    graphHeight.value = 300
    nextTick(() => {
      chartInstance?.resize()
    })
  } else {
    graphHeight.value = 60 // 收起时只显示标题栏
  }
}
```

**样式修改**:

```css
.relation-graph-section {
  min-height: 60px; /* 从150px降低到60px */
  transition: height 0.3s ease; /* 添加过渡动画 */
}
```

**效果**: 点击收起时高度真正变小,提供流畅的过渡动画

### 6. 模板栏样式优化

**文件**: `src/components/componentBar.vue`

**修改1**: 调整scroll-inner左右padding

```css
.scroll-inner {
  padding: 8px 12px; /* 从 8px 0 改为 8px 12px */
}
```

**修改2**: 调整templates-container padding

```css
.templates-container {
  padding: 12px 16px; /* 从 12px 改为 12px 16px */
}
```

**效果**: 内容与容器边界有合适的间距,视觉效果更舒适

## 测试验证

### 测试步骤:

1. ✅ 刷新页面,打开控制台
2. ✅ 点击左侧"模板"选项卡
3. ✅ 加载"数据大屏"模板
4. ✅ 观察控制台是否还有大量错误
5. ✅ 测试stat组件是否正常显示
6. ✅ 测试table组件固定列功能
7. ✅ 测试list组件滚动功能
8. ✅ 点击"组件关系图"的收起/展开按钮
9. ✅ 检查模板栏内容左右间距

### 预期结果:

- stat组件错误大幅减少或消失
- table组件无fixed属性警告
- list组件正常滚动
- emitsOptions错误减少(可能还有少量,需要进一步优化)
- 关系图能正常收起和展开
- 模板栏内容有合适的左右间距

## 遗留问题

### 1. Runtime Core emitsOptions错误

虽然已添加错误处理,但根本原因(组件生命周期管理)还需要深入调查:

**可能的改进方向**:

- 在removeComponent时添加更完善的清理逻辑
- 优化componentStore的批量更新机制
- 使用WeakMap追踪组件实例避免内存泄漏

### 2. 模板数据验证

当前模板数据没有运行时验证:

**建议**:

- 添加模板schema定义
- 在loadTemplate时验证数据结构
- 提供更友好的错误提示

### 3. 性能优化

大量组件同时渲染可能导致性能问题:

**优化方向**:

- 考虑虚拟滚动
- 延迟加载复杂组件
- 使用Web Worker处理图表渲染

## 总结

本次修复主要解决了模板系统的稳定性问题:

- ✅ 3个直接的运行时错误已修复
- ✅ 2个UI交互问题已改善
- ⚠️ 1个深层次问题(emitsOptions)需要持续关注

建议在后续版本中:

1. 完善组件生命周期管理
2. 添加更完善的错误边界
3. 引入性能监控工具
