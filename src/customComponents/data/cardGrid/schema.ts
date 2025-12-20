/**
 * CardGrid 卡片网格组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
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
    max: 20,
    step: 1,
    default: 0,
  },
  {
    key: 'cardBackgroundColor',
    label: '卡片背景色',
    type: 'color',
    default: '#ffffff',
  },
  {
    key: 'cardBorderRadius',
    label: '卡片圆角(px)',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    default: 8,
  },
  {
    key: 'titleFontSize',
    label: '标题字体大小(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 16,
  },
  {
    key: 'titleColor',
    label: '标题颜色',
    type: 'color',
    default: '#303133',
  },
  {
    key: 'descriptionFontSize',
    label: '描述字体大小(px)',
    type: 'number',
    min: 10,
    max: 24,
    step: 1,
    default: 14,
  },
  {
    key: 'descriptionColor',
    label: '描述颜色',
    type: 'color',
    default: '#606266',
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
    placeholder: 'http://localhost:3001/api/card-grid',
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
    placeholder: '例: data 或 result.list',
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
    key: 'cardData',
    label: '卡片数据(JSON)',
    type: 'text',
    placeholder:
      '[{"title":"标题","description":"描述","image":"图片URL","tags":["标签1"],"footer":"页脚"}]',
    default: '',
  },
  {
    key: 'columns',
    label: '列数',
    type: 'number',
    min: 1,
    max: 6,
    step: 1,
    default: 3,
  },
  {
    key: 'gap',
    label: '卡片间距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'showImage',
    label: '显示图片',
    type: 'switch',
    default: true,
  },
  {
    key: 'showTitle',
    label: '显示标题',
    type: 'switch',
    default: true,
  },
  {
    key: 'showDescription',
    label: '显示描述',
    type: 'switch',
    default: true,
  },
  {
    key: 'showTags',
    label: '显示标签',
    type: 'switch',
    default: true,
  },
  {
    key: 'showFooter',
    label: '显示页脚',
    type: 'switch',
    default: true,
  },
  {
    key: 'titleField',
    label: '标题字段名',
    type: 'text',
    placeholder: 'title',
    default: 'title',
  },
  {
    key: 'descriptionField',
    label: '描述字段名',
    type: 'text',
    placeholder: 'description',
    default: 'description',
  },
  {
    key: 'imageField',
    label: '图片字段名',
    type: 'text',
    placeholder: 'image',
    default: 'image',
  },
  {
    key: 'tagsField',
    label: '标签字段名',
    type: 'text',
    placeholder: 'tags',
    default: 'tags',
  },
  {
    key: 'footerField',
    label: '页脚字段名',
    type: 'text',
    placeholder: 'footer',
    default: 'footer',
  },
]

registerSchema({
  types: ['cardGrid'],
  styleSchema,
  dataSourceSchema,
  componentSchema,
})
