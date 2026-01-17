import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'GaugeChart',
  title: '仪表盘',
  category: '图表',
  props: {
    title: {
      title: '图表标题',
      setter: 'StringSetter',
      defaultValue: '',
    },
    value: {
      title: '数值',
      setter: 'NumberSetter',
      defaultValue: 75,
    },
    min: {
      title: '最小值',
      setter: 'NumberSetter',
      defaultValue: 0,
    },
    max: {
      title: '最大值',
      setter: 'NumberSetter',
      defaultValue: 100,
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
