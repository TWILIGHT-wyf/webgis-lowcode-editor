import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'Button',
  title: '按钮',
  category: '基础控件',
  props: {
    text: {
      title: '按钮文本',
      setter: 'StringSetter',
      defaultValue: '按钮',
      description: '按钮上显示的文字',
      group: '基础',
    },
    type: {
      title: '按钮类型',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '主要按钮', value: 'primary' },
          { label: '成功按钮', value: 'success' },
          { label: '警告按钮', value: 'warning' },
          { label: '危险按钮', value: 'danger' },
          { label: '信息按钮', value: 'info' },
          { label: '默认按钮', value: 'default' },
        ],
      },
      defaultValue: 'primary',
      description: '按钮的主题类型',
      group: '基础',
    },
    size: {
      title: '尺寸',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      defaultValue: 'default',
      group: '基础',
    },
    plain: {
      title: '朴素按钮',
      setter: 'BooleanSetter',
      defaultValue: false,
      description: '是否为朴素按钮',
      group: '样式',
    },
    round: {
      title: '圆角按钮',
      setter: 'BooleanSetter',
      defaultValue: false,
      description: '是否为圆角按钮',
      group: '样式',
    },
    circle: {
      title: '圆形按钮',
      setter: 'BooleanSetter',
      defaultValue: false,
      description: '是否为圆形按钮',
      group: '样式',
    },
    disabled: {
      title: '禁用状态',
      setter: 'BooleanSetter',
      defaultValue: false,
      description: '是否禁用按钮',
      group: '状态',
    },
    loading: {
      title: '加载中',
      setter: 'BooleanSetter',
      defaultValue: false,
      description: '是否显示加载状态',
      group: '状态',
    },
    icon: {
      title: '图标',
      setter: 'StringSetter',
      defaultValue: '',
      description: '按钮图标类名',
      group: '基础',
    },
  },
  styles: {
    width: {
      title: '宽度',
      setter: 'StringSetter',
      defaultValue: 'auto',
      description: '按钮宽度，如 100px, 50%, auto',
      group: '尺寸',
    },
    height: {
      title: '高度',
      setter: 'StringSetter',
      defaultValue: 'auto',
      description: '按钮高度，如 40px, auto',
      group: '尺寸',
    },
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: '',
      description: '自定义背景颜色（覆盖主题色）',
      group: '外观',
    },
    color: {
      title: '文字颜色',
      setter: 'ColorSetter',
      defaultValue: '',
      description: '自定义文字颜色',
      group: '外观',
    },
    fontSize: {
      title: '字体大小',
      setter: 'StringSetter',
      defaultValue: '14px',
      description: '字体大小，如 14px, 1rem',
      group: '文字',
    },
    fontWeight: {
      title: '字体粗细',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '正常', value: '400' },
          { label: '中等', value: '500' },
          { label: '粗体', value: '600' },
          { label: '超粗', value: '700' },
        ],
      },
      defaultValue: '400',
      group: '文字',
    },
    borderRadius: {
      title: '圆角',
      setter: 'StringSetter',
      defaultValue: '4px',
      description: '边框圆角，如 4px, 50%',
      group: '外观',
    },
    padding: {
      title: '内边距',
      setter: 'StringSetter',
      defaultValue: '',
      description: '内边距，如 10px 20px',
      group: '间距',
    },
    margin: {
      title: '外边距',
      setter: 'StringSetter',
      defaultValue: '',
      description: '外边距，如 10px 20px',
      group: '间距',
    },
  },
  events: ['onClick'],
}

export default meta
