import { ref,type Ref } from 'vue'
import { useComponent } from '@/stores/component'

export function useContextMenu(wrap: Ref<HTMLDivElement | null>) {
  const { selectedId, removeComponent, copy, cut, paste } = useComponent()
  // 右键菜单状态
  const menuState = ref<{ x: number; y: number; visible: boolean; targetId?: string }>({
    x: 0,
    y: 0,
    visible: false,
  })

  function openContextMenu(payload: { id: string; event: MouseEvent }) {
    const { id, event } = payload
    selectedId(id)
    const rect = wrap.value?.getBoundingClientRect()
    const stageX = event.clientX - (rect?.left || 0)
    const stageY = event.clientY - (rect?.top || 0)
    menuState.value = { x: stageX, y: stageY, visible: true, targetId: id }
  }

  function hideContextMenu() {
    if (menuState.value.visible) menuState.value.visible = false
  }

  function onMenuAction(action: string) {
    const position = {
      x: menuState.value.x,
      y: menuState.value.y,
    }
    if (menuState.value.targetId) {
      // 组件菜单
      const targetId = menuState.value.targetId
      switch (action) {
        case 'delete':
          removeComponent(targetId)
          break
        case 'copy':
          copy(targetId)
          break
        case 'cut':
          cut(targetId)
          break
        case 'paste':
          paste(position)
          break
      }
    } else {
      // 空白区域菜单（只有粘贴）
      if (action === 'paste') {
        paste(position)
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

    // 空白区域：显示菜单（只有粘贴）
    const rect = wrap.value?.getBoundingClientRect()
    const stageX = e.clientX - (rect?.left || 0)
    const stageY = e.clientY - (rect?.top || 0)
    menuState.value = { x: stageX, y: stageY, visible: true, targetId: undefined }
  }

  return {
    menuState,
    openContextMenu,
    hideContextMenu,
    onMenuAction,
    handleGlobalClick,
    onCanvasContextMenu
  }
}
