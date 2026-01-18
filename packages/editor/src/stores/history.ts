import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useComponent } from './component'
import type { NodeSchema } from '@vela/core'
import { cloneDeep } from 'lodash-es'

/**
 * 历史记录管理 Store
 * 实现撤销/重做功能
 */
export const useHistoryStore = defineStore('history', () => {
  const componentStore = useComponent()

  // ========== State ==========

  /**
   * 历史快照栈
   */
  const history = ref<NodeSchema[]>([])

  /**
   * 当前快照索引（指向当前状态在 history 中的位置）
   */
  const currentIndex = ref<number>(-1)

  /**
   * 最大历史记录数
   */
  const maxSize = ref<number>(50)

  // ========== Getters ==========

  /**
   * 是否可以撤销
   */
  const canUndo = ref<boolean>(false)

  /**
   * 是否可以重做
   */
  const canRedo = ref<boolean>(false)

  // ========== Actions ==========

  /**
   * 提交快照
   */
  function commit() {
    const tree = componentStore.rootNode
    if (!tree) return

    // 克隆当前状态
    const snapshot = cloneDeep(tree)

    // 如果当前不是最新状态，删除后面的历史
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    // 添加新快照
    history.value.push(snapshot)

    // 限制历史记录数量
    if (history.value.length > maxSize.value) {
      history.value.shift()
    } else {
      currentIndex.value++
    }

    updateCanState()
    console.log(`[History] Committed snapshot, index: ${currentIndex.value}`)
  }

  /**
   * 撤销
   */
  function undo() {
    if (currentIndex.value <= 0) {
      console.warn('[History] Cannot undo')
      return
    }

    currentIndex.value--
    const snapshot = history.value[currentIndex.value]
    componentStore.setTree(cloneDeep(snapshot))

    updateCanState()
    console.log(`[History] Undo to index: ${currentIndex.value}`)
  }

  /**
   * 重做
   */
  function redo() {
    if (currentIndex.value >= history.value.length - 1) {
      console.warn('[History] Cannot redo')
      return
    }

    currentIndex.value++
    const snapshot = history.value[currentIndex.value]
    componentStore.setTree(cloneDeep(snapshot))

    updateCanState()
    console.log(`[History] Redo to index: ${currentIndex.value}`)
  }

  /**
   * 清空历史
   */
  function clear() {
    history.value = []
    currentIndex.value = -1
    updateCanState()
    console.log('[History] Cleared')
  }

  /**
   * 初始化历史（保存初始状态）
   */
  function init() {
    clear()
    commit()
    console.log('[History] Initialized')
  }

  /**
   * 更新 canUndo 和 canRedo 状态
   */
  function updateCanState() {
    canUndo.value = currentIndex.value > 0
    canRedo.value = currentIndex.value < history.value.length - 1
  }

  return {
    // State
    history,
    currentIndex,
    maxSize,
    canUndo,
    canRedo,

    // Actions
    commit,
    undo,
    redo,
    clear,
    init,
  }
})
