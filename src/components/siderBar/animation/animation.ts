import { ref, computed, nextTick } from 'vue'
import { useComponent } from '@/stores/component'

export interface AnimationOption {
  name: string
  label: string
  class: string
  duration?: number
  desc?: string
}

export const animations: AnimationOption[] = [
  { name: 'fade', label: '淡入', class: 'anim-fade', desc: '元素由透明到不透明' },
  { name: 'zoom', label: '缩放', class: 'anim-zoom', desc: '由小到大缩放进入' },
  { name: 'slide-left', label: '左滑入', class: 'anim-slide-left', desc: '从右向左滑入' },
  { name: 'slide-up', label: '上移入', class: 'anim-slide-up', desc: '从下向上滑入' },
  { name: 'bounce', label: '弹跳', class: 'anim-bounce', desc: '带弹性进入' },
  { name: 'rotate', label: '旋转', class: 'anim-rotate', desc: '旋转出现' },
]

// Animation Preview Composable
export function useAnimationPreview() {
  const currentClass = ref<string | null>(null)
  const replayKey = ref(0)

  function triggerPreview(cls: string) {
    // 通过清空再设置的方式强制浏览器重新计算动画
    currentClass.value = null
    nextTick(() => {
      currentClass.value = cls
      replayKey.value++
    })
  }

  function cancelPreview() {
    // 悬停移出后保留最后一次效果或清空，这里选择保留
  }

  const previewClass = computed(() => {
    return ['preview-target', currentClass.value].filter(Boolean)
  })

  return {
    currentClass,
    replayKey,
    triggerPreview,
    cancelPreview,
    previewClass,
  }
}

// Animation Selection Composable
export function useAnimationSelection() {
  const store = useComponent()

  // 当前选中组件的动画配置
  const currentAnimation = computed(() => {
    return store.selectComponent?.animation
  })

  // 写入当前选中组件的 animation 配置
  function selectAnimation(a: { name: string; class: string }) {
    const target = store.selectComponent
    if (target) {
      // 如果已有配置，保留部分参数，仅切换类型
      const baseConfig = target.animation || {
        duration: 0.8,
        delay: 0,
        iterationCount: 1,
        timingFunction: 'ease',
        trigger: 'load',
      }

      target.animation = {
        ...baseConfig,
        name: a.name,
        class: a.class,
      }
    }
  }

  return {
    currentAnimation,
    selectAnimation,
  }
}
