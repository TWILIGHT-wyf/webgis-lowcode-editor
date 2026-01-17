import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'Pivot',
  title: '数据透视表',
  category: '数据展示',
  props: {
    data: {
      title: '数据源',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    rows: {
      title: '行字段',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    columns: {
      title: '列字段',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    values: {
      title: '值字段',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    aggregator: {
      title: '聚合函数',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '求和', value: 'sum' },
          { label: '计数', value: 'count' },
          { label: '平均值', value: 'average' },
          { label: '最大值', value: 'max' },
          { label: '最小值', value: 'min' },
        ],
      },
      defaultValue: 'sum',
    },
  },
  events: [],
}

export default meta
