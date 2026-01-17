import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'RadarChart',
  title: '雷达图',
  category: '图表',
  props: {
    title: {
      title: '图表标题',
      setter: 'StringSetter',
      defaultValue: '',
    },
    dataInput: {
      title: '数据',
      setter: 'JsonSetter',
      defaultValue: {
        indicator: [],
        value: [],
      },
    },
    option: {
      title: 'ECharts配置',
      setter: 'JsonSetter',
      defaultValue: {},
    },
  },
  events: [],
}

export default meta
