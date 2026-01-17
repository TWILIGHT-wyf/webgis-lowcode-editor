import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'Col',
  title: '列容器',
  category: '布局容器',
  props: {
    span: {
      title: '栅格占位',
      setter: 'NumberSetter',
      defaultValue: 12,
    },
    offset: {
      title: '左偏移',
      setter: 'NumberSetter',
      defaultValue: 0,
    },
    push: {
      title: '向右推',
      setter: 'NumberSetter',
      defaultValue: 0,
    },
    pull: {
      title: '向左拉',
      setter: 'NumberSetter',
      defaultValue: 0,
    },
    xs: {
      title: '<768px',
      setter: 'NumberSetter',
      defaultValue: 24,
    },
    sm: {
      title: '≥768px',
      setter: 'NumberSetter',
      defaultValue: 12,
    },
    md: {
      title: '≥992px',
      setter: 'NumberSetter',
      defaultValue: 12,
    },
    lg: {
      title: '≥1200px',
      setter: 'NumberSetter',
      defaultValue: 12,
    },
    xl: {
      title: '≥1920px',
      setter: 'NumberSetter',
      defaultValue: 12,
    },
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: '#ffffff',
    },
    minHeight: {
      title: '最小高度(px)',
      setter: 'NumberSetter',
      defaultValue: 100,
    },
  },
  events: [],
}

export default meta
