/**
 * Table 表格组件属性配置
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
    key: 'headerFontSize',
    label: '表头字体大小(px)',
    type: 'number',
    min: 10,
    max: 24,
    step: 1,
    default: 14,
  },
  {
    key: 'headerHeight',
    label: '表头高度(px)',
    type: 'number',
    min: 30,
    max: 100,
    step: 1,
    default: 40,
  },
  {
    key: 'cellColor',
    label: '单元格文字颜色',
    type: 'color',
    default: '#606266',
  },
  {
    key: 'cellFontSize',
    label: '单元格字体大小(px)',
    type: 'number',
    min: 10,
    max: 24,
    step: 1,
    default: 13,
  },
  {
    key: 'rowHeight',
    label: '行高(px)',
    type: 'number',
    min: 30,
    max: 100,
    step: 1,
    default: 48,
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#ebeef5',
  },
  {
    key: 'hoverBackgroundColor',
    label: '悬停背景色',
    type: 'color',
    default: '#f5f7fa',
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
    placeholder: 'http://localhost:3001/api/table-data',
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
    key: 'columns',
    label: '列配置(JSON)',
    type: 'text',
    placeholder: '[{"prop":"name","label":"姓名","width":120}]',
    default: '',
  },
  {
    key: 'data',
    label: '表格数据(JSON)',
    type: 'text',
    placeholder: '[{"name":"张三","age":28}]',
    default: '',
  },
  {
    key: 'showHeader',
    label: '显示表头',
    type: 'switch',
    default: true,
  },
  {
    key: 'stripe',
    label: '斑马纹',
    type: 'switch',
    default: false,
  },
  {
    key: 'border',
    label: '显示边框',
    type: 'switch',
    default: true,
  },
  {
    key: 'size',
    label: '表格尺寸',
    type: 'select',
    options: [
      { label: '大', value: 'large' },
      { label: '默认', value: 'default' },
      { label: '小', value: 'small' },
    ],
    default: 'default',
  },
  {
    key: 'emptyText',
    label: '空数据文本',
    type: 'text',
    placeholder: '暂无数据',
    default: '暂无数据',
  },
  {
    key: 'height',
    label: '固定高度',
    type: 'text',
    placeholder: 'auto 或 300',
    default: 'auto',
  },
  {
    key: 'maxHeight',
    label: '最大高度',
    type: 'text',
    placeholder: '留空或数字',
    default: '',
  },
]

registerSchema({
  types: ['table'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
