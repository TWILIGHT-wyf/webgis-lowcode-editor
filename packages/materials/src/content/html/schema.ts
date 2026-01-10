/**
 * HTML 组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    default: 16,
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#ffffff',
  },
  {
    key: 'textColor',
    label: '文本颜色',
    type: 'color',
    default: '#333333',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 14,
  },
  {
    key: 'lineHeight',
    label: '行高',
    type: 'number',
    min: 1,
    max: 3,
    step: 0.1,
    default: 1.6,
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
  {
    key: 'overflow',
    label: '溢出处理',
    type: 'select',
    options: [
      { label: '自动', value: 'auto' },
      { label: '滚动', value: 'scroll' },
      { label: '隐藏', value: 'hidden' },
      { label: '可见', value: 'visible' },
    ],
    default: 'auto',
  },
  {
    key: 'fontFamily',
    label: '字体',
    type: 'text',
    default: 'inherit',
  },
]

const componentSchema: Field[] = [
  {
    key: 'content',
    label: 'HTML内容',
    type: 'text',
    placeholder: '<div>HTML内容</div>',
    default: '<div>HTML内容</div>',
  },
  {
    key: 'sanitize',
    label: '启用XSS防护',
    type: 'switch',
    default: true,
  },
  {
    key: 'allowedTags',
    label: '允许的HTML标签',
    type: 'text',
    placeholder: 'div,span,p,h1,h2,h3,img,a',
    default:
      'div,span,p,h1,h2,h3,h4,h5,h6,ul,ol,li,strong,em,br,img,a,table,thead,tbody,tr,th,td,code,pre,blockquote',
  },
  {
    key: 'allowedAttributes',
    label: '允许的HTML属性',
    type: 'text',
    placeholder: 'class,style,href,src,alt',
    default: 'class,style,href,src,alt,target,title,id',
  },
]

registerSchema({
  types: ['html'],
  styleSchema,
  componentSchema,
})
