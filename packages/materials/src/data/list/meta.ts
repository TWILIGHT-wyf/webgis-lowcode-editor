import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'List',
  title: '列表',
  category: '数据展示',
  props: {
    data: {
      title: '列表数据',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    itemLayout: {
      title: '布局方式',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
      defaultValue: 'horizontal',
    },
    bordered: {
      title: '边框',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    split: {
      title: '分割线',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
  },
  events: ['onItemClick'],
}

export default meta
