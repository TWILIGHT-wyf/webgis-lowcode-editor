/**
 * Flex 弹性布局组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'flexDirection',
    label: '主轴方向',
    type: 'select',
    options: [
      { label: '水平', value: 'row' },
      { label: '垂直', value: 'column' },
    ],
    default: 'row',
  },
  {
    key: 'justifyContent',
    label: '主轴对齐',
    type: 'select',
    options: [
      { label: '起点', value: 'flex-start' },
      { label: '终点', value: 'flex-end' },
      { label: '居中', value: 'center' },
      { label: '两端', value: 'space-between' },
      { label: '周围', value: 'space-around' },
      { label: '均匀', value: 'space-evenly' },
    ],
    default: 'flex-start',
  },
  {
    key: 'alignItems',
    label: '交叉轴对齐',
    type: 'select',
    options: [
      { label: '起点', value: 'flex-start' },
      { label: '终点', value: 'flex-end' },
      { label: '居中', value: 'center' },
      { label: '基线', value: 'baseline' },
      { label: '拉伸', value: 'stretch' },
    ],
    default: 'stretch',
  },
  {
    key: 'flexWrap',
    label: '换行',
    type: 'select',
    options: [
      { label: '不换行', value: 'nowrap' },
      { label: '换行', value: 'wrap' },
      { label: '反向换行', value: 'wrap-reverse' },
    ],
    default: 'nowrap',
  },
  {
    key: 'gap',
    label: '间距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 2,
    default: 16,
  },
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
    key: 'content',
    label: '占位内容',
    type: 'text',
    placeholder: '请输入内容',
    default: '',
  },
]

registerSchema({
  types: ['flex', 'layout.flex'],
  styleSchema,
  componentSchema,
})
