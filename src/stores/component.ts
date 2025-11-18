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
  groupId?: string // 所属组合的ID（如果是组合成员）
  children?: string[] // 子组件ID列表（如果是组合容器）
}

export const useComponent = defineStore('component', () => {
  const componentStore = ref<component[]>([])
  const selectComponent = ref<component | null>(null)
  const selectedIds = ref<string[]>([])
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
    // 单选时同步更新selectedIds
    if (selectComponent.value) {
      selectedIds.value = [id]
    } else {
      selectedIds.value = []
    }
  }

  // 切换选中状态（支持Ctrl多选）
  function toggleSelect(id: string, ctrlKey: boolean) {
    if (ctrlKey) {
      // Ctrl+点击：切换选中
      const index = selectedIds.value.indexOf(id)
      if (index > -1) {
        selectedIds.value.splice(index, 1)
      } else {
        selectedIds.value.push(id)
      }
      // 更新主选择对象为第一个选中项
      if (selectedIds.value.length > 0) {
        selectComponent.value =
          componentStore.value.find((c) => c.id === selectedIds.value[0]) || null
      } else {
        selectComponent.value = null
      }
    } else {
      // 普通点击：单选
      selectedId(id)
    }
  }

  // 批量选中
  function selectMultiple(ids: string[]) {
    selectedIds.value = [...ids]
    if (ids.length > 0) {
      selectComponent.value = componentStore.value.find((c) => c.id === ids[0]) || null
    } else {
      selectComponent.value = null
    }
  }

  // 清空选择
  function clearSelection() {
    selectedIds.value = []
    selectComponent.value = null
  }

  // 判断是否选中
  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id)
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
    // 从selectedIds中移除
    const selectedIndex = selectedIds.value.indexOf(id)
    if (selectedIndex > -1) {
      selectedIds.value.splice(selectedIndex, 1)
    }
    if (selectComponent.value?.id === id) {
      selectComponent.value = null
    }
  }

  // 批量删除组件
  function removeMultipleComponents(ids: string[]) {
    ids.forEach((id) => {
      const index = componentStore.value.findIndex((c) => c.id === id)
      if (index > -1) {
        componentStore.value.splice(index, 1)
      }
    })
    clearSelection()
  }

  // 复制剪切粘贴组件
  const clipboard = ref<component[]>([])

  // 规范化待复制/剪切目标：去重并保持顺序
  function resolveCopyTargets(ids: string[]): component[] {
    const result: component[] = []
    const seen = new Set<string>()
    ids.forEach((id) => {
      if (seen.has(id)) return
      const comp = componentStore.value.find((c) => c.id === id)
      if (comp) {
        result.push(comp)
        seen.add(id)
      }
    })
    return result
  }

  function snapshotWithoutGrouping(comp: component): component {
    const snap = JSON.parse(JSON.stringify(comp)) as component
    snap.groupId = undefined
    snap.children = undefined
    return snap
  }

  function copy(id: string) {
    const comps = resolveCopyTargets([id])
    if (comps.length === 0) return
    clipboard.value = comps.map((c) => snapshotWithoutGrouping(c))
  }

  function cut(id: string) {
    const comps = resolveCopyTargets([id])
    if (comps.length === 0) return
    clipboard.value = comps.map((c) => snapshotWithoutGrouping(c))
    // 从画布移除原对象
    const idsToRemove = comps.map((c) => c.id)
    removeMultipleComponents(idsToRemove)
  }

  // 批量复制：以第一个为锚点，记录其他组件相对偏移
  function copyMultiple(ids: string[]) {
    const comps = resolveCopyTargets(ids)
    if (comps.length === 0) return
    clipboard.value = comps.map((c) => snapshotWithoutGrouping(c))
  }

  // 批量剪切：以第一个为锚点，记录其他组件相对偏移
  function cutMultiple(ids: string[]) {
    const comps = resolveCopyTargets(ids)
    if (comps.length === 0) return
    clipboard.value = comps.map((c) => snapshotWithoutGrouping(c))
    const idsToRemove = comps.map((c) => c.id)
    removeMultipleComponents(idsToRemove)
  }

  function paste(position: { x: number; y: number }) {
    if (clipboard.value.length === 0) return

    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)

    if (clipboard.value.length === 1) {
      // 单个组件粘贴
      const lastComp = clipboard.value[0]!
      const base: component = snapshotWithoutGrouping(lastComp)
      const newComp: component = {
        ...base,
        id: Date.now().toString(),
        position: { x: position.x, y: position.y },
        zindex: maxZ + 1,
      }
      componentStore.value.push(newComp)
      selectedId(newComp.id)
    } else {
      // 多个组件粘贴：第一个组件位置 = 鼠标位置，其他组件按与第一个的偏移定位
      const snaps = clipboard.value.map((c) => snapshotWithoutGrouping(c))
      const anchor = snaps[0]!
      const newIds: string[] = []
      const timestamp = Date.now()

      const expectedPos: Record<string, { x: number; y: number }> = {}
      snaps.forEach((comp, index) => {
        const offsetX = comp.position.x - anchor.position.x
        const offsetY = comp.position.y - anchor.position.y

        const expectedX = position.x + offsetX
        const expectedY = position.y + offsetY

        const newComp: component = {
          ...comp,
          id: `${timestamp}_${index}`,
          position: { x: expectedX, y: expectedY },
          zindex: maxZ + 1 + index,
        }
        expectedPos[newComp.id] = { x: expectedX, y: expectedY }
        componentStore.value.push(newComp)
        newIds.push(newComp.id)
      })

      selectMultiple(newIds)
      // 下一帧再矫正一次，避免外部副作用把位置拉到一起
      setTimeout(() => {
        newIds.forEach((id) => {
          const comp = componentStore.value.find((c) => c.id === id)
          const exp = expectedPos[id]
          if (!comp || !exp) return
          const changed = comp.position.x !== exp.x || comp.position.y !== exp.y
          if (changed) {
            comp.position.x = exp.x
            comp.position.y = exp.y
          }
        })
      }, 0)
    }
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

  // 组合多个组件：以第一个选中组件为锚点
  function groupComponents(ids: string[]) {
    if (ids.length < 2) return

    const members = ids
      .map((id) => componentStore.value.find((c) => c.id === id))
      .filter(Boolean) as component[]
    if (members.length < 2) return

    // 计算组合边界框(覆盖所有成员)
    const minX = Math.min(...members.map((c) => c.position.x))
    const minY = Math.min(...members.map((c) => c.position.y))
    const maxX = Math.max(...members.map((c) => c.position.x + c.size.width))
    const maxY = Math.max(...members.map((c) => c.position.y + c.size.height))

    const groupId = `group_${Date.now()}`

    // 创建组合组件
    const groupComponent: component = {
      id: groupId,
      type: 'Group',
      position: { x: minX, y: minY },
      size: { width: maxX - minX, height: maxY - minY },
      rotation: 0,
      zindex: Math.max(...members.map((c) => c.zindex)),
      style: {
        opacity: 100,
        visible: true,
        locked: false,
      },
      props: {},
      children: [...ids],
    }

    // 更新成员组件：设置 groupId（保持绝对位置不变，shape 内可独立移动）
    members.forEach((comp) => {
      comp.groupId = groupId
    })

    componentStore.value.push(groupComponent)
    selectComponent.value = groupComponent
    selectedIds.value = [groupId]
  }

  // 取消组合:子组件保持当前绝对位置不变,只移除 groupId
  function ungroupComponents(groupId: string) {
    const group = componentStore.value.find((c) => c.id === groupId)
    if (!group || group.type !== 'Group' || !group.children) return

    // 记录子组件的期望绝对位置
    const expectedPos: Record<string, { x: number; y: number }> = {}
    group.children.forEach((childId) => {
      const child = componentStore.value.find((c) => c.id === childId)
      if (child) expectedPos[childId] = { x: child.position.x, y: child.position.y }
    })

    // 恢复子组件的独立状态,位置保持不变
    group.children.forEach((childId) => {
      const child = componentStore.value.find((c) => c.id === childId)
      if (child) {
        delete child.groupId
        // 子组件位置已经是绝对位置,无需转换
      }
    })

    // 移除组合容器
    const index = componentStore.value.findIndex((c) => c.id === groupId)
    if (index > -1) {
      componentStore.value.splice(index, 1)
    }

    // 选中原来的成员
    selectMultiple(group.children)
    // 下一帧矫正子组件位置，避免外部副作用改写
    setTimeout(() => {
      group.children?.forEach((childId) => {
        const child = componentStore.value.find((c) => c.id === childId)
        const exp = expectedPos[childId]
        if (!child || !exp) return
        if (child.position.x !== exp.x || child.position.y !== exp.y) {
          child.position.x = exp.x
          child.position.y = exp.y
        }
      })
    }, 0)
  }

  // 清空画布
  function reset() {
    componentStore.value.length = 0
    selectComponent.value = null
    selectedIds.value = []
    clipboard.value.length = 0
    isDragging.value = false
  }
  return {
    cut,
    copy,
    paste,
    copyMultiple,
    cutMultiple,
    componentStore,
    addComponent,
    updateComponentSize,
    updateComponentPosition,
    selectedId,
    toggleSelect,
    selectMultiple,
    clearSelection,
    isSelected,
    updateComponentRotation,
    removeComponent,
    removeMultipleComponents,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupComponents,
    ungroupComponents,
    selectComponent,
    selectedIds,
    isDragging,
    clipboard,
    reset,
  }
})
