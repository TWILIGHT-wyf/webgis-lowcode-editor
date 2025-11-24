# 代码生成与项目管理功能实现总结

## 日期：2025年11月24日

## 实现的功能

### 1. 修复Group组件子组件显示问题 ✅

**问题描述**：组合（Group）组件中的子组件无法正常显示

**解决方案**：

- 重写 `Group.vue` 组件，参考其他布局容器（flex、grid、panel等）的实现
- 添加子组件渲染逻辑，使用相对定位
- 计算子组件相对于组合容器的位置
- 保留旋转、层级等属性

**关键代码**：

```vue
const getChildItemStyle = (childId: string): CSSProperties => { const child =
getChildComponent(childId) const parentComp = comp.value if (!child || !parentComp) return {} //
计算子组件相对于组合的位置 const relativeX = child.position.x - parentComp.position.x const
relativeY = child.position.y - parentComp.position.y return { position: 'absolute', left:
`${relativeX}px`, top: `${relativeY}px`, width: `${child.size.width}px`, height:
`${child.size.height}px`, transform: `rotate(${child.rotation || 0}deg)`, zIndex: child.zindex || 0,
} }
```

### 2. 实现代码生成功能 ✅

**文件**：`src/utils/toCode.ts`

**核心功能**：

- `generateVueCode()`: 将componentStore转换为完整的Vue单文件组件代码
- `generateTemplate()`: 生成模板代码，支持组件嵌套
- `generateScript()`: 生成脚本代码，包括导入和事件处理
- `generateStyle()`: 生成样式代码
- `componentsToJSON()`: 组件数据转JSON字符串
- `JSONToComponents()`: JSON字符串转组件数据

**特性**：

- 支持所有组件类型的映射
- 自动生成组件样式（位置、尺寸、旋转、透明度等）
- 自动生成事件绑定（click、hover、doubleClick）
- 支持组件树结构（父子关系）
- 生成的代码包含完整的template、script、style

### 3. 实现预览功能 ✅

**文件**：`src/pages/runtimeView.vue`

**功能**：

- 实时预览页面，动态渲染componentStore中的所有组件
- 工具栏按钮：
  - **刷新预览**：重新渲染预览
  - **查看JSON**：在对话框中显示组件JSON数据，可复制
  - **查看代码**：在对话框中显示生成的Vue代码，可复制
  - **导出Vue文件**：下载生成的.vue文件

**关键特性**：

- 只渲染顶层组件（无父组件的组件）
- 支持组件的所有样式属性
- 1920x1080默认画布尺寸
- 干净的预览环境，无编辑器控件

### 4. 实现导出Vue文件功能 ✅

**位置**：在预览页面（runtimeView.vue）的工具栏

**功能**：

- 点击"导出Vue文件"按钮
- 自动生成完整的.vue文件
- 文件名格式：`generated-page-{timestamp}.vue`
- 通过浏览器下载到本地

**导出内容**包括：

- `<template>` 完整模板结构
- `<script setup>` 响应式逻辑和事件处理
- `<style scoped>` 样式代码

### 5. 实现项目保存/加载功能 ✅

**文件**：`src/components/header.vue`

**新增按钮**：

1. **预览** - 跳转到预览页面（/runtime）
2. **保存** - 保存项目到localStorage
3. **加载** - 从localStorage加载项目
4. **导出JSON** - 导出项目JSON文件

**保存内容**：

```typescript
{
  components: component[],      // 所有组件数据
  canvasSize: {                 // 画布尺寸
    width: number,
    height: number
  },
  savedAt: string               // 保存时间戳
}
```

**localStorage键名**：`webgis_project`

**安全特性**：

- 加载前弹出确认对话框，防止误操作
- 错误处理和友好提示
- 支持多次保存，自动覆盖

## 技术实现细节

### 组件类型映射

支持的组件类型包括：

- 基础组件：Text、Box
- 图表组件：lineChart、barChart、pieChart、gaugeChart等
- 数据组件：table、list、timeline、cardGrid、pivot
- KPI组件：stat、countUp、progress、badge
- 控件组件：select、multiSelect、dateRange、slider、switch等
- 布局组件：row、col、flex、grid、modal、panel、tabs
- 媒体组件：image、video
- 内容组件：markdown、html、iframe
- 特殊组件：Group（组合）

### 样式生成

自动处理的样式属性：

- 位置和尺寸：`position`、`left`、`top`、`width`、`height`
- 变换：`transform` (rotation)
- 层级：`zIndex`
- 透明度：`opacity`
- 可见性：`display`
- 背景色：`backgroundColor`
- 边框：`border`、`borderRadius`
- 阴影：`boxShadow`
- 内边距：`padding`

### 事件系统集成

生成的代码支持：

- 点击事件 `@click`
- 双击事件 `@dblclick`
- 悬停事件 `@mouseenter`
- 每个事件生成对应的处理函数
- 支持多个动作的顺序执行

## 使用流程

### 保存项目

1. 在画布上设计页面
2. 点击顶部"保存"按钮
3. 项目数据保存到浏览器localStorage

### 加载项目

1. 点击顶部"加载"按钮
2. 确认是否覆盖当前画布
3. 项目数据从localStorage恢复

### 导出JSON

1. 点击顶部"导出JSON"按钮
2. 下载JSON文件到本地
3. 可用于备份或版本控制

### 预览和导出

1. 点击顶部"预览"按钮，跳转到预览页面
2. 在预览页面可以：
   - 查看实时渲染效果
   - 查看和复制JSON数据
   - 查看和复制Vue代码
   - 导出.vue文件

## 文件清单

### 新建文件

- `src/utils/toCode.ts` - 代码生成核心逻辑（371行）

### 修改文件

- `src/customComponents/group/Group.vue` - 修复子组件渲染（100行）
- `src/pages/runtimeView.vue` - 实现预览页面（200行）
- `src/components/header.vue` - 添加保存/加载功能（新增80行代码）

## 测试建议

1. **Group组件测试**
   - 创建组合，添加多个子组件
   - 验证子组件正确显示在组合内
   - 拖动组合，验证子组件跟随移动
   - 调整组合大小，验证子组件相对位置正确

2. **代码生成测试**
   - 创建包含各种类型组件的页面
   - 点击"查看代码"，检查生成的代码
   - 验证样式、props、事件是否正确生成
   - 测试组件嵌套（组合、布局容器）

3. **保存/加载测试**
   - 创建复杂页面并保存
   - 刷新浏览器后加载
   - 验证所有组件、样式、位置恢复正确
   - 测试多次保存和加载

4. **预览测试**
   - 在编辑器创建页面
   - 进入预览页面
   - 验证渲染效果与编辑器一致
   - 测试导出Vue文件，检查文件内容

5. **导出测试**
   - 导出JSON文件，检查格式
   - 导出Vue文件，检查代码完整性
   - 尝试在新项目中使用导出的代码

## 已知限制

1. **代码生成**
   - 生成的组件导入语句需要根据实际项目路径调整
   - 复杂的事件逻辑需要手动完善
   - 数据源配置不会自动生成数据获取代码

2. **localStorage**
   - 浏览器localStorage有存储大小限制（通常5MB）
   - 项目过大可能保存失败
   - 建议定期导出JSON文件作为备份

3. **预览功能**
   - 预览页面不支持编辑
   - 某些需要运行时数据的组件可能显示空状态
   - 事件处理函数在预览中可能不完全执行

## 后续优化建议

1. **多项目管理**
   - 支持保存多个项目
   - 项目列表管理界面
   - 项目重命名、删除功能

2. **模板系统**
   - 预设页面模板
   - 组件模板库
   - 快速创建常用布局

3. **代码优化**
   - 生成更优雅的代码格式
   - 支持TypeScript类型导出
   - 自动优化样式代码

4. **云端存储**
   - 集成云端存储服务
   - 支持项目分享
   - 团队协作功能

5. **版本控制**
   - 项目历史版本管理
   - 版本对比功能
   - 回滚到历史版本

## 总结

本次实现完成了从设计到代码的完整闭环：

1. ✅ 在编辑器中设计页面
2. ✅ 保存项目到本地
3. ✅ 预览页面效果
4. ✅ 生成Vue代码
5. ✅ 导出.vue文件或JSON
6. ✅ 加载已保存的项目

所有核心功能均已实现并通过TypeScript类型检查，无编译错误。
