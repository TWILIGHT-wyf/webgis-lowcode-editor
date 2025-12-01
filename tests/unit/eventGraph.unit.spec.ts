import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useComponent } from '@/stores/component'
import { useEventConfiguration } from '@/components/siderBar/events/events'
import type { Component, EventAction } from '@/types/components'

// 模拟 window.alert，防止测试中弹出
global.alert = vi.fn()

/*
  tests/unit/eventGraph.unit.spec.ts
  目的：验证事件配置逻辑 (useEventConfiguration)
  覆盖：点击/悬停/双击/自定义事件的增删改查，以及动作类型切换时的字段清理。
*/

describe('事件配置逻辑 (useEventConfiguration)', () => {
  beforeEach(() => {
    // 1. 初始化 Pinia 环境
    setActivePinia(createPinia())
    // 2. 每次测试前清理 alert mock 记录
    vi.clearAllMocks()
  })

  // 辅助函数：初始化 Store 并选中一个测试组件，返回环境上下文
  function setupWithComponent() {
    const store = useComponent()
    const component: Component = {
      id: 'comp-test-1',
      type: 'Button',
      name: 'TestButton',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {},
      events: {}, // 初始为空对象
    }

    // 将组件添加到 store 并选中
    store.componentStore = [component]
    store.selectedId(component.id)

    // 获取待测试的 composable
    const eventConfig = useEventConfiguration()

    return { store, component, eventConfig }
  }

  it('addClickAction 应在 events.click 数组中添加新动作', () => {
    const { eventConfig, store } = setupWithComponent()

    eventConfig.addClickAction()

    const events = store.selectComponent?.events
    expect(events?.click).toBeDefined()
    expect(events?.click?.length).toBe(1)

    // 安全访问
    const action = events?.click?.[0]
    expect(action).toBeDefined()
    expect(action?.id).toBeDefined() // 验证 id 生成 (nanoid)
    expect(action?.type).toBe('') // 初始类型为空
  })

  it('removeClickAction 应从 events.click 数组中移除动作', () => {
    const { eventConfig, store } = setupWithComponent()

    // 先添加一个
    eventConfig.addClickAction()
    expect(store.selectComponent?.events?.click?.length).toBe(1)

    // 再移除
    eventConfig.removeClickAction(0)
    expect(store.selectComponent?.events?.click?.length).toBe(0)
  })

  it('addCustomEvent 应创建一个新的自定义事件键', () => {
    const { eventConfig, store } = setupWithComponent()

    eventConfig.addCustomEvent()

    const customEvents = store.selectComponent?.events?.custom
    expect(customEvents).toBeDefined()

    if (!customEvents) return // 类型守卫

    const keys = Object.keys(customEvents)
    expect(keys.length).toBe(1)
    // 验证默认命名规则 customEvent1, customEvent2...
    expect(keys[0]).toMatch(/^customEvent\d+$/)
    expect(customEvents[keys[0]]).toEqual([])
  })

  it('renameCustomEvent 应修改自定义事件的键名并保留原有动作数据', () => {
    const { eventConfig, store } = setupWithComponent()

    // 1. 添加并获取初始名称 (通常是 customEvent1)
    eventConfig.addCustomEvent()
    const customEvents = store.selectComponent?.events?.custom

    expect(customEvents).toBeDefined()
    if (!customEvents) throw new Error('Custom events should be defined')

    const oldName = Object.keys(customEvents)[0]

    // 2. 给该事件添加一个动作，确保重命名后数据没有丢失
    eventConfig.addCustomEventAction(oldName)
    expect(customEvents[oldName].length).toBe(1)

    // 3. 执行重命名
    const newName = 'myCustomEvent'
    eventConfig.renameCustomEvent(oldName, newName)

    // 4. 验证
    expect(customEvents[oldName]).toBeUndefined() // 旧键不存在
    expect(customEvents[newName]).toBeDefined() // 新键存在
    expect(customEvents[newName].length).toBe(1) // 数据保留
  })

  it('onActionTypeChange 应根据动作类型清理不相关的字段', () => {
    const { eventConfig } = setupWithComponent()

    // 构造一个包含所有字段的“脏”动作对象
    // 使用 EventAction 类型，并包含可选字段
    const action: EventAction = {
      id: 'test-1',
      type: 'open-modal', // 初始类型：应该保留 targetId
      targetId: 'target-1',
      content: 'tooltip content', // 初始数据
      eventName: 'custom-evt',
      eventParams: '{}',
    }

    // --- 测试场景 1: 切换到 'show-tooltip' ---
    // 预期：保留 content；清理 targetId, eventName, eventParams
    action.type = 'show-tooltip'

    eventConfig.onActionTypeChange(action)

    expect(action.content).toBe('tooltip content') // show-tooltip 需要此字段
    expect(action).not.toHaveProperty('targetId') // show-tooltip 不需要此字段
    expect(action).not.toHaveProperty('eventName')
    expect(action).not.toHaveProperty('eventParams')

    // --- 测试场景 2: 切换到 'custom-event' ---
    // 预期：保留 eventName, eventParams；清理 content, targetId
    action.type = 'custom-event'
    action.eventName = 'new-evt' // 重新赋值以便测试
    action.content = 'should-be-deleted'

    eventConfig.onActionTypeChange(action)

    expect(action.eventName).toBe('new-evt')
    expect(action).not.toHaveProperty('content')
    expect(action).not.toHaveProperty('targetId')
  })
})
