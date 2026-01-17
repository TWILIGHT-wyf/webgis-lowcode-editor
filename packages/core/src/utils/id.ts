/**
 * 生成唯一的组件ID
 * @param componentName 组件名称
 * @returns 唯一ID，格式：{componentName}_{timestamp}_{random}
 */
export function generateId(componentName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `${componentName}_${timestamp}_${random}`
}
