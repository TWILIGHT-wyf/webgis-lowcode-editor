/**
 * Shape 操作框测试：选中、8 点缩放、平移
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Shape from '../../src/components/Editor/shape/shape.vue'
import { ref } from 'vue'
import { ComponentEventsKey } from '../../src/components/siderBar/events/events'
import { setActivePinia, createPinia } from 'pinia'
import { useComponent } from '../../src/stores/component'
import type { component } from '../../src/stores/component'

describe('Shape 组件', () => {
  it('props 渲染与 slot', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Shape, {
      props: { id: 's1', width: 100, height: 80 },
      slots: { default: '<div>内部内容</div>' },
      global: {
        plugins: [pinia],
        provide: {
          canvasWrapRef: ref(null),
          [ComponentEventsKey]: {
            emitComponentEvent: () => {},
            executeAction: async () => {},
            registerListener: () => {},
            unregisterListener: () => {},
          },
        },
      },
    })
    expect(wrapper.text()).toContain('内部内容')
  })

  it('缩放控制点点击触发事件', async () => {
    // 确保 Pinia 激活并设置选中组件，以便 handles 被渲染
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useComponent()
    // 直接注入一个组件记录并选中它
    ;(
      store as ReturnType<typeof useComponent> & {
        componentStore: ReturnType<typeof useComponent>['componentStore']
      }
    ).componentStore.push({
      id: 's2',
      type: 'box',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 80 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {},
    })
    store.selectedIds = ['s2']

    const wrapper = mount(Shape, {
      props: { id: 's2' },
      global: {
        plugins: [pinia],
        provide: {
          canvasWrapRef: ref(null),
          [ComponentEventsKey]: {
            emitComponentEvent: () => {},
            executeAction: async () => {},
            registerListener: () => {},
            unregisterListener: () => {},
          },
        },
      },
    })

    const handle = wrapper.find('.shape-handle.se')
    // 确认缩放句柄存在
    expect(handle.exists()).toBe(true)

    // 记录初始尺寸
    const initialComponent = store.componentStore.find((c: component) => c.id === 's2')
    expect(initialComponent).toBeTruthy()
    const initialWidth = initialComponent!.size.width
    const initialHeight = initialComponent!.size.height

    // 使用 mouse 事件模拟缩放（组件模板使用 mousedown 绑定）
    // 先触发 mousedown
    await handle.trigger('mousedown', { clientX: 100, clientY: 100 })

    // 然后模拟 window 的 mousemove 事件
    const mousemoveEvent = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 200,
      bubbles: true,
    })
    window.dispatchEvent(mousemoveEvent)

    // 最后触发 mouseup
    const mouseupEvent = new MouseEvent('mouseup', {
      bubbles: true,
    })
    window.dispatchEvent(mouseupEvent)

    // 验证组件尺寸实际发生了变化
    const updatedComponent = store.componentStore.find((c: component) => c.id === 's2')
    expect(updatedComponent).toBeTruthy()
    expect(updatedComponent!.size.width).toBeGreaterThan(initialWidth)
    expect(updatedComponent!.size.height).toBeGreaterThan(initialHeight)
  })

  it('最小尺寸限制应生效', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useComponent()

    store.componentStore.push({
      id: 's3',
      type: 'box',
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      zindex: 1,
      style: {},
      props: {},
    })
    store.selectedIds = ['s3']

    const wrapper = mount(Shape, {
      props: { id: 's3' },
      global: {
        plugins: [pinia],
        provide: {
          canvasWrapRef: ref(null),
          [ComponentEventsKey]: {
            emitComponentEvent: () => {},
            executeAction: async () => {},
            registerListener: () => {},
            unregisterListener: () => {},
          },
        },
      },
    })

    const handle = wrapper.find('.shape-handle.nw')
    expect(handle.exists()).toBe(true)

    // 尝试缩小到小于最小尺寸
    await handle.trigger('mousedown', { clientX: 50, clientY: 50 })
    await handle.trigger('mousemove', { clientX: 200, clientY: 200 }) // 大幅移动，应该被限制
    await handle.trigger('mouseup')

    const updatedComponent = store.componentStore.find((c: component) => c.id === 's3')
    expect(updatedComponent).toBeTruthy()
    expect(updatedComponent!.size.width).toBeGreaterThanOrEqual(10)
    expect(updatedComponent!.size.height).toBeGreaterThanOrEqual(10)
  })

  it('锁定组件不应响应缩放', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useComponent()

    store.componentStore.push({
      id: 's4',
      type: 'box',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zindex: 1,
      style: { locked: true },
      props: {},
    })
    store.selectedIds = ['s4']

    const wrapper = mount(Shape, {
      props: { id: 's4' },
      global: {
        plugins: [pinia],
        provide: {
          canvasWrapRef: ref(null),
          [ComponentEventsKey]: {
            emitComponentEvent: () => {},
            executeAction: async () => {},
            registerListener: () => {},
            unregisterListener: () => {},
          },
        },
      },
    })

    // 锁定组件不应该显示缩放句柄
    const handle = wrapper.find('.shape-handle')
    expect(handle.exists()).toBe(false)
  })
})
