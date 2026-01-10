/**
 * 面包屑组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 32,
    step: 1,
    default: 14,
  },
  {
    key: 'color',
    label: '文字颜色',
    type: 'color',
    default: '#606266',
  },
  {
    key: 'activeColor',
    label: '当前项颜色',
    type: 'color',
    default: '#909399',
  },
  {
    key: 'linkColor',
    label: '链接颜色',
    type: 'color',
    default: '#409eff',
  },
]

const componentSchema: Field[] = [
  {
    key: 'separator',
    label: '分隔符',
    type: 'text',
    placeholder: '/',
    default: '/',
  },
  {
    key: 'items',
    label: '面包屑项(JSON)',
    type: 'text',
    placeholder: '[{"label":"首页","pageId":"home"},{"label":"当前页"}]',
    default: '',
  },
]

registerSchema({
  types: ['breadcrumb'],
  styleSchema,
  componentSchema,
})
