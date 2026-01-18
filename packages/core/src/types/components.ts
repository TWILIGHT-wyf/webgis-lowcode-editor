/**
 * Legacy component types for backward compatibility
 * V1.5 uses NodeSchema, but some old code still references Component
 */

import type { NodeSchema } from './schema'
import type { ActionSchema } from './action'

/**
 * Legacy Component type - alias to NodeSchema for backward compatibility
 * @deprecated Use NodeSchema instead
 */
export interface Component {
  id: string
  type: string // componentName
  name?: string // display name
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation?: number
  zindex?: number
  props?: Record<string, unknown>
  style?: Record<string, unknown> & {
    visible?: boolean
    opacity?: number
    fontSize?: number
    fontColor?: string
    fontWeight?: string
    textAlign?: string
    lineHeight?: string | number
    backgroundColor?: string
    borderRadius?: number
    border?: string
    boxShadow?: string
    padding?: number
    locked?: boolean
  }
  animation?: {
    class?: string
    duration?: number
    delay?: number
    iterationCount?: number | string
    timingFunction?: string
    trigger?: 'load' | 'hover' | 'click'
  }
  events?: {
    click?: EventAction[]
    hover?: EventAction[]
    doubleClick?: EventAction[]
    [key: string]: EventAction[] | undefined
  }
  groupId?: string
  children?: string[]
  /** Layout configuration for container components */
  layout?: {
    mode?: 'horizontal' | 'vertical'
    gap?: number
    align?: string
    padding?: number
  }
}

/**
 * Event action configuration
 */
export interface EventAction {
  id: string
  type: string
  targetId?: string
  delay?: number
  message?: string
  messageType?: 'success' | 'warning' | 'error' | 'info'
  url?: string
  openInNewTab?: boolean
  script?: string
  eventName?: string
  [key: string]: unknown
}

/**
 * Convert legacy Component to NodeSchema
 */
export function componentToNodeSchema(comp: Component): NodeSchema {
  return {
    id: comp.id,
    componentName: comp.type,
    props: comp.props as NodeSchema['props'],
    style: {
      x: comp.position?.x ?? 0,
      y: comp.position?.y ?? 0,
      width: comp.size?.width ?? 100,
      height: comp.size?.height ?? 100,
      rotation: comp.rotation ?? 0,
      zIndex: comp.zindex ?? 0,
      ...comp.style,
    },
    animation: comp.animation
      ? {
          name: comp.animation.class || '',
          class: comp.animation.class || '',
          duration: comp.animation.duration || 0.7,
          delay: comp.animation.delay || 0,
          iterationCount: comp.animation.iterationCount || 1,
          timingFunction: comp.animation.timingFunction || 'ease',
          trigger: comp.animation.trigger || 'load',
        }
      : undefined,
    events: comp.events as Record<string, ActionSchema[]>,
  }
}

/**
 * Convert NodeSchema to legacy Component
 */
export function nodeSchemaToComponent(node: NodeSchema): Component {
  const style = node.style || {}
  return {
    id: node.id,
    type: node.componentName,
    position: {
      x: (style.x as number) ?? 0,
      y: (style.y as number) ?? 0,
    },
    size: {
      width: (style.width as number) ?? 100,
      height: (style.height as number) ?? 100,
    },
    rotation: (style.rotation as number) ?? 0,
    zindex: (style.zIndex as number) ?? 0,
    props: node.props,
    style: {
      visible: style.visible as boolean,
      opacity: style.opacity as number,
      fontSize: style.fontSize as number,
      fontColor: style.fontColor as string,
      fontWeight: style.fontWeight as string,
      textAlign: style.textAlign as string,
      lineHeight: style.lineHeight as string | number,
      backgroundColor: style.backgroundColor as string,
      borderRadius: style.borderRadius as number,
      border: style.border as string,
      boxShadow: style.boxShadow as string,
      padding: style.padding as number,
    },
    animation: node.animation
      ? {
          class: node.animation.class,
          duration: node.animation.duration,
          delay: node.animation.delay,
          iterationCount: node.animation.iterationCount,
          timingFunction: node.animation.timingFunction,
          trigger: node.animation.trigger,
        }
      : undefined,
    events: node.events as Component['events'],
    children: node.children?.map((c) => c.id),
  }
}
