import type { MaterialMeta } from '@vela/core/types'

const meta: MaterialMeta = {
  componentName: 'Container',
  title: '容器',
  category: '布局容器',
  isContainer: true,
  props: {
    // Container 组件本身没有特殊的 props，都是通过 style 控制
  },
  styles: {
    // 尺寸
    width: {
      title: '宽度',
      setter: 'StringSetter',
      defaultValue: '100%',
      description: '容器宽度，如 100%, 500px, auto',
      group: '尺寸',
    },
    height: {
      title: '高度',
      setter: 'StringSetter',
      defaultValue: 'auto',
      description: '容器高度，如 auto, 300px, 100vh',
      group: '尺寸',
    },
    minHeight: {
      title: '最小高度',
      setter: 'StringSetter',
      defaultValue: '100px',
      description: '容器最小高度',
      group: '尺寸',
    },
    maxWidth: {
      title: '最大宽度',
      setter: 'StringSetter',
      defaultValue: '',
      description: '容器最大宽度，如 1200px',
      group: '尺寸',
    },

    // 布局
    display: {
      title: '显示模式',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '块级', value: 'block' },
          { label: '弹性布局', value: 'flex' },
          { label: '网格布局', value: 'grid' },
          { label: '行内块', value: 'inline-block' },
        ],
      },
      defaultValue: 'block',
      description: '容器的布局模式',
      group: '布局',
    },
    flexDirection: {
      title: 'Flex方向',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '横向', value: 'row' },
          { label: '纵向', value: 'column' },
          { label: '横向反向', value: 'row-reverse' },
          { label: '纵向反向', value: 'column-reverse' },
        ],
      },
      defaultValue: 'row',
      description: 'Flex布局的主轴方向',
      group: '布局',
    },
    justifyContent: {
      title: '主轴对齐',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '起点', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '终点', value: 'flex-end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '均匀分布', value: 'space-around' },
          { label: '等间距分布', value: 'space-evenly' },
        ],
      },
      defaultValue: 'flex-start',
      description: 'Flex容器主轴对齐方式',
      group: '布局',
    },
    alignItems: {
      title: '交叉轴对齐',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '起点', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '终点', value: 'flex-end' },
          { label: '拉伸', value: 'stretch' },
          { label: '基线', value: 'baseline' },
        ],
      },
      defaultValue: 'flex-start',
      description: 'Flex容器交叉轴对齐方式',
      group: '布局',
    },
    flexWrap: {
      title: '换行',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '不换行', value: 'nowrap' },
          { label: '换行', value: 'wrap' },
          { label: '反向换行', value: 'wrap-reverse' },
        ],
      },
      defaultValue: 'nowrap',
      description: 'Flex项目是否换行',
      group: '布局',
    },
    gap: {
      title: '间距',
      setter: 'StringSetter',
      defaultValue: '0',
      description: '子元素之间的间距，如 10px, 1rem',
      group: '布局',
    },

    // 间距
    padding: {
      title: '内边距',
      setter: 'StringSetter',
      defaultValue: '16px',
      description: '容器内边距，如 16px, 10px 20px',
      group: '间距',
    },
    margin: {
      title: '外边距',
      setter: 'StringSetter',
      defaultValue: '0',
      description: '容器外边距，如 0, 10px 20px',
      group: '间距',
    },

    // 外观
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: 'transparent',
      description: '容器背景颜色',
      group: '外观',
    },
    backgroundImage: {
      title: '背景图片',
      setter: 'StringSetter',
      defaultValue: '',
      description: '背景图片URL，如 url(image.jpg)',
      group: '外观',
    },
    backgroundSize: {
      title: '背景尺寸',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '覆盖', value: 'cover' },
          { label: '包含', value: 'contain' },
          { label: '自动', value: 'auto' },
        ],
      },
      defaultValue: 'cover',
      group: '外观',
    },
    borderRadius: {
      title: '圆角',
      setter: 'StringSetter',
      defaultValue: '0',
      description: '容器圆角，如 4px, 10px 20px',
      group: '外观',
    },
    borderWidth: {
      title: '边框宽度',
      setter: 'StringSetter',
      defaultValue: '0',
      description: '边框宽度，如 1px',
      group: '外观',
    },
    borderColor: {
      title: '边框颜色',
      setter: 'ColorSetter',
      defaultValue: '#dcdfe6',
      description: '边框颜色',
      group: '外观',
    },
    borderStyle: {
      title: '边框样式',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '实线', value: 'solid' },
          { label: '虚线', value: 'dashed' },
          { label: '点线', value: 'dotted' },
          { label: '无', value: 'none' },
        ],
      },
      defaultValue: 'solid',
      description: '边框样式',
      group: '外观',
    },
    boxShadow: {
      title: '阴影',
      setter: 'StringSetter',
      defaultValue: '',
      description: '盒子阴影，如 0 2px 8px rgba(0,0,0,0.1)',
      group: '外观',
    },
    opacity: {
      title: '透明度',
      setter: 'NumberSetter',
      setterProps: {
        min: 0,
        max: 1,
        step: 0.1,
      },
      defaultValue: 1,
      description: '容器透明度，0-1',
      group: '外观',
    },

    // 定位
    position: {
      title: '定位方式',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '静态', value: 'static' },
          { label: '相对', value: 'relative' },
          { label: '绝对', value: 'absolute' },
          { label: '固定', value: 'fixed' },
          { label: '粘性', value: 'sticky' },
        ],
      },
      defaultValue: 'relative',
      description: 'CSS定位方式',
      group: '定位',
    },
    zIndex: {
      title: 'Z轴层级',
      setter: 'NumberSetter',
      defaultValue: 0,
      description: '容器的层叠顺序',
      group: '定位',
    },

    // 溢出
    overflow: {
      title: '溢出处理',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '可见', value: 'visible' },
          { label: '隐藏', value: 'hidden' },
          { label: '滚动', value: 'scroll' },
          { label: '自动', value: 'auto' },
        ],
      },
      defaultValue: 'visible',
      description: '内容溢出时的处理方式',
      group: '其他',
    },
  },
  events: [],
}

export default meta
