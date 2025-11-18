import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DataSource {
  enabled: boolean
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string
  interval?: number
  dataPath?: string
  [key: string]: unknown
}

export interface component {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  zindex: number
  style: {
    opacity?: number
    visible?: boolean
    locked?: boolean
    [key: string]: unknown
  }
  props: Record<string, unknown>
  dataSource?: DataSource
  animation?: {
    name: string
    class: string
    duration?: number
    delay?: number
    iterationCount?: number | 'infinite'
    timingFunction?: string
    trigger?: 'load' | 'hover' | 'click'
  }
}

export const useComponent = defineStore('component', () => {
  const componentStore = ref<component[]>([])
  const selectComponent = ref<component | null>(null)
  const isDragging = ref<boolean>(false)

  // 不同类型组件的默认样式
  function defaultStyleByType(type: string): component['style'] {
    const base: component['style'] = {
      opacity: 100,
      visible: true,
      locked: false,
    }
    switch (type) {
      case 'Text':
        return {
          ...base,
          fontSize: 16,
          fontColor: '#000000',
          fontWeight: 'normal',
          textAlign: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          paddingX: 0,
          paddingY: 0,
        }

      default:
        return base
    }
  }

  // 不同类型组件的默认非样式属性
  function defaultPropsByType(type: string): Record<string, unknown> {
    switch (type) {
      case 'Text':
        return {
          text: '示例文本',
        }
      default:
        return {}
    }
  }

  // 不同类型组件的默认数据源配置
  function defaultDataSourceByType(type: string): DataSource | undefined {
    switch (type) {
      case 'Text':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          body: '',
          interval: 0,
          dataPath: '',
        }
      default:
        return undefined
    }
  }

  // 不同类型组件的默认动画配置（默认无动画）
  function defaultAnimationByType(): component['animation'] | undefined {
    return undefined
  }

  // 添加组件
  function addComponent(
    component: Omit<component, 'id' | 'zindex' | 'style' | 'props'> & {
      style?: component['style']
      props?: Record<string, unknown>
    },
  ) {
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    const newComponent: component = {
      ...component,
      id: Date.now().toString(),
      zindex: maxZ + 1,
      style: {
        ...defaultStyleByType(component.type),
        ...(component.style || {}),
      },
      props: {
        ...defaultPropsByType(component.type),
        ...(component.props || {}),
      },
      dataSource: component.dataSource || defaultDataSourceByType(component.type),
      animation: component.animation || defaultAnimationByType(),
    }
    componentStore.value.push(newComponent)
  }

  // 组件Id
  function selectedId(id: string) {
    selectComponent.value = componentStore.value.find((com) => com.id === id) || null
  }

  // 更新组件大小
  function updateComponentSize(size: { width: number; height: number }) {
    if (selectComponent.value) {
      selectComponent.value.size.width = size.width
      selectComponent.value.size.height = size.height
    }
  }

  // 更新组件位置
  function updateComponentPosition(position: { x: number; y: number }) {
    if (selectComponent.value) {
      selectComponent.value.position.x = position.x
      selectComponent.value.position.y = position.y
    }
  }

  // 更新组件旋转
  function updateComponentRotation(rotate: number) {
    if (selectComponent.value) {
      selectComponent.value.rotation = rotate
    }
  }

  // 删除组件
  function removeComponent(id: string) {
    const index = componentStore.value.findIndex((c) => c.id === id)
    if (index > -1) {
      componentStore.value.splice(index, 1)
    }
    selectComponent.value = null
  }

  // 复制剪切粘贴组件
  const clipboard = ref<component[]>([])

  function copy(id: string) {
    const comp = componentStore.value.find((com) => com.id === id)
    if (!comp) return
    clipboard.value.push(comp)
  }

  function cut(id: string) {
    const comp = componentStore.value.find((com) => com.id === id)
    if (!comp) return
    clipboard.value.push(comp)
    removeComponent(id)
  }

  function paste(position: { x: number; y: number }) {
    if (clipboard.value.length === 0) return

    const lastComp = clipboard.value[clipboard.value.length - 1]
    if (!lastComp) return
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    const newComp: component = {
      ...lastComp,
      id: Date.now().toString(),
      position: { x: position.x, y: position.y },
      zindex: maxZ + 1,
    }
    componentStore.value.push(newComp)
    selectComponent.value = newComp
  }

  // —— 图层（z-index）操作 ——
  function normalizeZ() {
    const sorted = [...componentStore.value].sort((a, b) => (a.zindex ?? 0) - (b.zindex ?? 0))
    sorted.forEach((c, i) => {
      c.zindex = i
    })
  }

  function bringForward(id: string) {
    if (componentStore.value.length <= 1) return
    normalizeZ()
    const sorted = [...componentStore.value].sort((a, b) => a.zindex - b.zindex)
    const idx = sorted.findIndex((c) => c.id === id)
    if (idx === -1 || idx === sorted.length - 1) return
    const a = sorted[idx]!
    const b = sorted[idx + 1]!
    const tmp = a.zindex
    a.zindex = b.zindex
    b.zindex = tmp
  }

  function sendBackward(id: string) {
    if (componentStore.value.length <= 1) return
    normalizeZ()
    const sorted = [...componentStore.value].sort((a, b) => a.zindex - b.zindex)
    const idx = sorted.findIndex((c) => c.id === id)
    if (idx <= 0) return
    const a = sorted[idx]!
    const b = sorted[idx - 1]!
    const tmp = a.zindex
    a.zindex = b.zindex
    b.zindex = tmp
  }

  function bringToFront(id: string) {
    const target = componentStore.value.find((c) => c.id === id)
    if (!target) return
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    target.zindex = maxZ + 1
    normalizeZ()
  }

  function sendToBack(id: string) {
    const target = componentStore.value.find((c) => c.id === id)
    if (!target) return
    const minZ = componentStore.value.reduce((min, c) => Math.min(min, c.zindex ?? 0), 0)
    target.zindex = minZ - 1
    normalizeZ()
  }

  // 清空画布
  function reset() {
    componentStore.value.length = 0
    selectComponent.value = null
    clipboard.value.length = 0
    isDragging.value = false
  }
  return {
    cut,
    copy,
    paste,
    componentStore,
    addComponent,
    updateComponentSize,
    updateComponentPosition,
    selectedId,
    updateComponentRotation,
    removeComponent,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    selectComponent,
    isDragging,
    clipboard,
    reset,
  }
})
