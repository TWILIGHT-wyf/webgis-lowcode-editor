import { ref, type Ref } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

export function useContextMenu(wrap: Ref<HTMLDivElement | null>) {
  const compStore = useComponent()
  const {
    selectedId,
    removeComponent,
    removeMultipleComponents,
    copy,
    copyMultiple,
    cut,
    cutMultiple,
    paste,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupComponents,
    ungroupComponents,
  } = compStore
  const { selectedIds } = storeToRefs(compStore)
  // 右键菜单状态
  const menuState = ref<{
    x: number
    y: number
    stageX?: number
    stageY?: number
    visible: boolean
    targetId?: string
  }>({
    x: 0,
    y: 0,
    visible: false,
  })

  function openContextMenu(payload: { id: string; event: MouseEvent }) {
    const { id, event } = payload
    // 如果右键点击的组件不在当前选中列表中，则切换为单选该组件
    // 如果已经在选中列表中，保持当前多选状态
    if (!compStore.isSelected(id)) {
      selectedId(id)
    }
    const rect = wrap.value?.getBoundingClientRect()
    if (!rect) return

    // visual coordinates within wrap (用于定位右键菜单)
    const visualX = event.clientX - rect.left
    const visualY = event.clientY - rect.top

    // 计算 stage 坐标
    let stageX = visualX
    let stageY = visualY
    try {
      const worldEl = wrap.value?.querySelector('.world') as HTMLElement | null
      if (worldEl) {
        const style = window.getComputedStyle(worldEl)
        const tf = style.transform
        if (tf && tf !== 'none') {
          // matrix(a, b, c, d, e, f)
          const m = tf.match(/matrix\(([^)]+)\)/)
          if (m && m[1]) {
            const parts = m[1].split(',').map((s) => parseFloat(s.trim()))
            const a = parts[0] || 1
            const e = parts[4] || 0
            const f = parts[5] || 0
            stageX = (visualX - e) / a
            stageY = (visualY - f) / a
          }
        }
      }
    } catch {
      // 读取 transform 失败则回退为 visual 坐标
    }

    menuState.value = { x: visualX, y: visualY, stageX, stageY, visible: true, targetId: id }
  }

  function hideContextMenu() {
    if (menuState.value.visible) menuState.value.visible = false
  }

  function onMenuAction(action: string) {
    if (menuState.value.targetId) {
      // 组件菜单
      const targetId = menuState.value.targetId
      const isMultiSelect = selectedIds.value.length > 1

      switch (action) {
        case 'delete':
          if (isMultiSelect) {
            removeMultipleComponents([...selectedIds.value])
          } else {
            removeComponent(targetId)
          }
          break
        case 'copy':
          if (isMultiSelect) {
            copyMultiple([...selectedIds.value])
          } else {
            copy(targetId)
          }
          break
        case 'cut':
          if (isMultiSelect) {
            cutMultiple([...selectedIds.value])
          } else {
            cut(targetId)
          }
          break
        case 'paste':
          paste({
            x: menuState.value.stageX ?? menuState.value.x,
            y: menuState.value.stageY ?? menuState.value.y,
          })
          break
        case 'bringForward':
          if (isMultiSelect) {
            selectedIds.value.forEach((id) => bringForward(id))
          } else {
            bringForward(targetId)
          }
          break
        case 'sendBackward':
          if (isMultiSelect) {
            selectedIds.value.forEach((id) => sendBackward(id))
          } else {
            sendBackward(targetId)
          }
          break
        case 'bringToFront':
          if (isMultiSelect) {
            selectedIds.value.forEach((id) => bringToFront(id))
          } else {
            bringToFront(targetId)
          }
          break
        case 'sendToBack':
          if (isMultiSelect) {
            selectedIds.value.forEach((id) => sendToBack(id))
          } else {
            sendToBack(targetId)
          }
          break
        case 'group':
          if (isMultiSelect) {
            groupComponents([...selectedIds.value])
          }
          break
        case 'ungroup':
          const comp = compStore.componentStore.find((c) => c.id === targetId)
          if (comp && comp.type === 'Group') {
            ungroupComponents(targetId)
          }
          break
      }
    } else {
      if (action === 'paste') {
        paste({
          x: menuState.value.stageX ?? menuState.value.x,
          y: menuState.value.stageY ?? menuState.value.y,
        })
      }
    }
    hideContextMenu()
  }

  function handleGlobalClick(e: MouseEvent) {
    const el = document.querySelector('.ctx-menu')
    if (!el) return
    if (menuState.value.visible && !el.contains(e.target as Node)) {
      hideContextMenu()
    }
  }

  // 空白区域右键菜单
  function onCanvasContextMenu(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('.shape')) return

    const rect = wrap.value?.getBoundingClientRect()
    if (!rect) return

    const visualX = e.clientX - rect.left
    const visualY = e.clientY - rect.top

    let stageX = visualX
    let stageY = visualY
    try {
      const worldEl = wrap.value?.querySelector('.world') as HTMLElement | null
      if (worldEl) {
        const style = window.getComputedStyle(worldEl)
        const tf = style.transform
        if (tf && tf !== 'none') {
          const m = tf.match(/matrix\(([^)]+)\)/)
          if (m && m[1]) {
            const parts = m[1].split(',').map((s) => parseFloat(s.trim()))
            const a = parts[0] || 1
            const e2 = parts[4] || 0
            const f2 = parts[5] || 0
            stageX = (visualX - e2) / a
            stageY = (visualY - f2) / a
          }
        }
      }
    } catch {
      // ignore
    }

    menuState.value = { x: visualX, y: visualY, stageX, stageY, visible: true, targetId: undefined }
  }

  return {
    menuState,
    openContextMenu,
    hideContextMenu,
    onMenuAction,
    handleGlobalClick,
    onCanvasContextMenu,
  }
}
