/**
 * Heat 热力图组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    default: 0,
  },
  {
    key: 'border',
    label: '边框',
    type: 'text',
    default: 'none',
  },
]

const componentSchema: Field[] = [
  {
    key: 'centerLat',
    label: '中心纬度',
    type: 'number',
    min: -90,
    max: 90,
    step: 0.0001,
    default: 39.9,
  },
  {
    key: 'centerLng',
    label: '中心经度',
    type: 'number',
    min: -180,
    max: 180,
    step: 0.0001,
    default: 116.4,
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
  {
    key: 'radius',
    label: '热点半径',
    type: 'number',
    min: 10,
    max: 50,
    step: 1,
    default: 25,
  },
  {
    key: 'blur',
    label: '模糊度',
    type: 'number',
    min: 5,
    max: 30,
    step: 1,
    default: 15,
  },
  {
    key: 'maxZoom',
    label: '最大缩放',
    type: 'number',
    min: 1,
    max: 18,
    step: 1,
    default: 17,
  },
  {
    key: 'max',
    label: '最大强度',
    type: 'number',
    min: 0.1,
    max: 2,
    step: 0.1,
    default: 1,
  },
  {
    key: 'minOpacity',
    label: '最小透明度',
    type: 'number',
    min: 0,
    max: 1,
    step: 0.1,
    default: 0.4,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    default: '配置热力数据以显示热力图',
  },
]

registerSchema({
  types: ['heat'],
  styleSchema,
  componentSchema,
})
