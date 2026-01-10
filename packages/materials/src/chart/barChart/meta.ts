import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'BarChart',
  title: '柱状图',
  category: '图表',
  props: {
    title: {
      title: '图表标题',
      setter: 'StringSetter',
      defaultValue: '',
    },
    seriesName: {
      title: '系列名称',
      setter: 'StringSetter',
      defaultValue: 'Series',
    },
    dataInput: {
      title: '数据',
      setter: 'StringSetter',
      defaultValue: '120, 200, 150, 180, 270, 210, 220',
    },
    xAxisInput: {
      title: 'X轴标签',
      setter: 'StringSetter',
      defaultValue: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
    },
    barColor: {
      title: '柱子颜色',
      setter: 'ColorSetter',
      defaultValue: '#409eff',
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
