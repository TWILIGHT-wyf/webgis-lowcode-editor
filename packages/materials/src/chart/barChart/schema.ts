/**
 * BarChart 柱状图组件属性配置
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
    placeholder: 'http://localhost:3001/api/chart/nested',
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
    label: '数据值路径',
    type: 'text',
    placeholder: '例: data.chart.values 或 readings.temperatures',
    default: '',
  },
  {
    key: 'xAxisPath',
    label: 'X轴标签路径',
    type: 'text',
    placeholder: '例: data.chart.categories 或 readings.timestamps',
    default: '',
  },
  {
    key: 'seriesNamePath',
    label: '系列名称路径',
    type: 'text',
    placeholder: '例: data.seriesName (可选)',
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
    placeholder: '柱状图',
    default: '',
  },
  {
    key: 'seriesName',
    label: '系列名称',
    type: 'text',
    default: 'Series',
  },
  {
    key: 'dataInput',
    label: '数据 (逗号分隔)',
    type: 'text',
    placeholder: '120, 200, 150, 180, 270, 210, 220',
    default: '120, 200, 150, 180, 270, 210, 220',
  },
  {
    key: 'xAxisInput',
    label: 'X 轴标签 (逗号分隔)',
    type: 'text',
    placeholder: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
    default: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
  },
  {
    key: 'barColor',
    label: '柱子颜色',
    type: 'color',
    default: '#5470c6',
  },
  {
    key: 'barWidth',
    label: '柱子宽度',
    type: 'text',
    default: '60%',
  },
  {
    key: 'borderRadius',
    label: '圆角半径',
    type: 'number',
    min: 0,
    max: 20,
    default: 0,
  },
  {
    key: 'showLabel',
    label: '显示数值标签',
    type: 'switch',
    default: false,
  },
  {
    key: 'showLegend',
    label: '显示图例',
    type: 'switch',
    default: true,
  },
  {
    key: 'showTooltip',
    label: '显示提示框',
    type: 'switch',
    default: true,
  },
  {
    key: 'xAxisName',
    label: 'X 轴名称',
    type: 'text',
    default: '',
  },
  {
    key: 'yAxisName',
    label: 'Y 轴名称',
    type: 'text',
    default: '',
  },
  {
    key: 'showGrid',
    label: '显示网格线',
    type: 'switch',
    default: true,
  },
]

registerSchema({
  types: ['barChart', 'chart.bar', 'areaChart'],
  dataSourceSchema,
  componentSchema,
})
