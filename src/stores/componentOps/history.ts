import { ref } from 'vue'
import type { Ref } from 'vue'
import { throttle, debounce } from '@/utils/throttleDebounce'
import type { HistoryApi } from '@/types/store'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function createHistory<T extends object>(source: Ref<T[]>): HistoryApi {
  const history = ref<T[][]>([]) as Ref<T[][]>
  const future = ref<T[][]>([]) as Ref<T[][]>
  let lastSerialized = ''

  function createSnapshot(): T[] {
    return deepClone(source.value)
  }

  function applySnapshot(snap: T[]) {
    source.value = deepClone(snap)
  }

  function commit(force = false) {
    const snap = createSnapshot()
    const serialized = JSON.stringify(snap)
    if (!force && serialized === lastSerialized) return
    history.value.push(snap)
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

  const commitDebounced = debounce(() => commit(), 120)
  const commitThrottled = throttle(() => commit(), 200)

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
