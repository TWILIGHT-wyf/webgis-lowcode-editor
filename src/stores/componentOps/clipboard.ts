import { ref } from 'vue'
import { nanoid } from 'nanoid'
import type { Ref } from 'vue'

export interface ClipboardApi<C> {
  clipboard: Ref<C[]>
  copy: (id: string) => void
  cut: (id: string) => void
  copyMultiple: (ids: string[]) => void
  cutMultiple: (ids: string[]) => void
  paste: (position: { x: number; y: number }) => void
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function createClipboard<
  C extends {
    id: string
    type: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    rotation: number
    zindex: number
    style: Record<string, unknown>
    props: Record<string, unknown>
    groupId?: string
    children?: string[]
  },
>(
  componentStore: Ref<C[]>,
  deps: {
    selectedId: (id: string) => void
    selectMultiple: (ids: string[]) => void
    commit: (force?: boolean) => void
  },
): ClipboardApi<C> {
  const clipboard = ref<C[]>([]) as unknown as Ref<C[]>

  function snapshotWithoutGrouping(comp: C): C {
    const snap = deepClone(comp) as C & { groupId?: string; children?: string[] }
    delete snap.groupId
    delete snap.children
    return snap as C
  }

  function resolveCopyTargets(ids: string[]): C[] {
    const result: C[] = []
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
    idsToRemove.forEach((rid) => {
      const idx = componentStore.value.findIndex((c) => c.id === rid)
      if (idx > -1) componentStore.value.splice(idx, 1)
    })
    deps.commit()
  }

  function copyMultiple(ids: string[]) {
    const comps = resolveCopyTargets(ids)
    if (comps.length === 0) return
    clipboard.value = comps.map((c) => snapshotWithoutGrouping(c))
  }

  function cutMultiple(ids: string[]) {
    const comps = resolveCopyTargets(ids)
    if (comps.length === 0) return
    clipboard.value = comps.map((c) => snapshotWithoutGrouping(c))
    const idsToRemove = comps.map((c) => c.id)
    idsToRemove.forEach((rid) => {
      const idx = componentStore.value.findIndex((c) => c.id === rid)
      if (idx > -1) componentStore.value.splice(idx, 1)
    })
    deps.selectMultiple([])
    deps.commit()
  }

  function paste(position: { x: number; y: number }) {
    if (clipboard.value.length === 0) return

    const maxZ = componentStore.value.reduce(
      (max, c) => Math.max(max, (c.zindex as number) ?? 0),
      0,
    )

    if (clipboard.value.length === 1) {
      const lastComp = clipboard.value[0]!
      const base = snapshotWithoutGrouping(lastComp as unknown as C)
      const newComp = {
        ...base,
        id: nanoid(),
        position: { x: position.x, y: position.y },
        zindex: maxZ + 1,
      } as C
      componentStore.value.push(newComp)
      deps.selectedId(newComp.id)
      deps.commit()
    } else {
      const snaps = clipboard.value.map((c) => snapshotWithoutGrouping(c as unknown as C))
      const anchor = snaps[0]!
      const newIds: string[] = []
      const timestamp = nanoid()

      const expectedPos: Record<string, { x: number; y: number }> = {}
      snaps.forEach((comp, index) => {
        const offsetX = comp.position.x - anchor.position.x
        const offsetY = comp.position.y - anchor.position.y
        const expectedX = position.x + offsetX
        const expectedY = position.y + offsetY
        const newComp = {
          ...comp,
          id: `${timestamp}_${index}`,
          position: { x: expectedX, y: expectedY },
          zindex: maxZ + 1 + index,
        } as C
        expectedPos[newComp.id] = { x: expectedX, y: expectedY }
        componentStore.value.push(newComp)
        newIds.push(newComp.id)
      })

      deps.selectMultiple(newIds)
      setTimeout(() => {
        let changedAny = false
        newIds.forEach((id) => {
          const comp = componentStore.value.find((c) => c.id === id)
          const exp = expectedPos[id]
          if (!comp || !exp) return
          const changed = comp.position.x !== exp.x || comp.position.y !== exp.y
          if (changed) {
            comp.position.x = exp.x
            comp.position.y = exp.y
            changedAny = true
          }
        })
        deps.commit()
        if (changedAny) deps.commit()
      }, 0)
    }
  }

  return { clipboard, copy, cut, copyMultiple, cutMultiple, paste }
}
