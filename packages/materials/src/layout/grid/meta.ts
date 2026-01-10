import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Grid',
  title: '网格布局',
  category: '布局容器',
  props: {
    gridTemplateColumns: {
      title: '列模板',
      setter: 'StringSetter',
      defaultValue: 'repeat(3, 1fr)',
    },
    gridTemplateRows: {
      title: '行模板',
      setter: 'StringSetter',
      defaultValue: 'auto',
    },
    gridGap: {
      title: '间距(px)',
      setter: 'NumberSetter',
      defaultValue: 16,
    },
    gridAutoFlow: {
      title: '自动流动',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '行', value: 'row' },
          { label: '列', value: 'column' },
          { label: '密集行', value: 'row dense' },
          { label: '密集列', value: 'column dense' },
        ],
      },
      defaultValue: 'row',
    },
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: '#ffffff',
    },
    minHeight: {
      title: '最小高度(px)',
      setter: 'NumberSetter',
      defaultValue: 200,
    },
  },
  events: [],
}

export default meta
