import type { Ref } from 'vue'
import { nanoid } from 'nanoid'
import type { GroupingApi } from '@lowcode/core/types/store'
import type { BaseComponent } from './types'

export function createGrouping<C extends BaseComponent>(
  componentStore: Ref<C[]>,
  deps: {
    selectedId: (id: string) => void
    selectMultiple: (ids: string[]) => void
    commit: (force?: boolean) => void
  },
): GroupingApi {
  function groupComponents(ids: string[]) {
    if (ids.length < 2) return

    const members = ids
      .map((id) => componentStore.value.find((c) => c.id === id))
      .filter((c): c is C => c !== undefined)
    if (members.length < 2) return

    const minX = Math.min(...members.map((c) => c.position.x))
    const minY = Math.min(...members.map((c) => c.position.y))
    const maxX = Math.max(...members.map((c) => c.position.x + c.size.width))
    const maxY = Math.max(...members.map((c) => c.position.y + c.size.height))

    const groupId = `group_${nanoid()}`

    // 创建 Group 组件，使用 as unknown as C 确保类型安全
    const groupComponent = {
      id: groupId,
      type: 'Group',
      position: { x: minX, y: minY },
      size: { width: maxX - minX, height: maxY - minY },
      rotation: 0,
      zindex: Math.min(...members.map((c) => c.zindex)) - 1,
      style: { opacity: 100, visible: true, locked: false },
      props: {},
      children: [...ids],
    } as unknown as C

    members.forEach((comp) => {
      comp.groupId = groupId
    })

    componentStore.value.push(groupComponent)
    deps.selectedId(groupId)
    deps.commit()
  }

  function ungroupComponents(groupId: string) {
    const group = componentStore.value.find((c) => c.id === groupId)
    if (!group || group.type !== 'Group' || !group.children) return

    const expectedPos: Record<string, { x: number; y: number }> = {}
    group.children.forEach((childId) => {
      const child = componentStore.value.find((c) => c.id === childId)
      if (child) expectedPos[childId] = { x: child.position.x, y: child.position.y }
    })

    group.children.forEach((childId) => {
      const child = componentStore.value.find((c) => c.id === childId)
      if (child) {
        delete child.groupId
      }
    })

    const index = componentStore.value.findIndex((c) => c.id === groupId)
    if (index > -1) componentStore.value.splice(index, 1)

    deps.selectMultiple(group.children)
    setTimeout(() => {
      let changedAny = false
      group.children?.forEach((childId) => {
        const child = componentStore.value.find((c) => c.id === childId)
        const exp = expectedPos[childId]
        if (!child || !exp) return
        if (child.position.x !== exp.x || child.position.y !== exp.y) {
          child.position.x = exp.x
          child.position.y = exp.y
          changedAny = true
        }
      })
      deps.commit()
      if (changedAny) deps.commit()
    }, 0)
  }

  return { groupComponents, ungroupComponents }
}
