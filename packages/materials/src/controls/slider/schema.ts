/**
 * Slider 滑块组件属性配置
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
    key: 'activeColor',
    label: '激活颜色',
    type: 'color',
    default: '#409eff',
  },
  {
    key: 'inactiveColor',
    label: '未激活颜色',
    type: 'color',
    default: '#e4e7ed',
  },
  {
    key: 'buttonSize',
    label: '滑块大小(px)',
    type: 'number',
    min: 12,
    max: 40,
    step: 1,
    default: 20,
  },
  {
    key: 'valueFontSize',
    label: '数值字体大小(px)',
    type: 'number',
    min: 10,
    max: 24,
    step: 1,
    default: 14,
  },
  {
    key: 'valueColor',
    label: '数值颜色',
    type: 'color',
    default: '#606266',
  },
  {
    key: 'valueAlign',
    label: '数值对齐',
    type: 'select',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
    default: 'center',
  },
]

const componentSchema: Field[] = [
  {
    key: 'min',
    label: '最小值',
    type: 'number',
    min: -1000,
    max: 1000,
    step: 1,
    default: 0,
  },
  {
    key: 'max',
    label: '最大值',
    type: 'number',
    min: 0,
    max: 10000,
    step: 1,
    default: 100,
  },
  {
    key: 'step',
    label: '步长',
    type: 'number',
    min: 1,
    max: 100,
    step: 1,
    default: 1,
  },
  {
    key: 'defaultValue',
    label: '默认值',
    type: 'number',
    min: 0,
    max: 10000,
    step: 1,
    default: 0,
  },
  {
    key: 'showInput',
    label: '显示输入框',
    type: 'switch',
    default: false,
  },
  {
    key: 'showInputControls',
    label: '显示输入框控制按钮',
    type: 'switch',
    default: true,
  },
  {
    key: 'showStops',
    label: '显示间断点',
    type: 'switch',
    default: false,
  },
  {
    key: 'showTooltip',
    label: '显示提示',
    type: 'switch',
    default: true,
  },
  {
    key: 'range',
    label: '范围选择',
    type: 'switch',
    default: false,
  },
  {
    key: 'vertical',
    label: '垂直模式',
    type: 'switch',
    default: false,
  },
  {
    key: 'height',
    label: '垂直模式高度',
    type: 'text',
    placeholder: '200px',
    default: '200px',
  },
]

registerSchema({
  types: ['slider'],
  styleSchema,
  componentSchema,
})
