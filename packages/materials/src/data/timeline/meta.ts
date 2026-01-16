import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Timeline',
  title: '时间线',
  category: '数据展示',
  props: {
    data: {
      title: '时间线数据',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    mode: {
      title: '排列模式',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
          { label: '交替', value: 'alternate' },
        ],
      },
      defaultValue: 'left',
    },
    reverse: {
      title: '倒序',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
  },
  events: ['onItemClick'],
}

export default meta
