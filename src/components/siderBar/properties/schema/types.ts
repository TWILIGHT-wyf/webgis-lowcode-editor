/**
 * 属性配置类型定义
 * 用于组件属性配置的通用类型
 */

export type Primitive = string | number | boolean | null | undefined

export type TextField = {
  key: string
  label: string
  type: 'text'
  placeholder?: string
  default?: Primitive
}

export type NumberField = {
  key: string
  label: string
  type: 'number'
  min?: number
  max?: number
  step?: number
  default?: number
}

export type ColorField = {
  key: string
  label: string
  type: 'color'
  default?: string
}

export type SwitchField = {
  key: string
  label: string
  type: 'switch'
  default?: boolean
}

export type SelectField = {
  key: string
  label: string
  type: 'select'
  options: { label: string; value: Primitive }[]
  default?: Primitive
}

export type Field = TextField | NumberField | ColorField | SwitchField | SelectField

/**
 * 组件属性 Schema 定义
 */
export interface ComponentSchema {
  /** 组件类型标识，支持多个别名 */
  types: string[]
  /** 样式属性配置 */
  styleSchema?: Field[]
  /** 数据源属性配置 */
  dataSourceSchema?: Field[]
  /** 组件特有属性配置 */
  componentSchema?: Field[]
}

/**
 * Schema 注册表
 * 将组件类型映射到对应的 schema
 */
const schemaRegistry = new Map<string, ComponentSchema>()

/**
 * 注册组件 schema
 */
export function registerSchema(schema: ComponentSchema): void {
  for (const type of schema.types) {
    schemaRegistry.set(type, schema)
  }
}

/**
 * 获取组件 schema
 */
export function getSchema(type: string): ComponentSchema | undefined {
  return schemaRegistry.get(type)
}

/**
 * 获取所有已注册的 schema
 */
export function getAllSchemas(): Map<string, ComponentSchema> {
  return schemaRegistry
}

/**
 * 通用样式字段 - 可被各组件复用
 */
export const commonStyleFields = {
  opacity: {
    key: 'opacity',
    label: '透明度(%)',
    type: 'number' as const,
    min: 0,
    max: 100,
    step: 1,
    default: 100,
  },
  visible: {
    key: 'visible',
    label: '可见',
    type: 'switch' as const,
    default: true,
  },
  locked: {
    key: 'locked',
    label: '锁定',
    type: 'switch' as const,
    default: false,
  },
  backgroundColor: {
    key: 'backgroundColor',
    label: '背景色',
    type: 'color' as const,
    default: 'transparent',
  },
  borderRadius: {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number' as const,
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  borderWidth: {
    key: 'borderWidth',
    label: '边框宽度(px)',
    type: 'number' as const,
    min: 0,
    max: 20,
    step: 1,
    default: 0,
  },
  borderColor: {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color' as const,
    default: '#000000',
  },
  borderStyle: {
    key: 'borderStyle',
    label: '边框样式',
    type: 'select' as const,
    options: [
      { label: '实线', value: 'solid' },
      { label: '虚线', value: 'dashed' },
      { label: '点线', value: 'dotted' },
      { label: '双线', value: 'double' },
    ],
    default: 'solid',
  },
  padding: {
    key: 'padding',
    label: '内边距(px)',
    type: 'number' as const,
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  boxShadow: {
    key: 'boxShadow',
    label: '阴影',
    type: 'text' as const,
    placeholder: '0 2px 8px rgba(0,0,0,0.15)',
    default: '',
  },
}

/**
 * 通用数据源字段
 */
export const commonDataSourceFields = {
  enabled: {
    key: 'enabled',
    label: '启用数据源',
    type: 'switch' as const,
    default: false,
  },
  url: {
    key: 'url',
    label: '请求地址',
    type: 'text' as const,
    placeholder: 'https://api.example.com/data',
    default: '',
  },
  method: {
    key: 'method',
    label: '请求方法',
    type: 'select' as const,
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' },
      { label: 'PUT', value: 'PUT' },
      { label: 'DELETE', value: 'DELETE' },
    ],
    default: 'GET',
  },
  interval: {
    key: 'interval',
    label: '刷新间隔(ms)',
    type: 'number' as const,
    min: 0,
    max: 3600000,
    step: 1000,
    default: 0,
  },
  dataPath: {
    key: 'dataPath',
    label: '数据路径',
    type: 'text' as const,
    placeholder: 'data.items',
    default: '',
  },
}
