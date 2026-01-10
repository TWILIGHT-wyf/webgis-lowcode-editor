/**
 * Row 行布局组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#ffffff',
  },
  {
    key: 'border',
    label: '边框',
    type: 'text',
    default: '1px solid #e5e7eb',
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 4,
  },
  {
    key: 'minHeight',
    label: '最小高度(px)',
    type: 'number',
    min: 0,
    max: 1000,
    step: 10,
    default: 100,
  },
  {
    key: 'textColor',
    label: '文本颜色',
    type: 'color',
    default: '#333333',
  },
]

const componentSchema: Field[] = [
  {
    key: 'gutter',
    label: '栅格间隔',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 0,
  },
  {
    key: 'justify',
    label: '水平排列',
    type: 'select',
    options: [
      { label: '左对齐', value: 'start' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'end' },
      { label: '两端对齐', value: 'space-between' },
      { label: '环绕对齐', value: 'space-around' },
      { label: '均匀对齐', value: 'space-evenly' },
    ],
    default: 'start',
  },
  {
    key: 'align',
    label: '垂直对齐',
    type: 'select',
    options: [
      { label: '顶部', value: 'top' },
      { label: '居中', value: 'middle' },
      { label: '底部', value: 'bottom' },
    ],
    default: 'top',
  },
  {
    key: 'tag',
    label: 'HTML标签',
    type: 'text',
    placeholder: 'div',
    default: 'div',
  },
  {
    key: 'content',
    label: '占位内容',
    type: 'text',
    placeholder: '请输入内容',
    default: '',
  },
]

registerSchema({
  types: ['row', 'layout.row'],
  styleSchema,
  componentSchema,
})
