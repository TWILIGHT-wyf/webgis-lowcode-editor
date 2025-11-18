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

// 可扩展：后续可以添加触发方式（onLoad / onHover / onClick）、延迟、循环次数等配置
