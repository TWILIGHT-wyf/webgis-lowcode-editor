/**
 * Markdown 组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#ffffff',
  },
  {
    key: 'textColor',
    label: '文本颜色',
    type: 'color',
    default: '#333333',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 14,
  },
  {
    key: 'lineHeight',
    label: '行高',
    type: 'number',
    min: 1,
    max: 3,
    step: 0.1,
    default: 1.6,
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 0,
  },
  {
    key: 'border',
    label: '边框',
    type: 'text',
    default: 'none',
  },
  {
    key: 'fontFamily',
    label: '字体',
    type: 'text',
    default: 'inherit',
  },
]

const componentSchema: Field[] = [
  {
    key: 'content',
    label: 'Markdown内容',
    type: 'text',
    placeholder: '# 标题\n\n请输入Markdown文本...',
    default: '# Markdown 内容\n\n请输入 Markdown 文本...',
  },
]

registerSchema({
  types: ['markdown'],
  styleSchema,
  componentSchema,
})
