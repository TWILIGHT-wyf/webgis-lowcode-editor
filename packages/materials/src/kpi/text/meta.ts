import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'KpiText',
  title: '指标文字',
  category: 'KPI',
  props: {
    text: {
      title: '内容',
      setter: 'StringSetter',
      defaultValue: '请输入文本',
    },
    fontSize: {
      title: '字号',
      setter: 'NumberSetter',
      defaultValue: 14,
    },
    color: {
      title: '颜色',
      setter: 'ColorSetter',
      defaultValue: '#000000',
    },
  },
  events: ['onClick'],
}

export default meta
