# 页面模板系统

## 概述

页面模板系统提供了预定义的页面布局,帮助用户快速创建常用的页面类型,提高开发效率和用户体验。

## 功能特点

- **快速创建**: 一键加载预配置的页面布局
- **多种类型**: 提供数据大屏、GIS监控、图表分析、表单等常用模板
- **完整配置**: 包含组件样式、动画、事件等完整配置
- **可定制**: 加载后可自由修改调整

## 模板类型

### 1. 数据大屏模板 (dashboard)

**适用场景**: 数据可视化大屏、监控面板、KPI展示

**包含组件**:

- 标题文本 (带淡入动画)
- 4个KPI统计卡片 (stat组件,带滑动动画)
- 3个数据图表:
  - 折线图 - 访问趋势
  - 柱状图 - 产品销量
  - 饼图 - 用户分布
- 实时数据表格 (带滑入动画)

**特点**:

- 深色背景主题
- 分级加载动画 (0.2s-0.9s延迟)
- 网格化布局

### 2. GIS监控模板 (gis)

**适用场景**: 地理信息监控、设备管理、区域统计

**包含组件**:

- 标题文本
- 2个数字滚动展示 (countUp组件)
  - 在线设备数量
  - 告警数量
- 地图区域占位 (需配置实际地图组件)
- 区域分布柱状图

**特点**:

- 左侧KPI面板
- 中间地图区域
- 右侧统计图表
- 适合实时监控场景

### 3. 图表分析模板 (chart)

**适用场景**: 数据分析报表、图表展示、BI看板

**包含组件**:

- 标题文本
- 4个图表 (2x2布局):
  - 折线图 - 趋势分析
  - 柱状图 - 分类对比
  - 饼图 - 占比分析
  - 雷达图 - 综合评估

**特点**:

- 浅色主题
- 均匀网格布局
- 适合数据探索和报表

### 4. 表单模板 (form)

**适用场景**: 数据录入、信息采集、配置页面

**包含组件**:

- 表单标题
- 表单容器 (panel)

**特点**:

- 居中布局
- 卡片样式
- 预留表单区域供添加输入控件

## 使用方法

### 1. 打开模板选项卡

在左侧组件栏,点击"模板"选项卡

### 2. 浏览模板

浏览可用的页面模板,每个模板显示:

- 模板名称
- 描述信息
- 分类标签

### 3. 加载模板

点击模板卡片,系统会:

1. 弹出确认对话框 (因为会清空当前画布)
2. 确认后清空画布
3. 加载模板所有组件
4. 显示成功提示

### 4. 自定义调整

加载后可以:

- 修改组件属性
- 调整位置和大小
- 添加新组件
- 修改样式和动画

## 技术实现

### 模板定义

位置: `src/templates/index.ts`

```typescript
export interface PageTemplate {
  id: string // 唯一标识
  name: string // 模板名称
  description: string // 描述
  preview: string // 预览图URL
  category: 'dashboard' | 'gis' | 'form' | 'chart' | 'other'
  components: component[] // 组件数组
}
```

### 加载方法

位置: `src/stores/component.ts`

```typescript
function loadTemplate(templateComponents: component[]) {
  reset() // 清空当前画布
  componentStore.value = JSON.parse(JSON.stringify(templateComponents))
  commit() // 提交到历史
}
```

### UI组件

位置: `src/components/componentBar.vue`

- 使用 `el-tabs` 切换组件/模板视图
- 使用 `template-card` 展示模板
- 点击加载时弹出确认对话框

## 扩展模板

### 添加新模板

1. 在 `src/templates/index.ts` 中定义新模板:

```typescript
export const myTemplate: PageTemplate = {
  id: 'my-template-1',
  name: '我的模板',
  description: '模板描述',
  preview: '',
  category: 'other',
  components: [
    // 组件定义
  ],
}
```

2. 添加到导出数组:

```typescript
export const templates: PageTemplate[] = [
  dashboardTemplate,
  gisTemplate,
  chartAnalysisTemplate,
  formTemplate,
  myTemplate, // 新模板
]
```

### 组件ID生成

为避免ID冲突,使用时间戳生成唯一ID:

```typescript
id: 'template_prefix_' + Date.now() + '_序号'
```

### 动画配置

建议使用渐进式延迟动画:

```typescript
animation: {
  name: 'fade',
  class: 'anim-fade',
  duration: 0.8,
  delay: 0.2 * index, // 递增延迟
  iterationCount: 1,
  timingFunction: 'ease-out',
  trigger: 'load',
}
```

## 最佳实践

1. **组件位置**: 使用绝对坐标,确保在1920x1080画布上合理布局
2. **颜色主题**: 深色主题使用 `#1a1f3a`, 浅色主题使用 `#ffffff`
3. **动画效果**: load触发的动画使用0.2s间隔延迟,创造层次感
4. **组件尺寸**: 保持合理比例,避免过大或过小
5. **ID生成**: 使用时间戳+序号确保唯一性

## 注意事项

⚠️ **加载模板会清空当前画布内容,请确保已保存当前工作**

- 系统会弹出确认对话框
- 可以通过 Ctrl+Z 撤销操作
- 建议在开始新项目时使用模板

## 未来计划

- [ ] 添加模板预览图
- [ ] 支持自定义模板保存
- [ ] 模板市场/分享功能
- [ ] 更多行业模板 (金融、医疗、教育等)
- [ ] 响应式模板 (自适应不同屏幕)
