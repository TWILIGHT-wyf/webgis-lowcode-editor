import type { MaterialMeta } from '@lowcode/core/types'

const meta: MaterialMeta = {
  componentName: 'Table',
  title: '表格',
  category: '数据展示',
  props: {
    data: {
      title: '表格数据',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    columns: {
      title: '列配置',
      setter: 'JsonSetter',
      defaultValue: [],
    },
    border: {
      title: '边框',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    stripe: {
      title: '斑马纹',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    showHeader: {
      title: '显示表头',
      setter: 'BooleanSetter',
      defaultValue: true,
    },
    highlightCurrentRow: {
      title: '高亮当前行',
      setter: 'BooleanSetter',
      defaultValue: false,
    },
    maxHeight: {
      title: '最大高度',
      setter: 'NumberSetter',
      defaultValue: undefined,
    },
  },
  events: ['onRowClick', 'onSelectionChange'],
}

export default meta
