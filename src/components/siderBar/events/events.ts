import { provide, inject, type InjectionKey, computed } from 'vue'
import { useComponent, type EventAction, type component } from '@/stores/component'
import { storeToRefs } from 'pinia'

// 组件通信的 provide/inject key
export const ComponentEventsKey: InjectionKey<ComponentEventsContext> = Symbol('ComponentEvents')

// 事件上下文接口
export interface ComponentEventsContext {
  // 触发组件事件
  emitComponentEvent: (componentId: string, eventName: string, params?: unknown) => void
  // 执行事件动作
  executeAction: (action: EventAction, sourceComponent?: component) => Promise<void>
  // 注册组件事件监听器
  registerListener: (componentId: string, eventName: string, handler: EventHandler) => void
  // 取消注册事件监听器
  unregisterListener: (componentId: string, eventName: string) => void
}

export type EventHandler = (params?: unknown) => void | Promise<void>

// 事件监听器存储
const eventListeners = new Map<string, Map<string, EventHandler[]>>()

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
  async function executeAction(action: EventAction, sourceComponent?: component): Promise<void> {
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
            target.style.visible = !target.style.visible
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
  function evaluateCondition(expression: string, component?: component): boolean {
    try {
      const fn = new Function('component', `return ${expression}`)
      return !!fn(component)
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
