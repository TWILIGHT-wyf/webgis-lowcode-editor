import type { Ref } from 'vue'
import type { ZOrderApi } from '@vela/core/types/store'

export function createZOrder<
  C extends {
    id: string
    zindex: number
  },
>(componentStore: Ref<C[]>, deps: { commit: (force?: boolean) => void }): ZOrderApi {
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
    deps.commit()
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
    deps.commit()
  }

  function bringToFront(id: string) {
    const target = componentStore.value.find((c) => c.id === id)
    if (!target) return
    const maxZ = componentStore.value.reduce(
      (max, c) => Math.max(max, (c.zindex as number) ?? 0),
      0,
    )
    target.zindex = maxZ + 1
    normalizeZ()
    deps.commit()
  }

  function sendToBack(id: string) {
    const target = componentStore.value.find((c) => c.id === id)
    if (!target) return
    const minZ = componentStore.value.reduce(
      (min, c) => Math.min(min, (c.zindex as number) ?? 0),
      0,
    )
    target.zindex = minZ - 1
    normalizeZ()
    deps.commit()
  }

  return { bringForward, sendBackward, bringToFront, sendToBack }
}
