import { NodeSchema } from '../types/schema'

/**
 * 深度优先查找节点
 */
export function findNodeById(root: NodeSchema, id: string): NodeSchema | null {
  if (root.id === id) return root
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
  }
  return null
}

/**
 * 遍历树
 */
export function traverse(root: NodeSchema, callback: (node: NodeSchema) => void) {
  callback(root)
  if (root.children) {
    root.children.forEach((child) => traverse(child, callback))
  }
}
