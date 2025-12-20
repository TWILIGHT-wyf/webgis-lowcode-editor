/**
 * Cluster 聚合图层组件属性配置
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
    default: 5,
  },
  {
    key: 'maxClusterRadius',
    label: '聚合半径',
    type: 'number',
    min: 20,
    max: 200,
    step: 10,
    default: 80,
  },
  {
    key: 'spiderfyOnMaxZoom',
    label: '最大缩放时展开',
    type: 'switch',
    default: true,
  },
  {
    key: 'showCoverageOnHover',
    label: '悬停显示覆盖',
    type: 'switch',
    default: true,
  },
  {
    key: 'zoomToBoundsOnClick',
    label: '点击缩放到边界',
    type: 'switch',
    default: true,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    default: '配置标记点数据以显示聚合',
  },
]

registerSchema({
  types: ['cluster'],
  styleSchema,
  componentSchema,
})
