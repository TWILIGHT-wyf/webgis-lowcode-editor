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
 * 模拟 Agent 调用（实际项目中替换为真实 API）
 */
async function callAgent(request: SuggestionRequest): Promise<Omit<SuggestionResult, 'id'>> {
  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 简单解析 prompt
  const prompt = request.prompt.toLowerCase()
  const diffs: DiffItem[] = []

  // 示例：检测 KPI 需求
  if (prompt.includes('kpi') || prompt.includes('指标')) {
    diffs.push({
      action: 'add',
      componentType: 'stat',
      component: {
        type: 'stat',
        name: 'KPI 指标卡',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 120 },
        rotation: 0,
        zindex: 1,
        style: { visible: true, locked: false },
        props: {
          title: '总销售额',
          value: 12580,
          unit: '元',
          trend: 'up',
        },
      },
      description: '新增 KPI 指标卡',
    })
  }

  // 示例：检测图表需求
  if (prompt.includes('折线') || prompt.includes('line')) {
    diffs.push({
      action: 'add',
      componentType: 'lineChart',
      component: {
        type: 'lineChart',
        name: '折线图',
        position: { x: 300, y: 50 },
        size: { width: 400, height: 280 },
        rotation: 0,
        zindex: 1,
        style: { visible: true, locked: false },
        props: {
          title: '趋势分析',
          xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
          series: [
            {
              name: '销售额',
              data: [120, 200, 150, 280, 320, 390],
            },
          ],
        },
      },
      description: '新增折线图组件',
    })
  }

  if (prompt.includes('柱状') || prompt.includes('bar')) {
    diffs.push({
      action: 'add',
      componentType: 'barChart',
      component: {
        type: 'barChart',
        name: '柱状图',
        position: { x: 300, y: 360 },
        size: { width: 400, height: 280 },
        rotation: 0,
        zindex: 1,
        style: { visible: true, locked: false },
        props: {
          title: '数据对比',
          xAxisData: ['产品A', '产品B', '产品C', '产品D'],
          series: [
            {
              name: '销量',
              data: [320, 450, 280, 510],
            },
          ],
        },
      },
      description: '新增柱状图组件',
    })
  }

  if (prompt.includes('饼图') || prompt.includes('pie')) {
    diffs.push({
      action: 'add',
      componentType: 'pieChart',
      component: {
        type: 'pieChart',
        name: '饼图',
        position: { x: 750, y: 50 },
        size: { width: 300, height: 300 },
        rotation: 0,
        zindex: 1,
        style: { visible: true, locked: false },
        props: {
          title: '占比分析',
          data: [
            { name: '类型A', value: 335 },
            { name: '类型B', value: 234 },
            { name: '类型C', value: 154 },
            { name: '类型D', value: 135 },
          ],
        },
      },
      description: '新增饼图组件',
    })
  }

  // 如果没有识别到任何内容，返回提示
  if (diffs.length === 0) {
    diffs.push({
      action: 'add',
      componentType: 'Text',
      component: {
        type: 'Text',
        name: '提示文本',
        position: { x: 50, y: 50 },
        size: { width: 300, height: 60 },
        rotation: 0,
        zindex: 1,
        style: { visible: true, locked: false },
        props: {
          content: `未能识别您的需求："${request.prompt}"。请尝试更具体的描述，如"添加 KPI 和折线图"。`,
        },
      },
      description: '添加提示信息',
    })
  }

  return {
    request,
    diffs,
    summary: `根据您的需求生成了 ${diffs.length} 个组件`,
    confidence: diffs.length > 0 ? 0.85 : 0.3,
    agentVersion: '1.0.0-demo',
    timestamp: Date.now(),
    validated: false,
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
