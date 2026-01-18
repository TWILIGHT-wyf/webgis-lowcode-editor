/**
 * Component type for code generation
 * This is the runtime representation with position/size
 * for generating Vue code from the editor's component store
 */
export interface Component {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation?: number
  zindex?: number
  props?: Record<string, unknown>
  style?: Record<string, unknown>
  events?: {
    click?: ActionConfig[]
    hover?: ActionConfig[]
    doubleClick?: ActionConfig[]
    [key: string]: ActionConfig[] | undefined
  }
  groupId?: string
  animation?: {
    class?: string
    trigger?: 'load' | 'hover' | 'click'
    duration?: number
    delay?: number
    iterationCount?: number | string
    timingFunction?: string
  }
  dataBindings?: DataBinding[]
  dataSource?: DataSourceConfig
}

export interface ActionConfig {
  id: string
  type: string
  targetId?: string
  delay?: number
  [key: string]: unknown
}

export interface DataBinding {
  sourceId: string
  sourcePath: string
  targetPath: string
  transformer?: {
    type: 'expression' | 'template'
    expression?: string
    template?: string
  }
}

export interface DataSourceConfig {
  enabled?: boolean
  type?: 'api' | 'static'
  url?: string
  method?: string
  interval?: number
  data?: unknown
}
