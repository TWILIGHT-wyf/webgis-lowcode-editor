/**
 * Trigger 触发器组件属性配置
 */
import { registerSchema, type Field } from '@lowcode/editor/components/siderBar/properties/schema/types'

const styleSchema: Field[] = [
  {
    key: 'padding',
    label: '内边距(px)',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    default: 16,
  },
  {
    key: 'backgroundColor',
    label: '背景颜色',
    type: 'color',
    default: '#1a1a1a',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#e0e0e0',
  },
  {
    key: 'fontSize',
    label: '字体大小(px)',
    type: 'number',
    min: 10,
    max: 30,
    step: 1,
    default: 13,
  },
  {
    key: 'lineHeight',
    label: '行高',
    type: 'number',
    min: 1,
    max: 3,
    step: 0.1,
    default: 1.5,
  },
  {
    key: 'borderRadius',
    label: '圆角(px)',
    type: 'number',
    min: 0,
    max: 20,
    step: 1,
    default: 4,
  },
  {
    key: 'border',
    label: '边框',
    type: 'text',
    default: '1px solid #3c3c3c',
  },
  {
    key: 'fontFamily',
    label: '字体',
    type: 'text',
    default: 'Consolas, Monaco, "Courier New", monospace',
  },
]

const componentSchema: Field[] = [
  {
    key: 'enabled',
    label: '启用触发器',
    type: 'switch',
    default: true,
  },
  {
    key: 'triggerType',
    label: '触发类型',
    type: 'select',
    options: [
      { label: '手动触发', value: 'manual' },
      { label: '定时触发', value: 'interval' },
    ],
    default: 'manual',
  },
  {
    key: 'interval',
    label: '触发间隔(毫秒)',
    type: 'number',
    min: 1000,
    max: 3600000,
    step: 1000,
    default: 5000,
  },
  {
    key: 'action',
    label: '动作类型',
    type: 'select',
    options: [
      { label: '日志记录', value: 'log' },
      { label: '弹窗提示', value: 'alert' },
      { label: '派发事件', value: 'dispatch' },
      { label: '调用API', value: 'api' },
    ],
    default: 'log',
  },
  {
    key: 'actionData',
    label: '动作数据',
    type: 'text',
    placeholder: '触发器执行的数据',
    default: '触发器已执行',
  },
  {
    key: 'condition',
    label: '触发条件',
    type: 'text',
    placeholder: '例: value > 100',
    default: '',
  },
  {
    key: 'showClearButton',
    label: '显示清除按钮',
    type: 'switch',
    default: true,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    placeholder: '暂无执行记录',
    default: '暂无执行记录',
  },
]

registerSchema({
  types: ['trigger'],
  styleSchema,
  componentSchema,
})
