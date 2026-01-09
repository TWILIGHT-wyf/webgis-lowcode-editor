/**
 * Scripting 脚本组件属性配置
 */
import { registerSchema, type Field } from '@/components/siderBar/properties/schema/types'

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
    default: '#1e1e1e',
  },
  {
    key: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#d4d4d4',
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
    key: 'script',
    label: 'JavaScript代码',
    type: 'text',
    placeholder: 'console.log("Hello World");',
    default: '// JavaScript 代码\nconsole.log("Hello, World!");',
  },
  {
    key: 'autoRun',
    label: '自动执行',
    type: 'switch',
    default: false,
  },
  {
    key: 'showCode',
    label: '显示代码',
    type: 'switch',
    default: true,
  },
  {
    key: 'showControls',
    label: '显示控制按钮',
    type: 'switch',
    default: true,
  },
  {
    key: 'showPlaceholder',
    label: '显示占位提示',
    type: 'switch',
    default: true,
  },
  {
    key: 'placeholder',
    label: '占位提示',
    type: 'text',
    placeholder: '点击执行按钮运行脚本',
    default: '点击执行按钮运行脚本',
  },
]

registerSchema({
  types: ['scripting'],
  styleSchema,
  componentSchema,
})
