/**
 * FunnelChart 漏斗图组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

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
    placeholder: 'http://localhost:3001/api/chart/funnel',
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
    placeholder: '例: data 或 result',
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
    key: 'title',
    label: '图表标题',
    type: 'text',
    default: '',
  },
  {
    key: 'dataInput',
    label: '数据 (逗号分隔)',
    type: 'text',
    placeholder: '100,80,60,40,20',
    default: '',
  },
  {
    key: 'labelsInput',
    label: '标签 (逗号分隔)',
    type: 'text',
    placeholder: '展示,访问,咨询,订单,成交',
    default: '',
  },
  {
    key: 'seriesName',
    label: '系列名称',
    type: 'text',
    default: 'Funnel',
  },
  {
    key: 'left',
    label: '左边距',
    type: 'text',
    default: '10%',
  },
  {
    key: 'top',
    label: '上边距',
    type: 'text',
    default: '20%',
  },
  {
    key: 'bottom',
    label: '下边距',
    type: 'text',
    default: '20%',
  },
  {
    key: 'width',
    label: '宽度',
    type: 'text',
    default: '80%',
  },
  {
    key: 'min',
    label: '最小值',
    type: 'number',
    default: 0,
  },
  {
    key: 'max',
    label: '最大值',
    type: 'number',
    default: 100,
  },
  {
    key: 'minSize',
    label: '最小尺寸',
    type: 'text',
    default: '0%',
  },
  {
    key: 'maxSize',
    label: '最大尺寸',
    type: 'text',
    default: '100%',
  },
  {
    key: 'sort',
    label: '排序方式',
    type: 'select',
    options: [
      { label: '降序', value: 'descending' },
      { label: '升序', value: 'ascending' },
      { label: '无', value: 'none' },
    ],
    default: 'descending',
  },
  {
    key: 'gap',
    label: '间距',
    type: 'number',
    min: 0,
    max: 20,
    default: 2,
  },
  {
    key: 'showLabel',
    label: '显示标签',
    type: 'switch',
    default: true,
  },
  {
    key: 'labelPosition',
    label: '标签位置',
    type: 'select',
    options: [
      { label: '内部', value: 'inside' },
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
    ],
    default: 'inside',
  },
  {
    key: 'showLegend',
    label: '显示图例',
    type: 'switch',
    default: true,
  },
]

registerSchema({
  types: ['funnelChart'],
  dataSourceSchema,
  componentSchema,
})
