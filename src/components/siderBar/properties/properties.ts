import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

export function customProperties() {
  const componentStore = useComponent()
  const { selectComponent } = storeToRefs(componentStore)

  // 通用字段类型声明
  type Primitive = string | number | boolean | null | undefined
  type Field =
    | { key: string; label: string; type: 'text'; placeholder?: string; default?: Primitive }
    | {
        key: string
        label: string
        type: 'number'
        min?: number
        max?: number
        step?: number
        default?: number
      }
    | {
        key: string
        label: string
        type: 'color'
        default?: string
      }
    | {
        key: string
        label: string
        type: 'switch'
        default?: boolean
      }
    | {
        key: string
        label: string
        type: 'select'
        options: { label: string; value: Primitive }[]
        default?: Primitive
      }

  // 样式字段
  const styleSchema = computed<Field[]>(() => {
    const type = selectComponent.value?.type
    if (!type) return []
    switch (type) {
      case 'Text':
        return [
          {
            key: 'fontSize',
            label: '字体大小',
            type: 'number',
            min: 8,
            max: 200,
            step: 1,
            default: 16,
          },
          { key: 'fontColor', label: '字体颜色', type: 'color', default: '#000000' },
          {
            key: 'fontWeight',
            label: '字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
              { label: '更细', value: 'lighter' },
              { label: '更粗', value: 'bolder' },
            ],
            default: 'normal',
          },
          {
            key: 'textAlign',
            label: '对齐',
            type: 'select',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
            default: 'left',
          },
          {
            key: 'letterSpacing',
            label: '字间距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'lineHeight',
            label: '行高(倍数)',
            type: 'number',
            min: 0.8,
            max: 3,
            step: 0.1,
            default: 1.2,
          },
          {
            key: 'paddingX',
            label: '左右内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'paddingY',
            label: '上下内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
        ]
      case 'Row':
      case 'layout.row':
        return [
          // 基础控制
          {
            key: 'opacity',
            label: '透明度(%)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 100,
          },
          {
            key: 'visible',
            label: '可见',
            type: 'switch',
            default: true,
          },
          {
            key: 'locked',
            label: '锁定',
            type: 'switch',
            default: false,
          },
          // 背景
          {
            key: 'backgroundColor',
            label: '背景色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'backgroundImage',
            label: '背景图片(URL)',
            type: 'text',
            placeholder: 'https://example.com/bg.png',
            default: '',
          },
          {
            key: 'backgroundSize',
            label: '背景尺寸',
            type: 'select',
            options: [
              { label: '覆盖', value: 'cover' },
              { label: '包含', value: 'contain' },
              { label: '自动', value: 'auto' },
              { label: '100%', value: '100% 100%' },
            ],
            default: 'cover',
          },
          {
            key: 'backgroundPosition',
            label: '背景位置',
            type: 'select',
            options: [
              { label: '居中', value: 'center' },
              { label: '顶部', value: 'top' },
              { label: '底部', value: 'bottom' },
              { label: '左侧', value: 'left' },
              { label: '右侧', value: 'right' },
              { label: '左上', value: 'left top' },
              { label: '右上', value: 'right top' },
              { label: '左下', value: 'left bottom' },
              { label: '右下', value: 'right bottom' },
            ],
            default: 'center',
          },
          {
            key: 'backgroundRepeat',
            label: '背景重复',
            type: 'select',
            options: [
              { label: '不重复', value: 'no-repeat' },
              { label: '重复', value: 'repeat' },
              { label: '水平重复', value: 'repeat-x' },
              { label: '垂直重复', value: 'repeat-y' },
            ],
            default: 'no-repeat',
          },
          // 边框
          {
            key: 'borderWidth',
            label: '边框宽度(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 0,
          },
          {
            key: 'borderStyle',
            label: '边框样式',
            type: 'select',
            options: [
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' },
              { label: '双线', value: 'double' },
            ],
            default: 'solid',
          },
          { key: 'borderColor', label: '边框颜色', type: 'color', default: '#000000' },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          // 内边距
          {
            key: 'paddingTop',
            label: '上内边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          {
            key: 'paddingRight',
            label: '右内边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          {
            key: 'paddingBottom',
            label: '下内边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          {
            key: 'paddingLeft',
            label: '左内边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          // 外边距
          {
            key: 'marginTop',
            label: '上外边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          {
            key: 'marginRight',
            label: '右外边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          {
            key: 'marginBottom',
            label: '下外边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          {
            key: 'marginLeft',
            label: '左外边距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
          // 布局 (Flex)
          {
            key: 'flexDirection',
            label: '主轴方向',
            type: 'select',
            options: [
              { label: '水平', value: 'row' },
              { label: '垂直', value: 'column' },
              { label: '水平反向', value: 'row-reverse' },
              { label: '垂直反向', value: 'column-reverse' },
            ],
            default: 'row',
          },
          {
            key: 'justifyContent',
            label: '主轴对齐',
            type: 'select',
            options: [
              { label: '起点', value: 'flex-start' },
              { label: '居中', value: 'center' },
              { label: '终点', value: 'flex-end' },
              { label: '均匀(around)', value: 'space-around' },
              { label: '两端', value: 'space-between' },
              { label: '均匀(evenly)', value: 'space-evenly' },
            ],
            default: 'flex-start',
          },
          {
            key: 'alignItems',
            label: '交叉轴对齐',
            type: 'select',
            options: [
              { label: '拉伸', value: 'stretch' },
              { label: '起点', value: 'flex-start' },
              { label: '居中', value: 'center' },
              { label: '终点', value: 'flex-end' },
              { label: '基线', value: 'baseline' },
            ],
            default: 'stretch',
          },
          {
            key: 'flexWrap',
            label: '换行',
            type: 'select',
            options: [
              { label: '不换行', value: 'nowrap' },
              { label: '换行', value: 'wrap' },
              { label: '反向换行', value: 'wrap-reverse' },
            ],
            default: 'nowrap',
          },
          { key: 'gap', label: '间距(px)', type: 'number', min: 0, max: 200, step: 1, default: 0 },
          // 其他
          {
            key: 'minHeight',
            label: '最小高度(px)',
            type: 'number',
            min: 0,
            max: 2000,
            step: 1,
            default: 50,
          },
          {
            key: 'overflow',
            label: '溢出',
            type: 'select',
            options: [
              { label: '可见', value: 'visible' },
              { label: '隐藏', value: 'hidden' },
              { label: '滚动', value: 'scroll' },
              { label: '自动', value: 'auto' },
            ],
            default: 'visible',
          },
          {
            key: 'boxShadow',
            label: '阴影',
            type: 'text',
            placeholder: '0 2px 8px rgba(0,0,0,0.15)',
            default: '',
          },
        ]
      default:
        return []
    }
  })

  // 数据源字段
  const dataSourceSchema = computed<Field[]>(() => {
    const type = selectComponent.value?.type
    if (!type) return []
    switch (type) {
      case 'Text':
        return [
          { key: 'enabled', label: '启用数据源', type: 'switch', default: false },
          {
            key: 'url',
            label: 'API 地址',
            type: 'text',
            placeholder: 'https://api.example.com/data',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' },
            ],
            default: 'GET',
          },
          {
            key: 'interval',
            label: '自动刷新(秒)',
            type: 'number',
            min: 0,
            max: 3600,
            step: 1,
            default: 0,
          },
          {
            key: 'dataPath',
            label: '数据路径',
            type: 'text',
            placeholder: 'data.text 或 result[0].content',
            default: '',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
          {
            key: 'body',
            label: '请求体(JSON)',
            type: 'text',
            placeholder: '{"key": "value"}',
            default: '',
          },
        ]
      case 'lineChart':
        return [
          {
            key: 'enabled',
            label: '启用数据源',
            type: 'switch',
            default: false,
          },
          {
            key: 'url',
            label: 'API 地址',
            type: 'text',
            placeholder: 'http://localhost:3001/api/chart/nested',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
            ],
            default: 'GET',
          },
          {
            key: 'interval',
            label: '自动刷新(秒)',
            type: 'number',
            min: 0,
            max: 3600,
            step: 1,
            default: 0,
          },
          {
            key: 'dataPath',
            label: '数据值路径',
            type: 'text',
            placeholder: '例: data.chart.values 或 readings.temperatures',
            default: '',
          },
          {
            key: 'xAxisPath',
            label: 'X轴标签路径',
            type: 'text',
            placeholder: '例: data.chart.categories 或 readings.timestamps',
            default: '',
          },
          {
            key: 'seriesNamePath',
            label: '系列名称路径',
            type: 'text',
            placeholder: '例: data.seriesName (可选)',
            default: '',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]
      case 'areaChart':
      case 'barChart':
        return [
          {
            key: 'enabled',
            label: '启用数据源',
            type: 'switch',
            default: false,
          },
          {
            key: 'url',
            label: 'API 地址',
            type: 'text',
            placeholder: 'http://localhost:3001/api/chart/nested',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
            ],
            default: 'GET',
          },
          {
            key: 'interval',
            label: '自动刷新(秒)',
            type: 'number',
            min: 0,
            max: 3600,
            step: 1,
            default: 0,
          },
          {
            key: 'dataPath',
            label: '数据值路径',
            type: 'text',
            placeholder: '例: data.chart.values 或 readings.temperatures',
            default: '',
          },
          {
            key: 'xAxisPath',
            label: 'X轴标签路径',
            type: 'text',
            placeholder: '例: data.chart.categories 或 readings.timestamps',
            default: '',
          },
          {
            key: 'seriesNamePath',
            label: '系列名称路径',
            type: 'text',
            placeholder: '例: data.seriesName (可选)',
            default: '',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]
      case 'stackedBarChart':
        return [
          {
            key: 'enabled',
            label: '启用数据源',
            type: 'switch',
            default: false,
          },
          {
            key: 'url',
            label: 'API 地址',
            type: 'text',
            placeholder: 'http://localhost:3001/api/chart/stacked',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
            ],
            default: 'GET',
          },
          {
            key: 'interval',
            label: '自动刷新(秒)',
            type: 'number',
            min: 0,
            max: 3600,
            step: 1,
            default: 0,
          },
          {
            key: 'xAxisPath',
            label: 'X轴标签路径',
            type: 'text',
            placeholder: '例: data.categories',
            default: '',
          },
          {
            key: 'seriesNamesPath',
            label: '系列名称数组路径',
            type: 'text',
            placeholder: '例: data.seriesNames',
            default: '',
          },
          {
            key: 'seriesDataPath',
            label: '系列数据数组路径',
            type: 'text',
            placeholder: '例: data.seriesData (二维数组)',
            default: '',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]
      default:
        return []
    }
  })

  // 组件自定义字段（非样式/非 dataSource）
  const componentSchema = computed<Field[]>(() => {
    const type = selectComponent.value?.type
    if (!type) return []
    switch (type) {
      case 'lineChart':
        return [
          {
            key: 'option',
            label: '完整 ECharts Option (JSON) - 高级配置会覆盖下方简单配置',
            type: 'text',
            placeholder: '{ "tooltip": {...}, "series": [...] }',
          },

          // === 基础配置 ===
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            placeholder: '折线图',
            default: '',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            placeholder: 'Series',
            default: 'Series',
          },
          {
            key: 'dataInput',
            label: '数据 (逗号分隔)',
            type: 'text',
            placeholder: '150, 230, 224, 218, 135, 147, 260',
            default: '150, 230, 224, 218, 135, 147, 260',
          },
          {
            key: 'xAxisInput',
            label: 'X 轴标签 (逗号分隔)',
            type: 'text',
            placeholder: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
            default: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          },

          // === 样式配置 ===
          {
            key: 'lineColor',
            label: '线条颜色',
            type: 'color',
            default: '#5470c6',
          },
          {
            key: 'lineWidth',
            label: '线条宽度',
            type: 'number',
            min: 1,
            max: 10,
            step: 1,
            default: 2,
          },
          {
            key: 'smooth',
            label: '平滑曲线',
            type: 'switch',
            default: true,
          },
          {
            key: 'showArea',
            label: '显示区域',
            type: 'switch',
            default: false,
          },
          {
            key: 'areaOpacity',
            label: '区域透明度',
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
            default: 0.3,
          },
          {
            key: 'showSymbol',
            label: '显示数据点',
            type: 'switch',
            default: true,
          },
          {
            key: 'symbolSize',
            label: '数据点大小',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 6,
          },
          {
            key: 'lineType',
            label: '线条类型',
            type: 'select',
            options: [
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' },
            ],
            default: 'solid',
          },

          // === 图例和提示框 ===
          {
            key: 'showLegend',
            label: '显示图例',
            type: 'switch',
            default: true,
          },
          {
            key: 'legendPosition',
            label: '图例位置',
            type: 'select',
            options: [
              { label: '顶部', value: 'top' },
              { label: '底部', value: 'bottom' },
              { label: '左侧', value: 'left' },
              { label: '右侧', value: 'right' },
            ],
            default: 'top',
          },
          {
            key: 'showTooltip',
            label: '显示提示框',
            type: 'switch',
            default: true,
          },

          // === 坐标轴配置 ===
          {
            key: 'xAxisName',
            label: 'X 轴名称',
            type: 'text',
            placeholder: '时间',
            default: '',
          },
          {
            key: 'yAxisName',
            label: 'Y 轴名称',
            type: 'text',
            placeholder: '数值',
            default: '',
          },
          {
            key: 'showXAxisLine',
            label: '显示 X 轴线',
            type: 'switch',
            default: true,
          },
          {
            key: 'showYAxisLine',
            label: '显示 Y 轴线',
            type: 'switch',
            default: true,
          },
          {
            key: 'showXAxisLabel',
            label: '显示 X 轴标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'showYAxisLabel',
            label: '显示 Y 轴标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'showGrid',
            label: '显示网格线',
            type: 'switch',
            default: true,
          },
        ]
      case 'chart.bar':
        return [
          { key: 'title', label: '图表标题', type: 'text', placeholder: '柱状图', default: '' },
          { key: 'seriesName', label: '系列名称', type: 'text', default: 'Series' },
          {
            key: 'dataInput',
            label: '数据 (逗号分隔)',
            type: 'text',
            placeholder: '120, 200, 150, 180, 270, 210, 220',
            default: '120, 200, 150, 180, 270, 210, 220',
          },
          {
            key: 'xAxisInput',
            label: 'X 轴标签 (逗号分隔)',
            type: 'text',
            placeholder: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
            default: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          },
          {
            key: 'barColor',
            label: '柱子颜色',
            type: 'color',
            default: '#5470c6'
          },
          {
            key: 'barWidth',
            label: '柱子宽度',
            type: 'text',
            default: '60%'
          },
          {
            key: 'borderRadius',
            label: '圆角半径',
            type: 'number',
            min: 0,
            max: 20,
            default: 0
          },
          { key: 'showLabel', label: '显示数值标签', type: 'switch', default: false },
          { key: 'showLegend', label: '显示图例', type: 'switch', default: true },
          { key: 'showTooltip', label: '显示提示框', type: 'switch', default: true },
          { key: 'xAxisName', label: 'X 轴名称', type: 'text', default: '' },
          { key: 'yAxisName', label: 'Y 轴名称', type: 'text', default: '' },
          { key: 'showGrid', label: '显示网格线', type: 'switch', default: true },
        ]
      case 'chart.stackedBar':
        return [
          { key: 'title', label: '图表标题', type: 'text', placeholder: '堆叠柱状图', default: '' },
          {
            key: 'xAxisInput',
            label: 'X 轴标签 (逗号分隔)',
            type: 'text',
            placeholder: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
            default: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          },
          {
            key: 'seriesNamesInput',
            label: '系列名称 (逗号分隔)',
            type: 'text',
            placeholder: 'Series 1, Series 2, Series 3',
            default: 'Series 1, Series 2, Series 3',
          },
          {
            key: 'series1Input',
            label: '系列 1 数据 (逗号分隔)',
            type: 'text',
            placeholder: '120, 132, 101, 134, 90, 230, 210',
            default: '120, 132, 101, 134, 90, 230, 210',
          },
          {
            key: 'series2Input',
            label: '系列 2 数据 (逗号分隔)',
            type: 'text',
            placeholder: '220, 182, 191, 234, 290, 330, 310',
            default: '220, 182, 191, 234, 290, 330, 310',
          },
          {
            key: 'series3Input',
            label: '系列 3 数据 (逗号分隔)',
            type: 'text',
            placeholder: '150, 232, 201, 154, 190, 330, 410',
            default: '150, 232, 201, 154, 190, 330, 410',
          },
          { key: 'color1', label: '系列 1 颜色', type: 'color', default: '#5470c6' },
          { key: 'color2', label: '系列 2 颜色', type: 'color', default: '#91cc75' },
          { key: 'color3', label: '系列 3 颜色', type: 'color', default: '#fac858' },
          { key: 'barWidth', label: '柱子宽度', type: 'text', default: '60%' },
          { key: 'borderRadius', label: '顶部圆角', type: 'number', min: 0, max: 20, default: 0 },
          { key: 'showLabel', label: '显示数值标签', type: 'switch', default: false },
          { key: 'showLegend', label: '显示图例', type: 'switch', default: true },
          { key: 'showTooltip', label: '显示提示框', type: 'switch', default: true },
          { key: 'xAxisName', label: 'X 轴名称', type: 'text', default: '' },
          { key: 'yAxisName', label: 'Y 轴名称', type: 'text', default: '' },
          { key: 'showGrid', label: '显示网格线', type: 'switch', default: true },
        ]
      default:
        return []
    }
  })

  return { styleSchema, dataSourceSchema, componentSchema }
}
