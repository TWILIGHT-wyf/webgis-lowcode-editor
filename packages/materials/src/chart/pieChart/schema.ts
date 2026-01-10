/**
 * PieChart 饼图组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

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
    placeholder: 'http://localhost:3001/api/chart/pie',
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
    placeholder: '例: data 或 result.items',
    default: '',
  },
  {
    key: 'valuePath',
    label: '数值字段名',
    type: 'text',
    placeholder: '例: value 或 count',
    default: '',
  },
  {
    key: 'labelPath',
    label: '标签字段名',
    type: 'text',
    placeholder: '例: name 或 category',
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
    key: 'titleAlign',
    label: '标题对齐',
    type: 'select',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
    default: 'center',
  },
  {
    key: 'titleSize',
    label: '标题字号',
    type: 'number',
    min: 10,
    max: 36,
    default: 16,
  },
  {
    key: 'titleColor',
    label: '标题颜色',
    type: 'color',
    default: '#333',
  },
  {
    key: 'seriesName',
    label: '系列名称',
    type: 'text',
    default: 'Data',
  },
  {
    key: 'dataInput',
    label: '数据 (逗号分隔)',
    type: 'text',
    placeholder: '335, 310, 234, 135, 148',
    default: '',
  },
  {
    key: 'labelsInput',
    label: '标签 (逗号分隔)',
    type: 'text',
    placeholder: 'Category A, Category B, ...',
    default: '',
  },
  {
    key: 'radius',
    label: '半径',
    type: 'text',
    placeholder: '60%',
    default: '60%',
  },
  {
    key: 'centerX',
    label: '中心 X',
    type: 'text',
    placeholder: '50%',
    default: '50%',
  },
  {
    key: 'centerY',
    label: '中心 Y',
    type: 'text',
    placeholder: '50%',
    default: '50%',
  },
  {
    key: 'showLabel',
    label: '显示标签',
    type: 'switch',
    default: true,
  },
  {
    key: 'labelFormatter',
    label: '标签格式',
    type: 'text',
    placeholder: '{b}: {c}',
    default: '{b}: {c}',
  },
  {
    key: 'showLegend',
    label: '显示图例',
    type: 'switch',
    default: true,
  },
  {
    key: 'legendOrient',
    label: '图例方向',
    type: 'select',
    options: [
      { label: '水平', value: 'horizontal' },
      { label: '垂直', value: 'vertical' },
    ],
    default: 'horizontal',
  },
  {
    key: 'legendLeft',
    label: '图例水平位置',
    type: 'text',
    default: 'center',
  },
  {
    key: 'legendTop',
    label: '图例垂直位置',
    type: 'text',
    default: 'bottom',
  },
]

registerSchema({
  types: ['pieChart'],
  dataSourceSchema,
  componentSchema,
})
