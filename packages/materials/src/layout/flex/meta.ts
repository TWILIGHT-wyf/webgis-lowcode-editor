import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Flex',
  title: '弹性布局',
  category: '布局容器',
  props: {
    flexDirection: {
      title: '主轴方向',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '水平', value: 'row' },
          { label: '垂直', value: 'column' },
        ],
      },
      defaultValue: 'row',
    },
    justifyContent: {
      title: '主轴对齐',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '起点', value: 'flex-start' },
          { label: '终点', value: 'flex-end' },
          { label: '居中', value: 'center' },
          { label: '两端', value: 'space-between' },
          { label: '周围', value: 'space-around' },
          { label: '均匀', value: 'space-evenly' },
        ],
      },
      defaultValue: 'flex-start',
    },
    alignItems: {
      title: '交叉轴对齐',
      setter: 'SelectSetter',
      setterProps: {
        options: [
          { label: '起点', value: 'flex-start' },
          { label: '终点', value: 'flex-end' },
          { label: '居中', value: 'center' },
          { label: '基线', value: 'baseline' },
          { label: '拉伸', value: 'stretch' },
        ],
      },
      defaultValue: 'stretch',
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
    },
    gap: {
      title: '间距(px)',
      setter: 'NumberSetter',
      defaultValue: 16,
    },
    backgroundColor: {
      title: '背景颜色',
      setter: 'ColorSetter',
      defaultValue: '#ffffff',
    },
    minHeight: {
      title: '最小高度(px)',
      setter: 'NumberSetter',
      defaultValue: 100,
    },
  },
  events: [],
}

export default meta
