/**
 * Select 下拉选择组件属性配置
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
    key: 'selectWidth',
    label: '选择器宽度',
    type: 'text',
    placeholder: '100% 或 200px',
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
    key: 'tagBackgroundColor',
    label: '标签背景颜色',
    type: 'color',
    default: '#f4f4f5',
  },
  {
    key: 'tagTextColor',
    label: '标签文字颜色',
    type: 'color',
    default: '#909399',
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
    key: 'options',
    label: '选项数据(JSON/逗号分隔)',
    type: 'text',
    placeholder: '[{"label":"选项1","value":"1"}] 或 选项1,选项2,选项3',
    default: '',
  },
  {
    key: 'defaultValue',
    label: '默认值',
    type: 'text',
    placeholder: '默认选中的值',
    default: '',
  },
  {
    key: 'placeholder',
    label: '占位文本',
    type: 'text',
    placeholder: '请选择',
    default: '请选择',
  },
  {
    key: 'clearable',
    label: '可清空',
    type: 'switch',
    default: true,
  },
  {
    key: 'filterable',
    label: '可搜索',
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
    key: 'labelField',
    label: '标签字段名',
    type: 'text',
    placeholder: 'label',
    default: 'label',
  },
  {
    key: 'valueField',
    label: '值字段名',
    type: 'text',
    placeholder: 'value',
    default: 'value',
  },
  {
    key: 'emptyText',
    label: '空数据文本',
    type: 'text',
    placeholder: '暂无选项',
    default: '暂无选项',
  },
]

registerSchema({
  types: ['select'],
  styleSchema,
  componentSchema,
})
