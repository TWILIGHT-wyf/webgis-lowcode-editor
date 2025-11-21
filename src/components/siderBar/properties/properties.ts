import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'

export function customProperties() {
  const componentStore = useComponent()
  const { selectComponent } = storeToRefs(componentStore)

  // 通用字段类型声明
  type Primitive = string | number | boolean | null | undefined
  type Field =
    | {
        key: string
        label: string
        type: 'text'
        placeholder?: string
        default?: Primitive
      }
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
          {
            key: 'fontColor',
            label: '字体颜色',
            type: 'color',
            default: '#000000',
          },
          {
            key: 'fontWeight',
            label: '字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal',
              },
              {
                label: '加粗',
                value: 'bold',
              },
              {
                label: '更细',
                value: 'lighter',
              },
              {
                label: '更粗',
                value: 'bolder',
              },
            ],
            default: 'normal',
          },
          {
            key: 'textAlign',
            label: '对齐',
            type: 'select',
            options: [
              {
                label: '左对齐',
                value: 'left',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '右对齐',
                value: 'right',
              },
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
              {
                label: '覆盖',
                value: 'cover',
              },
              {
                label: '包含',
                value: 'contain',
              },
              {
                label: '自动',
                value: 'auto',
              },
              {
                label: '100%',
                value: '100% 100%',
              },
            ],
            default: 'cover',
          },
          {
            key: 'backgroundPosition',
            label: '背景位置',
            type: 'select',
            options: [
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '顶部',
                value: 'top',
              },
              {
                label: '底部',
                value: 'bottom',
              },
              {
                label: '左侧',
                value: 'left',
              },
              {
                label: '右侧',
                value: 'right',
              },
              {
                label: '左上',
                value: 'left top',
              },
              {
                label: '右上',
                value: 'right top',
              },
              {
                label: '左下',
                value: 'left bottom',
              },
              {
                label: '右下',
                value: 'right bottom',
              },
            ],
            default: 'center',
          },
          {
            key: 'backgroundRepeat',
            label: '背景重复',
            type: 'select',
            options: [
              {
                label: '不重复',
                value: 'no-repeat',
              },
              {
                label: '重复',
                value: 'repeat',
              },
              {
                label: '水平重复',
                value: 'repeat-x',
              },
              {
                label: '垂直重复',
                value: 'repeat-y',
              },
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
              {
                label: '实线',
                value: 'solid',
              },
              {
                label: '虚线',
                value: 'dashed',
              },
              {
                label: '点线',
                value: 'dotted',
              },
              {
                label: '双线',
                value: 'double',
              },
            ],
            default: 'solid',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#000000',
          },
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
              {
                label: '水平',
                value: 'row',
              },
              {
                label: '垂直',
                value: 'column',
              },
              {
                label: '水平反向',
                value: 'row-reverse',
              },
              {
                label: '垂直反向',
                value: 'column-reverse',
              },
            ],
            default: 'row',
          },
          {
            key: 'justifyContent',
            label: '主轴对齐',
            type: 'select',
            options: [
              {
                label: '起点',
                value: 'flex-start',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '终点',
                value: 'flex-end',
              },
              {
                label: '均匀(around)',
                value: 'space-around',
              },
              {
                label: '两端',
                value: 'space-between',
              },
              {
                label: '均匀(evenly)',
                value: 'space-evenly',
              },
            ],
            default: 'flex-start',
          },
          {
            key: 'alignItems',
            label: '交叉轴对齐',
            type: 'select',
            options: [
              {
                label: '拉伸',
                value: 'stretch',
              },
              {
                label: '起点',
                value: 'flex-start',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '终点',
                value: 'flex-end',
              },
              {
                label: '基线',
                value: 'baseline',
              },
            ],
            default: 'stretch',
          },
          {
            key: 'flexWrap',
            label: '换行',
            type: 'select',
            options: [
              {
                label: '不换行',
                value: 'nowrap',
              },
              {
                label: '换行',
                value: 'wrap',
              },
              {
                label: '反向换行',
                value: 'wrap-reverse',
              },
            ],
            default: 'nowrap',
          },
          {
            key: 'gap',
            label: '间距(px)',
            type: 'number',
            min: 0,
            max: 200,
            step: 1,
            default: 0,
          },
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
              {
                label: '可见',
                value: 'visible',
              },
              {
                label: '隐藏',
                value: 'hidden',
              },
              {
                label: '滚动',
                value: 'scroll',
              },
              {
                label: '自动',
                value: 'auto',
              },
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
      case 'stat':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#fff',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#e0e0e0',
          },
          {
            key: 'borderWidth',
            label: '边框宽度(px)',
            type: 'number',
            min: 0,
            max: 10,
            step: 1,
            default: 1,
          },
          {
            key: 'borderRadius',
            label: '边框圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 8,
          },
          {
            key: 'boxShadow',
            label: '阴影',
            type: 'text',
            placeholder: '0 2px 4px rgba(0, 0, 0, 0.1)',
            default: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 20,
          },
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#333',
          },
          {
            key: 'valueColor',
            label: '数值颜色',
            type: 'color',
            default: '#3f8600',
          },
          {
            key: 'changeColorPositive',
            label: '增长颜色',
            type: 'color',
            default: '#28a745',
          },
          {
            key: 'changeColorNegative',
            label: '下降颜色',
            type: 'color',
            default: '#dc3545',
          },
          {
            key: 'titleFontSize',
            label: '标题字体大小(px)',
            type: 'number',
            min: 8,
            max: 100,
            step: 1,
            default: 14,
          },
          {
            key: 'valueFontSize',
            label: '数值字体大小(px)',
            type: 'number',
            min: 8,
            max: 200,
            step: 1,
            default: 24,
          },
          {
            key: 'changeFontSize',
            label: '变化字体大小(px)',
            type: 'number',
            min: 8,
            max: 100,
            step: 1,
            default: 14,
          },
          {
            key: 'titleFontWeight',
            label: '标题字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal'
              },
              {
                label: '加粗',
                value: 'bold'
              },
              {
                label: '更细',
                value: 'lighter'
              },
              {
                label: '更粗',
                value: 'bolder'
              },
            ],
            default: 'normal',
          },
          {
            key: 'valueFontWeight',
            label: '数值字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal'
              },
              {
                label: '加粗',
                value: 'bold'
              },
              {
                label: '更细',
                value: 'lighter'
              },
              {
                label: '更粗',
                value: 'bolder'
              },
            ],
            default: 'bold',
          },
          {
            key: 'changeFontWeight',
            label: '变化字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal'
              },
              {
                label: '加粗',
                value: 'bold'
              },
              {
                label: '更细',
                value: 'lighter'
              },
              {
                label: '更粗',
                value: 'bolder'
              },
            ],
            default: 'normal',
          },
        ]
      case 'countUp':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'borderWidth',
            label: '边框宽度(px)',
            type: 'number',
            min: 0,
            max: 10,
            step: 1,
            default: 0,
          },
          {
            key: 'borderRadius',
            label: '边框圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 10,
          },
          {
            key: 'align',
            label: '对齐方式',
            type: 'select',
            options: [
              {
                label: '左对齐',
                value: 'flex-start'
              },
              {
                label: '居中',
                value: 'center'
              },
              {
                label: '右对齐',
                value: 'flex-end'
              },
            ],
            default: 'center',
          },
          {
            key: 'valueColor',
            label: '数值颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'valueFontSize',
            label: '数值字体大小(px)',
            type: 'number',
            min: 12,
            max: 200,
            step: 1,
            default: 32,
          },
          {
            key: 'valueFontWeight',
            label: '数值字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal'
              },
              {
                label: '加粗',
                value: 'bold'
              },
              {
                label: '更细',
                value: 'lighter'
              },
              {
                label: '更粗',
                value: 'bolder'
              },
            ],
            default: 'bold',
          },
          {
            key: 'prefixColor',
            label: '前缀颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'prefixFontSize',
            label: '前缀字体大小(px)',
            type: 'number',
            min: 8,
            max: 100,
            step: 1,
            default: 16,
          },
          {
            key: 'prefixFontWeight',
            label: '前缀字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal'
              },
              {
                label: '加粗',
                value: 'bold'
              },
            ],
            default: 'normal',
          },
          {
            key: 'suffixColor',
            label: '后缀颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'suffixFontSize',
            label: '后缀字体大小(px)',
            type: 'number',
            min: 8,
            max: 100,
            step: 1,
            default: 16,
          },
          {
            key: 'suffixFontWeight',
            label: '后缀字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
            ],
            default: 'normal',
          },
          {
            key: 'fontFamily',
            label: '字体',
            type: 'text',
            placeholder: 'inherit',
            default: 'inherit',
          },
        ]
      case 'progress':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'strokeWidth',
            label: '进度条高度/宽度(px)',
            type: 'number',
            min: 6,
            max: 50,
            step: 1,
            default: 20,
          },
          {
            key: 'trackColor',
            label: '轨道颜色',
            type: 'color',
            default: '#e4e7ed',
          },
          {
            key: 'barColor',
            label: '进度条颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'successColor',
            label: '成功状态颜色',
            type: 'color',
            default: '#67c23a',
          },
          {
            key: 'warningColor',
            label: '警告状态颜色',
            type: 'color',
            default: '#e6a23c',
          },
          {
            key: 'exceptionColor',
            label: '异常状态颜色',
            type: 'color',
            default: '#f56c6c',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 10,
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'textInsideColor',
            label: '内部文字颜色',
            type: 'color',
            default: '#fff',
          },
          {
            key: 'textFontSize',
            label: '文字大小(px)',
            type: 'number',
            min: 8,
            max: 50,
            step: 1,
            default: 14,
          },
          {
            key: 'textFontWeight',
            label: '文字字重',
            type: 'select',
            options: [
              {
                label: '常规',
                value: 'normal'
              },
              {
                label: '加粗',
                value: 'bold'
              },
            ],
            default: 'normal',
          },
        ]
      case 'badge':
        return [
          {
            key: 'padding',
            label: '外边距(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'successColor',
            label: '成功类型颜色',
            type: 'color',
            default: '#67c23a',
          },
          {
            key: 'warningColor',
            label: '警告类型颜色',
            type: 'color',
            default: '#e6a23c',
          },
          {
            key: 'dangerColor',
            label: '危险类型颜色',
            type: 'color',
            default: '#f56c6c',
          },
          {
            key: 'infoColor',
            label: '信息类型颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#fff',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 8,
            max: 50,
            step: 1,
            default: 12,
          },
          {
            key: 'fontWeight',
            label: '字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
            ],
            default: 'bold',
          },
          {
            key: 'paddingX',
            label: '水平内边距(px)',
            type: 'number',
            min: 0,
            max: 30,
            step: 1,
            default: 6,
          },
          {
            key: 'paddingY',
            label: '垂直内边距(px)',
            type: 'number',
            min: 0,
            max: 30,
            step: 1,
            default: 2,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 10,
          },
          {
            key: 'borderWidth',
            label: '边框宽度(px)',
            type: 'number',
            min: 0,
            max: 5,
            step: 1,
            default: 0,
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'boxShadow',
            label: '阴影',
            type: 'text',
            placeholder: 'none',
            default: 'none',
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
            placeholder: 'https://api.example.com/data',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
              {
                label: 'PUT',
                value: 'PUT',
              },
              {
                label: 'DELETE',
                value: 'DELETE',
              },
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
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
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
      case 'pieChart':
      case 'doughnutChart':
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
            placeholder: 'http://localhost:3001/api/chart/pie',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
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
            placeholder: '例: data.values',
            default: '',
          },
          {
            key: 'labelsPath',
            label: '标签路径',
            type: 'text',
            placeholder: '例: data.labels',
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
      case 'scatterChart':
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
            placeholder: 'http://localhost:3001/api/chart/scatter',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
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
            placeholder: '例: data.points (二维数组 [[x1,y1],[x2,y2]])',
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
      case 'radarChart':
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
            placeholder: 'http://localhost:3001/api/chart/radar',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
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
            key: 'indicatorNamesPath',
            label: '指标名称路径',
            type: 'text',
            placeholder: '例: data.indicators',
            default: '',
          },
          {
            key: 'indicatorMaxsPath',
            label: '指标最大值路径',
            type: 'text',
            placeholder: '例: data.maxValues',
            default: '',
          },
          {
            key: 'seriesNamesPath',
            label: '系列名称路径',
            type: 'text',
            placeholder: '例: data.seriesNames',
            default: '',
          },
          {
            key: 'seriesValuesPath',
            label: '系列数据路径',
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
      case 'gaugeChart':
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
            placeholder: 'http://localhost:3001/api/chart/gauge',
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
            label: '数值路径',
            type: 'text',
            placeholder: '例: data.value',
            default: '',
          },
          {
            key: 'namePath',
            label: '名称路径',
            type: 'text',
            placeholder: '例: data.name',
            default: '',
          },
          {
            key: 'minPath',
            label: '最小值路径',
            type: 'text',
            placeholder: '例: data.min',
            default: '',
          },
          {
            key: 'maxPath',
            label: '最大值路径',
            type: 'text',
            placeholder: '例: data.max',
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
      case 'funnelChart':
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
            placeholder: 'http://localhost:3001/api/chart/funnel',
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
            label: '数据路径',
            type: 'text',
            placeholder: '例: data.values',
            default: '',
          },
          {
            key: 'labelsPath',
            label: '标签路径',
            type: 'text',
            placeholder: '例: data.labels',
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
      case 'sankeyChart':
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
            placeholder: 'http://localhost:3001/api/chart/sankey',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
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
            key: 'nodesPath',
            label: '节点数据路径',
            type: 'text',
            placeholder: '例: data.nodes',
            default: '',
          },
          {
            key: 'linksPath',
            label: '连接数据路径',
            type: 'text',
            placeholder: '例: data.links',
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
      case 'stat':
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
            placeholder: 'http://localhost:3001/api/stat',
            default: '',
          },
          {
            key: 'method',
            label: '请求方法',
            type: 'select',
            options: [
              {
                label: 'GET',
                value: 'GET',
              },
              {
                label: 'POST',
                value: 'POST',
              },
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
            label: '数据根路径',
            type: 'text',
            placeholder: '例: data',
            default: '',
          },
          {
            key: 'titlePath',
            label: '标题路径',
            type: 'text',
            placeholder: '例: data.title',
            default: '',
          },
          {
            key: 'valuePath',
            label: '数值路径',
            type: 'text',
            placeholder: '例: data.value',
            default: '',
          },
          {
            key: 'changePath',
            label: '变化路径',
            type: 'text',
            placeholder: '例: data.change',
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
      case 'countUp':
      case 'progress':
      case 'badge':
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
            placeholder: 'http://localhost:3001/api/kpi',
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
            label: '数据根路径',
            type: 'text',
            placeholder: '例: data',
            default: '',
          },
          {
            key: 'valuePath',
            label: '数值路径',
            type: 'text',
            placeholder: '例: data.value 或 value',
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
              {
                label: '实线',
                value: 'solid',
              },
              {
                label: '虚线',
                value: 'dashed',
              },
              {
                label: '点线',
                value: 'dotted',
              },
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
              {
                label: '顶部',
                value: 'top',
              },
              {
                label: '底部',
                value: 'bottom',
              },
              {
                label: '左侧',
                value: 'left',
              },
              {
                label: '右侧',
                value: 'right',
              },
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
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            placeholder: '柱状图',
            default: '',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            default: 'Series',
          },
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
            default: '#5470c6',
          },
          {
            key: 'barWidth',
            label: '柱子宽度',
            type: 'text',
            default: '60%',
          },
          {
            key: 'borderRadius',
            label: '圆角半径',
            type: 'number',
            min: 0,
            max: 20,
            default: 0,
          },
          {
            key: 'showLabel',
            label: '显示数值标签',
            type: 'switch',
            default: false,
          },
          {
            key: 'showLegend',
            label: '显示图例',
            type: 'switch',
            default: true,
          },
          {
            key: 'showTooltip',
            label: '显示提示框',
            type: 'switch',
            default: true,
          },
          {
            key: 'xAxisName',
            label: 'X 轴名称',
            type: 'text',
            default: '',
          },
          {
            key: 'yAxisName',
            label: 'Y 轴名称',
            type: 'text',
            default: '',
          },
          {
            key: 'showGrid',
            label: '显示网格线',
            type: 'switch',
            default: true,
          },
        ]
      case 'chart.stackedBar':
        return [
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            placeholder: '堆叠柱状图',
            default: '',
          },
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
          {
            key: 'color1',
            label: '系列 1 颜色',
            type: 'color',
            default: '#5470c6',
          },
          {
            key: 'color2',
            label: '系列 2 颜色',
            type: 'color',
            default: '#91cc75',
          },
          {
            key: 'color3',
            label: '系列 3 颜色',
            type: 'color',
            default: '#fac858',
          },
          {
            key: 'barWidth',
            label: '柱子宽度',
            type: 'text',
            default: '60%',
          },
          {
            key: 'borderRadius',
            label: '顶部圆角',
            type: 'number',
            min: 0,
            max: 20,
            default: 0,
          },
          {
            key: 'showLabel',
            label: '显示数值标签',
            type: 'switch',
            default: false,
          },
          {
            key: 'showLegend',
            label: '显示图例',
            type: 'switch',
            default: true,
          },
          {
            key: 'showTooltip',
            label: '显示提示框',
            type: 'switch',
            default: true,
          },
          { key: 'xAxisName', label: 'X 轴名称', type: 'text', default: '' },
          {
            key: 'yAxisName',
            label: 'Y 轴名称',
            type: 'text',
            default: '',
          },
          {
            key: 'showGrid',
            label: '显示网格线',
            type: 'switch',
            default: true,
          },
        ]
      case 'pieChart':
        return [
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            default: '',
          },
          {
            key: 'titleAlign',
            label: '标题对齐',
            type: 'select',
            options: [
              {
                label: '左对齐',
                value: 'left',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '右对齐',
                value: 'right',
              },
            ],
            default: 'center',
          },
          {
            key: 'titleSize',
            label: '标题字号',
            type: 'number',
            min: 10,
            max: 36,
            default: 16,
          },
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#333',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            default: 'Data',
          },
          {
            key: 'dataInput',
            label: '数据 (逗号分隔)',
            type: 'text',
            placeholder: '335, 310, 234, 135, 148',
            default: '',
          },
          {
            key: 'labelsInput',
            label: '标签 (逗号分隔)',
            type: 'text',
            placeholder: 'Category A, Category B, ...',
            default: '',
          },
          {
            key: 'radius',
            label: '半径',
            type: 'text',
            placeholder: '60%',
            default: '60%',
          },
          {
            key: 'centerX',
            label: '中心 X',
            type: 'text',
            placeholder: '50%',
            default: '50%',
          },
          {
            key: 'centerY',
            label: '中心 Y',
            type: 'text',
            placeholder: '50%',
            default: '50%',
          },
          {
            key: 'showLabel',
            label: '显示标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'labelFormatter',
            label: '标签格式',
            type: 'text',
            placeholder: '{b}: {c}',
            default: '{b}: {c}',
          },
          {
            key: 'showLegend',
            label: '显示图例',
            type: 'switch',
            default: true,
          },
          {
            key: 'legendOrient',
            label: '图例方向',
            type: 'select',
            options: [
              {
                label: '水平',
                value: 'horizontal',
              },
              {
                label: '垂直',
                value: 'vertical',
              },
            ],
            default: 'horizontal',
          },
          {
            key: 'legendLeft',
            label: '图例水平位置',
            type: 'text',
            default: 'center',
          },
          {
            key: 'legendTop',
            label: '图例垂直位置',
            type: 'text',
            default: 'bottom',
          },
        ]
      case 'doughnutChart':
        return [
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            default: '',
          },
          {
            key: 'titleAlign',
            label: '标题对齐',
            type: 'select',
            options: [
              {
                label: '左对齐',
                value: 'left',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '右对齐',
                value: 'right',
              },
            ],
            default: 'center',
          },
          {
            key: 'titleSize',
            label: '标题字号',
            type: 'number',
            min: 10,
            max: 36,
            default: 16,
          },
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#333',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            default: 'Access From',
          },
          {
            key: 'dataInput',
            label: '数据 (逗号分隔)',
            type: 'text',
            placeholder: '335, 310, 234, 135, 1548',
            default: '',
          },
          {
            key: 'labelsInput',
            label: '标签 (逗号分隔)',
            type: 'text',
            placeholder: 'Direct, Email, ...',
            default: '',
          },
          {
            key: 'innerRadius',
            label: '内半径',
            type: 'text',
            placeholder: '40%',
            default: '40%',
          },
          {
            key: 'outerRadius',
            label: '外半径',
            type: 'text',
            placeholder: '70%',
            default: '70%',
          },
          {
            key: 'centerX',
            label: '中心 X',
            type: 'text',
            placeholder: '50%',
            default: '50%',
          },
          {
            key: 'centerY',
            label: '中心 Y',
            type: 'text',
            placeholder: '50%',
            default: '50%',
          },
          {
            key: 'borderRadius',
            label: '边框圆角',
            type: 'number',
            min: 0,
            max: 50,
            default: 10,
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#fff',
          },
          {
            key: 'borderWidth',
            label: '边框宽度',
            type: 'number',
            min: 0,
            max: 10,
            default: 2,
          },
          {
            key: 'showLabel',
            label: '显示标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'labelFormatter',
            label: '标签格式',
            type: 'text',
            placeholder: '{b}: {c}',
            default: '{b}: {c}',
          },
          {
            key: 'showLabelLine',
            label: '显示标签线',
            type: 'switch',
            default: true,
          },
          {
            key: 'showLegend',
            label: '显示图例',
            type: 'switch',
            default: true,
          },
          {
            key: 'legendOrient',
            label: '图例方向',
            type: 'select',
            options: [
              {
                label: '水平',
                value: 'horizontal',
              },
              {
                label: '垂直',
                value: 'vertical',
              },
            ],
            default: 'horizontal',
          },
          {
            key: 'legendLeft',
            label: '图例水平位置',
            type: 'text',
            default: 'center',
          },
          {
            key: 'legendTop',
            label: '图例垂直位置',
            type: 'text',
            default: 'bottom',
          },
        ]
      case 'scatterChart':
        return [
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            default: '',
          },
          {
            key: 'titleAlign',
            label: '标题对齐',
            type: 'select',
            options: [
              {
                label: '左对齐',
                value: 'left',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '右对齐',
                value: 'right',
              },
            ],
            default: 'center',
          },
          {
            key: 'titleSize',
            label: '标题字号',
            type: 'number',
            min: 10,
            max: 36,
            default: 16,
          },
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#333',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            default: 'Data',
          },
          {
            key: 'dataInput',
            label: '数据 (JSON二维数组)',
            type: 'text',
            placeholder: '[[10, 8.04], [8.07, 6.95], ...]',
            default: '',
          },
          {
            key: 'symbolSize',
            label: '点大小',
            type: 'number',
            min: 1,
            max: 50,
            default: 10,
          },
          {
            key: 'color',
            label: '点颜色',
            type: 'color',
            default: '#5470c6',
          },
          {
            key: 'opacity',
            label: '透明度',
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
            default: 0.8,
          },
          {
            key: 'xAxisName',
            label: 'X 轴名称',
            type: 'text',
            default: '',
          },
          {
            key: 'yAxisName',
            label: 'Y 轴名称',
            type: 'text',
            default: '',
          },
          {
            key: 'showXAxisSplitLine',
            label: '显示 X 轴分隔线',
            type: 'switch',
            default: true,
          },
          {
            key: 'showYAxisSplitLine',
            label: '显示 Y 轴分隔线',
            type: 'switch',
            default: true,
          },
          {
            key: 'gridLeft',
            label: '网格左边距',
            type: 'text',
            default: '10%',
          },
          {
            key: 'gridRight',
            label: '网格右边距',
            type: 'text',
            default: '10%',
          },
          {
            key: 'gridTop',
            label: '网格上边距',
            type: 'text',
            default: '15%',
          },
          {
            key: 'gridBottom',
            label: '网格下边距',
            type: 'text',
            default: '15%',
          },
          {
            key: 'showLegend',
            label: '显示图例',
            type: 'switch',
            default: true,
          },
          {
            key: 'legendLeft',
            label: '图例水平位置',
            type: 'text',
            default: 'center',
          },
          {
            key: 'legendTop',
            label: '图例垂直位置',
            type: 'text',
            default: 'bottom',
          },
        ]
      case 'radarChart':
        return [
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            default: '',
          },
          {
            key: 'indicatorNamesInput',
            label: '指标名称 (逗号分隔)',
            type: 'text',
            placeholder: '销售,管理,技术,客服,研发,市场',
            default: '',
          },
          {
            key: 'indicatorMaxsInput',
            label: '指标最大值 (逗号分隔)',
            type: 'text',
            placeholder: '100,100,100,100,100,100',
            default: '',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            default: 'Radar',
          },
          {
            key: 'radarShape',
            label: '雷达图形状',
            type: 'select',
            options: [
              {
                label: '多边形',
                value: 'polygon',
              },
              {
                label: '圆形',
                value: 'circle',
              },
            ],
            default: 'polygon',
          },
          {
            key: 'splitNumber',
            label: '分割段数',
            type: 'number',
            min: 1,
            max: 10,
            default: 5,
          },
          {
            key: 'axisNameColor',
            label: '坐标轴名称颜色',
            type: 'color',
            default: '#333',
          },
          {
            key: 'showArea',
            label: '显示区域填充',
            type: 'switch',
            default: true,
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
        ]
      case 'gaugeChart':
        return [
          {
            key: 'title',
            label: '图表标题',
            type: 'text',
            default: '',
          },
          {
            key: 'value',
            label: '数值',
            type: 'number',
            min: 0,
            max: 100,
            default: 75,
          },
          {
            key: 'name',
            label: '名称',
            type: 'text',
            default: 'Progress',
          },
          {
            key: 'min',
            label: '最小值',
            type: 'number',
            default: 0,
          },
          {
            key: 'max',
            label: '最大值',
            type: 'number',
            default: 100,
          },
          {
            key: 'startAngle',
            label: '起始角度',
            type: 'number',
            min: 0,
            max: 360,
            default: 225,
          },
          {
            key: 'endAngle',
            label: '结束角度',
            type: 'number',
            min: -360,
            max: 360,
            default: -45,
          },
          {
            key: 'splitNumber',
            label: '分割段数',
            type: 'number',
            min: 1,
            max: 20,
            default: 10,
          },
          {
            key: 'showProgress',
            label: '显示进度条',
            type: 'switch',
            default: true,
          },
          {
            key: 'progressWidth',
            label: '进度条宽度',
            type: 'number',
            min: 1,
            max: 50,
            default: 10,
          },
          {
            key: 'axisLineWidth',
            label: '轴线宽度',
            type: 'number',
            min: 1,
            max: 50,
            default: 10,
          },
          {
            key: 'pointerColor',
            label: '指针颜色',
            type: 'text',
            default: 'auto',
          },
          {
            key: 'pointerLength',
            label: '指针长度',
            type: 'text',
            default: '70%',
          },
          {
            key: 'pointerWidth',
            label: '指针宽度',
            type: 'number',
            min: 1,
            max: 20,
            default: 8,
          },
          {
            key: 'showAxisTick',
            label: '显示刻度',
            type: 'switch',
            default: true,
          },
          {
            key: 'axisTickSplitNumber',
            label: '刻度分割',
            type: 'number',
            min: 1,
            max: 10,
            default: 5,
          },
          {
            key: 'showSplitLine',
            label: '显示分隔线',
            type: 'switch',
            default: true,
          },
          {
            key: 'splitLineLength',
            label: '分隔线长度',
            type: 'number',
            min: 1,
            max: 50,
            default: 15,
          },
          {
            key: 'showAxisLabel',
            label: '显示轴标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'axisLabelDistance',
            label: '轴标签距离',
            type: 'number',
            min: 0,
            max: 100,
            default: 25,
          },
          {
            key: 'axisLabelFontSize',
            label: '轴标签字号',
            type: 'number',
            min: 8,
            max: 24,
            default: 12,
          },
          {
            key: 'detailFormatter',
            label: '详情格式',
            type: 'text',
            default: '{value}',
          },
          {
            key: 'detailFontSize',
            label: '详情字号',
            type: 'number',
            min: 8,
            max: 48,
            default: 20,
          },
          {
            key: 'detailOffsetX',
            label: '详情水平偏移',
            type: 'text',
            default: '0%',
          },
          {
            key: 'detailOffsetY',
            label: '详情垂直偏移',
            type: 'text',
            default: '70%',
          },
        ]
      case 'funnelChart':
        return [
          { key: 'title', label: '图表标题', type: 'text', default: '' },
          {
            key: 'dataInput',
            label: '数据 (逗号分隔)',
            type: 'text',
            placeholder: '100,80,60,40,20',
            default: '',
          },
          {
            key: 'labelsInput',
            label: '标签 (逗号分隔)',
            type: 'text',
            placeholder: '展示,访问,咨询,订单,成交',
            default: '',
          },
          {
            key: 'seriesName',
            label: '系列名称',
            type: 'text',
            default: 'Funnel',
          },
          {
            key: 'left',
            label: '左边距',
            type: 'text',
            default: '10%',
          },
          {
            key: 'top',
            label: '上边距',
            type: 'text',
            default: '20%',
          },
          {
            key: 'bottom',
            label: '下边距',
            type: 'text',
            default: '20%',
          },
          {
            key: 'width',
            label: '宽度',
            type: 'text',
            default: '80%',
          },
          {
            key: 'min',
            label: '最小值',
            type: 'number',
            default: 0,
          },
          {
            key: 'max',
            label: '最大值',
            type: 'number',
            default: 100,
          },
          {
            key: 'minSize',
            label: '最小尺寸',
            type: 'text',
            default: '0%',
          },
          {
            key: 'maxSize',
            label: '最大尺寸',
            type: 'text',
            default: '100%',
          },
          {
            key: 'sort',
            label: '排序方式',
            type: 'select',
            options: [
              { label: '降序', value: 'descending' },
              { label: '升序', value: 'ascending' },
              { label: '无', value: 'none' },
            ],
            default: 'descending',
          },
          {
            key: 'gap',
            label: '间隙',
            type: 'number',
            min: 0,
            max: 20,
            default: 2,
          },
          {
            key: 'showLabel',
            label: '显示标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'labelPosition',
            label: '标签位置',
            type: 'select',
            options: [
              { label: '左侧', value: 'left' },
              { label: '右侧', value: 'right' },
              { label: '内部', value: 'inside' },
            ],
            default: 'inside',
          },
          {
            key: 'labelFormatter',
            label: '标签格式',
            type: 'text',
            default: '{b}: {c}',
          },
          {
            key: 'showLabelLine',
            label: '显示标签线',
            type: 'switch',
            default: true,
          },
          {
            key: 'labelLineLength',
            label: '标签线长度',
            type: 'number',
            min: 0,
            max: 50,
            default: 10,
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#fff',
          },
          {
            key: 'borderWidth',
            label: '边框宽度',
            type: 'number',
            min: 0,
            max: 10,
            default: 1,
          },
        ]
      case 'sankeyChart':
        return [
          { key: 'title', label: '图表标题', type: 'text', default: '' },
          {
            key: 'nodesInput',
            label: '节点 (JSON数组)',
            type: 'text',
            placeholder: '["a","b","c"] 或 [{"name":"a"},{"name":"b"}]',
            default: '',
          },
          {
            key: 'linksInput',
            label: '连接 (JSON数组)',
            type: 'text',
            placeholder: '[{"source":"a","target":"b","value":5}]',
            default: '',
          },
          {
            key: 'orient',
            label: '方向',
            type: 'select',
            options: [
              {
                label: '水平',
                value: 'horizontal',
              },
              {
                label: '垂直',
                value: 'vertical',
              },
            ],
            default: 'horizontal',
          },
          {
            key: 'left',
            label: '左边距',
            type: 'text',
            default: '5%',
          },
          {
            key: 'top',
            label: '上边距',
            type: 'text',
            default: '10%',
          },
          {
            key: 'right',
            label: '右边距',
            type: 'text',
            default: '20%',
          },
          {
            key: 'bottom',
            label: '下边距',
            type: 'text',
            default: '10%',
          },
          {
            key: 'nodeWidth',
            label: '节点宽度',
            type: 'number',
            min: 1,
            max: 100,
            default: 20,
          },
          {
            key: 'nodeGap',
            label: '节点间隙',
            type: 'number',
            min: 0,
            max: 50,
            default: 8,
          },
          {
            key: 'layoutIterations',
            label: '布局迭代次数',
            type: 'number',
            min: 1,
            max: 100,
            default: 32,
          },
          {
            key: 'nodeAlign',
            label: '节点对齐',
            type: 'select',
            options: [
              {
                label: '左对齐',
                value: 'left',
              },
              {
                label: '右对齐',
                value: 'right',
              },
              {
                label: '两端对齐',
                value: 'justify',
              },
            ],
            default: 'justify',
          },
          {
            key: 'showLabel',
            label: '显示标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'labelPosition',
            label: '标签位置',
            type: 'select',
            options: [
              {
                label: '左侧',
                value: 'left',
              },
              {
                label: '右侧',
                value: 'right',
              },
              {
                label: '上方',
                value: 'top',
              },
              {
                label: '下方',
                value: 'bottom',
              },
            ],
            default: 'right',
          },
          {
            key: 'labelFontSize',
            label: '标签字号',
            type: 'number',
            min: 8,
            max: 24,
            default: 12,
          },
          {
            key: 'labelColor',
            label: '标签颜色',
            type: 'color',
            default: '#000',
          },
          {
            key: 'lineColor',
            label: '连线颜色',
            type: 'text',
            default: 'source',
          },
          {
            key: 'lineOpacity',
            label: '连线透明度',
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
            default: 0.2,
          },
          {
            key: 'lineCurveness',
            label: '连线曲率',
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
            default: 0.5,
          },
        ]
      case 'stat':
        return [
          {
            key: 'title',
            label: '标题',
            type: 'text',
            placeholder: '指标标题',
            default: '指标标题',
          },
          {
            key: 'value',
            label: '数值',
            type: 'number',
            min: 0,
            step: 1,
            default: 0,
          },
          {
            key: 'icon',
            label: '图标类名',
            type: 'text',
            placeholder: 'el-icon-star-on',
            default: 'el-icon-star-on',
          },
          {
            key: 'change',
            label: '变化百分比',
            type: 'number',
            step: 0.1,
            default: 0,
          },
          {
            key: 'precision',
            label: '小数位数',
            type: 'number',
            min: 0,
            max: 10,
            step: 1,
            default: 0,
          },
          {
            key: 'suffix',
            label: '后缀',
            type: 'text',
            placeholder: '% 或 元',
            default: '',
          },
        ]
      case 'countUp':
        return [
          {
            key: 'value',
            label: '目标数值',
            type: 'number',
            step: 0.01,
            default: 0,
          },
          {
            key: 'startValue',
            label: '起始数值',
            type: 'number',
            step: 0.01,
            default: 0,
          },
          {
            key: 'duration',
            label: '动画时长(毫秒)',
            type: 'number',
            min: 0,
            max: 10000,
            step: 100,
            default: 2000,
          },
          {
            key: 'decimals',
            label: '小数位数',
            type: 'number',
            min: 0,
            max: 10,
            step: 1,
            default: 0,
          },
          {
            key: 'separator',
            label: '千分位分隔符',
            type: 'text',
            placeholder: ',',
            default: ',',
          },
          {
            key: 'prefix',
            label: '前缀',
            type: 'text',
            placeholder: '¥',
            default: '',
          },
          {
            key: 'suffix',
            label: '后缀',
            type: 'text',
            placeholder: '元',
            default: '',
          },
          {
            key: 'showPrefix',
            label: '显示前缀',
            type: 'switch',
            default: true,
          },
          {
            key: 'showSuffix',
            label: '显示后缀',
            type: 'switch',
            default: true,
          },
          {
            key: 'useEasing',
            label: '使用缓动效果',
            type: 'switch',
            default: true,
          },
        ]
      case 'progress':
        return [
          {
            key: 'value',
            label: '进度值(0-100)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 50,
          },
          {
            key: 'type',
            label: '类型',
            type: 'select',
            options: [
              { label: '水平', value: 'line' },
              { label: '垂直', value: 'vertical' },
            ],
            default: 'line',
          },
          {
            key: 'status',
            label: '状态',
            type: 'select',
            options: [
              { label: '默认', value: '' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '异常', value: 'exception' },
            ],
            default: '',
          },
          {
            key: 'showText',
            label: '显示文字',
            type: 'switch',
            default: true,
          },
          {
            key: 'textPosition',
            label: '文字位置',
            type: 'select',
            options: [
              { label: '左侧', value: 'left' },
              { label: '右侧', value: 'right' },
              { label: '内部', value: 'inside' },
            ],
            default: 'right',
          },
          {
            key: 'textFormat',
            label: '文字格式',
            type: 'text',
            placeholder: '{value}%',
            default: '{value}%',
          },
          {
            key: 'showStripe',
            label: '显示条纹',
            type: 'switch',
            default: false,
          },
          {
            key: 'animateStripe',
            label: '条纹动画',
            type: 'switch',
            default: false,
          },
        ]
      case 'badge':
        return [
          {
            key: 'value',
            label: '显示值',
            type: 'text',
            placeholder: '99',
            default: 0,
          },
          {
            key: 'type',
            label: '类型',
            type: 'select',
            options: [
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' },
              { label: '信息', value: 'info' },
            ],
            default: 'primary',
          },
          {
            key: 'dot',
            label: '小圆点模式',
            type: 'switch',
            default: false,
          },
          {
            key: 'maxValue',
            label: '最大值',
            type: 'number',
            min: 1,
            max: 999,
            step: 1,
            default: 99,
          },
        ]
      default:
        return []
    }
  })

  return { styleSchema, dataSourceSchema, componentSchema }
}
