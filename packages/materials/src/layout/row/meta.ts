import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Row',
  title: '行容器',
  category: '布局容器',
  props: {
    gutter: {
      title: '栅格间隔',
      setter: 'NumberSetter',
      defaultValue: 0,
    },
    justify: {
      title: '水平排列',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '左对齐', value: 'start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '环绕对齐', value: 'space-around' },
          { label: '均匀对齐', value: 'space-evenly' },
        ],
      },
      defaultValue: 'start',
    },
    align: {
      title: '垂直对齐',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '顶部', value: 'top' },
          { label: '居中', value: 'middle' },
          { label: '底部', value: 'bottom' },
        ],
      },
      defaultValue: 'top',
    },
    tag: {
      title: 'HTML标签',
      setter: 'StringSetter',
      defaultValue: 'div',
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
