/**
 * SankeyChart 桑基图组件属性配置
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
    placeholder: 'http://localhost:3001/api/chart/sankey',
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
    key: 'nodesPath',
    label: '节点数据路径',
    type: 'text',
    placeholder: '例: data.nodes',
    default: '',
  },
  {
    key: 'linksPath',
    label: '连接数据路径',
    type: 'text',
    placeholder: '例: data.links',
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
    key: 'nodesInput',
    label: '节点数据 (JSON)',
    type: 'text',
    placeholder: '[{"name":"A"},{"name":"B"}]',
    default: '',
  },
  {
    key: 'linksInput',
    label: '连接数据 (JSON)',
    type: 'text',
    placeholder: '[{"source":"A","target":"B","value":10}]',
    default: '',
  },
  {
    key: 'left',
    label: '左边距',
    type: 'text',
    default: '5%',
  },
  {
    key: 'top',
    label: '上边距',
    type: 'text',
    default: '10%',
  },
  {
    key: 'right',
    label: '右边距',
    type: 'text',
    default: '10%',
  },
  {
    key: 'bottom',
    label: '下边距',
    type: 'text',
    default: '10%',
  },
  {
    key: 'nodeWidth',
    label: '节点宽度',
    type: 'number',
    min: 5,
    max: 50,
    default: 20,
  },
  {
    key: 'nodeGap',
    label: '节点间距',
    type: 'number',
    min: 0,
    max: 50,
    default: 8,
  },
  {
    key: 'nodeAlign',
    label: '节点对齐',
    type: 'select',
    options: [
      { label: '两端对齐', value: 'justify' },
      { label: '左对齐', value: 'left' },
      { label: '右对齐', value: 'right' },
    ],
    default: 'justify',
  },
  {
    key: 'orient',
    label: '方向',
    type: 'select',
    options: [
      { label: '水平', value: 'horizontal' },
      { label: '垂直', value: 'vertical' },
    ],
    default: 'horizontal',
  },
  {
    key: 'draggable',
    label: '节点可拖拽',
    type: 'switch',
    default: true,
  },
  {
    key: 'lineOpacity',
    label: '连线透明度',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.1,
    default: 0.5,
  },
]

registerSchema({
  types: ['sankeyChart'],
  dataSourceSchema,
  componentSchema,
})
