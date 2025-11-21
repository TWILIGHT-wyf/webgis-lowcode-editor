# 数据提取工具函数使用指南

## 概述

`chartUtils.ts` 提供了统一的数据提取工具函数，适用于所有组件（图表、KPI、Text 等）。

## 核心设计原则

1. **useDataSource 只负责网络请求**，返回完整响应数据
2. **组件使用工具函数按需提取**所需字段
3. **工具函数统一管理**，避免代码冗余

## 工具函数列表

### 1. `getValueByPath` - 通用路径提取

```typescript
getValueByPath(obj: unknown, path: string | undefined): unknown
```

从对象中根据路径提取值，支持点号路径和数组索引。

**示例：**

```typescript
const data = { code: 200, data: { user: { name: 'John' } } }
getValueByPath(data, 'data.user.name') // 'John'
```

### 2. `extractWithFallback` - 智能提取（推荐）

```typescript
extractWithFallback<T>(
  remoteData: unknown,
  path: string | undefined,
  fallbackValue: T
): T
```

优先使用路径提取，否则返回默认值。**适用于 Text、Badge 等简单组件**。

**示例：**

```typescript
// Text 组件
const content = extractWithFallback(remoteData, ds.dataPath, '默认文本')

// Badge 组件
const value = extractWithFallback(remoteData, ds.valuePath, 0)
```

### 3. `extractNumber` - 数值提取

```typescript
extractNumber(
  remoteData: unknown,
  valuePath: string | undefined,
  defaultValue: number = 0
): number
```

提取单个数值，自动转换类型。**适用于 CountUp、Progress 等 KPI 组件**。

**示例：**

```typescript
// CountUp 组件
const targetValue = extractNumber(remoteData, ds.valuePath, 0)

// Progress 组件
const progress = extractNumber(remoteData, ds.valuePath, 50)
```

### 4. `extractMultipleFields` - 多字段提取

```typescript
extractMultipleFields<T extends Record<string, string | undefined>>(
  remoteData: unknown,
  paths: T
): Record<keyof T, unknown>
```

**同时提取多个字段**，适用于需要多个数据的组件。

**示例：**

```typescript
// Stat 组件提取多个字段
const { title, value, change } = extractMultipleFields(remoteData, {
  title: ds.titlePath,
  value: ds.valuePath,
  change: ds.changePath,
})
```

### 5. 图表专用函数

#### `extractNumberArray` - 提取数字数组

```typescript
extractNumberArray(
  remoteData: unknown,
  dataPath: string | undefined
): number[] | undefined
```

#### `extractStringArray` - 提取字符串数组

```typescript
extractStringArray(
  remoteData: unknown,
  dataPath: string | undefined
): string[] | undefined
```

#### `extractString` - 提取字符串

```typescript
extractString(
  remoteData: unknown,
  dataPath: string | undefined
): string | undefined
```

## 使用场景

### 场景 1：Text 组件（单个字段）

```typescript
const content = computed(() => {
  const ds = comp.value?.dataSource
  const localText = (comp.value?.props.text as string) ?? '默认文本'

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.dataPath, localText)
  }
  return localText
})
```

### 场景 2：CountUp 组件（数值字段）

```typescript
const targetValue = computed(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as number) ?? 0

  if (ds?.enabled && remoteData.value) {
    return extractNumber(remoteData.value, ds.valuePath, localValue)
  }
  return localValue
})
```

### 场景 3：Stat 组件（多个字段）

```typescript
const displayTitle = computed(() => {
  const ds = comp.value?.dataSource
  const localTitle = (comp.value?.props.title as string) ?? '标题'

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.titlePath, localTitle)
  }
  return localTitle
})

const displayValue = computed(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as number) ?? 0

  if (ds?.enabled && remoteData.value) {
    return extractNumber(remoteData.value, ds.valuePath, localValue)
  }
  return localValue
})

const displayChange = computed(() => {
  const ds = comp.value?.dataSource
  const localChange = (comp.value?.props.change as number) ?? 0

  if (ds?.enabled && remoteData.value) {
    return extractNumber(remoteData.value, ds.changePath, localChange)
  }
  return localChange
})
```

### 场景 4：图表组件（复杂数据）

```typescript
const buildOption = () => {
  if (!ds?.enabled || !remoteData.value) {
    // 使用本地配置
    return buildLocalOption()
  }

  // 提取数据数组（可选）
  const data = extractNumberArray(remoteData.value, ds.dataPath) || defaultData

  // 提取 X 轴标签（可选）
  const xAxisData = extractStringArray(remoteData.value, ds.xAxisPath) || defaultXAxis

  // 提取系列名称（可选）
  const seriesName = extractString(remoteData.value, ds.seriesNamePath) || 'Series'

  return {
    xAxis: { data: xAxisData },
    series: [{ name: seriesName, data: data }],
  }
}
```

## 数据路径配置示例

### API 返回格式示例

```json
{
  "code": 200,
  "data": {
    "kpi": {
      "title": "月销售额",
      "value": 12345,
      "change": 5.2
    },
    "chart": {
      "values": [120, 200, 150],
      "categories": ["1月", "2月", "3月"]
    }
  }
}
```

### 组件配置示例

#### Text 组件

- **dataPath**: `data.kpi.title` → 显示 "月销售额"

#### CountUp 组件

- **valuePath**: `data.kpi.value` → 显示 12345

#### Stat 组件

- **titlePath**: `data.kpi.title`
- **valuePath**: `data.kpi.value`
- **changePath**: `data.kpi.change`

#### 图表组件

- **dataPath**: `data.chart.values` → [120, 200, 150]
- **xAxisPath**: `data.chart.categories` → ["1月", "2月", "3月"]

## 优势

✅ **灵活性**：图表可以只填 `dataPath`，不填 `xAxisPath` 也能工作  
✅ **多字段**：KPI 组件可以同时提取多个字段  
✅ **统一管理**：工具函数统一在 `chartUtils.ts`，避免冗余  
✅ **易维护**：新组件直接复用工具函数  
✅ **类型安全**：TypeScript 支持完整

## 最佳实践

1. **优先使用 `extractWithFallback` 和 `extractNumber`**，它们会自动处理 undefined 和类型转换
2. **图表组件使用专用函数**：`extractNumberArray`、`extractStringArray` 等
3. **多字段提取考虑使用 `extractMultipleFields`**（可选，也可以分别提取）
4. **始终提供默认值**，确保组件在数据未加载时能正常显示
