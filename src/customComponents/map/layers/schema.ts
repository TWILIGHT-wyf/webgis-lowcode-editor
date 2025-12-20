/**
 * Layers 图层控制组件属性配置
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
    label: '控件标题',
    type: 'text',
    default: '图层控制',
  },
  {
    key: 'showOpacity',
    label: '显示透明度控制',
    type: 'switch',
    default: true,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    default: '配置图层列表以显示',
  },
]

registerSchema({
  types: ['layers'],
  styleSchema,
  componentSchema,
})
