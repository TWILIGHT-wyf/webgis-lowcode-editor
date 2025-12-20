/**
 * Video 视频组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'objectFit',
    label: '视频适应',
    type: 'select',
    options: [
      { label: '填充', value: 'fill' },
      { label: '包含', value: 'contain' },
      { label: '覆盖', value: 'cover' },
      { label: '无', value: 'none' },
    ],
    default: 'contain',
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#000000',
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 50,
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
    placeholder: 'http://localhost:3001/api/video',
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
    placeholder: '例: data.url 或 videoUrl',
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
    label: '视频地址',
    type: 'text',
    placeholder: 'https://example.com/video.mp4',
    default: '',
  },
  {
    key: 'poster',
    label: '封面图',
    type: 'text',
    placeholder: 'https://example.com/poster.jpg',
    default: '',
  },
  {
    key: 'controls',
    label: '显示控制栏',
    type: 'switch',
    default: true,
  },
  {
    key: 'autoplay',
    label: '自动播放',
    type: 'switch',
    default: false,
  },
  {
    key: 'loop',
    label: '循环播放',
    type: 'switch',
    default: false,
  },
  {
    key: 'muted',
    label: '静音',
    type: 'switch',
    default: false,
  },
  {
    key: 'preload',
    label: '预加载',
    type: 'select',
    options: [
      { label: '元数据', value: 'metadata' },
      { label: '自动', value: 'auto' },
      { label: '不预加载', value: 'none' },
    ],
    default: 'metadata',
  },
  {
    key: 'noDownload',
    label: '禁止下载',
    type: 'switch',
    default: false,
  },
  {
    key: 'noPictureInPicture',
    label: '禁用画中画',
    type: 'switch',
    default: false,
  },
  {
    key: 'placeholder',
    label: '无视频提示',
    type: 'text',
    placeholder: '暂无视频',
    default: '暂无视频',
  },
]

registerSchema({
  types: ['video'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
