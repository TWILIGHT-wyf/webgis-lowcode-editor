import { ref } from 'vue'
import type { Ref } from 'vue'
import { debounce, throttle } from 'lodash-es'
import type { HistoryApi } from '@vela/core/types/store'
import { cloneDeep } from 'lodash-es'
import {
  MAX_HISTORY_SIZE,
  HISTORY_DEBOUNCE_DELAY,
  HISTORY_THROTTLE_INTERVAL,
} from '@vela/core/constants/editor'

export interface HistoryOptions {
  /** 历史记录最大栈深度，默认 50 */
  maxSize?: number
}

export function createHistory<T extends object>(
  source: Ref<T[]>,
  options: HistoryOptions = {},
): HistoryApi {
  const maxSize = options.maxSize ?? MAX_HISTORY_SIZE

  const history = ref<T[][]>([]) as Ref<T[][]>
  const future = ref<T[][]>([]) as Ref<T[][]>
  let lastSerialized = ''

  function createSnapshot(): T[] {
    return cloneDeep(source.value)
  }

  function applySnapshot(snap: T[]) {
    source.value = cloneDeep(snap)
  }

  function commit(force = false) {
    const snap = createSnapshot()
    const serialized = JSON.stringify(snap)
    if (!force && serialized === lastSerialized) return

    history.value.push(snap)

    // 限制历史栈深度，超出时移除最早的记录
    while (history.value.length > maxSize) {
      history.value.shift()
    }

    future.value.length = 0
    lastSerialized = serialized
  }

  function canUndo() {
    return history.value.length > 1
  }
  function canRedo() {
    return future.value.length > 0
  }

  function undo() {
    if (history.value.length < 2) return
    const current = history.value.pop()!
    future.value.push(current)
    const prev = history.value[history.value.length - 1]!
    applySnapshot(prev)
    lastSerialized = JSON.stringify(prev)
  }

  function redo() {
    if (future.value.length === 0) return
    const next = future.value.pop()!
    history.value.push(next)
    applySnapshot(next)
    lastSerialized = JSON.stringify(next)
  }

  const commitDebounced = debounce(() => commit(), HISTORY_DEBOUNCE_DELAY)
  const commitThrottled = throttle(() => commit(), HISTORY_THROTTLE_INTERVAL)

  function init() {
    commit(true)
  }

  return {
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    commitDebounced,
    commitThrottled,
    init,
  }
}
