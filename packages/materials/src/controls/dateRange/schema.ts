/**
 * DateRange 日期范围选择器组件属性配置
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
    key: 'pickerWidth',
    label: '选择器宽度',
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
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 20,
    step: 1,
    default: 14,
  },
]

const componentSchema: Field[] = [
  {
    key: 'defaultValue',
    label: '默认日期范围(JSON)',
    type: 'text',
    placeholder: '["2024-01-01","2024-12-31"]',
    default: '',
  },
  {
    key: 'startPlaceholder',
    label: '开始日期占位文本',
    type: 'text',
    placeholder: '开始日期',
    default: '开始日期',
  },
  {
    key: 'endPlaceholder',
    label: '结束日期占位文本',
    type: 'text',
    placeholder: '结束日期',
    default: '结束日期',
  },
  {
    key: 'rangeSeparator',
    label: '分隔符',
    type: 'text',
    placeholder: '至',
    default: '至',
  },
  {
    key: 'format',
    label: '显示格式',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
    default: 'YYYY-MM-DD',
  },
  {
    key: 'valueFormat',
    label: '绑定值格式',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
    default: 'YYYY-MM-DD',
  },
  {
    key: 'clearable',
    label: '可清空',
    type: 'switch',
    default: true,
  },
  {
    key: 'editable',
    label: '可手动输入',
    type: 'switch',
    default: true,
  },
  {
    key: 'enableShortcuts',
    label: '启用快捷选项',
    type: 'switch',
    default: true,
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
]

registerSchema({
  types: ['dateRange'],
  styleSchema,
  componentSchema,
})
