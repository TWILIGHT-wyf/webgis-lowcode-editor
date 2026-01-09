/**
 * 组件操作模块的基础类型定义
 * 用于 componentOps 下各模块的泛型约束，减少类型断言
 */

/**
 * 组件基础属性接口
 * 所有组件操作模块共用的最小属性集
 */
export interface BaseComponent {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  zindex: number
  style: Record<string, unknown>
  props: Record<string, unknown>
  groupId?: string
  children?: string[]
}

/**
 * 创建组件对象的工厂函数类型
 */
export type ComponentFactory<C extends BaseComponent> = (partial: Partial<C>) => C
