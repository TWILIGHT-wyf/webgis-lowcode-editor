/**
 * 导航按钮组件属性配置
 */
import {
  registerSchema,
  commonStyleFields,
  type Field,
} from '@/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  commonStyleFields.backgroundColor,
  {
    key: 'color',
    label: '文字颜色',
    type: 'color',
    default: '#ffffff',
  },
  commonStyleFields.borderRadius,
  {
    key: 'paddingX',
    label: '水平内边距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 24,
  },
  {
    key: 'paddingY',
    label: '垂直内边距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 12,
  },
  {
    key: 'shadow',
    label: '显示阴影',
    type: 'switch',
    default: false,
  },
]

const componentSchema: Field[] = [
  {
    key: 'label',
    label: '按钮文字',
    type: 'text',
    placeholder: '跳转',
    default: '跳转',
  },
  {
    key: 'showLabel',
    label: '显示文字',
    type: 'switch',
    default: true,
  },
  {
    key: 'icon',
    label: '图标名称',
    type: 'text',
    placeholder: 'ArrowRight',
    default: 'ArrowRight',
  },
  {
    key: 'iconSize',
    label: '图标大小',
    type: 'number',
    min: 12,
    max: 64,
    step: 1,
    default: 20,
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 12,
    max: 48,
    step: 1,
    default: 14,
  },
  {
    key: 'targetPageId',
    label: '目标页面ID',
    type: 'text',
    placeholder: '输入要跳转的页面ID',
    default: '',
  },
  {
    key: 'url',
    label: '外部链接',
    type: 'text',
    placeholder: 'https://example.com',
    default: '',
  },
  {
    key: 'openInNewTab',
    label: '新标签页打开',
    type: 'switch',
    default: false,
  },
]

registerSchema({
  types: ['navButton'],
  styleSchema,
  componentSchema,
})
