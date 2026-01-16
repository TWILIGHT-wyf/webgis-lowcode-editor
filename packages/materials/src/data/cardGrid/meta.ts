import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'CardGrid',
  title: '卡片网格',
  category: '数据展示',
  props: {
    data: {
      title: '卡片数据',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    columns: {
      title: '列数',
      setter: 'NumberSetter',
      defaultValue: 3,
    },
    gap: {
      title: '间距',
      setter: 'NumberSetter',
      defaultValue: 16,
    },
    hoverable: {
      title: '悬浮效果',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
  },
  events: ['onCardClick'],
}

export default meta
