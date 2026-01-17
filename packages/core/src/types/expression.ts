/**
 * JS 表达式容器
 * 用于区分静态值和动态绑定值
 * e.g. { type: 'JSExpression', value: 'state.userInfo.name' }
 */
export interface JSExpression {
  type: 'JSExpression'
  value: string
}

export type PropValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSExpression
  | PropValue[]
  | { [key: string]: PropValue }
