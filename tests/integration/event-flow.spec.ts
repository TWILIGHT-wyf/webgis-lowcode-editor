import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useComponent } from '@/stores/component'
import { provideComponentEvents } from '@/components/siderBar/events/events'
import type { Component, EventAction } from '@/types/components'

/*
  tests/integration/event-flow.spec.ts
  目的：集成测试事件运行时系统 (Runtime Event System)
  核心：验证 provideComponentEvents 提供的 executeAction 能否正确修改组件状态
*/

describe('集成：事件运行时 (Runtime Event Flow)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // 1. 辅助组件：用于在 Vue 上下文中提供事件系统，并暴露 context 给测试用例
  const TestHost = defineComponent({
    setup() {
      // 在 setup 中调用，模拟真实运行环境
      const context = provideComponentEvents()
      return { context }
    },
    template: '<div></div>',
  })

  // 2. 辅助函数：初始化 Store 并挂载测试宿主
  function setupIntegration() {
    const componentStore = useComponent()

    // 初始化两个测试组件
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

    // 挂载组件以获取 context
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

    // 监听目标组件的 highlight 事件
    context.registerListener(targetComp.id, 'highlight', onHighlight)

    const action: EventAction = {
      id: 'act-2',
      type: 'highlight',
      targetId: targetComp.id,
    }

    await context.executeAction(action)

    // 验证事件是否被正确分发到了组件
    expect(onHighlight).toHaveBeenCalledTimes(1)
    expect(onHighlight).toHaveBeenCalledWith(expect.objectContaining({ duration: 2000 }))
  })

  it('动作：custom-script 应能通过脚本修改组件属性', async () => {
    const { componentStore, context, sourceComp } = setupIntegration()

    // 编写一段脚本：修改 source 组件的 props.text
    // 注意：在 executeAction 的 new Function 中，component 指向 sourceComponent
    const scriptContent = `
      component.props.text = 'Text Updated via Script';
      // 也可以访问全局 components
      const target = components.find(c => c.id === 'box-1');
      if(target) target.style.opacity = 1;
    `

    const action: EventAction = {
      id: 'act-3',
      type: 'custom-script',
      content: scriptContent,
    }

    await context.executeAction(action, sourceComp)

    // 验证 1：源组件属性被修改
    const updatedSource = componentStore.componentStore.find((c) => c.id === 'btn-1')
    expect(updatedSource?.props.text).toBe('Text Updated via Script')

    // 验证 2：目标组件样式被修改（跨组件操作）
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
        // 条件：源组件的 text 必须等于 'Go'
        expression: "component.props.text === 'Go'",
      },
    }

    // 1. 当前 text 是 'Click Me'，条件不满足
    await context.executeAction(action, sourceComp)
    // 断言：target 依然是隐藏的 (未执行 toggle)
    expect(componentStore.componentStore[1].style.visible).toBe(false)

    // 2. 修改 text 为 'Go'
    sourceComp.props.text = 'Go'

    // 3. 再次执行
    await context.executeAction(action, sourceComp)
    // 断言：target 变为可见 (执行了 toggle)
    expect(componentStore.componentStore[1].style.visible).toBe(true)
  })
})
