/**
 * 分页器组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: 'transparent',
  },
]

const componentSchema: Field[] = [
  {
    key: 'total',
    label: '总条数',
    type: 'number',
    min: 0,
    max: 100000,
    step: 1,
    default: 100,
  },
  {
    key: 'currentPage',
    label: '当前页',
    type: 'number',
    min: 1,
    max: 10000,
    step: 1,
    default: 1,
  },
  {
    key: 'pageSize',
    label: '每页条数',
    type: 'number',
    min: 1,
    max: 1000,
    step: 1,
    default: 10,
  },
  {
    key: 'pageSizes',
    label: '可选每页条数(JSON)',
    type: 'text',
    placeholder: '[10, 20, 50, 100]',
    default: '',
  },
  {
    key: 'layout',
    label: '布局',
    type: 'text',
    placeholder: 'prev, pager, next, sizes, total',
    default: 'prev, pager, next, sizes, total',
  },
  {
    key: 'background',
    label: '显示背景',
    type: 'switch',
    default: true,
  },
  {
    key: 'small',
    label: '小尺寸',
    type: 'switch',
    default: false,
  },
]

registerSchema({
  types: ['pagination'],
  styleSchema,
  componentSchema,
})
