# AI 建议面板 (AI Assist) - 集成指南

## 📋 功能概览

AI 建议面板提供了完整的自然语言驱动的组件生成、预览和管理功能,包含:

### ✅ 已实现功能

1. **类型系统** (`src/type/suggestion.d.ts`)
   - SuggestionRequest: 建议请求结构
   - SuggestionResult: 建议响应结构
   - DiffItem: 差异项(add/modify/delete)
   - AuditRecord: 审计记录
   - WhitelistConfig: 白名单配置

2. **服务层** (`src/services/suggestService.ts`)
   - `generateSuggestion()`: Agent 调用(当前为模拟实现)
   - `validateComponentSchema()`: JSON Schema 校验
   - `isPropertyAllowed()`: 白名单属性过滤
   - `sanitizeValue()`: 危险内容沙箱隔离
   - `applyDiffs()`: 将差异应用到组件树

3. **状态管理** (`src/stores/suggestion.ts`)
   - `generate()`: 生成建议
   - `preview()`: 预览建议
   - `accept()` / `acceptPartial()`: 接受建议
   - `reject()`: 拒绝建议
   - `rollback()`: 回滚到历史状态
   - `exportAudit()`: 导出审计日志

4. **UI 组件**
   - `DiffViewer.vue`: 差异预览组件,高亮显示变更
   - `SuggestionPanel.vue`: 建议面板主界面
   - `AuditPanel.vue`: 审计日志面板

## 🚀 快速集成

### 方式 1: 集成到 siderBar

在 `src/components/siderBar/siderBar.vue` 中添加新的 Tab:

```vue
<template>
  <el-tabs v-model="activeTab">
    <!-- 现有 tabs... -->
    <el-tab-pane label="AI 助手" name="ai-assist">
      <SuggestionPanel />
    </el-tab-pane>
    <el-tab-pane label="审计日志" name="audit">
      <AuditPanel />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import SuggestionPanel from './suggestion/SuggestionPanel.vue'
import AuditPanel from './suggestion/AuditPanel.vue'
// ... 其他导入
</script>
```

### 方式 2: 创建独立浮动面板

创建 `src/components/AIAssistDialog.vue`:

```vue
<template>
  <el-dialog v-model="visible" title="AI 建议助手" width="800px" :close-on-click-modal="false">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="生成建议" name="suggest">
        <SuggestionPanel />
      </el-tab-pane>
      <el-tab-pane label="审计日志" name="audit">
        <AuditPanel />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SuggestionPanel from './siderBar/suggestion/SuggestionPanel.vue'
import AuditPanel from './siderBar/suggestion/AuditPanel.vue'

const visible = defineModel<boolean>('visible', { default: false })
const activeTab = ref('suggest')
</script>
```

然后在主界面添加触发按钮:

```vue
<el-button @click="aiDialogVisible = true">
  <el-icon><MagicStick /></el-icon>
  AI 助手
</el-button>

<AIAssistDialog v-model:visible="aiDialogVisible" />
```

## 🔧 替换真实 Agent API

当前 `suggestService.ts` 中的 `callAgent()` 是模拟实现,需替换为真实 API:

```typescript
// src/services/suggestService.ts

async function callAgent(request: SuggestionRequest): Promise<Omit<SuggestionResult, 'id'>> {
  // 替换为真实 API 调用
  const response = await fetch('/api/agent/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Agent 调用失败: ${response.statusText}`)
  }

  const result = await response.json()
  return {
    request,
    diffs: result.diffs, // 确保符合 DiffItem[] 格式
    summary: result.summary,
    confidence: result.confidence,
    agentVersion: result.agentVersion || 'unknown',
    timestamp: Date.now(),
    validated: false,
  }
}
```

## 🛡️ 安全配置

### 自定义白名单

修改 `suggestService.ts` 中的 `DEFAULT_WHITELIST`:

```typescript
const DEFAULT_WHITELIST: WhitelistConfig = {
  allowedComponents: [
    'yourCustomComponent',
    // 添加允许的组件类型
  ],
  allowedPropPrefixes: [
    'customProp',
    // 添加允许的属性前缀
  ],
  forbiddenProps: [
    '__proto__',
    'constructor',
    'dangerousField',
    // 添加禁止的属性
  ],
  allowedDataSources: ['static', 'api', 'mock'],
}
```

### 增强沙箱隔离

在 `sanitizeValue()` 中添加更多安全检查:

```typescript
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    // 添加自定义危险模式
    const customDangerousPatterns = /your-pattern|another-pattern/gi
    if (customDangerousPatterns.test(value)) {
      console.warn('[Security] 检测到危险内容')
      return '' // 或抛出错误
    }
  }
  // ... 其他逻辑
}
```

## 📊 扩展 Agent 能力

### 添加新的意图识别

在 `callAgent()` 中扩展 prompt 解析:

```typescript
// 检测表格需求
if (prompt.includes('表格') || prompt.includes('table')) {
  diffs.push({
    action: 'add',
    componentType: 'table',
    component: {
      type: 'table',
      name: '数据表格',
      position: { x: 50, y: 50 },
      size: { width: 600, height: 400 },
      rotation: 0,
      zindex: 1,
      style: { visible: true, locked: false },
      props: {
        columns: [
          { label: '列1', prop: 'col1' },
          { label: '列2', prop: 'col2' },
        ],
        data: [],
      },
    },
    description: '新增数据表格',
  })
}
```

## 🎨 UI 自定义

### 修改样式主题

所有组件均使用 Element Plus 主题变量,可通过 CSS 变量覆盖:

```css
/* 在全局样式中 */
.suggestion-panel {
  --el-color-primary: #your-color;
  --el-border-radius-base: 12px;
}
```

### 调整布局

修改各组件的 `.scoped` 样式,如调整面板高度、间距等。

## 🔍 调试与监控

### 启用详细日志

在 `suggestService.ts` 和 `suggestion.ts` 中已有 `console.log/warn`,可根据需要调整日志级别。

### 监控 Agent 性能

```typescript
// 在 generateSuggestion 中添加
const startTime = performance.now()
const rawResult = await callAgent(request)
const duration = performance.now() - startTime
console.log(`[Perf] Agent 响应时间: ${duration.toFixed(2)}ms`)
```

## 📦 依赖项

确保已安装:

```json
{
  "dependencies": {
    "vue": "^3.x",
    "pinia": "^2.x",
    "element-plus": "^2.x",
    "@element-plus/icons-vue": "^2.x",
    "nanoid": "^5.x"
  }
}
```

## 🧪 测试建议

1. **单元测试**: 测试 `validateComponentSchema`, `isPropertyAllowed`, `sanitizeValue`
2. **集成测试**: 测试 Store 的 `generate`, `accept`, `rollback` 流程
3. **E2E 测试**: 测试完整的用户交互流程

## 🚧 已知限制与后续优化

- [ ] Agent 当前为模拟实现,需对接真实 AI 服务
- [ ] Diff 预览暂不支持复杂嵌套结构的可视化
- [ ] 回滚功能暂不支持多步骤撤销/重做
- [ ] 审计日志导出仅为 JSON,可扩展为 CSV/Excel
- [ ] 建议生成暂无进度反馈,可添加 SSE 流式输出

## 📞 支持

如有问题,请查看:

- 类型定义: `src/type/suggestion.d.ts`
- 服务实现: `src/services/suggestService.ts`
- Store 逻辑: `src/stores/suggestion.ts`
