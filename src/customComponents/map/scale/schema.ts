/**
 * Scale 比例尺组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: 'rgba(255, 255, 255, 0.8)',
  },
  {
    key: 'lineColor',
    label: '线条颜色',
    type: 'color',
    default: '#303133',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#303133',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 8,
    max: 16,
    step: 1,
    default: 11,
  },
]

const componentSchema: Field[] = [
  {
    key: 'maxWidth',
    label: '最大宽度',
    type: 'number',
    min: 50,
    max: 200,
    step: 10,
    default: 100,
  },
  {
    key: 'metric',
    label: '公制单位',
    type: 'switch',
    default: true,
  },
  {
    key: 'imperial',
    label: '英制单位',
    type: 'switch',
    default: false,
  },
  {
    key: 'segments',
    label: '段数',
    type: 'number',
    min: 2,
    max: 8,
    step: 1,
    default: 4,
  },
  {
    key: 'zoom',
    label: '缩放级别',
    type: 'number',
    min: 1,
    max: 18,
    step: 1,
    default: 10,
  },
]

registerSchema({
  types: ['scale'],
  styleSchema,
  componentSchema,
})
