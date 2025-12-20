/**
 * Progress 进度条组件属性配置
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
    default: 0,
  },
  {
    key: 'strokeWidth',
    label: '进度条高度/宽度(px)',
    type: 'number',
    min: 6,
    max: 50,
    step: 1,
    default: 20,
  },
  {
    key: 'trackColor',
    label: '轨道颜色',
    type: 'color',
    default: '#e4e7ed',
  },
  {
    key: 'barColor',
    label: '进度条颜色',
    type: 'color',
    default: '#409eff',
  },
  {
    key: 'successColor',
    label: '成功状态颜色',
    type: 'color',
    default: '#67c23a',
  },
  {
    key: 'warningColor',
    label: '警告状态颜色',
    type: 'color',
    default: '#e6a23c',
  },
  {
    key: 'exceptionColor',
    label: '异常状态颜色',
    type: 'color',
    default: '#f56c6c',
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 10,
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#606266',
  },
  {
    key: 'textInsideColor',
    label: '内部文字颜色',
    type: 'color',
    default: '#fff',
  },
  {
    key: 'textFontSize',
    label: '文字大小(px)',
    type: 'number',
    min: 8,
    max: 50,
    step: 1,
    default: 14,
  },
  {
    key: 'textFontWeight',
    label: '文字字重',
    type: 'select',
    options: [
      { label: '常规', value: 'normal' },
      { label: '加粗', value: 'bold' },
    ],
    default: 'normal',
  },
]

const dataSourceSchema: Field[] = [
  {
    key: 'enabled',
    label: '启用数据源',
    type: 'switch',
    default: false,
  },
  {
    key: 'url',
    label: 'API 地址',
    type: 'text',
    placeholder: 'http://localhost:3001/api/kpi',
    default: '',
  },
  {
    key: 'method',
    label: '请求方法',
    type: 'select',
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' },
    ],
    default: 'GET',
  },
  {
    key: 'interval',
    label: '自动刷新(秒)',
    type: 'number',
    min: 0,
    max: 3600,
    step: 1,
    default: 0,
  },
  {
    key: 'dataPath',
    label: '数据根路径',
    type: 'text',
    placeholder: '例: data',
    default: '',
  },
  {
    key: 'valuePath',
    label: '数值路径',
    type: 'text',
    placeholder: '例: data.value 或 value',
    default: '',
  },
  {
    key: 'headers',
    label: '请求头(JSON)',
    type: 'text',
    placeholder: '{"Authorization": "Bearer token"}',
    default: '',
  },
]

const componentSchema: Field[] = [
  {
    key: 'value',
    label: '进度值(0-100)',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 50,
  },
  {
    key: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '水平', value: 'line' },
      { label: '垂直', value: 'vertical' },
    ],
    default: 'line',
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '默认', value: '' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '异常', value: 'exception' },
    ],
    default: '',
  },
  {
    key: 'showText',
    label: '显示文字',
    type: 'switch',
    default: true,
  },
  {
    key: 'textPosition',
    label: '文字位置',
    type: 'select',
    options: [
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
      { label: '内部', value: 'inside' },
    ],
    default: 'right',
  },
  {
    key: 'textFormat',
    label: '文字格式',
    type: 'text',
    placeholder: '{value}%',
    default: '{value}%',
  },
  {
    key: 'showStripe',
    label: '显示条纹',
    type: 'switch',
    default: false,
  },
  {
    key: 'animateStripe',
    label: '条纹动画',
    type: 'switch',
    default: false,
  },
]

registerSchema({
  types: ['progress'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
