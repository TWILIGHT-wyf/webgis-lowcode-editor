import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Tabs',
  title: '标签页',
  category: '布局容器',
  props: {
    activeTab: {
      title: '当前激活标签',
      setter: 'StringSetter',
      defaultValue: '',
    },
    type: {
      title: '标签页类型',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '卡片化', value: 'card' },
          { label: '边框卡片', value: 'border-card' },
          { label: '默认', value: '' },
        ],
      },
      defaultValue: 'border-card',
    },
    tabPosition: {
      title: '标签位置',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '顶部', value: 'top' },
          { label: '右侧', value: 'right' },
          { label: '底部', value: 'bottom' },
          { label: '左侧', value: 'left' },
        ],
      },
      defaultValue: 'top',
    },
    closable: {
      title: '可关闭',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    addable: {
      title: '可增加',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    tabs: {
      title: '标签页数据',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: '#ffffff',
    },
    textColor: {
      title: '文本颜色',
      setter: 'ColorSetter',
      defaultValue: '#333333',
    },
  },
  events: ['onTabClick', 'onTabRemove', 'onTabAdd'],
}

export default meta
