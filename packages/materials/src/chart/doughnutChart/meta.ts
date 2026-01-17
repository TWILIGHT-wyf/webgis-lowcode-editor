import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'DoughnutChart',
  title: '环形图',
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
      defaultValue: [
        { name: '类型A', value: 335 },
        { name: '类型B', value: 234 },
        { name: '类型C', value: 154 },
      ],
    },
    radius: {
      title: '环形半径',
      setter: 'StringSetter',
      defaultValue: '50%, 70%',
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
