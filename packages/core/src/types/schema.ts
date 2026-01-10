/**
 * 核心节点协议：描述页面上的一个组件实例
 * 这是生成器 (Generator) 和 渲染器 (Renderer) 的通用语言
 */
export interface NodeSchema {
  id: string // 唯一组件ID
  componentName: string // 对应 UI 库的组件名 (e.g., 'Button', 'Text')
  props?: Record<string, any> // 传递给组件的属性
  style?: Record<string, any> // 样式配置

  // 嵌套结构
  children?: NodeSchema[] | string

  // 动态指令 (为 AST 生成做准备)
  condition?: boolean | { type: 'JSExpression'; value: string } // v-if
  loop?: {
    // v-for
    data: any[] | { type: 'JSExpression'; value: string }
    itemArg?: string
    indexArg?: string
  }

  // 事件交互
  events?: EventSchema
}

export interface EventSchema {
  // key: 事件名 (e.g. 'onClick'), value: 动作列表
  [eventName: string]: ActionSchema[]
}

export interface ActionSchema {
  type: 'component' | 'global' | 'custom'
  targetId?: string // 调用哪个组件
  methodName?: string // 调用什么方法
  stateName?: string // 修改哪个全局状态
  value?: any // 修改成什么值
  code?: string // 自定义代码块
}
