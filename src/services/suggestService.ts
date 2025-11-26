/**
 * AI 建议服务
 * 负责调用 Agent、校验、白名单过滤、沙箱隔离
 */

import type {
  SuggestionRequest,
  SuggestionResult,
  DiffItem,
  WhitelistConfig,
} from '@/type/suggestion'
import type { component as Component } from '@/stores/component'
import { nanoid } from 'nanoid'
import http from '@/services/http'

/**
 * 默认白名单配置
 */
const DEFAULT_WHITELIST: WhitelistConfig = {
  allowedComponents: [
    // 地图
    'base',
    'tile',
    'vector',
    'geojson',
    'marker',
    'cluster',
    'heat',
    'legend',
    'scale',
    'layers',
    // 图表
    'lineChart',
    'barChart',
    'stackedBarChart',
    'pieChart',
    'doughnutChart',
    'scatterChart',
    'radarChart',
    'gaugeChart',
    'funnelChart',
    'sankeyChart',
    // KPI
    'stat',
    'Text',
    'countUp',
    'progress',
    'badge',
    'box',
    // 数据
    'table',
    'list',
    'timeline',
    'cardGrid',
    'pivot',
    // 控件
    'select',
    'multiSelect',
    'dateRange',
    'searchBox',
    'slider',
    'switch',
    'checkboxGroup',
    'buttonGroup',
    // 布局
    'row',
    'col',
    'tabs',
    'grid',
    'panel',
    'modal',
    'flex',
    // 媒体
    'image',
    'video',
    // 内容
    'markdown',
    'html',
    'iframe',
    // 高级
    'scripting',
    'trigger',
    'state',
  ],
  allowedPropPrefixes: ['label', 'title', 'value', 'placeholder', 'options', 'dataSource'],
  forbiddenProps: ['__proto__', 'constructor', 'prototype', 'eval', 'Function'],
  allowedDataSources: ['static', 'api', 'mock'],
}

/**
 * JSON Schema 校验（简化版）
 */
function validateComponentSchema(component: Partial<Component>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // 必需字段
  if (!component.type) {
    errors.push('组件缺少必需字段: type')
  }

  // 检查组件类型是否在白名单内
  if (component.type && !DEFAULT_WHITELIST.allowedComponents.includes(component.type)) {
    errors.push(`组件类型 "${component.type}" 不在白名单内`)
  }

  // 检查尺寸
  if (component.size) {
    if (component.size.width < 0 || component.size.width > 2000) {
      errors.push('组件宽度超出合理范围 (0-2000)')
    }
    if (component.size.height < 0 || component.size.height > 2000) {
      errors.push('组件高度超出合理范围 (0-2000)')
    }
  }

  // 检查位置
  if (component.position) {
    if (component.position.x < 0) {
      errors.push('组件 x 坐标不能为负数')
    }
    if (component.position.y < 0) {
      errors.push('组件 y 坐标不能为负数')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 白名单过滤 - 检查属性路径
 */
function isPropertyAllowed(path: string): boolean {
  // 检查禁止属性
  if (DEFAULT_WHITELIST.forbiddenProps.some((forbidden) => path.includes(forbidden))) {
    return false
  }

  // 检查是否以允许的前缀开头（或为通用属性）
  const allowedGenericProps = ['x', 'y', 'w', 'h', 'style', 'name', 'visible', 'locked']
  const firstPart = path.split('.')[0]
  if (firstPart && allowedGenericProps.includes(firstPart)) {
    return true
  }

  return DEFAULT_WHITELIST.allowedPropPrefixes.some((prefix) => path.startsWith(prefix))
}

/**
 * 沙箱隔离 - 检查危险脚本
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    // 移除潜在危险的脚本标签和事件处理器
    const dangerous = /<script|javascript:|onerror|onload|eval\(/gi
    if (dangerous.test(value)) {
      console.warn('[SuggestService] 检测到危险内容，已清理:', value)
      return value.replace(dangerous, '')
    }
  }

  if (typeof value === 'object' && value !== null) {
    // 递归清理对象
    const cleaned: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (!DEFAULT_WHITELIST.forbiddenProps.includes(key)) {
        cleaned[key] = sanitizeValue(val)
      }
    }
    return cleaned
  }

  return value
}

/**
 * 校验差异项
 */
function validateDiff(diff: DiffItem): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (diff.action === 'add' && diff.component) {
    // 校验新增组件
    const schemaResult = validateComponentSchema(diff.component)
    if (!schemaResult.valid) {
      errors.push(...schemaResult.errors)
    }
  }

  if (diff.action === 'modify' && diff.path) {
    // 校验修改路径
    if (!isPropertyAllowed(diff.path)) {
      errors.push(`属性路径 "${diff.path}" 不在白名单内`)
    }
  }

  // 清理值
  if (diff.newValue !== undefined) {
    diff.newValue = sanitizeValue(diff.newValue)
  }

  if (diff.component) {
    diff.component = sanitizeValue(diff.component) as Partial<Component>
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Agent API 配置
 * 使用本地代理服务器转发请求，保护 API 密钥安全
 *
 * 启动代理: cd server && npm install && npm start
 */
const AGENT_CONFIG = {
  // 本地代理服务器地址
  endpoint: 'http://localhost:3001/api/ai/generate',
  // 代理模式下不需要在前端配置密钥，密钥存储在服务器端
  apiKey: 'proxy-mode', // 占位符，实际密钥在 server/.env 中配置
  // 模型名称（用于显示，实际模型在 server/.env 中配置）
  model: 'gemini-via-proxy',
  // 请求超时时间（毫秒）
  timeout: 60000,
}

/**
 * 构建发送给 Agent 的系统提示词
 */
function buildSystemPrompt(): string {
  return `你是一个专业的 WebGIS 可视化大屏设计助手。用户会描述他们想要的组件或布局需求，你需要根据需求生成对应的组件配置。

## 可用组件类型
### 图表类
- lineChart: 折线图（用于趋势分析）
- barChart: 柱状图（用于数据对比）
- stackedBarChart: 堆叠柱状图
- pieChart: 饼图（用于占比分析）
- doughnutChart: 环形图
- scatterChart: 散点图
- radarChart: 雷达图
- gaugeChart: 仪表盘
- funnelChart: 漏斗图
- sankeyChart: 桑基图

### KPI 指标类
- stat: 统计指标卡
- countUp: 数字滚动
- progress: 进度条
- badge: 徽章
- box: 信息盒子
- Text: 文本

### 数据展示类
- table: 数据表格
- list: 列表
- timeline: 时间线
- cardGrid: 卡片网格
- pivot: 透视表

### 控件类
- select: 下拉选择
- multiSelect: 多选
- dateRange: 日期范围
- searchBox: 搜索框
- slider: 滑块
- switch: 开关
- checkboxGroup: 复选框组
- buttonGroup: 按钮组

### 布局类
- row, col, flex, grid: 布局容器
- panel: 面板
- tabs: 标签页
- modal: 弹窗

### 媒体类
- image: 图片
- video: 视频

### 地图类
- base: 基础地图
- tile: 瓦片图层
- marker: 标记点
- heat: 热力图

## 输出格式
请严格按照以下 JSON 格式返回，不要包含任何其他文字：
{
  "diffs": [
    {
      "action": "add",
      "componentType": "组件类型",
      "component": {
        "type": "组件类型",
        "name": "组件名称",
        "position": { "x": 数字, "y": 数字 },
        "size": { "width": 数字, "height": 数字 },
        "rotation": 0,
        "zindex": 1,
        "style": { "visible": true, "locked": false },
        "props": { /* 组件特定属性 */ }
      },
      "description": "操作描述"
    }
  ],
  "summary": "总结说明"
}

## 注意事项
1. position.x 和 position.y 必须 >= 0
2. size.width 和 size.height 范围为 50-2000
3. 多个组件时注意位置错开，避免重叠
4. 根据组件类型提供合理的 props 配置
5. 只返回 JSON，不要有其他解释文字`
}

/**
 * 构建用户消息
 */
function buildUserMessage(request: SuggestionRequest): string {
  const contextInfo = request.context
    ? `\n当前画布尺寸: ${request.context.canvasSize?.width || 1920}x${request.context.canvasSize?.height || 1080}\n已有组件数量: ${request.context.components?.length || 0}`
    : ''

  return `用户需求: ${request.prompt}${contextInfo}`
}

/**
 * 解析 Agent 响应
 */
function parseAgentResponse(
  responseText: string,
  request: SuggestionRequest,
): Omit<SuggestionResult, 'id'> {
  try {
    // 尝试提取 JSON（处理可能包含 markdown 代码块的情况）
    let jsonStr = responseText
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1].trim()
    }

    const parsed = JSON.parse(jsonStr)

    return {
      request,
      diffs: parsed.diffs || [],
      summary: parsed.summary || `生成了 ${parsed.diffs?.length || 0} 个组件`,
      confidence: 0.9,
      agentVersion: AGENT_CONFIG.model || 'unknown',
      timestamp: Date.now(),
      validated: false,
    }
  } catch (error) {
    console.error('[SuggestService] 解析 Agent 响应失败:', error)
    // 返回错误提示
    return {
      request,
      diffs: [
        {
          action: 'add',
          componentType: 'Text',
          component: {
            type: 'Text',
            name: '错误提示',
            position: { x: 50, y: 50 },
            size: { width: 400, height: 80 },
            rotation: 0,
            zindex: 1,
            style: { visible: true, locked: false },
            props: {
              content: `Agent 响应解析失败，请重试。原始响应: ${responseText.slice(0, 200)}...`,
            },
          },
          description: '解析错误提示',
        },
      ],
      summary: 'Agent 响应解析失败',
      confidence: 0,
      agentVersion: AGENT_CONFIG.model || 'unknown',
      timestamp: Date.now(),
      validated: false,
    }
  }
}

/**
 * 调用真实 Agent API
 */
async function callAgent(request: SuggestionRequest): Promise<Omit<SuggestionResult, 'id'>> {
  // 检查 API 配置
  if (!AGENT_CONFIG.endpoint || !AGENT_CONFIG.apiKey) {
    console.warn('[SuggestService] Agent API 未配置，请设置 AGENT_CONFIG')
    return {
      request,
      diffs: [
        {
          action: 'add',
          componentType: 'Text',
          component: {
            type: 'Text',
            name: '配置提示',
            position: { x: 50, y: 50 },
            size: { width: 500, height: 100 },
            rotation: 0,
            zindex: 1,
            style: { visible: true, locked: false },
            props: {
              content:
                '⚠️ Agent API 未配置。请在 suggestService.ts 中设置 AGENT_CONFIG 的 endpoint、apiKey 和 model。',
            },
          },
          description: 'API 配置提示',
        },
      ],
      summary: 'Agent API 未配置',
      confidence: 0,
      agentVersion: 'not-configured',
      timestamp: Date.now(),
      validated: false,
    }
  }

  let timeoutId: number | null = null

  try {
    const controller = new AbortController()
    // 使用 window.setTimeout 以获得 number 类型（前端环境）
    timeoutId = window.setTimeout(() => controller.abort(), AGENT_CONFIG.timeout)

    const resp = await http.post(
      AGENT_CONFIG.endpoint,
      {
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserMessage(request) },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        timeout: AGENT_CONFIG.timeout,
      },
    )

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    const data = resp.data
    const content = data.choices?.[0]?.message?.content || data.content || ''
    return parseAgentResponse(content, request)
  } catch (err: unknown) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    console.error('[SuggestService] Agent 调用失败:', err)

    // 超时/取消/其它错误处理
    let errorMessage = '未知错误'
    const errCode = (err as { code?: string })?.code
    if (errCode === 'ECONNABORTED' || errCode === 'ERR_CANCELED') {
      errorMessage = '请求超时或已取消，请检查网络连接'
    } else if (err instanceof Error) {
      errorMessage = err.message
    }

    return {
      request,
      diffs: [
        {
          action: 'add',
          componentType: 'Text',
          component: {
            type: 'Text',
            name: '错误提示',
            position: { x: 50, y: 50 },
            size: { width: 500, height: 80 },
            rotation: 0,
            zindex: 1,
            style: { visible: true, locked: false },
            props: {
              content: `❌ Agent 调用失败: ${errorMessage}`,
            },
          },
          description: '错误提示',
        },
      ],
      summary: `调用失败: ${errorMessage}`,
      confidence: 0,
      agentVersion: AGENT_CONFIG.model || 'unknown',
      timestamp: Date.now(),
      validated: false,
    }
  }
}

/**
 * 生成建议
 */
export async function generateSuggestion(request: SuggestionRequest): Promise<SuggestionResult> {
  // 调用 Agent
  const rawResult = await callAgent(request)

  // 校验每个差异项
  const validationErrors: string[] = []
  for (const diff of rawResult.diffs) {
    const result = validateDiff(diff)
    if (!result.valid) {
      validationErrors.push(...result.errors)
    }
  }

  const validated = validationErrors.length === 0

  return {
    id: nanoid(),
    ...rawResult,
    validated,
    validationErrors: validated ? undefined : validationErrors,
  }
}

/**
 * 应用差异到组件树
 */
export function applyDiffs(
  components: Component[],
  diffs: DiffItem[],
): { components: Component[]; appliedCount: number } {
  const newComponents = [...components]
  let appliedCount = 0

  for (const diff of diffs) {
    try {
      if (diff.action === 'add' && diff.component) {
        // 新增组件
        const newComponent = {
          id: nanoid(),
          ...diff.component,
        } as Component
        newComponents.push(newComponent)
        appliedCount++
      } else if (diff.action === 'modify' && diff.componentId && diff.path && diff.newValue) {
        // 修改组件
        const targetIndex = newComponents.findIndex((c) => c.id === diff.componentId)
        if (targetIndex !== -1) {
          const target = newComponents[targetIndex]
          // 简化的路径设置（实际项目可用 lodash.set）
          const pathParts = diff.path.split('.')
          let current: unknown = target
          for (let i = 0; i < pathParts.length - 1; i++) {
            const key = pathParts[i]
            if (key && typeof current === 'object' && current !== null && key in current) {
              current = (current as Record<string, unknown>)[key]
            }
          }
          const lastKey = pathParts[pathParts.length - 1]
          if (lastKey && typeof current === 'object' && current !== null) {
            ;(current as Record<string, unknown>)[lastKey] = diff.newValue
          }
          appliedCount++
        }
      } else if (diff.action === 'delete' && diff.componentId) {
        // 删除组件
        const targetIndex = newComponents.findIndex((c) => c.id === diff.componentId)
        if (targetIndex !== -1) {
          newComponents.splice(targetIndex, 1)
          appliedCount++
        }
      }
    } catch (error) {
      console.error('[SuggestService] 应用差异失败:', diff, error)
    }
  }

  return {
    components: newComponents,
    appliedCount,
  }
}
