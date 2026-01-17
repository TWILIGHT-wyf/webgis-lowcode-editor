import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'State',
  title: '状态管理',
  category: '高级',
  props: {
    initialState: {
      title: '初始状态',
      setter: 'JsonSetter',
      defaultValue: {},
    },
    persist: {
      title: '持久化',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    storageKey: {
      title: '存储键',
      setter: 'StringSetter',
      defaultValue: '',
    },
  },
  events: ['onChange'],
}

export default meta
