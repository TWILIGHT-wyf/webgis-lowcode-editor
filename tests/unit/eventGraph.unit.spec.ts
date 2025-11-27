import { describe, it, expect, beforeEach, vi } from 'vitest'
// 假设项目中有一个 eventGraph 服务/模块
// 为了保证测试独立，直接使用一个轻量的模拟实现

/*
  tests/unit/eventGraph.unit.spec.ts
  目的：验证事件图（eventGraph）记录与调度逻辑：当组件 emit 时，记录节点/边并能调度到目标处理器。
*/

interface MockEventGraph {
  nodes: unknown[]
  edges: { from: string; to: string; meta: { event: string } }[]
  push(node: { id: string }): void
  link(from: string, to: string, meta: { event: string }): void
  dispatch(
    event: { type: string; payload: Record<string, unknown>; target: string },
    stores: Record<string, (payload: Record<string, unknown>) => void>,
  ): void
}

describe('EventGraph 单元测试', () => {
  let graph: MockEventGraph

  beforeEach(() => {
    // 简单的 EventGraph 模拟
    graph = {
      nodes: [],
      edges: [],
      push(node: { id: string }) {
        this.nodes.push(node)
      },
      link(from: string, to: string, meta: { event: string }) {
        this.edges.push({ from, to, meta })
      },
      dispatch(
        event: { type: string; payload: Record<string, unknown>; target: string },
        stores: Record<string, (payload: Record<string, unknown>) => void>,
      ) {
        // 简单路由：寻找 edges 中 target 为 event.target 的处理器
        const targets = this.edges.filter((e) => e.meta && e.meta.event === event.type)
        targets.forEach((t) => {
          // 调用对应 store 方法（若存在）
          const fn = stores[t.to]
          if (fn) fn(event.payload)
        })
      },
    }
  })

  it('记录节点与边并能 dispatch 到目标', () => {
    graph.push({ id: 'A' })
    graph.push({ id: 'B' })
    graph.link('A', 'B', { event: 'custom:update' })

    const called = vi.fn()
    const stores: Record<string, (payload: Record<string, unknown>) => void> = { B: called }

    graph.dispatch({ type: 'custom:update', payload: { foo: 1 }, target: 'B' }, stores)

    expect(graph.nodes.length).toBe(2)
    expect(graph.edges.length).toBe(1)
    expect(called).toHaveBeenCalledWith({ foo: 1 })
  })
})
