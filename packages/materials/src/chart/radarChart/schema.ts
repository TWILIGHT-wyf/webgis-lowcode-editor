/**
 * RadarChart 雷达图组件属性配置
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
    placeholder: 'http://localhost:3001/api/chart/radar',
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
    key: 'indicatorNamesInput',
    label: '指标名称 (逗号分隔)',
    type: 'text',
    placeholder: '销售,管理,技术,客服,研发,市场',
    default: '',
  },
  {
    key: 'indicatorMaxsInput',
    label: '指标最大值 (逗号分隔)',
    type: 'text',
    placeholder: '100,100,100,100,100,100',
    default: '',
  },
  {
    key: 'seriesName',
    label: '系列名称',
    type: 'text',
    default: 'Radar',
  },
  {
    key: 'radarShape',
    label: '雷达图形状',
    type: 'select',
    options: [
      { label: '多边形', value: 'polygon' },
      { label: '圆形', value: 'circle' },
    ],
    default: 'polygon',
  },
  {
    key: 'splitNumber',
    label: '分割段数',
    type: 'number',
    min: 1,
    max: 10,
    default: 5,
  },
  {
    key: 'axisNameColor',
    label: '坐标轴名称颜色',
    type: 'color',
    default: '#333',
  },
  {
    key: 'showArea',
    label: '显示区域填充',
    type: 'switch',
    default: true,
  },
  {
    key: 'areaOpacity',
    label: '区域透明度',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.1,
    default: 0.3,
  },
]

registerSchema({
  types: ['radarChart'],
  dataSourceSchema,
  componentSchema,
})
