import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'StackedBarChart',
  title: '堆叠柱状图',
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
      defaultValue: [],
    },
    xAxisInput: {
      title: 'X轴标签',
      setter: 'StringSetter',
      defaultValue: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
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
