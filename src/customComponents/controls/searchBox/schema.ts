/**
 * SearchBox 搜索框组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

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
    default: 'transparent',
  },
  {
    key: 'inputWidth',
    label: '输入框宽度',
    type: 'text',
    placeholder: '100% 或 300px',
    default: '100%',
  },
  {
    key: 'borderColor',
    label: '边框颜色',
    type: 'color',
    default: '#dcdfe6',
  },
  {
    key: 'borderFocusColor',
    label: '聚焦边框颜色',
    type: 'color',
    default: '#409eff',
  },
  {
    key: 'borderHoverColor',
    label: '悬停边框颜色',
    type: 'color',
    default: '#c0c4cc',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#606266',
  },
  {
    key: 'placeholderColor',
    label: '占位符颜色',
    type: 'color',
    default: '#a8abb2',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 24,
    step: 1,
    default: 14,
  },
]

const componentSchema: Field[] = [
  {
    key: 'placeholder',
    label: '占位文本',
    type: 'text',
    placeholder: '请输入搜索内容',
    default: '请输入搜索内容',
  },
  {
    key: 'defaultValue',
    label: '默认值',
    type: 'text',
    placeholder: '',
    default: '',
  },
  {
    key: 'clearable',
    label: '可清空',
    type: 'switch',
    default: true,
  },
  {
    key: 'disabled',
    label: '禁用',
    type: 'switch',
    default: false,
  },
  {
    key: 'size',
    label: '尺寸',
    type: 'select',
    options: [
      { label: '大', value: 'large' },
      { label: '默认', value: 'default' },
      { label: '小', value: 'small' },
    ],
    default: 'default',
  },
  {
    key: 'prefixIcon',
    label: '前缀图标',
    type: 'text',
    placeholder: 'Search',
    default: '',
  },
  {
    key: 'suffixIcon',
    label: '后缀图标',
    type: 'text',
    placeholder: '',
    default: '',
  },
  {
    key: 'maxlength',
    label: '最大长度',
    type: 'number',
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    key: 'showWordLimit',
    label: '显示字数统计',
    type: 'switch',
    default: false,
  },
  {
    key: 'showSearchButton',
    label: '显示搜索按钮',
    type: 'switch',
    default: true,
  },
  {
    key: 'buttonText',
    label: '按钮文字',
    type: 'text',
    placeholder: '搜索',
    default: '搜索',
  },
  {
    key: 'buttonType',
    label: '按钮类型',
    type: 'select',
    options: [
      { label: '主要', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
      { label: '信息', value: 'info' },
    ],
    default: 'primary',
  },
]

registerSchema({
  types: ['searchBox'],
  styleSchema,
  componentSchema,
})
