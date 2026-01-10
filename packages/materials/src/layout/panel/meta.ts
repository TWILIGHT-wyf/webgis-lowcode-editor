import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Panel',
  title: '面板',
  category: '布局容器',
  props: {
    title: {
      title: '标题',
      setter: 'StringSetter',
      defaultValue: '面板标题',
    },
    collapsible: {
      title: '可折叠',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    collapsed: {
      title: '默认折叠',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    showHeader: {
      title: '显示头部',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
    showFooter: {
      title: '显示底部',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    footerContent: {
      title: '底部内容',
      setter: 'StringSetter',
      defaultValue: '',
    },
    content: {
      title: '内容',
      setter: 'StringSetter',
      defaultValue: '这是面板内容',
    },
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: '#ffffff',
    },
    headerBg: {
      title: '头部背景',
      setter: 'ColorSetter',
      defaultValue: '#f9fafb',
    },
    headerColor: {
      title: '头部颜色',
      setter: 'ColorSetter',
      defaultValue: '#111827',
    },
  },
  events: ['onCollapse'],
}

export default meta
