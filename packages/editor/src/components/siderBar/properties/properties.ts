import { computed, ref, watch } from 'vue'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@vela/ui'
import { getSchema } from './schema'

export function customProperties() {
  const componentStore = useComponent()
  const { selectComponent } = storeToRefs(componentStore)

  // 通用字段类型声明
  type Primitive = string | number | boolean | null | undefined
  type Field =
    | {
        key: string
        label: string
        type: 'text'
        placeholder?: string
        default?: Primitive
      }
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

    // 首先尝试从新的 schema 系统获取配置
    const schema = getSchema(type)
    if (schema?.styleSchema) {
      return schema.styleSchema as Field[]
    }

    // 回退到原有的 switch-case 逻辑（仅保留 Text 组件）
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
          {
            key: 'fontColor',
            label: '字体颜色',
            type: 'color',
            default: '#000000',
          },
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

    // 首先尝试从新的 schema 系统获取配置
    const schema = getSchema(type)
    if (schema?.dataSourceSchema) {
      return schema.dataSourceSchema as Field[]
    }

    // 回退到原有的 switch-case 逻辑（仅保留 Text 组件）
    switch (type) {
      case 'Text':
        return [
          {
            key: 'enabled',
            label: '启用数据源',
            type: 'switch',
            default: false,
          },
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

  // 组件自定义字段（非样式/非 dataSource）
  const componentSchema = computed<Field[]>(() => {
    const type = selectComponent.value?.type
    if (!type) return []

    // 首先尝试从新的 schema 系统获取配置
    const schema = getSchema(type)
    if (schema?.componentSchema) {
      return schema.componentSchema as Field[]
    }

    // 回退到原有的 switch-case 逻辑
    // 所有组件配置已迁移到各组件目录的 schema.ts 文件中
    return []
  })

  return { styleSchema, dataSourceSchema, componentSchema }
}

// Canvas Settings Composable
export function useCanvasSettings() {
  const sizeStore = useSizeStore()
  const { width: canvasWidth, height: canvasHeight, canvasConfig } = storeToRefs(sizeStore)
  const { setSize: setCanvasSize } = sizeStore

  return {
    canvasWidth,
    canvasHeight,
    canvasConfig,
    setCanvasSize,
  }
}

// Component Properties Composable
export function useComponentProperties() {
  const storeComponent = useComponent()
  const { selectComponent, selectedIds } = storeToRefs(storeComponent)

  const activeCollapse = ref(['basic', 'style'])

  const isRow = computed(() => {
    const t = selectComponent.value?.type
    return t === 'Row' || t === 'layout.row'
  })

  const isMultiSelect = computed(() => selectedIds.value.length > 1)

  const getStyleValue = (key: string) => {
    const target = isRow.value ? selectComponent.value!.props : selectComponent.value!.style!
    return {
      get value() {
        return target[key]
      },
      set value(v) {
        target[key] = v
        storeComponent.commitDebounced()
      },
    }
  }

  const rotationForUi = computed({
    get: () => {
      const rot = selectComponent.value?.rotation ?? 0
      return ((rot % 360) + 360) % 360
    },
    set: (val: number) => {
      const comp = selectComponent.value
      if (!comp) return
      const current = comp.rotation ?? 0
      const k = Math.round((current - val) / 360)
      storeComponent.updateComponentRotation(val + 360 * k)
    },
  })

  return {
    selectComponent,
    selectedIds,
    activeCollapse,
    isRow,
    isMultiSelect,
    getStyleValue,
    rotationForUi,
  }
}

// Data Preview Composable
export function useDataPreview() {
  const storeComponent = useComponent()
  const { selectComponent } = storeToRefs(storeComponent)

  const {
    data: previewData,
    loading: previewLoading,
    error: previewError,
  } = useDataSource(computed(() => selectComponent.value?.dataSource))

  return {
    previewData,
    previewLoading,
    previewError,
  }
}

// Component Fields Composable
export function useComponentFields() {
  const storeComponent = useComponent()
  const { selectComponent } = storeToRefs(storeComponent)
  const { componentSchema } = customProperties()

  const headersInput = ref('')

  function applyHeadersFromInput() {
    const ds = selectComponent.value?.dataSource
    if (!ds) return
    try {
      const text = headersInput.value.trim()
      ds.headers = text ? (JSON.parse(text) as Record<string, string>) : {}
      storeComponent.commitDebounced()
    } catch {}
  }

  watch(
    () => selectComponent.value?.dataSource,
    (ds) => {
      if (!ds) return
      const raw = ds.headers
      if (typeof raw === 'string') {
        headersInput.value = raw
      } else {
        headersInput.value = JSON.stringify(raw ?? {}, null, 2)
      }
    },
    { immediate: true, deep: true },
  )

  const componentFieldInput = ref<Record<string, string>>({})

  function applyComponentField(key: string) {
    const comp = selectComponent.value
    if (!comp) return
    const text = componentFieldInput.value[key]?.trim() ?? ''
    if (!text) {
      Reflect.set(comp.props as Record<string, unknown>, key, undefined)
      storeComponent.commitDebounced()
      return
    }
    try {
      const parsed = JSON.parse(text)
      Reflect.set(comp.props as Record<string, unknown>, key, parsed)
    } catch {
      Reflect.set(comp.props as Record<string, unknown>, key, text)
    }
    storeComponent.commitDebounced()
  }

  watch(
    () => selectComponent.value,
    (comp) => {
      if (!comp) {
        componentFieldInput.value = {}
        return
      }
      for (const f of componentSchema.value) {
        if (!('props' in comp) || !comp.props) comp.props = {}
        if (comp.props[f.key] === undefined) {
          Reflect.set(comp.props as Record<string, unknown>, f.key, f.default ?? undefined)
        }
        const v = comp.props[f.key]
        componentFieldInput.value[f.key] =
          v === undefined ? '' : typeof v === 'string' ? v : JSON.stringify(v, null, 2)
      }
    },
    { immediate: true, deep: true },
  )

  return {
    headersInput,
    applyHeadersFromInput,
    componentFieldInput,
    applyComponentField,
  }
}

// Layer Actions Composable
export function useLayerActions() {
  const storeComponent = useComponent()
  const { selectComponent } = storeToRefs(storeComponent)

  const handleBringToFront = () =>
    selectComponent.value && storeComponent.bringToFront(selectComponent.value.id)
  const handleBringForward = () =>
    selectComponent.value && storeComponent.bringForward(selectComponent.value.id)
  const handleSendBackward = () =>
    selectComponent.value && storeComponent.sendBackward(selectComponent.value.id)
  const handleSendToBack = () =>
    selectComponent.value && storeComponent.sendToBack(selectComponent.value.id)
  const handleDelete = () => storeComponent.removeComponent(selectComponent.value!.id)

  return {
    handleBringToFront,
    handleBringForward,
    handleSendBackward,
    handleSendToBack,
    handleDelete,
  }
}

// Multi Select Composable
export function useMultiSelect() {
  const storeComponent = useComponent()
  const { selectComponent, selectedIds } = storeToRefs(storeComponent)

  const handleDeleteMulti = () => storeComponent.removeMultipleComponents([...selectedIds.value])

  watch(
    () => selectComponent.value?.position,
    (newPos) => {
      if (selectedIds.value.length <= 1 || !newPos) return
      selectedIds.value.forEach((id) => {
        const comp = storeComponent.componentStore.find((c) => c.id === id)
        if (comp && comp.id !== selectComponent.value?.id) {
          comp.position.x = newPos.x
          comp.position.y = newPos.y
        }
      })
      storeComponent.commitDebounced()
    },
    { deep: true },
  )

  watch(
    () => selectComponent.value?.size,
    (newSize) => {
      if (selectedIds.value.length <= 1 || !newSize) return
      selectedIds.value.forEach((id) => {
        const comp = storeComponent.componentStore.find((c) => c.id === id)
        if (comp && comp.id !== selectComponent.value?.id) {
          comp.size.width = newSize.width
          comp.size.height = newSize.height
        }
      })
      storeComponent.commitDebounced()
    },
    { deep: true },
  )

  watch(
    () => selectComponent.value?.rotation,
    (newRotation) => {
      if (selectedIds.value.length <= 1 || newRotation === undefined) return
      selectedIds.value.forEach((id) => {
        const comp = storeComponent.componentStore.find((c) => c.id === id)
        if (comp && comp.id !== selectComponent.value?.id) comp.rotation = newRotation
      })
      storeComponent.commitDebounced()
    },
  )

  watch(
    () => selectComponent.value?.style,
    (newStyle) => {
      if (selectedIds.value.length <= 1 || !newStyle) return
      selectedIds.value.forEach((id) => {
        const comp = storeComponent.componentStore.find((c) => c.id === id)
        if (comp && comp.id !== selectComponent.value?.id && comp.style) {
          Object.assign(comp.style, { ...newStyle })
        }
      })
      storeComponent.commitDebounced()
    },
    { deep: true },
  )

  return {
    handleDeleteMulti,
  }
}

// Component Initialization Composable
export function useComponentInitialization() {
  const storeComponent = useComponent()
  const { selectComponent } = storeToRefs(storeComponent)
  const { styleSchema } = customProperties()

  watch(
    () => selectComponent.value,
    (comp) => {
      if (!comp) return
      if (!comp.style) comp.style = {}
      if (comp.style.opacity === undefined) comp.style.opacity = 100
      if (comp.style.visible === undefined) comp.style.visible = true
      if (comp.style.locked === undefined) comp.style.locked = false

      for (const f of styleSchema.value) {
        if (comp.type === 'Row' || comp.type === 'layout.row') {
          if (comp.props[f.key] === undefined)
            Reflect.set(comp.props as Record<string, unknown>, f.key, f.default)
        } else {
          if (comp.style[f.key] === undefined)
            Reflect.set(comp.style as Record<string, unknown>, f.key, f.default)
        }
      }

      if (!comp.props) comp.props = {}
      if (!comp.props.text) comp.props.text = '示例文本'

      if (!comp.dataSource) {
        comp.dataSource = {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          body: '',
          interval: 0,
          dataPath: '',
        }
      }
    },
    { immediate: true },
  )
}
