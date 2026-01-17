/**
 * [REFACTORED - 2026-01-11]
 * ============================================================
 * 旧的 schema.ts 自动加载逻辑已废弃。
 *
 * 原因：
 * - 在 Monorepo 重构中，所有组件从 @/customComponents 迁移到 @vela/materials
 * - 配置文件从 schema.ts 重构为 meta.ts（包含 PropConfig 结构）
 * - 旧的导入路径 '@vela/materials/xxx/schema.ts' 已不存在
 *
 * 新架构：
 * - 属性面板应直接读取 materialList 中的 MaterialMeta.props
 * - 使用 componentMap 获取组件实例
 * - PropConfig 定义了属性的类型、默认值、编辑器配置
 *
 * 迁移指南：
 * 1. 导入：import { materialList } from '@vela/materials'
 * 2. 查找：const meta = materialList.find(m => m.componentName === 'YourComponent')
 * 3. 读取：meta.props 包含所有属性配置
 * ============================================================
 */

// 保留类型导出，防止其他文件引用报错
export * from './types'

import { materialList } from '@vela/materials'
import { registerSchema } from './types'
import type { Field } from './types'

/**
 * 从 MaterialMeta 的 PropConfig 转换为 Schema Field
 * 这是一个临时的适配层，用于兼容旧的属性面板系统
 */
function convertPropsToFields(props: Record<string, any>): Field[] {
  const fields: Field[] = []

  for (const [key, config] of Object.entries(props)) {
    // 跳过非编辑器配置
    if (!config || typeof config !== 'object') continue

    const field: any = {
      key,
      label: config.label || key,
    }

    // 根据 PropConfig 的类型转换
    const editorType = config.editor?.type || config.type

    switch (editorType) {
      case 'input':
      case 'textarea':
        field.type = 'text'
        field.placeholder = config.editor?.placeholder
        break
      case 'number':
      case 'input-number':
        field.type = 'number'
        field.min = config.editor?.min
        field.max = config.editor?.max
        field.step = config.editor?.step
        break
      case 'color':
      case 'color-picker':
        field.type = 'color'
        break
      case 'switch':
        field.type = 'switch'
        break
      case 'select':
        field.type = 'select'
        field.options = config.editor?.options || []
        break
      default:
        // 默认作为文本输入
        field.type = 'text'
    }

    field.default = config.defaultValue
    fields.push(field)
  }

  return fields
}

/**
 * 自动注册所有 material 组件的 schema
 * 从 @vela/materials 的 materialList 生成兼容的 schema
 */
function autoRegisterSchemas() {
  console.log('[Schema Registry] 开始自动注册组件配置...')

  for (const meta of materialList) {
    try {
      // 将 props 转换为 field 数组
      const componentFields = meta.props ? convertPropsToFields(meta.props) : []

      // 注册 schema（使用 componentName 作为类型标识）
      registerSchema({
        types: [meta.componentName],
        componentSchema: componentFields,
        // 样式和数据源配置暂时为空，可以后续扩展
        styleSchema: [],
        dataSourceSchema: [],
      })

      console.log(`[Schema Registry] ✓ ${meta.componentName} (${meta.label})`)
    } catch (error) {
      console.error(`[Schema Registry] ✗ 注册 ${meta.componentName} 失败:`, error)
    }
  }

  console.log(`[Schema Registry] 完成！共注册 ${materialList.length} 个组件`)
}

// 立即执行自动注册
autoRegisterSchemas()

// 空的注册表，作为过渡期兼容
export const schemaRegistry = {} as Record<string, any>

/**
 * 获取组件的属性配置（新架构适配）
 * @deprecated 使用 materialList 直接获取 meta.props
 */
export function getPropertySchema(componentName: string) {
  console.warn(
    `[Deprecated] getPropertySchema('${componentName}') 已废弃，请使用 materialList 获取 meta.props`,
  )
  return null
}
