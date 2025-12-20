/**
 * Base 基础地图组件属性配置
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
    default: 13,
  },
  {
    key: 'minZoom',
    label: '最小缩放',
    type: 'number',
    min: 1,
    max: 18,
    step: 1,
    default: 1,
  },
  {
    key: 'maxZoom',
    label: '最大缩放',
    type: 'number',
    min: 1,
    max: 18,
    step: 1,
    default: 18,
  },
  {
    key: 'tileUrl',
    label: '瓦片URL',
    type: 'text',
    placeholder: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    default: '',
  },
  {
    key: 'attribution',
    label: '版权信息',
    type: 'text',
    default: '&copy; OpenStreetMap contributors',
  },
  {
    key: 'zoomControl',
    label: '缩放控件',
    type: 'switch',
    default: true,
  },
  {
    key: 'dragging',
    label: '允许拖拽',
    type: 'switch',
    default: true,
  },
  {
    key: 'scrollWheelZoom',
    label: '滚轮缩放',
    type: 'switch',
    default: true,
  },
  {
    key: 'doubleClickZoom',
    label: '双击缩放',
    type: 'switch',
    default: true,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    default: '配置地图中心点以显示底图',
  },
]

registerSchema({
  types: ['base'],
  styleSchema,
  componentSchema,
})
