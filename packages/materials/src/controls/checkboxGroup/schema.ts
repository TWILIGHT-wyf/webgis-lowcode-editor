/**
 * CheckboxGroup 复选框组组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

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
    key: 'direction',
    label: '布局方向',
    type: 'select',
    options: [
      { label: '水平', value: 'horizontal' },
      { label: '垂直', value: 'vertical' },
    ],
    default: 'horizontal',
  },
  {
    key: 'gap',
    label: '间距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 12,
  },
  {
    key: 'checkedColor',
    label: '选中颜色',
    type: 'color',
    default: '#409eff',
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#dcdfe6',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#606266',
  },
]

const componentSchema: Field[] = [
  {
    key: 'options',
    label: '选项数据(JSON/逗号分隔)',
    type: 'text',
    placeholder: '[{"label":"选项1","value":"1"}] 或 选项1,选项2,选项3',
    default: '',
  },
  {
    key: 'defaultValue',
    label: '默认选中值(逗号分隔)',
    type: 'text',
    placeholder: '1,2,3',
    default: '',
  },
  {
    key: 'min',
    label: '最少选中数',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  {
    key: 'max',
    label: '最多选中数',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  {
    key: 'disabled',
    label: '禁用',
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
  types: ['checkboxGroup'],
  styleSchema,
  componentSchema,
})
