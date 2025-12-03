import { defineAsyncComponent, type Component } from 'vue'

/**
 * 使用 Vite 的 import.meta.glob 自动导入所有组件
 * 匹配规则：所有子目录下的 .vue 文件（排除工具文件）
 * 移除 eager: true 实现懒加载，按需加载组件
 */
const modules = import.meta.glob<{ default: Component }>([
  './*/**/*.vue', // 匹配所有子目录下的 .vue 文件
  '!./**/components/**', // 排除嵌套的 components 目录
])

/**
 * 从文件路径提取组件名称
 * 例如：'./chart/lineChart/lineChart.vue' -> 'lineChart'
 *       './kpi/text/Text.vue' -> 'Text'
 *       './group/Group.vue' -> 'Group'
 */
function extractComponentName(path: string): string {
  const match = path.match(/\/([^/]+)\.vue$/)
  return match ? (match[1] ?? '') : ''
}

/**
 * 组件注册表 - 自动从文件系统构建
 * 使用 defineAsyncComponent 实现异步加载，减小首屏体积
 * 新增组件只需在对应目录创建 .vue 文件，无需手动注册
 */
export const componentRegistry: Record<string, Component> = {}

// 自动注册所有组件（异步加载）
for (const path in modules) {
  const componentName = extractComponentName(path)
  if (componentName) {
    // 使用 defineAsyncComponent 包裹动态导入函数，实现按需加载
    componentRegistry[componentName] = defineAsyncComponent(
      modules[path] as () => Promise<{ default: Component }>,
    )
  }
}

/**
 * 获取组件，如果未找到则返回 'div' 作为兜底
 */
export function getComponent(type: string): Component | string {
  return componentRegistry[type] || 'div'
}

/**
 * 检查组件是否已注册
 */
export function hasComponent(type: string): boolean {
  return type in componentRegistry
}

/**
 * 获取所有已注册的组件名称
 */
export function getRegisteredComponents(): string[] {
  return Object.keys(componentRegistry)
}
