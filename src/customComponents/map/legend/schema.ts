/**
 * Legend 图例组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#ffffff',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#303133',
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#dcdfe6',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 20,
    step: 1,
    default: 14,
  },
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 30,
    step: 1,
    default: 12,
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 10,
    step: 1,
    default: 4,
  },
]

const componentSchema: Field[] = [
  {
    key: 'title',
    label: '图例标题',
    type: 'text',
    default: '图例',
  },
  {
    key: 'symbolShape',
    label: '符号形状',
    type: 'select',
    options: [
      { label: '方形', value: 'square' },
      { label: '圆形', value: 'circle' },
    ],
    default: 'square',
  },
  {
    key: 'symbolWidth',
    label: '符号宽度',
    type: 'number',
    min: 10,
    max: 40,
    step: 1,
    default: 20,
  },
  {
    key: 'symbolHeight',
    label: '符号高度',
    type: 'number',
    min: 10,
    max: 40,
    step: 1,
    default: 20,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    default: '配置图例项以显示',
  },
]

registerSchema({
  types: ['legend'],
  styleSchema,
  componentSchema,
})
