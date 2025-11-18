import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

export function customProperties() {
  const componentStore = useComponent()
  const { selectComponent } = storeToRefs(componentStore)

  // 通用字段类型声明
  type Primitive = string | number | boolean | null | undefined
  type Field =
    | { key: string; label: string; type: 'text'; placeholder?: string; default?: Primitive }
    | {
        key: string
        label: string
        type: 'number'
        min?: number
        max?: number
        step?: number
        default?: number
      }
    | {
        key: string
        label: string
        type: 'color'
        default?: string
      }
    | {
        key: string
        label: string
        type: 'switch'
        default?: boolean
      }
    | {
        key: string
        label: string
        type: 'select'
        options: { label: string; value: Primitive }[]
        default?: Primitive
      }

  // 样式字段
  const styleSchema = computed<Field[]>(() => {
    const type = selectComponent.value?.type
    if (!type) return []
    switch (type) {
      case 'Text':
        return [
          {
            key: 'fontSize',
            label: '字体大小',
            type: 'number',
            min: 8,
            max: 200,
            step: 1,
            default: 16,
          },
          { key: 'fontColor', label: '字体颜色', type: 'color', default: '#000000' },
          {
            key: 'fontWeight',
            label: '字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
              { label: '更细', value: 'lighter' },
              { label: '更粗', value: 'bolder' },
            ],
            default: 'normal',
          },
          {
            key: 'textAlign',
            label: '对齐',
            type: 'select',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
            default: 'left',
          },
          {
            key: 'letterSpacing',
            label: '字间距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'lineHeight',
            label: '行高(倍数)',
            type: 'number',
            min: 0.8,
            max: 3,
            step: 0.1,
            default: 1.2,
          },
          {
            key: 'paddingX',
            label: '左右内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'paddingY',
            label: '上下内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
        ]
      default:
        return []
    }
  })

  // 数据源字段
  const dataSourceSchema = computed<Field[]>(() => {
    const type = selectComponent.value?.type
    if (!type) return []
    switch (type) {
      case 'Text':
        return [
          { key: 'enabled', label: '启用数据源', type: 'switch', default: false },
          {
            key: 'url',
            label: 'API 地址',
            type: 'text',
            placeholder: 'https://api.example.com/data',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' },
            ],
            default: 'GET',
          },
          {
            key: 'interval',
            label: '自动刷新(秒)',
            type: 'number',
            min: 0,
            max: 3600,
            step: 1,
            default: 0,
          },
          {
            key: 'dataPath',
            label: '数据路径',
            type: 'text',
            placeholder: 'data.text 或 result[0].content',
            default: '',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
          {
            key: 'body',
            label: '请求体(JSON)',
            type: 'text',
            placeholder: '{"key": "value"}',
            default: '',
          },
        ]
      default:
        return []
    }
  })

  return { styleSchema, dataSourceSchema }
}
