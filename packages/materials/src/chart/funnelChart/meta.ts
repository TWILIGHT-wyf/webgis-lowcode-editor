import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'FunnelChart',
  title: '漏斗图',
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
        { name: '阶段1', value: 100 },
        { name: '阶段2', value: 80 },
        { name: '阶段3', value: 60 },
      ],
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
