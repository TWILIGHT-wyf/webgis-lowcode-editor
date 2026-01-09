/**
 * Box 占位盒组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#f5f7fa',
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
    key: 'borderWidth',
    label: '边框宽度(px)',
    type: 'number',
    min: 0,
    max: 10,
    step: 1,
    default: 1,
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#dcdfe6',
  },
  {
    key: 'borderStyle',
    label: '边框样式',
    type: 'select',
    options: [
      { label: '实线', value: 'solid' },
      { label: '虚线', value: 'dashed' },
      { label: '点线', value: 'dotted' },
      { label: '双线', value: 'double' },
    ],
    default: 'dashed',
  },
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 20,
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#909399',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 8,
    max: 50,
    step: 1,
    default: 14,
  },
  {
    key: 'textAlign',
    label: '文字对齐',
    type: 'select',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
    default: 'center',
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
    placeholder: 'http://localhost:3001/api/box-content',
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
    placeholder: '例: content 或 data.message',
    default: '',
  },
  {
    key: 'contentPath',
    label: '内容字段路径',
    type: 'text',
    placeholder: '留空则使用dataPath',
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
    key: 'content',
    label: '显示内容',
    type: 'text',
    placeholder: '占位盒内容',
    default: '占位盒内容',
  },
]

registerSchema({
  types: ['box'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
