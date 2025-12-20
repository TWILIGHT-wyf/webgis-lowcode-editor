/**
 * Pivot 透视表组件属性配置
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
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    default: 4,
  },
  {
    key: 'headerBackgroundColor',
    label: '表头背景色',
    type: 'color',
    default: '#f5f7fa',
  },
  {
    key: 'headerColor',
    label: '表头文字颜色',
    type: 'color',
    default: '#909399',
  },
  {
    key: 'cellColor',
    label: '单元格文字颜色',
    type: 'color',
    default: '#606266',
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#ebeef5',
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
    placeholder: 'http://localhost:3001/api/pivot-data',
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
    placeholder: '例: data 或 result.list',
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
    key: 'data',
    label: '数据(JSON)',
    type: 'text',
    placeholder: '[{"category":"分类","value":100}]',
    default: '',
  },
  {
    key: 'rowField',
    label: '行字段',
    type: 'text',
    placeholder: 'category',
    default: '',
  },
  {
    key: 'columnField',
    label: '列字段',
    type: 'text',
    placeholder: 'type',
    default: '',
  },
  {
    key: 'valueField',
    label: '值字段',
    type: 'text',
    placeholder: 'value',
    default: '',
  },
  {
    key: 'aggregation',
    label: '聚合方式',
    type: 'select',
    options: [
      { label: '求和', value: 'sum' },
      { label: '平均', value: 'avg' },
      { label: '计数', value: 'count' },
      { label: '最大', value: 'max' },
      { label: '最小', value: 'min' },
    ],
    default: 'sum',
  },
  {
    key: 'emptyText',
    label: '空数据文本',
    type: 'text',
    placeholder: '暂无数据',
    default: '暂无数据',
  },
]

registerSchema({
  types: ['pivot'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
