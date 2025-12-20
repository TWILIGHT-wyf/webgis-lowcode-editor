/**
 * 事件执行器单元测试
 * 覆盖：动作执行、可见性切换、消息提示、导航、高亮、全屏等
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import type { Router } from 'vue-router'
import type { Component, EventAction } from '../../src/types/components'
import type { Page } from '../../src/stores/project'

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock vue-router
const mockRouter = {
  currentRoute: { value: { query: {} } },
  replace: vi.fn(),
} as unknown as Router

// 辅助函数：创建测试组件
function createComponent(partial: Partial<Component> & { id: string; type: string }): Component {
  return {
    id: partial.id,
    type: partial.type,
    name: partial.name,
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
  }
}

// 创建测试页面
function createPage(id: string, name: string, route: string): Page {
  return {
    id,
    name,
    route,
    components: [],
  }
}

describe('事件执行器 (useEventExecutor)', () => {
  let useEventExecutor: typeof import('../../src/runtime/useEventExecutor').useEventExecutor
  let ElMessage: typeof import('element-plus').ElMessage

  beforeEach(async () => {
    vi.useFakeTimers()

    // 动态导入以确保 mock 生效
    const module = await import('../../src/runtime/useEventExecutor')
    useEventExecutor = module.useEventExecutor

    const epModule = await import('element-plus')
    ElMessage = epModule.ElMessage

    // 重置 mock
    vi.clearAllMocks()
    vi.mocked(mockRouter.replace).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('可见性切换', () => {
    it('toggle-visibility 应切换组件可见状态', async () => {
      const target = createComponent({
        id: 'toggle-target',
        type: 'panel',
        style: { visible: true },
      })

      const components = ref<Component[]>([target])
      const pages = ref<Page[]>([])
      const isProjectMode = ref(false)

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
      })

      const action: EventAction = {
        id: 'action-1',
        type: 'toggle-visibility',
        targetId: 'toggle-target',
      }

      await executeAction(action)

      expect(target.style.visible).toBe(false)

      // 再次切换
      await executeAction(action)
      expect(target.style.visible).toBe(true)
    })

    it('目标组件不存在时不应抛出错误', async () => {
      const components = ref<Component[]>([])
      const pages = ref<Page[]>([])
      const isProjectMode = ref(false)

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
      })

      const action: EventAction = {
        id: 'action-2',
        type: 'toggle-visibility',
        targetId: 'not-exist',
      }

      // 不应抛出错误
      await expect(executeAction(action)).resolves.not.toThrow()
    })
  })

  describe('消息提示', () => {
    it('show-tooltip 应显示对应类型的消息', async () => {
      const components = ref<Component[]>([])
      const pages = ref<Page[]>([])
      const isProjectMode = ref(false)

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
      })

      // 测试各种消息类型
      await executeAction({
        id: 'msg-1',
        type: 'show-tooltip',
        content: '成功消息',
        messageType: 'success',
      } as EventAction & { messageType: string })

      expect(ElMessage.success).toHaveBeenCalledWith('成功消息')

      await executeAction({
        id: 'msg-2',
        type: 'show-tooltip',
        content: '警告消息',
        messageType: 'warning',
      } as EventAction & { messageType: string })

      expect(ElMessage.warning).toHaveBeenCalledWith('警告消息')

      await executeAction({
        id: 'msg-3',
        type: 'show-tooltip',
        content: '错误消息',
        messageType: 'error',
      } as EventAction & { messageType: string })

      expect(ElMessage.error).toHaveBeenCalledWith('错误消息')

      await executeAction({
        id: 'msg-4',
        type: 'show-tooltip',
        content: '普通消息',
      } as EventAction)

      expect(ElMessage.info).toHaveBeenCalledWith('普通消息')
    })
  })

  describe('页面导航', () => {
    it('navigate-page 应在项目模式下触发导航', async () => {
      const components = ref<Component[]>([])
      const pages = ref<Page[]>([
        createPage('page-1', '首页', '/home'),
        createPage('page-2', '详情页', '/detail'),
      ])
      const isProjectMode = ref(true)
      const onNavigate = vi.fn()

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
        onNavigate,
      })

      await executeAction({
        id: 'nav-1',
        type: 'navigate-page',
        targetId: 'page-2',
      })

      expect(onNavigate).toHaveBeenCalledWith('page-2')
    })

    it('非项目模式下不应触发页面导航', async () => {
      const components = ref<Component[]>([])
      const pages = ref<Page[]>([createPage('page-1', '首页', '/home')])
      const isProjectMode = ref(false) // 非项目模式
      const onNavigate = vi.fn()

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
        onNavigate,
      })

      await executeAction({
        id: 'nav-2',
        type: 'navigate-page',
        targetId: 'page-1',
      })

      expect(onNavigate).not.toHaveBeenCalled()
    })
  })

  describe('延迟执行', () => {
    it('带 delay 的动作应延迟执行', async () => {
      const target = createComponent({
        id: 'delay-target',
        type: 'panel',
        style: { visible: true },
      })

      const components = ref<Component[]>([target])
      const pages = ref<Page[]>([])
      const isProjectMode = ref(false)

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
      })

      const action: EventAction = {
        id: 'delay-action',
        type: 'toggle-visibility',
        targetId: 'delay-target',
        delay: 1000,
      }

      const promise = executeAction(action)

      // 立即检查，状态不应改变
      expect(target.style.visible).toBe(true)

      // 推进时间
      await vi.advanceTimersByTimeAsync(1000)
      await promise

      // 延迟后状态应改变
      expect(target.style.visible).toBe(false)
    })
  })

  describe('事件处理', () => {
    it('handleComponentEvent 应按顺序执行所有动作', async () => {
      const panel1 = createComponent({
        id: 'panel-1',
        type: 'panel',
        style: { visible: true },
      })

      const panel2 = createComponent({
        id: 'panel-2',
        type: 'panel',
        style: { visible: true },
      })

      const components = ref<Component[]>([panel1, panel2])
      const pages = ref<Page[]>([])
      const isProjectMode = ref(false)

      const { handleComponentEvent } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
      })

      await handleComponentEvent({
        componentId: 'trigger',
        eventType: 'click',
        actions: [
          { id: 'a1', type: 'toggle-visibility', targetId: 'panel-1' },
          { id: 'a2', type: 'toggle-visibility', targetId: 'panel-2' },
        ],
      })

      expect(panel1.style.visible).toBe(false)
      expect(panel2.style.visible).toBe(false)
    })
  })

  describe('未知动作类型', () => {
    it('未知动作类型应输出警告但不抛出错误', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const components = ref<Component[]>([])
      const pages = ref<Page[]>([])
      const isProjectMode = ref(false)

      const { executeAction } = useEventExecutor({
        components,
        pages,
        isProjectMode,
        router: mockRouter,
      })

      await expect(
        executeAction({
          id: 'unknown-action',
          type: 'unknown-type-xyz',
        }),
      ).resolves.not.toThrow()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
