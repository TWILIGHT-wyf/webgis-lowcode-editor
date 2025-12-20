/**
 * Grid 网格布局组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'gridTemplateColumns',
    label: '列模板',
    type: 'text',
    default: 'repeat(3, 1fr)',
    placeholder: 'repeat(3, 1fr)',
  },
  {
    key: 'gridTemplateRows',
    label: '行模板',
    type: 'text',
    default: 'auto',
    placeholder: 'auto',
  },
  {
    key: 'gridGap',
    label: '间距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 2,
    default: 16,
  },
  {
    key: 'gridAutoFlow',
    label: '自动流动',
    type: 'select',
    options: [
      { label: '行', value: 'row' },
      { label: '列', value: 'column' },
      { label: '密集行', value: 'row dense' },
      { label: '密集列', value: 'column dense' },
    ],
    default: 'row',
  },
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
    key: 'border',
    label: '边框',
    type: 'text',
    default: '1px solid #e5e7eb',
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 4,
  },
  {
    key: 'minHeight',
    label: '最小高度(px)',
    type: 'number',
    min: 0,
    max: 1000,
    step: 10,
    default: 200,
  },
  {
    key: 'textColor',
    label: '文本颜色',
    type: 'color',
    default: '#333333',
  },
]

const componentSchema: Field[] = [
  {
    key: 'content',
    label: '占位内容',
    type: 'text',
    placeholder: '请输入内容',
    default: '',
  },
]

registerSchema({
  types: ['grid', 'layout.grid'],
  styleSchema,
  componentSchema,
})
