import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'LineChart',
  title: '折线图',
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
      defaultValue: '150, 230, 224, 218, 135, 147, 260',
    },
    xAxisInput: {
      title: 'X轴标签',
      setter: 'StringSetter',
      defaultValue: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
    },
    lineColor: {
      title: '线条颜色',
      setter: 'ColorSetter',
      defaultValue: '#409eff',
    },
    smooth: {
      title: '平滑曲线',
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
