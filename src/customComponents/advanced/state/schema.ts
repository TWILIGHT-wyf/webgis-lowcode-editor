/**
 * State 状态组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 16,
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#2d2d2d',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#cccccc',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 14,
  },
  {
    key: 'lineHeight',
    label: '行高',
    type: 'number',
    min: 1,
    max: 3,
    step: 0.1,
    default: 1.6,
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
    key: 'border',
    label: '边框',
    type: 'text',
    default: '1px solid #3c3c3c',
  },
  {
    key: 'fontFamily',
    label: '字体',
    type: 'text',
    default: 'Consolas, Monaco, "Courier New", monospace',
  },
]

const componentSchema: Field[] = [
  {
    key: 'state',
    label: '状态数据(JSON)',
    type: 'text',
    placeholder: '{"key": "value"}',
    default: JSON.stringify(
      {
        count: 0,
        status: 'idle',
      },
      null,
      2,
    ),
  },
  {
    key: 'viewMode',
    label: '视图模式',
    type: 'select',
    options: [
      { label: '列表视图', value: 'list' },
      { label: 'JSON视图', value: 'json' },
      { label: '表格视图', value: 'table' },
    ],
    default: 'list',
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    placeholder: '暂无状态数据',
    default: '暂无状态数据',
  },
]

registerSchema({
  types: ['state'],
  styleSchema,
  componentSchema,
})
