import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'Page',
  title: '页面容器',
  category: '布局容器',
  props: {
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: 'transparent',
    },
    padding: {
      title: '内边距',
      setter: 'NumberSetter',
      defaultValue: 0,
    },
    minHeight: {
      title: '最小高度',
      setter: 'TextSetter',
      defaultValue: '100%',
    },
    width: {
      title: '宽度',
      setter: 'TextSetter',
      defaultValue: '100%',
    },
    height: {
      title: '高度',
      setter: 'TextSetter',
      defaultValue: '100%',
    },
  },
  events: [],
}

export default meta
