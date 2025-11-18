import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface component {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: string
  zindex: number
}

export const useComponent = defineStore('component', () => {
  const componentStore = ref<component[]>([])
  const selectComponent = ref<component | null>(null)
  const isDragging = ref<boolean>(false)

  // 添加组件
  function addComponent(component: Omit<component, 'id' | 'zindex'>) {
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    const newComponent = {
      ...component,
      id: Date.now().toString(),
      zindex: maxZ + 1,
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
  function updateComponentRotation(rotate: string) {
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
    // 按 zindex 升序重排并赋为 0..n-1，确保唯一且连续
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
