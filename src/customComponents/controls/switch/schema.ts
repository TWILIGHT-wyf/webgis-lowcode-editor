/**
 * Switch 开关组件属性配置
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
    default: 'transparent',
  },
  {
    key: 'activeColor',
    label: '开启颜色',
    type: 'color',
    default: '#409eff',
  },
  {
    key: 'inactiveColor',
    label: '关闭颜色',
    type: 'color',
    default: '#dcdfe6',
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#dcdfe6',
  },
]

const componentSchema: Field[] = [
  {
    key: 'defaultValue',
    label: '默认值',
    type: 'switch',
    default: false,
  },
  {
    key: 'activeText',
    label: '开启时文字',
    type: 'text',
    placeholder: '',
    default: '',
  },
  {
    key: 'inactiveText',
    label: '关闭时文字',
    type: 'text',
    placeholder: '',
    default: '',
  },
  {
    key: 'width',
    label: '宽度(px)',
    type: 'number',
    min: 30,
    max: 200,
    step: 1,
    default: 40,
  },
  {
    key: 'inlinePrompt',
    label: '文字内嵌',
    type: 'switch',
    default: false,
  },
  {
    key: 'disabled',
    label: '禁用',
    type: 'switch',
    default: false,
  },
  {
    key: 'loading',
    label: '加载中',
    type: 'switch',
    default: false,
  },
  {
    key: 'size',
    label: '尺寸',
    type: 'select',
    options: [
      { label: '大', value: 'large' },
      { label: '默认', value: 'default' },
      { label: '小', value: 'small' },
    ],
    default: 'default',
  },
]

registerSchema({
  types: ['switch'],
  styleSchema,
  componentSchema,
})
