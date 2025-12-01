// 组件相关类型定义

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
}

export interface ComponentPayload {
  type: string
  width?: number
  height?: number
  props?: Record<string, PropValue>
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

// 组件相关的其它轻量类型通过 re-export
export type { Action, DataBinding } from '@/components/siderBar/relations/relations'
export type { AnimationOption } from '@/components/siderBar/animation/animation'
export type { ComponentEventsContext, EventHandler } from '@/components/siderBar/events/events'
export type { SnapComp, Box } from '@/types/snap'
