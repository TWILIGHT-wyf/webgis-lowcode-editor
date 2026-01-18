import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import type { ActionSchema } from '@vela/core/types/action'

export function useEventConfiguration() {
  const componentStore = useComponent()
  const { selectedNode } = storeToRefs(componentStore)

  function ensureEvents() {
    if (!selectedNode.value) return
    if (!selectedNode.value.events) {
      selectedNode.value.events = {}
    }
  }

  const clickActions = computed<ActionSchema[]>({
    get: () => {
      if (!selectedNode.value?.events?.click) return []
      return selectedNode.value.events.click
    },
    set: (value: ActionSchema[]) => {
      if (selectedNode.value?.events) {
        selectedNode.value.events.click = value
        componentStore.syncToProjectStore()
      }
    },
  })

  const hoverActions = computed<ActionSchema[]>({
    get: () => {
      if (!selectedNode.value?.events?.hover) return []
      return selectedNode.value.events.hover
    },
    set: (value: ActionSchema[]) => {
      if (selectedNode.value?.events) {
        selectedNode.value.events.hover = value
        componentStore.syncToProjectStore()
      }
    },
  })

  function addClickAction() {
    ensureEvents()
    if (!selectedNode.value!.events!.click) {
      selectedNode.value!.events!.click = []
    }
    selectedNode.value!.events!.click.push({
      id: nanoid(),
      type: 'alert',
    } as ActionSchema)
    componentStore.syncToProjectStore()
  }

  function removeClickAction(index: number) {
    if (!selectedNode.value?.events?.click) return
    selectedNode.value.events.click.splice(index, 1)
    componentStore.syncToProjectStore()
  }

  function addHoverAction() {
    ensureEvents()
    if (!selectedNode.value!.events!.hover) {
      selectedNode.value!.events!.hover = []
    }
    selectedNode.value!.events!.hover.push({
      id: nanoid(),
      type: 'alert',
    } as ActionSchema)
    componentStore.syncToProjectStore()
  }

  function removeHoverAction(index: number) {
    if (!selectedNode.value?.events?.hover) return
    selectedNode.value.events.hover.splice(index, 1)
    componentStore.syncToProjectStore()
  }

  return {
    clickActions,
    hoverActions,
    addClickAction,
    removeClickAction,
    addHoverAction,
    removeHoverAction,
  }
}
