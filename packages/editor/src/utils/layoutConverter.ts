import type { NodeSchema } from '@vela/core'
import { cloneDeep } from 'lodash-es'

export type LayoutMode = 'free' | 'flow'

/**
 * 需要从 Flow 模式中移除的样式属性
 */
const FREE_ONLY_STYLES = [
  'position',
  'left',
  'top',
  'right',
  'bottom',
  'zIndex',
  'transform',
] as const

/**
 * 块级组件列表 - 这些组件在 Flow 模式下应该是 width: 100%
 */
const BLOCK_COMPONENTS = ['Container', 'Page', 'Row', 'Col', 'Panel', 'Card', 'Form', 'Table']

/**
 * 从 style 字符串中提取数值（如 "100px" -> 100）
 */
function parseStyleValue(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0
  if (typeof value === 'number') return value
  const num = parseFloat(value)
  return isNaN(num) ? 0 : num
}

/**
 * 将组件树转换为流式布局（Flow）
 *
 * 转换规则：
 * 1. 移除绝对定位相关样式（position, left, top, right, bottom, zIndex, transform）
 * 2. 根据原 top 值对同级子节点排序，保持视觉顺序
 * 3. 块级组件的 width 重置为 100%
 * 4. 保留其他样式属性（如 backgroundColor, border 等）
 */
export function convertToFlow(root: NodeSchema): NodeSchema {
  const cloned = cloneDeep(root)

  function processNode(node: NodeSchema): void {
    // 清理 Free 模式特有的样式
    if (node.style) {
      for (const prop of FREE_ONLY_STYLES) {
        delete node.style[prop]
      }

      // 块级组件重置为 100% 宽度
      if (BLOCK_COMPONENTS.includes(node.componentName)) {
        node.style.width = '100%'
        // 移除固定高度，让内容撑开
        if (node.style.height && node.children && node.children.length > 0) {
          node.style.minHeight = node.style.height
          delete node.style.height
        }
      }
    }

    // 处理子节点
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      // 先根据原来的 top 值排序，保持视觉顺序
      node.children.sort((a, b) => {
        const topA = parseStyleValue(a.style?.top)
        const topB = parseStyleValue(b.style?.top)
        return topA - topB
      })

      // 递归处理子节点
      for (const child of node.children) {
        processNode(child)
      }
    }
  }

  processNode(cloned)

  console.log('[LayoutConverter] Converted to Flow mode:', cloned)
  return cloned
}

/**
 * 将组件树转换为自由布局（Free）
 *
 * 转换规则：
 * 1. 添加 position: absolute
 * 2. 根据索引设置初始位置（错开排列，避免重叠）
 * 3. 保留原有的宽高数据
 * 4. 设置初始 zIndex
 */
export function convertToFree(root: NodeSchema): NodeSchema {
  const cloned = cloneDeep(root)

  // 用于跟踪当前层级的位置偏移
  const OFFSET_X = 20
  const OFFSET_Y = 50
  const DEFAULT_WIDTH = 200
  const DEFAULT_HEIGHT = 100

  function processNode(node: NodeSchema, depth: number = 0): void {
    // 初始化 style
    if (!node.style) {
      node.style = {}
    }

    // Page 根节点不需要绝对定位
    if (node.componentName === 'Page') {
      node.style.position = 'relative'
      node.style.width = '100%'
      node.style.height = '100%'
    } else {
      // 添加绝对定位
      node.style.position = 'absolute'
    }

    // 处理子节点
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      node.children.forEach((child, index) => {
        if (!child.style) {
          child.style = {}
        }

        // 设置绝对定位
        child.style.position = 'absolute'

        // 根据索引错开位置，避免重叠
        child.style.left = `${OFFSET_X + index * OFFSET_X}px`
        child.style.top = `${OFFSET_Y + index * OFFSET_Y}px`

        // 设置默认宽高（如果没有的话）
        if (!child.style.width) {
          child.style.width = `${DEFAULT_WIDTH}px`
        }
        if (!child.style.height) {
          child.style.height = `${DEFAULT_HEIGHT}px`
        }

        // 设置 zIndex
        child.style.zIndex = String(index + 1)

        // 递归处理
        processNode(child, depth + 1)
      })
    }
  }

  processNode(cloned)

  console.log('[LayoutConverter] Converted to Free mode:', cloned)
  return cloned
}

/**
 * 根据目标模式转换布局
 */
export function convertLayout(root: NodeSchema, targetMode: LayoutMode): NodeSchema {
  if (targetMode === 'flow') {
    return convertToFlow(root)
  } else {
    return convertToFree(root)
  }
}

/**
 * 检查节点是否包含自由布局特有的样式
 */
export function hasFreeLayoutStyles(node: NodeSchema): boolean {
  if (!node.style) return false
  return (
    node.style.position === 'absolute' ||
    node.style.left !== undefined ||
    node.style.top !== undefined
  )
}

/**
 * 检测当前树的布局模式（基于第一层子节点）
 */
export function detectLayoutMode(root: NodeSchema): LayoutMode {
  if (!root.children || root.children.length === 0) {
    return 'flow' // 默认流式
  }

  // 检查第一个子节点
  const firstChild = root.children[0]
  return hasFreeLayoutStyles(firstChild) ? 'free' : 'flow'
}
