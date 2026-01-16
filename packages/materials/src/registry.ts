import { defineAsyncComponent, type Component } from 'vue'
import type { MaterialMeta } from '@lowcode/core/types'

/**
 * 使用 Vite 的 import.meta.glob 自动导入所有组件实现 (.vue)
 */
const vueModules = import.meta.glob<{ default: Component }>([
  './*/**/*.vue', // 匹配所有子目录下的 .vue 文件
  '!./**/components/**', // 排除嵌套的 components 目录
])

/**
 * 使用 Vite 的 import.meta.glob 自动导入所有组件元数据 (index.ts)
 */
const metaModules = import.meta.glob<{ default: MaterialMeta }>(['./**/index.ts'], {
  eager: true,
})

/**
 * 从文件路径提取组件名称
 * 例如：'./chart/lineChart/lineChart.vue' -> 'LineChart'
 *       './kpi/text/Text.vue' -> 'Text'
 */
function extractComponentName(path: string): string {
  const match = path.match(/\/([^/]+)\.vue$/)
  if (!match) return ''
  const name = match[1]
  // 首字母大写
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * 从元数据路径提取组件名称
 * 例如：'./chart/lineChart/index.ts' -> 'LineChart'
 */
function extractMetaComponentName(path: string): string {
  const match = path.match(/\/([^/]+)\/index\.ts$/)
  if (!match) return ''
  const name = match[1]
  // 首字母大写
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * 组件实现注册表 - componentMap
 * 使用 defineAsyncComponent 实现异步加载
 */
export const componentMap: Record<string, Component> = {}

// 自动注册所有 Vue 组件（异步加载）
for (const path in vueModules) {
  const componentName = extractComponentName(path)
  if (componentName) {
    componentMap[componentName] = defineAsyncComponent(
      vueModules[path] as () => Promise<{ default: Component }>,
    )
  }
}

/**
 * 组件元数据列表 - materialList
 * 从所有 index.ts 中提取 MaterialMeta
 */
export const materialList: MaterialMeta[] = []

for (const path in metaModules) {
  const meta = metaModules[path]?.default
  if (meta && meta.componentName) {
    materialList.push(meta)
  }
}

/**
 * 获取组件实现，如果未找到则返回 'div' 作为兜底
 */
export function getComponent(name: string): Component | string {
  return componentMap[name] || 'div'
}

/**
 * 检查组件是否已注册
 */
export function hasComponent(name: string): boolean {
  return name in componentMap
}

/**
 * 获取所有已注册的组件名称
 */
export function getRegisteredComponents(): string[] {
  return Object.keys(componentMap)
}

/**
 * 根据 category 分组获取物料列表
 */
export function getMaterialsByCategory(): Record<string, MaterialMeta[]> {
  const grouped: Record<string, MaterialMeta[]> = {}
  materialList.forEach((meta) => {
    const category = meta.category || '其他'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(meta)
  })
  return grouped
}

/**
 * 从 MaterialMeta 的 props 中提取默认值
 */
export function extractDefaultProps(props: MaterialMeta['props']): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const key in props) {
    const prop = props[key]
    if (prop && 'defaultValue' in prop) {
      defaults[key] = prop.defaultValue
    }
  }
  return defaults
}

// 保持向后兼容
export const componentRegistry = componentMap
