/**
 * Modal 对话框组件属性配置
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
    key: 'textColor',
    label: '文本颜色',
    type: 'color',
    default: '#333333',
  },
]

const componentSchema: Field[] = [
  {
    key: 'visible',
    label: '显示对话框',
    type: 'switch',
    default: false,
  },
  {
    key: 'title',
    label: '标题',
    type: 'text',
    placeholder: '对话框标题',
    default: '对话框标题',
  },
  {
    key: 'width',
    label: '宽度',
    type: 'text',
    placeholder: '50%',
    default: '50%',
  },
  {
    key: 'fullscreen',
    label: '全屏',
    type: 'switch',
    default: false,
  },
  {
    key: 'closeOnClickModal',
    label: '点击遮罩关闭',
    type: 'switch',
    default: true,
  },
  {
    key: 'showClose',
    label: '显示关闭按钮',
    type: 'switch',
    default: true,
  },
  {
    key: 'showFooter',
    label: '显示底部',
    type: 'switch',
    default: true,
  },
  {
    key: 'content',
    label: '内容',
    type: 'text',
    placeholder: '这是对话框内容',
    default: '这是对话框内容',
  },
]

registerSchema({
  types: ['modal', 'layout.modal'],
  styleSchema,
  componentSchema,
})
