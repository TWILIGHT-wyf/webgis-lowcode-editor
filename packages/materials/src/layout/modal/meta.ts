import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'Modal',
  title: '对话框',
  category: '布局容器',
  props: {
    visible: {
      title: '显示对话框',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    title: {
      title: '标题',
      setter: 'StringSetter',
      defaultValue: '对话框标题',
    },
    width: {
      title: '宽度',
      setter: 'StringSetter',
      defaultValue: '50%',
    },
    fullscreen: {
      title: '全屏',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    closeOnClickModal: {
      title: '点击遮罩关闭',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
    showClose: {
      title: '显示关闭按钮',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
    showFooter: {
      title: '显示底部',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
    content: {
      title: '内容',
      setter: 'StringSetter',
      defaultValue: '这是对话框内容',
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
  events: ['onClose', 'onOpen'],
}

export default meta
