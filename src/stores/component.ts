import { defineStore } from "pinia";
import { ref } from 'vue'

export interface component {
  id: string,
  type: string,
  position: { x: number, y: number }
  size: { width: number, height: number }
  rotation: string
}

export const useComponent = defineStore('component', () => {
  const componentStore = ref<component[]>([])
  const selectComponent = ref<component>()

  // 添加组件
  function addComponent(component: Omit<component, 'id'>) {
    const newComponent = {
      ...component,
      id: Date.now().toString()
    }
    componentStore.value.push(newComponent)
  }

  // 组件Id
  function selectedId(id: string) {
    selectComponent.value = componentStore.value.find(com => com.id === id)
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

  return {
    componentStore,
    addComponent,
    updateComponentSize,
    updateComponentPosition,
    selectedId,
    updateComponentRotation,
    selectComponent
  }
})
