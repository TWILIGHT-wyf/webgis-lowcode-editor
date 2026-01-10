/**
 * Iframe 组件属性配置
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
    default: '1px solid #dcdfe6',
  },
]

const componentSchema: Field[] = [
  {
    key: 'url',
    label: '页面地址',
    type: 'text',
    placeholder: 'https://example.com',
    default: '',
  },
  {
    key: 'title',
    label: '标题',
    type: 'text',
    placeholder: '外部页面',
    default: '外部页面',
  },
  {
    key: 'sandbox',
    label: '安全限制',
    type: 'text',
    placeholder: 'allow-scripts allow-same-origin',
    default: 'allow-scripts allow-same-origin allow-forms allow-popups',
  },
  {
    key: 'allow',
    label: '权限策略',
    type: 'text',
    placeholder: 'fullscreen; camera; microphone',
    default: 'fullscreen',
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    placeholder: '请输入外部页面地址',
    default: '请输入外部页面地址',
  },
]

registerSchema({
  types: ['iframe'],
  styleSchema,
  componentSchema,
})
