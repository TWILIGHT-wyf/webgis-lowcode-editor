import type { Component } from 'vue'

/**
 * 使用 Vite 的 import.meta.glob 自动导入所有组件
 * 匹配规则：所有子目录下的 .vue 文件（排除工具文件）
 */
const modules = import.meta.glob<{ default: Component }>(
  [
    './*/**/*.vue', // 匹配所有子目录下的 .vue 文件
    '!./**/components/**', // 排除嵌套的 components 目录
  ],
  { eager: true },
)

/**
 * 从文件路径提取组件名称
 * 例如：'./chart/lineChart/lineChart.vue' -> 'lineChart'
 *       './kpi/text/Text.vue' -> 'Text'
 *       './group/Group.vue' -> 'Group'
 */
function extractComponentName(path: string): string {
  const match = path.match(/\/([^/]+)\.vue$/)
  return match ? match[1] ?? '' : ''
}

/**
 * 组件注册表 - 自动从文件系统构建
 * 新增组件只需在对应目录创建 .vue 文件，无需手动注册
 */
export const componentRegistry: Record<string, Component> = {}

// 自动注册所有组件
for (const path in modules) {
  const mod = modules[path]
  const componentName = extractComponentName(path)
  if (componentName && mod && mod.default) {
    componentRegistry[componentName] = mod.default
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
