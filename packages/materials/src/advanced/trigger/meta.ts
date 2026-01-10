import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Trigger',
  title: '触发器',
  category: '高级',
  props: {
    type: {
      title: '触发类型',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '点击', value: 'click' },
          { label: '定时', value: 'timer' },
          { label: '条件', value: 'condition' },
        ],
      },
      defaultValue: 'click',
    },
    interval: {
      title: '间隔(毫秒)',
      setter: 'NumberSetter',
      defaultValue: 1000,
    },
    condition: {
      title: '条件表达式',
      setter: 'StringSetter',
      defaultValue: '',
    },
  },
  events: ['onTrigger'],
}

export default meta
