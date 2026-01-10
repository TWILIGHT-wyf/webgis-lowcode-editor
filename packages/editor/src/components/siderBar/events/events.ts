import { provide, inject, type InjectionKey, computed } from 'vue'
import { useComponent } from '@/stores/component'
import type { EventAction, Component } from '@lowcode/core/types/components'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'

// 组件通信的 provide/inject key
export const ComponentEventsKey: InjectionKey<ComponentEventsContext> = Symbol('ComponentEvents')

// 事件上下文接口
export interface ComponentEventsContext {
  // 触发组件事件
  emitComponentEvent: (componentId: string, eventName: string, params?: unknown) => void
  // 执行事件动作
  executeAction: (action: EventAction, sourceComponent?: Component) => Promise<void>
  // 注册组件事件监听器
  registerListener: (componentId: string, eventName: string, handler: EventHandler) => void
  // 取消注册事件监听器
  unregisterListener: (componentId: string, eventName: string) => void
}

export type EventHandler = (params?: unknown) => void | Promise<void>

// 事件监听器存储
const eventListeners = new Map<string, Map<string, EventHandler[]>>()

/**
 * 事件配置管理 composable
 * 用于在事件面板中管理组件的事件配置
 */
export function useEventConfiguration() {
  const componentStore = useComponent()
  const { selectComponent, componentStore: components } = storeToRefs(componentStore)

  // 初始化事件对象
  function ensureEvents() {
    if (!selectComponent.value) return
    if (!selectComponent.value.events) {
      selectComponent.value.events = {}
    }
  }

  // 点击事件列表
  const clickActions = computed<EventAction[]>({
    get: () => {
      if (!selectComponent.value?.events?.click) return []
      return selectComponent.value.events.click
    },
    set: (value) => {
      if (selectComponent.value?.events) {
        selectComponent.value.events.click = value
      }
    },
  })

  // 悬停事件列表
  const hoverActions = computed<EventAction[]>({
    get: () => {
      if (!selectComponent.value?.events?.hover) return []
      return selectComponent.value.events.hover
    },
    set: (value) => {
      if (selectComponent.value?.events) {
        selectComponent.value.events.hover = value
      }
    },
  })

  // 双击事件列表
  const doubleClickActions = computed<EventAction[]>({
    get: () => {
      if (!selectComponent.value?.events?.doubleClick) return []
      return selectComponent.value.events.doubleClick
    },
    set: (value) => {
      if (selectComponent.value?.events) {
        selectComponent.value.events.doubleClick = value
      }
    },
  })

  // 自定义事件列表
  const customEvents = computed(() => {
    if (!selectComponent.value?.events?.custom) return []
    return Object.keys(selectComponent.value.events.custom).map((eventName) => ({
      name: eventName,
      actions: selectComponent.value!.events!.custom![eventName] || [],
    }))
  })

  // 所有组件列表（包括当前组件，因为可以给自己添加事件）
  const otherComponents = computed(() => {
    return components.value
  })

  // 获取组件显示标签
  function getComponentLabel(comp: Component) {
    if (comp.name) {
      return `${comp.name} (${comp.type})`
    }
    return `${comp.type} #${comp.id.slice(0, 6)}`
  }

  // ==================== 点击事件 ====================
  function addClickAction() {
    ensureEvents()
    if (!selectComponent.value!.events!.click) {
      selectComponent.value!.events!.click = []
    }
    selectComponent.value!.events!.click.push({
      id: nanoid(),
      type: '',
    })
    componentStore.commit()
  }

  function removeClickAction(index: number) {
    if (!selectComponent.value?.events?.click) return
    selectComponent.value.events.click.splice(index, 1)
    componentStore.commit()
  }

  // ==================== 悬停事件 ====================
  function addHoverAction() {
    ensureEvents()
    if (!selectComponent.value!.events!.hover) {
      selectComponent.value!.events!.hover = []
    }
    selectComponent.value!.events!.hover.push({
      id: nanoid(),
      type: '',
    })
    componentStore.commit()
  }

  function removeHoverAction(index: number) {
    if (!selectComponent.value?.events?.hover) return
    selectComponent.value.events.hover.splice(index, 1)
    componentStore.commit()
  }

  // ==================== 双击事件 ====================
  function addDoubleClickAction() {
    ensureEvents()
    if (!selectComponent.value!.events!.doubleClick) {
      selectComponent.value!.events!.doubleClick = []
    }
    selectComponent.value!.events!.doubleClick.push({
      id: nanoid(),
      type: '',
    })
    componentStore.commit()
  }

  function removeDoubleClickAction(index: number) {
    if (!selectComponent.value?.events?.doubleClick) return
    selectComponent.value.events.doubleClick.splice(index, 1)
    componentStore.commit()
  }

  // ==================== 自定义事件 ====================
  function addCustomEvent() {
    ensureEvents()
    if (!selectComponent.value!.events!.custom) {
      selectComponent.value!.events!.custom = {}
    }
    const eventName = `customEvent${Object.keys(selectComponent.value!.events!.custom).length + 1}`
    selectComponent.value!.events!.custom[eventName] = []
    componentStore.commit()
  }

  function removeCustomEvent(eventName: string) {
    if (!selectComponent.value?.events?.custom) return
    delete selectComponent.value.events.custom[eventName]
    componentStore.commit()
  }

  function renameCustomEvent(oldName: string, newName: string) {
    if (!selectComponent.value?.events?.custom || !newName || oldName === newName) return
    if (selectComponent.value.events.custom[newName]) {
      alert('事件名称已存在')
      return
    }
    const actions = selectComponent.value.events.custom[oldName]
    if (actions) {
      delete selectComponent.value.events.custom[oldName]
      selectComponent.value.events.custom[newName] = actions
      componentStore.commit()
    }
  }

  function promptRenameEvent(oldName: string) {
    const newName = prompt('输入新的事件名称:', oldName)
    if (newName && newName !== oldName) {
      renameCustomEvent(oldName, newName)
    }
  }

  function addCustomEventAction(eventName: string) {
    if (!selectComponent.value?.events?.custom?.[eventName]) return
    selectComponent.value.events.custom[eventName].push({
      id: nanoid(),
      type: '',
    })
    componentStore.commit()
  }

  function removeCustomEventAction(eventName: string, index: number) {
    if (!selectComponent.value?.events?.custom?.[eventName]) return
    selectComponent.value.events.custom[eventName].splice(index, 1)
    componentStore.commit()
  }

  // 动作类型变化时，清理不相关的字段
  function onActionTypeChange(action: EventAction) {
    // 清理字段
    if (action.type !== 'custom-event') {
      delete action.eventName
      delete action.eventParams
    }
    if (action.type !== 'show-tooltip') {
      delete action.content
    }
    if (
      ![
        'toggle-visibility',
        'scroll-to',
        'play-animation',
        'open-modal',
        'highlight',
        'show-detail',
        'preview',
      ].includes(action.type)
    ) {
      delete action.targetId
    }
    componentStore.commitDebounced()
  }

  return {
    selectComponent,
    clickActions,
    hoverActions,
    doubleClickActions,
    customEvents,
    otherComponents,
    getComponentLabel,
    addClickAction,
    removeClickAction,
    addHoverAction,
    removeHoverAction,
    addDoubleClickAction,
    removeDoubleClickAction,
    addCustomEvent,
    removeCustomEvent,
    renameCustomEvent,
    promptRenameEvent,
    addCustomEventAction,
    removeCustomEventAction,
    onActionTypeChange,
  }
}

/**
 * 提供组件事件系统上下文
 * 在根组件中使用
 */
export function provideComponentEvents() {
  const componentStore = useComponent()
  const { componentStore: components } = storeToRefs(componentStore)

  /**
   * 注册事件监听器
   */
  function registerListener(componentId: string, eventName: string, handler: EventHandler) {
    if (!eventListeners.has(componentId)) {
      eventListeners.set(componentId, new Map())
    }
    const compListeners = eventListeners.get(componentId)!
    if (!compListeners.has(eventName)) {
      compListeners.set(eventName, [])
    }
    compListeners.get(eventName)!.push(handler)
  }

  /**
   * 取消注册事件监听器
   */
  function unregisterListener(componentId: string, eventName: string) {
    const compListeners = eventListeners.get(componentId)
    if (compListeners) {
      compListeners.delete(eventName)
    }
  }

  /**
   * 触发组件事件
   */
  function emitComponentEvent(componentId: string, eventName: string, params?: unknown) {
    const compListeners = eventListeners.get(componentId)
    if (compListeners) {
      const handlers = compListeners.get(eventName)
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(params)
          } catch (error) {
            console.error(`Error executing event handler for ${componentId}.${eventName}:`, error)
          }
        })
      }
    }
  }

  /**
   * 执行事件动作
   */
  async function executeAction(action: EventAction, sourceComponent?: Component): Promise<void> {
    // 检查条件
    if (action.condition?.enabled && action.condition.expression) {
      try {
        const conditionMet = evaluateCondition(action.condition.expression, sourceComponent)
        if (!conditionMet) {
          console.log('Condition not met, skipping action')
          return
        }
      } catch (error) {
        console.error('Error evaluating condition:', error)
        return
      }
    }

    // 延迟执行
    if (action.delay && action.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, action.delay))
    }

    // 执行动作
    switch (action.type) {
      case 'toggle-visibility':
        if (action.targetId) {
          const target = components.value.find((c) => c.id === action.targetId)
          if (target) {
            // 确保style对象存在
            if (!target.style) {
              target.style = { visible: true }
            }
            // 切换可见性: undefined默认为true(可见)
            const currentVisible = target.style.visible !== false
            target.style.visible = !currentVisible
            componentStore.commit()
          }
        }
        break

      case 'scroll-to':
        if (action.targetId) {
          const element = document.querySelector(`[data-component-id="${action.targetId}"]`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
        break

      case 'refresh-data':
        if (sourceComponent?.dataSource?.enabled) {
          emitComponentEvent(sourceComponent.id, 'data-refresh', {})
        }
        break

      case 'play-animation':
        if (action.targetId) {
          const target = components.value.find((c) => c.id === action.targetId)
          if (target && target.animation) {
            emitComponentEvent(action.targetId, 'play-animation', target.animation)
          }
        }
        break

      case 'open-modal':
        if (action.targetId) {
          const target = components.value.find((c) => c.id === action.targetId)
          if (target) {
            target.style.visible = true
            componentStore.commit()
            emitComponentEvent(action.targetId, 'modal-open', {})
          }
        }
        break

      case 'show-tooltip':
        if (action.content) {
          emitComponentEvent('global', 'show-tooltip', {
            content: action.content,
            sourceId: sourceComponent?.id,
          })
        }
        break

      case 'highlight':
        if (action.targetId) {
          emitComponentEvent(action.targetId, 'highlight', { duration: 2000 })
        }
        break

      case 'show-detail':
      case 'preview':
        if (action.targetId) {
          emitComponentEvent(action.targetId, action.type, {})
        }
        break

      case 'fullscreen':
        if (sourceComponent) {
          emitComponentEvent(sourceComponent.id, 'fullscreen', {})
        }
        break

      case 'edit-mode':
        if (sourceComponent) {
          emitComponentEvent(sourceComponent.id, 'edit-mode', {})
        }
        break

      case 'expand-detail':
        if (sourceComponent) {
          emitComponentEvent(sourceComponent.id, 'expand-detail', {})
        }
        break

      case 'custom-event':
        if (action.eventName) {
          let params = {}
          if (action.eventParams) {
            try {
              params = JSON.parse(action.eventParams)
            } catch (error) {
              console.error('Error parsing event params:', error)
            }
          }
          if (action.targetId) {
            emitComponentEvent(action.targetId, action.eventName, params)
          } else if (sourceComponent) {
            emitComponentEvent(sourceComponent.id, action.eventName, params)
          }
        }
        break

      case 'custom-script':
        if (action.content) {
          try {
            const fn = new Function('component', 'components', 'emit', action.content)
            fn(sourceComponent, components.value, emitComponentEvent)
          } catch (error) {
            console.error('Error executing custom script:', error)
          }
        }
        break

      default:
        console.warn(`Unknown action type: ${action.type}`)
    }
  }

  /**
   * 简单的条件评估
   */
  function evaluateCondition(expression: string, comp?: Component): boolean {
    try {
      const fn = new Function('component', `return ${expression}`)
      return !!fn(comp)
    } catch (error) {
      console.error('Error evaluating condition:', error)
      return false
    }
  }

  const context: ComponentEventsContext = {
    emitComponentEvent,
    executeAction,
    registerListener,
    unregisterListener,
  }

  provide(ComponentEventsKey, context)

  return context
}

/**
 * 使用组件事件系统
 * 在子组件中使用
 */
export function useComponentEvents() {
  const context = inject(ComponentEventsKey)
  if (!context) {
    throw new Error(
      'useComponentEvents must be used within a component that provides ComponentEventsKey',
    )
  }
  return context
}

/**
 * 为特定组件创建事件处理 hook
 */
export function useComponentEventHandlers(componentId: string) {
  const eventContext = useComponentEvents()
  const componentStore = useComponent()
  const { componentStore: components } = storeToRefs(componentStore)

  const component = computed(() => components.value.find((c) => c.id === componentId))

  /**
   * 处理点击事件
   */
  async function handleClick() {
    const comp = component.value
    if (!comp?.events?.click) return

    for (const action of comp.events.click) {
      await eventContext.executeAction(action, comp)
    }
  }

  /**
   * 处理悬停事件
   */
  async function handleMouseEnter() {
    const comp = component.value
    if (!comp?.events?.hover) return

    for (const action of comp.events.hover) {
      await eventContext.executeAction(action, comp)
    }
  }

  /**
   * 处理双击事件
   */
  async function handleDoubleClick() {
    const comp = component.value
    if (!comp?.events?.doubleClick) return

    for (const action of comp.events.doubleClick) {
      await eventContext.executeAction(action, comp)
    }
  }

  /**
   * 触发自定义事件
   */
  async function emitCustomEvent(eventName: string) {
    const comp = component.value
    if (!comp?.events?.custom?.[eventName]) return

    for (const action of comp.events.custom[eventName]) {
      await eventContext.executeAction(action, comp)
    }
  }

  /**
   * 监听来自其他组件的事件
   */
  function onEvent(eventName: string, handler: EventHandler) {
    eventContext.registerListener(componentId, eventName, handler)
  }

  /**
   * 取消监听事件
   */
  function offEvent(eventName: string) {
    eventContext.unregisterListener(componentId, eventName)
  }

  return {
    component,
    handleClick,
    handleMouseEnter,
    handleDoubleClick,
    emitCustomEvent,
    onEvent,
    offEvent,
  }
}
