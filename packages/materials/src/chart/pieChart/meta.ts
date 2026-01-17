import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'PieChart',
  title: '饼图',
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
      title: '饼图半径',
      setter: 'StringSetter',
      defaultValue: '50%',
    },
    roseType: {
      title: '南丁格尔图',
      setter: 'BooleanSetter',
      defaultValue: false,
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
