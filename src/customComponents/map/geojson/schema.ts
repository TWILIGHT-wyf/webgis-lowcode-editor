/**
 * GeoJSON 地理数据组件属性配置
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
    key: 'showPopup',
    label: '显示弹窗',
    type: 'switch',
    default: true,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    default: '配置GeoJSON数据以显示图层',
  },
]

registerSchema({
  types: ['geojson'],
  styleSchema,
  componentSchema,
})
