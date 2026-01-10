/**
 * Tabs 标签页组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#ffffff',
  },
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
    key: 'textColor',
    label: '文本颜色',
    type: 'color',
    default: '#333333',
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
    placeholder: 'http://localhost:3001/api/tabs',
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
    label: '数据路径',
    type: 'text',
    placeholder: '例: data 或 result.tabs',
    default: '',
  },
  {
    key: 'labelField',
    label: '标签字段',
    type: 'text',
    placeholder: '默认: label',
    default: 'label',
  },
  {
    key: 'valueField',
    label: '值字段',
    type: 'text',
    placeholder: '默认: value',
    default: 'value',
  },
  {
    key: 'contentField',
    label: '内容字段',
    type: 'text',
    placeholder: '默认: content',
    default: 'content',
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
    key: 'activeTab',
    label: '当前激活标签',
    type: 'text',
    placeholder: 'tab1',
    default: '',
  },
  {
    key: 'type',
    label: '标签页类型',
    type: 'select',
    options: [
      { label: '卡片化', value: 'card' },
      { label: '边框卡片', value: 'border-card' },
      { label: '默认', value: '' },
    ],
    default: 'border-card',
  },
  {
    key: 'tabPosition',
    label: '标签位置',
    type: 'select',
    options: [
      { label: '顶部', value: 'top' },
      { label: '右侧', value: 'right' },
      { label: '底部', value: 'bottom' },
      { label: '左侧', value: 'left' },
    ],
    default: 'top',
  },
  {
    key: 'closable',
    label: '可关闭',
    type: 'switch',
    default: false,
  },
  {
    key: 'addable',
    label: '可增加',
    type: 'switch',
    default: false,
  },
  {
    key: 'tabs',
    label: '标签页数据(JSON)',
    type: 'text',
    placeholder: '[{"label":"Tab 1","name":"tab1","content":"Content 1"}]',
    default: '',
  },
]

registerSchema({
  types: ['tabs', 'layout.tabs'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
