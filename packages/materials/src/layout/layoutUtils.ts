import { computed } from 'vue'
import type { CSSProperties, ComputedRef } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { componentRegistry } from '@/customComponents/registry'

type LayoutComp = {
  children?: string[]
  layout?: Record<string, unknown>
  props?: Record<string, unknown>
  style?: Record<string, unknown>
}

export function useLayoutHelpers(comp: ComputedRef<LayoutComp | undefined>) {
  const { componentStore } = storeToRefs(useComponent())

  const hasChildren = computed(() => {
    return comp.value?.children && comp.value.children.length > 0
  })

  const getChildComponent = (childId: string) => {
    return componentStore.value.find((c) => c.id === childId)
  }

  const getComponentByType = (type: string) => {
    return componentRegistry[type] || 'div'
  }

  const childrenContainerStyle = computed<CSSProperties>(() => {
    const layout = comp.value?.layout
    const mode = layout?.mode || 'absolute'
    const gap = layout?.gap ?? 8
    const padding = layout?.padding ?? 0
    const align = layout?.align || 'start'

    const baseStyle: CSSProperties = {
      position: 'relative',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      padding: `${padding}px`,
    }

    switch (mode) {
      case 'horizontal':
        return {
          ...baseStyle,
          display: 'flex',
          flexDirection: 'row',
          gap: `${gap}px`,
          alignItems:
            align === 'stretch'
              ? 'stretch'
              : align === 'center'
                ? 'center'
                : align === 'end'
                  ? 'flex-end'
                  : 'flex-start',
        }
      case 'vertical':
        return {
          ...baseStyle,
          display: 'flex',
          flexDirection: 'column',
          gap: `${gap}px`,
          alignItems:
            align === 'stretch'
              ? 'stretch'
              : align === 'center'
                ? 'center'
                : align === 'end'
                  ? 'flex-end'
                  : 'flex-start',
        }
      case 'grid':
        return {
          ...baseStyle,
          display: 'grid',
          gridTemplateColumns: `repeat(${layout?.columns || 2}, 1fr)`,
          gap: `${gap}px`,
          alignItems:
            align === 'stretch'
              ? 'stretch'
              : align === 'center'
                ? 'center'
                : align === 'end'
                  ? 'end'
                  : 'start',
        }
      case 'absolute':
      default:
        return baseStyle
    }
  })

  const getChildItemStyle = (childId: string): CSSProperties => {
    const layout = comp.value?.layout
    const mode = layout?.mode || 'absolute'
    const child = getChildComponent(childId)

    if (mode === 'absolute' && child) {
      return {
        position: 'absolute',
        left: `${child.position.x}px`,
        top: `${child.position.y}px`,
        width: `${child.size.width}px`,
        height: `${child.size.height}px`,
      }
    }

    return {}
  }

  const getChildComponentStyle = (_childId: string): CSSProperties => {
    // 子组件内部样式通常统一为填满容器。保留 childId 参数以便未来扩展。
    void _childId

    return {
      width: '100%',
      height: '100%',
    }
  }

  return {
    hasChildren,
    getChildComponent,
    getComponentByType,
    childrenContainerStyle,
    getChildItemStyle,
    getChildComponentStyle,
  }
}
