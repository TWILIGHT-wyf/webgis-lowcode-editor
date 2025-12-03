import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useComponent } from '@/stores/component'
import { provideComponentEvents } from '@/components/siderBar/events/events'
import type { Component, EventAction } from '@/types/components'

/*
  tests/integration/event-flow.spec.ts
  目的：集成测试事件运行时系统 (Runtime Event System)
  核心：
  1. 验证 provideComponentEvents 提供的 executeAction 能否正确修改组件状态
  2. 测试组件间联动 (Cross-Component Interaction)
  3. 测试动作执行器 (Action Executor)
  4. 测试事件冒泡与传递
*/

// ==================== 场景 A: 组件间联动测试 ====================
describe('集成：组件间联动 (Cross-Component Interaction)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // 辅助组件：用于在 Vue 上下文中提供事件系统
  const TestHost = defineComponent({
    setup() {
      const context = provideComponentEvents()
      return { context }
    },
    template: '<div></div>',
  })

  // 辅助函数：初始化 Store 并挂载测试宿主
  function setupIntegration() {
    const componentStore = useComponent()

    // 初始化 Button 和 Text 组件
    const buttonComp: Component = {
      id: 'btn-1',
      type: 'Button',
      name: 'Toggle Button',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      rotation: 0,
      zindex: 1,
      style: { visible: true },
      props: { text: 'Click Me' },
      events: {
        click: [
          {
            id: 'act-toggle',
            type: 'toggle-visibility',
            targetId: 'txt-1',
          },
        ],
      },
    }

    const textComp: Component = {
      id: 'txt-1',
      type: 'Text',
      name: 'Target Text',
      position: { x: 200, y: 0 },
      size: { width: 200, height: 40 },
      rotation: 0,
      zindex: 1,
      style: { visible: true },
      props: { text: 'Hello World' },
    }

    const boxComp: Component = {
      id: 'box-1',
      type: 'Box',
      name: 'Target Box',
      position: { x: 200, y: 100 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zindex: 1,
      style: { visible: false, opacity: 0.5 },
      props: {},
    }

    componentStore.componentStore = [buttonComp, textComp, boxComp]

    const wrapper = mount(TestHost)
    const context = wrapper.vm.context

    return { componentStore, context, buttonComp, textComp, boxComp, wrapper }
  }

  it('场景A: Button 点击应切换 Text 组件的可见性', async () => {
    const { componentStore, context, buttonComp } = setupIntegration()

    // 1. 初始状态：Text 组件可见
    const textInitial = componentStore.componentStore.find((c) => c.id === 'txt-1')
    expect(textInitial?.style.visible).toBe(true)

    // 2. 执行 Button 的 click 事件动作
    const clickAction = buttonComp.events?.click?.[0]
    expect(clickAction).toBeDefined()

    await context.executeAction(clickAction!, buttonComp)

    // 3. 断言：Text 组件变为不可见
    const textAfterClick = componentStore.componentStore.find((c) => c.id === 'txt-1')
    expect(textAfterClick?.style.visible).toBe(false)

    // 4. 再次点击
    await context.executeAction(clickAction!, buttonComp)

    // 5. 断言：Text 组件恢复可见
    const textAfterSecondClick = componentStore.componentStore.find((c) => c.id === 'txt-1')
    expect(textAfterSecondClick?.style.visible).toBe(true)
  })

  it('场景A: 多个动作按顺序执行', async () => {
    const { componentStore, context, buttonComp, textComp, boxComp } = setupIntegration()

    // 配置多个动作
    const actions: EventAction[] = [
      { id: 'act-1', type: 'toggle-visibility', targetId: 'txt-1' },
      { id: 'act-2', type: 'toggle-visibility', targetId: 'box-1' },
    ]

    // 初始状态
    expect(textComp.style.visible).toBe(true)
    expect(boxComp.style.visible).toBe(false)

    // 依次执行动作
    for (const action of actions) {
      await context.executeAction(action, buttonComp)
    }

    // 验证两个组件都被切换了
    const updatedText = componentStore.componentStore.find((c) => c.id === 'txt-1')
    const updatedBox = componentStore.componentStore.find((c) => c.id === 'box-1')

    expect(updatedText?.style.visible).toBe(false)
    expect(updatedBox?.style.visible).toBe(true)
  })
})

// ==================== 场景 B: 动作执行器测试 ====================
describe('集成：动作执行器 (Action Executor)', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    setActivePinia(createPinia())
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    windowOpenSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  const TestHost = defineComponent({
    setup() {
      const context = provideComponentEvents()
      return { context }
    },
    template: '<div></div>',
  })

  function setupIntegration() {
    const componentStore = useComponent()

    const sourceComp: Component = {
      id: 'source-1',
      type: 'Button',
      name: 'Source',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      rotation: 0,
      zindex: 1,
      style: { visible: true },
      props: { text: 'Click Me' },
    }

    const targetComp: Component = {
      id: 'target-1',
      type: 'Box',
      name: 'Target',
      position: { x: 200, y: 0 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zindex: 1,
      style: { visible: true, opacity: 0.5 },
      props: { text: 'Target Text' },
    }

    componentStore.componentStore = [sourceComp, targetComp]

    const wrapper = mount(TestHost)
    const context = wrapper.vm.context

    return { componentStore, context, sourceComp, targetComp, wrapper }
  }

  it('场景B: show-tooltip 应调用事件分发（模拟 ElMessage）', async () => {
    const { context, sourceComp } = setupIntegration()

    const tooltipHandler = vi.fn()
    context.registerListener('global', 'show-tooltip', tooltipHandler)

    const action: EventAction = {
      id: 'act-tooltip',
      type: 'show-tooltip',
      content: '这是一条提示信息',
    }

    await context.executeAction(action, sourceComp)

    expect(tooltipHandler).toHaveBeenCalledTimes(1)
    expect(tooltipHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '这是一条提示信息',
        sourceId: 'source-1',
      }),
    )
  })

  it('场景B: custom-script 应正确执行并修改组件状态', async () => {
    const { componentStore, context, sourceComp } = setupIntegration()

    const scriptContent = `
      component.props.text = 'Script Modified';
      const target = components.find(c => c.id === 'target-1');
      if (target) {
        target.style.opacity = 1;
        target.props.text = 'Also Modified';
      }
    `

    const action: EventAction = {
      id: 'act-script',
      type: 'custom-script',
      content: scriptContent,
    }

    await context.executeAction(action, sourceComp)

    // 验证源组件被修改
    const updatedSource = componentStore.componentStore.find((c) => c.id === 'source-1')
    expect(updatedSource?.props.text).toBe('Script Modified')

    // 验证目标组件被修改（跨组件操作）
    const updatedTarget = componentStore.componentStore.find((c) => c.id === 'target-1')
    expect(updatedTarget?.style.opacity).toBe(1)
    expect(updatedTarget?.props.text).toBe('Also Modified')
  })

  it('场景B: custom-script 错误不应导致崩溃', async () => {
    const { context, sourceComp } = setupIntegration()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const action: EventAction = {
      id: 'act-bad-script',
      type: 'custom-script',
      content: 'throw new Error("Intentional error")',
    }

    // 不应抛出错误
    await expect(context.executeAction(action, sourceComp)).resolves.toBeUndefined()

    // 应记录错误
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('场景B: highlight 动作应触发高亮事件', async () => {
    const { context } = setupIntegration()

    const highlightHandler = vi.fn()
    context.registerListener('target-1', 'highlight', highlightHandler)

    const action: EventAction = {
      id: 'act-highlight',
      type: 'highlight',
      targetId: 'target-1',
    }

    await context.executeAction(action)

    expect(highlightHandler).toHaveBeenCalledTimes(1)
    expect(highlightHandler).toHaveBeenCalledWith(expect.objectContaining({ duration: 2000 }))
  })

  it('场景B: 延迟执行动作', async () => {
    vi.useFakeTimers()

    const { componentStore, context } = setupIntegration()

    const action: EventAction = {
      id: 'act-delayed',
      type: 'toggle-visibility',
      targetId: 'target-1',
      delay: 100,
    }

    // 初始状态
    expect(componentStore.componentStore.find((c) => c.id === 'target-1')?.style.visible).toBe(true)

    const promise = context.executeAction(action)

    // 延迟前不应执行
    expect(componentStore.componentStore.find((c) => c.id === 'target-1')?.style.visible).toBe(true)

    // 快进时间
    await vi.advanceTimersByTimeAsync(100)
    await promise

    // 延迟后应执行
    expect(componentStore.componentStore.find((c) => c.id === 'target-1')?.style.visible).toBe(
      false,
    )

    vi.useRealTimers()
  })
})

// ==================== 场景 C: 事件冒泡与传递 ====================
describe('集成：事件冒泡与传递 (Event Bubbling)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const TestHost = defineComponent({
    setup() {
      const context = provideComponentEvents()
      return { context }
    },
    template: '<div></div>',
  })

  function setupIntegration() {
    const componentStore = useComponent()

    const parentComp: Component = {
      id: 'parent-1',
      type: 'Group',
      name: 'Parent Group',
      position: { x: 0, y: 0 },
      size: { width: 400, height: 400 },
      rotation: 0,
      zindex: 1,
      style: { visible: true },
      props: {},
    }

    const childComp: Component = {
      id: 'child-1',
      type: 'Button',
      name: 'Child Button',
      position: { x: 10, y: 10 },
      size: { width: 100, height: 40 },
      rotation: 0,
      zindex: 2,
      style: { visible: true },
      props: { text: 'Child' },
      groupId: 'parent-1',
    }

    componentStore.componentStore = [parentComp, childComp]

    const wrapper = mount(TestHost)
    const context = wrapper.vm.context

    return { componentStore, context, parentComp, childComp, wrapper }
  }

  it('场景C: 子组件事件能被父组件监听', async () => {
    const { context, childComp } = setupIntegration()

    const parentHandler = vi.fn()
    const childHandler = vi.fn()

    // 注册监听器
    context.registerListener('parent-1', 'child-clicked', parentHandler)
    context.registerListener('child-1', 'click', childHandler)

    // 子组件触发事件
    context.emitComponentEvent('child-1', 'click', { x: 10, y: 20 })

    // 子组件监听器被调用
    expect(childHandler).toHaveBeenCalledWith({ x: 10, y: 20 })

    // 通过 custom-event 动作传递给父组件
    const action: EventAction = {
      id: 'act-propagate',
      type: 'custom-event',
      eventName: 'child-clicked',
      targetId: 'parent-1',
      eventParams: JSON.stringify({ source: 'child-1' }),
    }

    await context.executeAction(action, childComp)

    // 父组件监听器被调用
    expect(parentHandler).toHaveBeenCalledWith({ source: 'child-1' })
  })

  it('场景C: 事件监听器可以正确注销', async () => {
    const { context } = setupIntegration()

    const handler = vi.fn()

    // 注册监听器
    context.registerListener('child-1', 'test-event', handler)

    // 触发事件
    context.emitComponentEvent('child-1', 'test-event', { data: 1 })
    expect(handler).toHaveBeenCalledTimes(1)

    // 注销监听器
    context.unregisterListener('child-1', 'test-event')

    // 再次触发事件
    context.emitComponentEvent('child-1', 'test-event', { data: 2 })

    // 监听器不再被调用
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('场景C: 多个监听器可以同时响应同一事件', async () => {
    const { context } = setupIntegration()

    const handler1 = vi.fn()
    const handler2 = vi.fn()

    // 注册多个监听器
    context.registerListener('child-1', 'multi-event', handler1)
    context.registerListener('child-1', 'multi-event', handler2)

    // 触发事件
    context.emitComponentEvent('child-1', 'multi-event', { value: 'test' })

    // 两个监听器都被调用
    expect(handler1).toHaveBeenCalledWith({ value: 'test' })
    expect(handler2).toHaveBeenCalledWith({ value: 'test' })
  })
})

// ==================== 原有测试: 事件运行时 ====================
describe('集成：事件运行时 (Runtime Event Flow)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const TestHost = defineComponent({
    setup() {
      const context = provideComponentEvents()
      return { context }
    },
    template: '<div></div>',
  })

  function setupIntegration() {
    const componentStore = useComponent()

    const sourceComp: Component = {
      id: 'btn-1',
      type: 'Button',
      name: 'Source Button',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      rotation: 0,
      zindex: 1,
      style: { visible: true },
      props: { text: 'Click Me' },
    }

    const targetComp: Component = {
      id: 'box-1',
      type: 'Box',
      name: 'Target Box',
      position: { x: 200, y: 0 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zindex: 1,
      style: { visible: false, opacity: 0.5 },
      props: { text: 'I am hidden' },
    }

    componentStore.componentStore = [sourceComp, targetComp]

    const wrapper = mount(TestHost)
    const context = wrapper.vm.context

    return { componentStore, context, sourceComp, targetComp }
  }

  it('动作：toggle-visibility 应能切换目标组件的可见性', async () => {
    const { componentStore, context, targetComp } = setupIntegration()

    const action: EventAction = {
      id: 'act-1',
      type: 'toggle-visibility',
      targetId: targetComp.id,
    }

    // 1. 初始状态：不可见
    expect(componentStore.componentStore[1].style.visible).toBe(false)

    // 2. 执行动作
    await context.executeAction(action)

    // 3. 断言：变为可见
    expect(componentStore.componentStore[1].style.visible).toBe(true)

    // 4. 再次执行
    await context.executeAction(action)

    // 5. 断言：再次变为不可见
    expect(componentStore.componentStore[1].style.visible).toBe(false)
  })

  it('动作：highlight 应触发高亮事件分发', async () => {
    const { context, targetComp } = setupIntegration()
    const onHighlight = vi.fn()

    context.registerListener(targetComp.id, 'highlight', onHighlight)

    const action: EventAction = {
      id: 'act-2',
      type: 'highlight',
      targetId: targetComp.id,
    }

    await context.executeAction(action)

    expect(onHighlight).toHaveBeenCalledTimes(1)
    expect(onHighlight).toHaveBeenCalledWith(expect.objectContaining({ duration: 2000 }))
  })

  it('动作：custom-script 应能通过脚本修改组件属性', async () => {
    const { componentStore, context, sourceComp } = setupIntegration()

    const scriptContent = `
      component.props.text = 'Text Updated via Script';
      const target = components.find(c => c.id === 'box-1');
      if(target) target.style.opacity = 1;
    `

    const action: EventAction = {
      id: 'act-3',
      type: 'custom-script',
      content: scriptContent,
    }

    await context.executeAction(action, sourceComp)

    const updatedSource = componentStore.componentStore.find((c) => c.id === 'btn-1')
    expect(updatedSource?.props.text).toBe('Text Updated via Script')

    const updatedTarget = componentStore.componentStore.find((c) => c.id === 'box-1')
    expect(updatedTarget?.style.opacity).toBe(1)
  })

  it('条件执行：不满足条件时应跳过动作', async () => {
    const { componentStore, context, sourceComp, targetComp } = setupIntegration()

    const action: EventAction = {
      id: 'act-4',
      type: 'toggle-visibility',
      targetId: targetComp.id,
      condition: {
        enabled: true,
        expression: "component.props.text === 'Go'",
      },
    }

    // 1. 当前 text 是 'Click Me'，条件不满足
    await context.executeAction(action, sourceComp)
    expect(componentStore.componentStore[1].style.visible).toBe(false)

    // 2. 修改 text 为 'Go'
    sourceComp.props.text = 'Go'

    // 3. 再次执行
    await context.executeAction(action, sourceComp)
    expect(componentStore.componentStore[1].style.visible).toBe(true)
  })
})
