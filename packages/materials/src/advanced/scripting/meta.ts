import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Scripting',
  title: '脚本',
  category: '高级',
  props: {
    code: {
      title: 'JavaScript代码',
      setter: 'JsonSetter',
      defaultValue: '',
    },
    autoRun: {
      title: '自动执行',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
  },
  events: ['onExecute', 'onError'],
}

export default meta
