// 组件相关类型定义

// 事件动作接口
export interface Action {
  type: string
  targetId?: string
}

// 数据绑定接口
export interface DataBinding {
  sourceId: string
  sourcePath: string
  targetPath: string
  transformer?: string
  transformerType?: 'expression' | 'template'
}

// 动画选项接口
export interface AnimationOption {
  name: string
  label: string
  class: string
  duration?: number
  desc?: string
}

// 事件处理器类型
export type EventHandler = (params?: unknown) => void | Promise<void>

// 事件上下文接口
export interface ComponentEventsContext {
  emitComponentEvent: (componentId: string, eventName: string, params?: unknown) => void
  executeAction: (action: EventAction, sourceComponent?: Component) => Promise<void>
  registerListener: (componentId: string, eventName: string, handler: EventHandler) => void
  unregisterListener: (componentId: string, eventName: string) => void
}

export interface DataSource {
  enabled: boolean
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string
  interval?: number
  dataPath?: string
  valuePath?: string
  xAxisPath?: string
  labelsPath?: string
  seriesNamePath?: string
  seriesNamesPath?: string
  seriesDataPath?: string
  titlePath?: string
  changePath?: string
  [key: string]: unknown
}

// 可递归的属性值类型，覆盖基本类型、数组和嵌套对象
export type PropValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | PropValue[]
  | { [key: string]: PropValue }

export interface EventAction {
  id: string
  type: string
  targetId?: string
  eventName?: string
  eventParams?: string
  content?: string
  condition?: {
    enabled: boolean
    expression: string
  }
  delay?: number
}

export interface ComponentEvents {
  click?: EventAction[]
  hover?: EventAction[]
  doubleClick?: EventAction[]
  custom?: {
    [eventName: string]: EventAction[]
  }
}

export interface Component {
  id: string
  name?: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  zindex: number
  style: {
    opacity?: number
    visible?: boolean
    locked?: boolean
    [key: string]: unknown
  }
  props: Record<string, PropValue>
  dataSource?: DataSource
  animation?: {
    name: string
    class: string
    duration?: number
    delay?: number
    iterationCount?: number | 'infinite'
    timingFunction?: string
    trigger?: 'load' | 'hover' | 'click'
  }
  groupId?: string
  children?: string[]
  layout?: {
    mode: 'absolute' | 'horizontal' | 'vertical' | 'grid'
    gap?: number
    columns?: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    padding?: number
  }
  events?: ComponentEvents

  /** 数据联动：target 默认为本组件，source 由 binding.sourceId 指定 */
  dataBindings?: DataBinding[]
}

/**
 * 组件拖拽载荷
 * 支持新旧两种格式：
 * - 新格式：componentName (从 @lowcode/materials)
 * - 旧格式：type (向后兼容)
 */
export interface ComponentPayload {
  /** 组件类型标识（旧协议，向后兼容） */
  type?: string
  /** 组件名称（新协议，从 materialList） */
  componentName?: string
  width?: number
  height?: number
  props?: Record<string, PropValue>
  style?: Record<string, unknown>
  children?: unknown[]
  [key: string]: unknown
}

// TreeNode 组件的 props 类型
export interface TreeNodeProps {
  node: {
    id: string
    name: string
    type: 'page' | 'folder'
    path?: string
    expanded?: boolean
    children?: TreeNodeProps['node'][]
    isHome?: boolean
  }
  activeId?: string
  depth?: number
}

// Re-export snap types
export type { SnapComp, Box } from './snap'
