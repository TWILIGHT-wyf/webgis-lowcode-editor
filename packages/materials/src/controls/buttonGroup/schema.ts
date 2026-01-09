/**
 * ButtonGroup 按钮组组件属性配置
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
]

const componentSchema: Field[] = [
  {
    key: 'buttons',
    label: '按钮配置(JSON)',
    type: 'text',
    placeholder: '[{"label":"按钮1","type":"primary"},{"label":"按钮2","type":"success"}]',
    default: '',
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
  {
    key: 'type',
    label: '按钮类型',
    type: 'select',
    options: [
      { label: '主要', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
      { label: '信息', value: 'info' },
      { label: '默认', value: '' },
    ],
    default: 'primary',
  },
]

registerSchema({
  types: ['buttonGroup'],
  styleSchema,
  componentSchema,
})
