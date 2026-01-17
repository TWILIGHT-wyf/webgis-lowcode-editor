import { PropValue, JSExpression } from './expression'
import { ActionSchema } from './action'

/**
 * 核心节点协议：描述页面上的一个组件实例
 * V1.5 架构：递归树形结构
 */
export interface NodeSchema {
  id: string
  componentName: string // 对应 MaterialMeta.componentName
  props?: Record<string, PropValue>
  style?: Record<string, any>

  /**
   * 核心变更：递归子节点
   * 只有容器组件该字段才有效
   */
  children?: NodeSchema[]

  // 动态指令
  condition?: boolean | JSExpression // v-if
  loop?: {
    // v-for
    data: any[] | JSExpression
    itemArg?: string
    indexArg?: string
  }

  // 事件交互
  events?: Record<string, ActionSchema[]>
}
