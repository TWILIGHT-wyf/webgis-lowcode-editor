/**
 * StackedBarChart 堆叠柱状图组件属性配置
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
    placeholder: 'http://localhost:3001/api/chart/stacked',
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
    key: 'xAxisPath',
    label: 'X轴标签路径',
    type: 'text',
    placeholder: '例: data.categories',
    default: '',
  },
  {
    key: 'seriesNamesPath',
    label: '系列名称数组路径',
    type: 'text',
    placeholder: '例: data.seriesNames',
    default: '',
  },
  {
    key: 'seriesDataPath',
    label: '系列数据数组路径',
    type: 'text',
    placeholder: '例: data.seriesData (二维数组)',
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
    placeholder: '堆叠柱状图',
    default: '',
  },
  {
    key: 'xAxisInput',
    label: 'X 轴标签 (逗号分隔)',
    type: 'text',
    placeholder: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
    default: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
  },
  {
    key: 'seriesNamesInput',
    label: '系列名称 (逗号分隔)',
    type: 'text',
    placeholder: 'Series 1, Series 2, Series 3',
    default: 'Series 1, Series 2, Series 3',
  },
  {
    key: 'series1Input',
    label: '系列 1 数据 (逗号分隔)',
    type: 'text',
    placeholder: '120, 132, 101, 134, 90, 230, 210',
    default: '120, 132, 101, 134, 90, 230, 210',
  },
  {
    key: 'series2Input',
    label: '系列 2 数据 (逗号分隔)',
    type: 'text',
    placeholder: '220, 182, 191, 234, 290, 330, 310',
    default: '220, 182, 191, 234, 290, 330, 310',
  },
  {
    key: 'series3Input',
    label: '系列 3 数据 (逗号分隔)',
    type: 'text',
    placeholder: '150, 232, 201, 154, 190, 330, 410',
    default: '150, 232, 201, 154, 190, 330, 410',
  },
  {
    key: 'color1',
    label: '系列 1 颜色',
    type: 'color',
    default: '#5470c6',
  },
  {
    key: 'color2',
    label: '系列 2 颜色',
    type: 'color',
    default: '#91cc75',
  },
  {
    key: 'color3',
    label: '系列 3 颜色',
    type: 'color',
    default: '#fac858',
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
    key: 'showGrid',
    label: '显示网格线',
    type: 'switch',
    default: true,
  },
]

registerSchema({
  types: ['stackedBarChart', 'chart.stackedBar'],
  dataSourceSchema,
  componentSchema,
})
