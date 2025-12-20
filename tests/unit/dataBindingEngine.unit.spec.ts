import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, nextTick, reactive } from 'vue'
import type { Component } from '../../src/types/components'
import { useDataBindingEngine } from '../../src/stores/dataLinkage/engine'

function makeComp(partial: Partial<Component> & Pick<Component, 'id' | 'type'>): Component {
  return reactive({
    id: partial.id,
    type: partial.type,
    position: partial.position ?? { x: 0, y: 0 },
    size: partial.size ?? { width: 100, height: 100 },
    rotation: partial.rotation ?? 0,
    zindex: partial.zindex ?? 0,
    style: partial.style ?? {},
    props: partial.props ?? {},
    dataSource: partial.dataSource,
    animation: partial.animation,
    groupId: partial.groupId,
    children: partial.children,
    layout: partial.layout,
    events: partial.events,
    dataBindings: partial.dataBindings,
  }) as Component
}

describe('DataBindingEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('把 sourcePath 的值同步到 targetPath', async () => {
    const source = makeComp({ id: 's', type: 'input', props: { value: 1 } })
    const target = makeComp({
      id: 't',
      type: 'text',
      props: { text: '' },
      dataBindings: [{ sourceId: 's', sourcePath: 'props.value', targetPath: 'props.text' }],
    })

    const comps = ref<Component[]>([source, target])
    const engine = useDataBindingEngine(comps)
    engine.start()

    await nextTick()
    vi.runAllTimers()
    expect(target.props.text).toBe(1)

    source.props.value = 42
    await nextTick()
    vi.runAllTimers()
    expect(target.props.text).toBe(42)

    engine.stop()
  })
})
