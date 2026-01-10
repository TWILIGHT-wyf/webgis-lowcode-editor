/**
 * Panel 面板组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
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
    key: 'boxShadow',
    label: '阴影',
    type: 'text',
    default: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  {
    key: 'headerPadding',
    label: '头部内边距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'headerBg',
    label: '头部背景',
    type: 'color',
    default: '#f9fafb',
  },
  {
    key: 'headerFontSize',
    label: '头部字号(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 14,
  },
  {
    key: 'headerColor',
    label: '头部颜色',
    type: 'color',
    default: '#111827',
  },
  {
    key: 'bodyPadding',
    label: '内容内边距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'textColor',
    label: '内容颜色',
    type: 'color',
    default: '#333333',
  },
  {
    key: 'fontSize',
    label: '内容字号(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 14,
  },
  {
    key: 'footerPadding',
    label: '底部内边距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'footerBg',
    label: '底部背景',
    type: 'color',
    default: '#f9fafb',
  },
  {
    key: 'footerFontSize',
    label: '底部字号(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 12,
  },
  {
    key: 'footerColor',
    label: '底部颜色',
    type: 'color',
    default: '#6b7280',
  },
]

const componentSchema: Field[] = [
  {
    key: 'title',
    label: '标题',
    type: 'text',
    placeholder: '面板标题',
    default: '面板标题',
  },
  {
    key: 'collapsible',
    label: '可折叠',
    type: 'switch',
    default: false,
  },
  {
    key: 'collapsed',
    label: '默认折叠',
    type: 'switch',
    default: false,
  },
  {
    key: 'showHeader',
    label: '显示头部',
    type: 'switch',
    default: true,
  },
  {
    key: 'showFooter',
    label: '显示底部',
    type: 'switch',
    default: false,
  },
  {
    key: 'footerContent',
    label: '底部内容',
    type: 'text',
    placeholder: '',
    default: '',
  },
  {
    key: 'content',
    label: '内容',
    type: 'text',
    placeholder: '这是面板内容',
    default: '这是面板内容',
  },
]

registerSchema({
  types: ['panel', 'layout.panel'],
  styleSchema,
  componentSchema,
})
