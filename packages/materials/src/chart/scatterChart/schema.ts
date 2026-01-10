/**
 * ScatterChart 散点图组件属性配置
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
    placeholder: 'http://localhost:3001/api/chart/scatter',
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
    placeholder: '例: data 或 result.points',
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
    label: '数据 (JSON二维数组)',
    type: 'text',
    placeholder: '[[10, 8.04], [8.07, 6.95], ...]',
    default: '',
  },
  {
    key: 'symbolSize',
    label: '点大小',
    type: 'number',
    min: 1,
    max: 50,
    default: 10,
  },
  {
    key: 'color',
    label: '点颜色',
    type: 'color',
    default: '#5470c6',
  },
  {
    key: 'opacity',
    label: '透明度',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.1,
    default: 0.8,
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
    key: 'showXAxisSplitLine',
    label: '显示 X 轴分隔线',
    type: 'switch',
    default: true,
  },
  {
    key: 'showYAxisSplitLine',
    label: '显示 Y 轴分隔线',
    type: 'switch',
    default: true,
  },
  {
    key: 'gridLeft',
    label: '网格左边距',
    type: 'text',
    default: '10%',
  },
  {
    key: 'gridRight',
    label: '网格右边距',
    type: 'text',
    default: '10%',
  },
  {
    key: 'gridTop',
    label: '网格上边距',
    type: 'text',
    default: '15%',
  },
  {
    key: 'gridBottom',
    label: '网格下边距',
    type: 'text',
    default: '15%',
  },
  {
    key: 'showLegend',
    label: '显示图例',
    type: 'switch',
    default: true,
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
  types: ['scatterChart'],
  dataSourceSchema,
  componentSchema,
})
