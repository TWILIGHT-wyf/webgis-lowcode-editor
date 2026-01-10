/**
 * Image 图片组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'objectFit',
    label: '图片适应',
    type: 'select',
    options: [
      { label: '填充', value: 'fill' },
      { label: '包含', value: 'contain' },
      { label: '覆盖', value: 'cover' },
      { label: '无', value: 'none' },
      { label: '缩小', value: 'scale-down' },
    ],
    default: 'cover',
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: 'transparent',
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 100,
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
    placeholder: 'http://localhost:3001/api/image',
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
    placeholder: '例: data.url 或 imageUrl',
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
    key: 'url',
    label: '图片地址',
    type: 'text',
    placeholder: 'https://example.com/image.jpg',
    default: '',
  },
  {
    key: 'fit',
    label: '图片填充模式',
    type: 'select',
    options: [
      { label: '填充', value: 'fill' },
      { label: '包含', value: 'contain' },
      { label: '覆盖', value: 'cover' },
      { label: '无缩放', value: 'none' },
      { label: '按比例缩小', value: 'scale-down' },
    ],
    default: 'cover',
  },
  {
    key: 'lazy',
    label: '懒加载',
    type: 'switch',
    default: true,
  },
  {
    key: 'preview',
    label: '启用预览',
    type: 'switch',
    default: false,
  },
  {
    key: 'previewZIndex',
    label: '预览层级',
    type: 'number',
    min: 0,
    max: 10000,
    step: 1,
    default: 2000,
  },
  {
    key: 'hideOnClickModal',
    label: '点击遮罩关闭预览',
    type: 'switch',
    default: false,
  },
  {
    key: 'errorText',
    label: '加载失败提示',
    type: 'text',
    placeholder: '图片加载失败',
    default: '图片加载失败',
  },
  {
    key: 'placeholder',
    label: '占位文本',
    type: 'text',
    placeholder: '加载中...',
    default: '加载中...',
  },
]

registerSchema({
  types: ['image'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
