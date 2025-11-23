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
            key: 'valueFontWeight',
            label: '数值字重',
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
            default: 'bold',
          },
          {
            key: 'changeFontWeight',
            label: '变化字重',
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
                value: 'flex-start',
              },
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '右对齐',
                value: 'flex-end',
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
                value: 'normal',
              },
              {
                label: '加粗',
                value: 'bold',
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
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#909399',
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
            key: 'titleFontWeight',
            label: '标题字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
            ],
            default: 'normal',
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
                value: 'normal',
              },
              {
                label: '加粗',
                value: 'bold',
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
          {
            key: 'slotFontSize',
            label: '内容字体大小(px)',
            type: 'number',
            min: 8,
            max: 100,
            step: 1,
            default: 14,
          },
          {
            key: 'slotColor',
            label: '内容颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'slotPadding',
            label: '内容内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 8,
          },
        ]

      case 'box':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#f5f7fa',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 4,
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
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'borderStyle',
            label: '边框样式',
            type: 'select',
            options: [
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' },
              { label: '无', value: 'none' },
            ],
            default: 'solid',
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 16,
          },
          {
            key: 'boxShadow',
            label: '阴影',
            type: 'text',
            placeholder: '0 2px 4px rgba(0,0,0,0.1)',
            default: 'none',
          },
          {
            key: 'textAlign',
            label: '文本对齐',
            type: 'select',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
              { label: '两端对齐', value: 'justify' },
            ],
            default: 'center',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 8,
            max: 100,
            step: 1,
            default: 14,
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'fontWeight',
            label: '字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
            ],
            default: 'normal',
          },
          {
            key: 'lineHeight',
            label: '行高',
            type: 'number',
            min: 1,
            max: 3,
            step: 0.1,
            default: 1.5,
          },
        ]

      case 'table':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'headerBackgroundColor',
            label: '表头背景色',
            type: 'color',
            default: '#f5f7fa',
          },
          {
            key: 'headerColor',
            label: '表头文字颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'headerFontSize',
            label: '表头字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 14,
          },
          {
            key: 'headerHeight',
            label: '表头高度(px)',
            type: 'number',
            min: 30,
            max: 100,
            step: 1,
            default: 40,
          },
          {
            key: 'cellColor',
            label: '单元格文字颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'cellFontSize',
            label: '单元格字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 13,
          },
          {
            key: 'rowHeight',
            label: '行高(px)',
            type: 'number',
            min: 30,
            max: 100,
            step: 1,
            default: 48,
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#ebeef5',
          },
          {
            key: 'hoverBackgroundColor',
            label: '悬停背景色',
            type: 'color',
            default: '#f5f7fa',
          },
        ]

      case 'list':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'itemBackgroundColor',
            label: '列表项背景色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'itemPadding',
            label: '列表项上下内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 12,
          },
          {
            key: 'itemPaddingX',
            label: '列表项左右内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'borderColor',
            label: '左侧边框颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'splitColor',
            label: '分割线颜色',
            type: 'color',
            default: '#e4e7ed',
          },
          {
            key: 'titleFontSize',
            label: '标题字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 15,
          },
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'titleFontWeight',
            label: '标题字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '中等', value: '500' },
              { label: '加粗', value: 'bold' },
            ],
            default: '500',
          },
          {
            key: 'descriptionFontSize',
            label: '描述字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 13,
          },
          {
            key: 'descriptionColor',
            label: '描述颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'extraFontSize',
            label: '扩展信息字体大小(px)',
            type: 'number',
            min: 10,
            max: 20,
            step: 1,
            default: 12,
          },
          {
            key: 'extraColor',
            label: '扩展信息颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'iconColor',
            label: '图标颜色',
            type: 'color',
            default: '#909399',
          },
        ]

      case 'timeline':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'padding',
            label: '容器内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'timelinePadding',
            label: '时间轴左边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'cardMargin',
            label: '卡片间距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 12,
          },
          {
            key: 'cardBorderRadius',
            label: '卡片圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'headerFontSize',
            label: '卡片标题字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 15,
          },
          {
            key: 'headerColor',
            label: '卡片标题颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'headerFontWeight',
            label: '卡片标题字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '中等', value: '500' },
              { label: '加粗', value: '600' },
            ],
            default: '600',
          },
          {
            key: 'contentFontSize',
            label: '卡片内容字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 14,
          },
          {
            key: 'contentColor',
            label: '卡片内容颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'titleFontSize',
            label: '简单模式标题字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 15,
          },
          {
            key: 'titleColor',
            label: '简单模式标题颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'titleFontWeight',
            label: '简单模式标题字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '中等', value: '500' },
              { label: '加粗', value: '600' },
            ],
            default: '600',
          },
          {
            key: 'textFontSize',
            label: '简单模式内容字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 14,
          },
          {
            key: 'textColor',
            label: '简单模式内容颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'extraFontSize',
            label: '扩展信息字体大小(px)',
            type: 'number',
            min: 10,
            max: 20,
            step: 1,
            default: 12,
          },
          {
            key: 'extraColor',
            label: '扩展信息颜色',
            type: 'color',
            default: '#909399',
          },
        ]

      case 'cardGrid':
        return [
          {
            key: 'backgroundColor',
            label: '容器背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'padding',
            label: '容器内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'cardBackgroundColor',
            label: '卡片背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'cardBorderColor',
            label: '卡片边框颜色',
            type: 'color',
            default: '#ebeef5',
          },
          {
            key: 'cardShadow',
            label: '卡片阴影',
            type: 'select',
            options: [
              { label: '总是显示', value: 'always' },
              { label: '悬停显示', value: 'hover' },
              { label: '从不显示', value: 'never' },
            ],
            default: 'hover',
          },
          {
            key: 'cardPadding',
            label: '卡片内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'gap',
            label: '卡片间距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'imageHeight',
            label: '图片高度(px)',
            type: 'number',
            min: 50,
            max: 500,
            step: 10,
            default: 150,
          },
          {
            key: 'titleFontSize',
            label: '标题字体大小(px)',
            type: 'number',
            min: 12,
            max: 30,
            step: 1,
            default: 16,
          },
          {
            key: 'titleColor',
            label: '标题颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'titleFontWeight',
            label: '标题字重',
            type: 'select',
            options: [
              { label: '常规', value: 'normal' },
              { label: '加粗', value: 'bold' },
            ],
            default: 'bold',
          },
          {
            key: 'descFontSize',
            label: '描述字体大小(px)',
            type: 'number',
            min: 10,
            max: 20,
            step: 1,
            default: 14,
          },
          {
            key: 'descColor',
            label: '描述颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'footerFontSize',
            label: '页脚字体大小(px)',
            type: 'number',
            min: 10,
            max: 18,
            step: 1,
            default: 12,
          },
          {
            key: 'footerColor',
            label: '页脚颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'tagBackgroundColor',
            label: '标签背景颜色',
            type: 'color',
            default: '#ecf5ff',
          },
          {
            key: 'tagTextColor',
            label: '标签文字颜色',
            type: 'color',
            default: '#409eff',
          },
        ]

      case 'pivot':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'headerBackgroundColor',
            label: '表头背景颜色',
            type: 'color',
            default: '#f5f7fa',
          },
          {
            key: 'headerTextColor',
            label: '表头文字颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#ebeef5',
          },
          {
            key: 'hoverBackgroundColor',
            label: '悬停背景颜色',
            type: 'color',
            default: '#f5f7fa',
          },
          {
            key: 'highlightColor',
            label: '高亮颜色',
            type: 'color',
            default: '#67c23a',
          },
          {
            key: 'highlightThreshold',
            label: '高亮阈值',
            type: 'number',
            min: 0,
            max: 10000,
            step: 100,
            default: 1000,
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 14,
          },
        ]

      case 'select':
      case 'multiSelect':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'selectWidth',
            label: '选择器宽度',
            type: 'text',
            placeholder: '100% 或 200px',
            default: '100%',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'borderFocusColor',
            label: '聚焦边框颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'borderHoverColor',
            label: '悬停边框颜色',
            type: 'color',
            default: '#c0c4cc',
          },
          {
            key: 'tagBackgroundColor',
            label: '标签背景颜色',
            type: 'color',
            default: '#f4f4f5',
          },
          {
            key: 'tagTextColor',
            label: '标签文字颜色',
            type: 'color',
            default: '#909399',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 20,
            step: 1,
            default: 14,
          },
        ]

      case 'dateRange':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'pickerWidth',
            label: '选择器宽度',
            type: 'text',
            placeholder: '100% 或 300px',
            default: '100%',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'borderFocusColor',
            label: '聚焦边框颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'borderHoverColor',
            label: '悬停边框颜色',
            type: 'color',
            default: '#c0c4cc',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 20,
            step: 1,
            default: 14,
          },
        ]

      case 'searchBox':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'inputWidth',
            label: '输入框宽度',
            type: 'text',
            placeholder: '100% 或 300px',
            default: '100%',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'borderFocusColor',
            label: '聚焦边框颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'borderHoverColor',
            label: '悬停边框颜色',
            type: 'color',
            default: '#c0c4cc',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'placeholderColor',
            label: '占位符颜色',
            type: 'color',
            default: '#a8abb2',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 14,
          },
        ]

      case 'slider':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'activeColor',
            label: '激活颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'inactiveColor',
            label: '未激活颜色',
            type: 'color',
            default: '#e4e7ed',
          },
          {
            key: 'buttonSize',
            label: '滑块大小(px)',
            type: 'number',
            min: 12,
            max: 40,
            step: 1,
            default: 20,
          },
          {
            key: 'valueFontSize',
            label: '数值字体大小(px)',
            type: 'number',
            min: 10,
            max: 24,
            step: 1,
            default: 14,
          },
          {
            key: 'valueColor',
            label: '数值颜色',
            type: 'color',
            default: '#606266',
          },
          {
            key: 'valueAlign',
            label: '数值对齐',
            type: 'select',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
            default: 'center',
          },
        ]

      case 'switch':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'activeColor',
            label: '开启颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'inactiveColor',
            label: '关闭颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
        ]

      case 'checkboxGroup':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
          },
          {
            key: 'direction',
            label: '布局方向',
            type: 'select',
            options: [
              { label: '水平', value: 'horizontal' },
              { label: '垂直', value: 'vertical' },
            ],
            default: 'horizontal',
          },
          {
            key: 'gap',
            label: '间距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 12,
          },
          {
            key: 'checkedColor',
            label: '选中颜色',
            type: 'color',
            default: '#409eff',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#606266',
          },
        ]

      case 'buttonGroup':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
          },
        ]

      // 布局组件样式
      case 'row':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #e5e7eb',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 4,
          },
          {
            key: 'minHeight',
            label: '最小高度(px)',
            type: 'number',
            min: 0,
            max: 1000,
            step: 10,
            default: 100,
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
        ]

      case 'col':
        return [
          {
            key: 'span',
            label: '栅格占位',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: 12,
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #e5e7eb',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 4,
          },
          {
            key: 'minHeight',
            label: '最小高度(px)',
            type: 'number',
            min: 0,
            max: 1000,
            step: 10,
            default: 100,
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
        ]

      case 'flex':
        return [
          {
            key: 'flexDirection',
            label: '主轴方向',
            type: 'select',
            options: [
              { label: '水平', value: 'row' },
              { label: '垂直', value: 'column' },
            ],
            default: 'row',
          },
          {
            key: 'justifyContent',
            label: '主轴对齐',
            type: 'select',
            options: [
              { label: '起点', value: 'flex-start' },
              { label: '终点', value: 'flex-end' },
              { label: '居中', value: 'center' },
              { label: '两端', value: 'space-between' },
              { label: '周围', value: 'space-around' },
              { label: '均匀', value: 'space-evenly' },
            ],
            default: 'flex-start',
          },
          {
            key: 'alignItems',
            label: '交叉轴对齐',
            type: 'select',
            options: [
              { label: '起点', value: 'flex-start' },
              { label: '终点', value: 'flex-end' },
              { label: '居中', value: 'center' },
              { label: '基线', value: 'baseline' },
              { label: '拉伸', value: 'stretch' },
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
          {
            key: 'gap',
            label: '间距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 2,
            default: 16,
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #e5e7eb',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 4,
          },
          {
            key: 'minHeight',
            label: '最小高度(px)',
            type: 'number',
            min: 0,
            max: 1000,
            step: 10,
            default: 100,
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
        ]

      case 'grid':
        return [
          {
            key: 'gridTemplateColumns',
            label: '列模板',
            type: 'text',
            default: 'repeat(3, 1fr)',
            placeholder: 'repeat(3, 1fr)',
          },
          {
            key: 'gridTemplateRows',
            label: '行模板',
            type: 'text',
            default: 'auto',
            placeholder: 'auto',
          },
          {
            key: 'gridGap',
            label: '间距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 2,
            default: 16,
          },
          {
            key: 'gridAutoFlow',
            label: '自动流动',
            type: 'select',
            options: [
              { label: '行', value: 'row' },
              { label: '列', value: 'column' },
              { label: '密集行', value: 'row dense' },
              { label: '密集列', value: 'column dense' },
            ],
            default: 'row',
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #e5e7eb',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 4,
          },
          {
            key: 'minHeight',
            label: '最小高度(px)',
            type: 'number',
            min: 0,
            max: 1000,
            step: 10,
            default: 200,
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
        ]

      case 'modal':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
        ]

      case 'panel':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #e5e7eb',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 4,
          },
          {
            key: 'boxShadow',
            label: '阴影',
            type: 'text',
            default: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
          {
            key: 'headerPadding',
            label: '头部内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'headerBg',
            label: '头部背景',
            type: 'color',
            default: '#f9fafb',
          },
          {
            key: 'headerFontSize',
            label: '头部字号(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 14,
          },
          {
            key: 'headerColor',
            label: '头部颜色',
            type: 'color',
            default: '#111827',
          },
          {
            key: 'bodyPadding',
            label: '内容内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'textColor',
            label: '内容颜色',
            type: 'color',
            default: '#333333',
          },
          {
            key: 'fontSize',
            label: '内容字号(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 14,
          },
          {
            key: 'footerPadding',
            label: '底部内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'footerBg',
            label: '底部背景',
            type: 'color',
            default: '#f9fafb',
          },
          {
            key: 'footerFontSize',
            label: '底部字号(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 12,
          },
          {
            key: 'footerColor',
            label: '底部颜色',
            type: 'color',
            default: '#6b7280',
          },
        ]

      case 'tabs':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
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
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
        ]

      // 媒体组件样式
      case 'image':
        return [
          {
            key: 'objectFit',
            label: '图片适应',
            type: 'select',
            options: [
              { label: '填充', value: 'fill' },
              { label: '包含', value: 'contain' },
              { label: '覆盖', value: 'cover' },
              { label: '无', value: 'none' },
              { label: '缩小', value: 'scale-down' },
            ],
            default: 'cover',
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'transparent',
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
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: 'none',
          },
        ]

      case 'video':
        return [
          {
            key: 'objectFit',
            label: '视频适应',
            type: 'select',
            options: [
              { label: '填充', value: 'fill' },
              { label: '包含', value: 'contain' },
              { label: '覆盖', value: 'cover' },
              { label: '无', value: 'none' },
            ],
            default: 'contain',
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#000000',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: 'none',
          },
        ]

      // 内容组件样式
      case 'markdown':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 14,
          },
          {
            key: 'lineHeight',
            label: '行高',
            type: 'number',
            min: 1,
            max: 3,
            step: 0.1,
            default: 1.6,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: 'none',
          },
          {
            key: 'fontFamily',
            label: '字体',
            type: 'text',
            default: 'inherit',
          },
        ]

      case 'html':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'textColor',
            label: '文本颜色',
            type: 'color',
            default: '#333333',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 14,
          },
          {
            key: 'lineHeight',
            label: '行高',
            type: 'number',
            min: 1,
            max: 3,
            step: 0.1,
            default: 1.6,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: 'none',
          },
          {
            key: 'overflow',
            label: '溢出处理',
            type: 'select',
            options: [
              { label: '自动', value: 'auto' },
              { label: '滚动', value: 'scroll' },
              { label: '隐藏', value: 'hidden' },
              { label: '可见', value: 'visible' },
            ],
            default: 'auto',
          },
          {
            key: 'fontFamily',
            label: '字体',
            type: 'text',
            default: 'inherit',
          },
        ]

      case 'iframe':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #dcdfe6',
          },
        ]

      // 高级功能组件
      case 'scripting':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#1e1e1e',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#d4d4d4',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 14,
          },
          {
            key: 'lineHeight',
            label: '行高',
            type: 'number',
            min: 1,
            max: 3,
            step: 0.1,
            default: 1.6,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #3c3c3c',
          },
          {
            key: 'fontFamily',
            label: '字体',
            type: 'text',
            default: 'Consolas, Monaco, "Courier New", monospace',
          },
        ]

      case 'state':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#2d2d2d',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#cccccc',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 14,
          },
          {
            key: 'lineHeight',
            label: '行高',
            type: 'number',
            min: 1,
            max: 3,
            step: 0.1,
            default: 1.6,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #3c3c3c',
          },
          {
            key: 'fontFamily',
            label: '字体',
            type: 'text',
            default: 'Consolas, Monaco, "Courier New", monospace',
          },
        ]

      case 'trigger':
        return [
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 16,
          },
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#1a1a1a',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#e0e0e0',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 30,
            step: 1,
            default: 13,
          },
          {
            key: 'lineHeight',
            label: '行高',
            type: 'number',
            min: 1,
            max: 3,
            step: 0.1,
            default: 1.5,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 4,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: '1px solid #3c3c3c',
          },
          {
            key: 'fontFamily',
            label: '字体',
            type: 'text',
            default: 'Consolas, Monaco, "Courier New", monospace',
          },
        ]

      // 地图组件样式
      case 'base':
      case 'tile':
      case 'vector':
      case 'geojson':
      case 'marker':
      case 'cluster':
      case 'heat':
        return [
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: 0,
          },
          {
            key: 'border',
            label: '边框',
            type: 'text',
            default: 'none',
          },
        ]

      case 'legend':
      case 'layers':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: '#ffffff',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'borderColor',
            label: '边框颜色',
            type: 'color',
            default: '#dcdfe6',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 10,
            max: 20,
            step: 1,
            default: 14,
          },
          {
            key: 'padding',
            label: '内边距(px)',
            type: 'number',
            min: 0,
            max: 30,
            step: 1,
            default: 12,
          },
          {
            key: 'borderRadius',
            label: '圆角(px)',
            type: 'number',
            min: 0,
            max: 10,
            step: 1,
            default: 4,
          },
        ]

      case 'scale':
        return [
          {
            key: 'backgroundColor',
            label: '背景颜色',
            type: 'color',
            default: 'rgba(255, 255, 255, 0.8)',
          },
          {
            key: 'lineColor',
            label: '线条颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'textColor',
            label: '文字颜色',
            type: 'color',
            default: '#303133',
          },
          {
            key: 'fontSize',
            label: '字体大小(px)',
            type: 'number',
            min: 8,
            max: 16,
            step: 1,
            default: 11,
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
            placeholder: 'http://localhost:3001/api/countup',
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
            key: 'titlePath',
            label: '标题路径',
            type: 'text',
            placeholder: '例: title 或 data.title',
            default: '',
          },
          {
            key: 'valuePath',
            label: '数值路径',
            type: 'text',
            placeholder: '例: value 或 data.value',
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

      case 'box':
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
            placeholder: 'http://localhost:3001/api/box-content',
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
            placeholder: '例: content 或 data.message',
            default: '',
          },
          {
            key: 'contentPath',
            label: '内容字段路径',
            type: 'text',
            placeholder: '留空则使用dataPath',
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

      case 'table':
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
            placeholder: 'http://localhost:3001/api/table-data',
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
            placeholder: '例: data 或 result.list',
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

      case 'list':
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
            placeholder: 'http://localhost:3001/api/list-items',
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
            placeholder: '例: data 或 result.items',
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

      case 'timeline':
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
            placeholder: 'http://localhost:3001/api/timeline-events',
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
            placeholder: '例: data 或 result.events',
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

      case 'cardGrid':
      case 'pivot':
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
            placeholder:
              type === 'cardGrid'
                ? 'http://localhost:3001/api/card-grid'
                : 'http://localhost:3001/api/pivot-data',
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
            placeholder: '例: data 或 result.list',
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

      case 'select':
      case 'multiSelect':
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
            placeholder:
              type === 'select'
                ? 'http://localhost:3001/api/select-options'
                : 'http://localhost:3001/api/multi-select-options',
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
            placeholder: '例: data 或 result.options',
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

      case 'checkboxGroup':
      case 'buttonGroup':
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
            placeholder:
              type === 'checkboxGroup'
                ? 'http://localhost:3001/api/checkbox-options'
                : 'http://localhost:3001/api/button-group',
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
            placeholder: '例: data 或 result.options',
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

      case 'tabs':
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
            placeholder: 'http://localhost:3001/api/tabs',
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
            placeholder: '例: data 或 result.tabs',
            default: '',
          },
          {
            key: 'labelField',
            label: '标签字段',
            type: 'text',
            placeholder: '默认: label',
            default: 'label',
          },
          {
            key: 'valueField',
            label: '值字段',
            type: 'text',
            placeholder: '默认: value',
            default: 'value',
          },
          {
            key: 'contentField',
            label: '内容字段',
            type: 'text',
            placeholder: '默认: content',
            default: 'content',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      // 媒体组件数据源
      case 'image':
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
            placeholder: 'http://localhost:3001/api/image',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'urlField',
            label: 'URL字段',
            type: 'text',
            placeholder: '默认: url',
            default: 'url',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      case 'video':
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
            placeholder: 'http://localhost:3001/api/video',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'urlField',
            label: 'URL字段',
            type: 'text',
            placeholder: '默认: url',
            default: 'url',
          },
          {
            key: 'posterField',
            label: '海报字段',
            type: 'text',
            placeholder: '默认: poster',
            default: 'poster',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      // 内容组件数据源
      case 'markdown':
      case 'html':
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
            placeholder:
              type === 'markdown'
                ? 'http://localhost:3001/api/markdown'
                : 'http://localhost:3001/api/html',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'contentField',
            label: '内容字段',
            type: 'text',
            placeholder: '默认: content',
            default: 'content',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      case 'iframe':
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
            placeholder: 'http://localhost:3001/api/iframe',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'urlField',
            label: 'URL字段',
            type: 'text',
            placeholder: '默认: url',
            default: 'url',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      // 高级功能组件数据源
      case 'scripting':
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
            placeholder: 'http://localhost:3001/api/scripting',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'scriptField',
            label: '脚本字段',
            type: 'text',
            placeholder: '默认: script',
            default: 'script',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      case 'state':
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
            placeholder: 'http://localhost:3001/api/state',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'stateField',
            label: '状态字段',
            type: 'text',
            placeholder: '默认: state',
            default: 'state',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      case 'trigger':
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
            placeholder: 'http://localhost:3001/api/trigger',
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
            placeholder: '例: data 或 result',
            default: '',
          },
          {
            key: 'conditionField',
            label: '条件字段',
            type: 'text',
            placeholder: '默认: condition',
            default: 'condition',
          },
          {
            key: 'headers',
            label: '请求头(JSON)',
            type: 'text',
            placeholder: '{"Authorization": "Bearer token"}',
            default: '',
          },
        ]

      // 地图组件数据源 - base 底图
      case 'base':
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
            placeholder: 'http://localhost:3001/api/map/base',
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
            key: 'centerLatField',
            label: '中心纬度字段',
            type: 'text',
            placeholder: 'centerLat 或 data.centerLat',
            default: 'centerLat',
          },
          {
            key: 'centerLngField',
            label: '中心经度字段',
            type: 'text',
            placeholder: 'centerLng 或 data.centerLng',
            default: 'centerLng',
          },
          {
            key: 'zoomField',
            label: '缩放级别字段',
            type: 'text',
            placeholder: 'zoom 或 data.zoom',
            default: 'zoom',
          },
          {
            key: 'tileUrlField',
            label: '瓦片URL字段',
            type: 'text',
            placeholder: 'tileUrl 或 data.tileUrl',
            default: 'tileUrl',
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
        ]

      // 地图组件数据源 - tile 瓦片图层
      case 'tile':
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
            placeholder: 'http://localhost:3001/api/map/tile',
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
            key: 'tileUrlField',
            label: '瓦片URL字段',
            type: 'text',
            placeholder: 'tileUrl 或 data.tileUrl',
            default: 'tileUrl',
          },
          {
            key: 'opacityField',
            label: '透明度字段',
            type: 'text',
            placeholder: 'opacity 或 data.opacity',
            default: 'opacity',
          },
          {
            key: 'centerLatField',
            label: '中心纬度字段',
            type: 'text',
            placeholder: 'centerLat 或 data.centerLat',
            default: 'centerLat',
          },
          {
            key: 'centerLngField',
            label: '中心经度字段',
            type: 'text',
            placeholder: 'centerLng 或 data.centerLng',
            default: 'centerLng',
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
        ]

      // 地图组件数据源 - vector 矢量图层
      case 'vector':
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
            placeholder: 'http://localhost:3001/api/map/vector',
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
            key: 'vectorDataField',
            label: '矢量数据字段',
            type: 'text',
            placeholder: 'vectorData 或 data.vectorData',
            default: 'vectorData',
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
        ]

      // 地图组件数据源 - geojson
      case 'geojson':
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
            placeholder: 'http://localhost:3001/api/map/geojson',
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
            key: 'geojsonDataField',
            label: 'GeoJSON数据字段',
            type: 'text',
            placeholder: 'geojsonData 或 data.geojsonData',
            default: 'geojsonData',
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
        ]

      // 地图组件数据源 - marker 标记点
      case 'marker':
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
            placeholder: 'http://localhost:3001/api/map/markers',
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
            key: 'markersField',
            label: '标记点数组字段',
            type: 'text',
            placeholder: 'markers 或 data.markers',
            default: 'markers',
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
        ]

      // 地图组件数据源 - cluster 聚合点
      case 'cluster':
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
            placeholder: 'http://localhost:3001/api/map/cluster',
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
            key: 'markersField',
            label: '聚合点数组字段',
            type: 'text',
            placeholder: 'markers 或 data.markers',
            default: 'markers',
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
        ]

      // 地图组件数据源 - heat 热力图
      case 'heat':
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
            placeholder: 'http://localhost:3001/api/map/heat',
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
            key: 'heatDataField',
            label: '热力数据字段',
            type: 'text',
            placeholder: 'heatData 或 data.heatData',
            default: 'heatData',
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
        ]

      // 地图组件数据源 - legend 图例
      case 'legend':
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
            placeholder: 'http://localhost:3001/api/map/legend',
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
            key: 'itemsField',
            label: '图例项数组字段',
            type: 'text',
            placeholder: 'items 或 data.items',
            default: 'items',
          },
          {
            key: 'titleField',
            label: '标题字段',
            type: 'text',
            placeholder: 'title 或 data.title',
            default: 'title',
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
        ]

      // 地图组件数据源 - layers 图层控制
      case 'layers':
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
            placeholder: 'http://localhost:3001/api/map/layers',
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
            key: 'layersField',
            label: '图层数组字段',
            type: 'text',
            placeholder: 'layers 或 data.layers',
            default: 'layers',
          },
          {
            key: 'titleField',
            label: '标题字段',
            type: 'text',
            placeholder: 'title 或 data.title',
            default: 'title',
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
            key: 'title',
            label: '标题',
            type: 'text',
            placeholder: '总销售额',
            default: '',
          },
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
            key: 'customPrefix',
            label: '自定义前缀样式',
            type: 'switch',
            default: false,
          },
          {
            key: 'customSuffix',
            label: '自定义后缀样式',
            type: 'switch',
            default: false,
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
          {
            key: 'hidden',
            label: '隐藏徽章',
            type: 'switch',
            default: false,
          },
          {
            key: 'showZero',
            label: '显示0值',
            type: 'switch',
            default: false,
          },
          {
            key: 'offsetX',
            label: 'X偏移量',
            type: 'number',
            min: -100,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'offsetY',
            label: 'Y偏移量',
            type: 'number',
            min: -100,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'showSlot',
            label: '显示插槽内容',
            type: 'switch',
            default: true,
          },
          {
            key: 'slotText',
            label: '插槽文本',
            type: 'text',
            placeholder: '内容',
            default: '内容',
          },
        ]

      case 'box':
        return [
          {
            key: 'content',
            label: '显示内容',
            type: 'text',
            placeholder: '占位盒内容',
            default: '占位盒内容',
          },
        ]

      case 'table':
        return [
          {
            key: 'columns',
            label: '列配置(JSON)',
            type: 'text',
            placeholder: '[{"prop":"name","label":"姓名","width":120}]',
            default: '',
          },
          {
            key: 'data',
            label: '表格数据(JSON)',
            type: 'text',
            placeholder: '[{"name":"张三","age":28}]',
            default: '',
          },
          {
            key: 'showHeader',
            label: '显示表头',
            type: 'switch',
            default: true,
          },
          {
            key: 'stripe',
            label: '斑马纹',
            type: 'switch',
            default: false,
          },
          {
            key: 'border',
            label: '显示边框',
            type: 'switch',
            default: true,
          },
          {
            key: 'size',
            label: '表格尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无数据',
            default: '暂无数据',
          },
          {
            key: 'height',
            label: '固定高度',
            type: 'text',
            placeholder: 'auto 或 300',
            default: 'auto',
          },
          {
            key: 'maxHeight',
            label: '最大高度',
            type: 'text',
            placeholder: '留空或数字',
            default: '',
          },
        ]

      case 'list':
        return [
          {
            key: 'data',
            label: '列表数据(JSON)',
            type: 'text',
            placeholder: '[{"title":"标题","description":"描述"}]',
            default: '',
          },
          {
            key: 'showIcon',
            label: '显示图标',
            type: 'switch',
            default: false,
          },
          {
            key: 'showTitle',
            label: '显示标题',
            type: 'switch',
            default: true,
          },
          {
            key: 'showDescription',
            label: '显示描述',
            type: 'switch',
            default: true,
          },
          {
            key: 'showExtra',
            label: '显示扩展信息',
            type: 'switch',
            default: false,
          },
          {
            key: 'showAction',
            label: '显示右侧箭头',
            type: 'switch',
            default: true,
          },
          {
            key: 'showBorder',
            label: '显示左侧边框',
            type: 'switch',
            default: true,
          },
          {
            key: 'showSplit',
            label: '显示分割线',
            type: 'switch',
            default: true,
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无数据',
            default: '暂无数据',
          },
          {
            key: 'iconSize',
            label: '图标大小(px)',
            type: 'number',
            min: 12,
            max: 50,
            step: 1,
            default: 20,
          },
          {
            key: 'scrollHeight',
            label: '滚动容器高度',
            type: 'text',
            placeholder: '100% 或 300px',
            default: '100%',
          },
          {
            key: 'titleField',
            label: '标题字段名',
            type: 'text',
            placeholder: 'title',
            default: 'title',
          },
          {
            key: 'descriptionField',
            label: '描述字段名',
            type: 'text',
            placeholder: 'description',
            default: 'description',
          },
          {
            key: 'extraField',
            label: '扩展信息字段名',
            type: 'text',
            placeholder: 'extra',
            default: 'extra',
          },
        ]

      case 'timeline':
        return [
          {
            key: 'data',
            label: '时间轴数据(JSON)',
            type: 'text',
            placeholder: '[{"title":"标题","content":"内容","timestamp":"2024-01-01"}]',
            default: '',
          },
          {
            key: 'showCard',
            label: '使用卡片模式',
            type: 'switch',
            default: true,
          },
          {
            key: 'showTitle',
            label: '显示标题',
            type: 'switch',
            default: true,
          },
          {
            key: 'showTimestamp',
            label: '显示时间戳',
            type: 'switch',
            default: true,
          },
          {
            key: 'showExtra',
            label: '显示扩展信息',
            type: 'switch',
            default: false,
          },
          {
            key: 'timestampPlacement',
            label: '时间戳位置',
            type: 'select',
            options: [
              { label: '上方', value: 'top' },
              { label: '下方', value: 'bottom' },
            ],
            default: 'top',
          },
          {
            key: 'itemSize',
            label: '节点大小',
            type: 'select',
            options: [
              { label: '普通', value: 'normal' },
              { label: '大', value: 'large' },
            ],
            default: 'normal',
          },
          {
            key: 'hollow',
            label: '空心节点',
            type: 'switch',
            default: false,
          },
          {
            key: 'cardShadow',
            label: '卡片阴影',
            type: 'select',
            options: [
              { label: '始终显示', value: 'always' },
              { label: '悬停显示', value: 'hover' },
              { label: '不显示', value: 'never' },
            ],
            default: 'hover',
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无数据',
            default: '暂无数据',
          },
          {
            key: 'scrollHeight',
            label: '滚动容器高度',
            type: 'text',
            placeholder: '100% 或 300px',
            default: '100%',
          },
          {
            key: 'titleField',
            label: '标题字段名',
            type: 'text',
            placeholder: 'title',
            default: 'title',
          },
          {
            key: 'contentField',
            label: '内容字段名',
            type: 'text',
            placeholder: 'content',
            default: 'content',
          },
          {
            key: 'timestampField',
            label: '时间戳字段名',
            type: 'text',
            placeholder: 'timestamp',
            default: 'timestamp',
          },
          {
            key: 'typeField',
            label: '类型字段名',
            type: 'text',
            placeholder: 'type',
            default: 'type',
          },
          {
            key: 'colorField',
            label: '颜色字段名',
            type: 'text',
            placeholder: 'color',
            default: 'color',
          },
          {
            key: 'extraField',
            label: '扩展信息字段名',
            type: 'text',
            placeholder: 'extra',
            default: 'extra',
          },
        ]

      case 'cardGrid':
        return [
          {
            key: 'cardData',
            label: '卡片数据(JSON)',
            type: 'text',
            placeholder:
              '[{"title":"标题","description":"描述","image":"图片URL","tags":["标签1"],"footer":"页脚"}]',
            default: '',
          },
          {
            key: 'columns',
            label: '列数',
            type: 'number',
            min: 1,
            max: 6,
            step: 1,
            default: 3,
          },
          {
            key: 'gap',
            label: '卡片间距(px)',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 16,
          },
          {
            key: 'showImage',
            label: '显示图片',
            type: 'switch',
            default: true,
          },
          {
            key: 'showTitle',
            label: '显示标题',
            type: 'switch',
            default: true,
          },
          {
            key: 'showDescription',
            label: '显示描述',
            type: 'switch',
            default: true,
          },
          {
            key: 'showTags',
            label: '显示标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'showFooter',
            label: '显示页脚',
            type: 'switch',
            default: true,
          },
          {
            key: 'titleField',
            label: '标题字段名',
            type: 'text',
            placeholder: 'title',
            default: 'title',
          },
          {
            key: 'descriptionField',
            label: '描述字段名',
            type: 'text',
            placeholder: 'description',
            default: 'description',
          },
          {
            key: 'imageField',
            label: '图片字段名',
            type: 'text',
            placeholder: 'image',
            default: 'image',
          },
          {
            key: 'tagsField',
            label: '标签字段名',
            type: 'text',
            placeholder: 'tags',
            default: 'tags',
          },
          {
            key: 'footerField',
            label: '页脚字段名',
            type: 'text',
            placeholder: 'footer',
            default: 'footer',
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无卡片数据',
            default: '暂无卡片数据',
          },
        ]

      case 'pivot':
        return [
          {
            key: 'pivotData',
            label: '数据(JSON)',
            type: 'text',
            placeholder: '[{"category":"分类1","region":"区域A","q1":100,"q2":200}]',
            default: '',
          },
          {
            key: 'rowHeaders',
            label: '行表头(JSON)',
            type: 'text',
            placeholder: '[{"prop":"category","label":"分类"},{"prop":"region","label":"区域"}]',
            default: '[{"prop":"category","label":"分类"}]',
          },
          {
            key: 'dataColumns',
            label: '数据列(JSON)',
            type: 'text',
            placeholder: '[{"prop":"q1","label":"Q1"},{"prop":"q2","label":"Q2"}]',
            default: '[{"prop":"value","label":"数值"}]',
          },
          {
            key: 'valueFormat',
            label: '数值格式',
            type: 'select',
            options: [
              { label: '数字', value: 'number' },
              { label: '百分比', value: 'percent' },
              { label: '货币', value: 'currency' },
            ],
            default: 'number',
          },
          {
            key: 'showSummary',
            label: '显示汇总行',
            type: 'switch',
            default: true,
          },
          {
            key: 'stripe',
            label: '斑马纹',
            type: 'switch',
            default: true,
          },
          {
            key: 'border',
            label: '显示边框',
            type: 'switch',
            default: true,
          },
          {
            key: 'highlightThreshold',
            label: '高亮阈值',
            type: 'number',
            min: 0,
            max: 10000,
            step: 100,
            default: 1000,
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无数据',
            default: '暂无数据',
          },
          {
            key: 'height',
            label: '表格高度',
            type: 'text',
            placeholder: '100% 或 400px',
            default: '100%',
          },
        ]

      case 'select':
        return [
          {
            key: 'options',
            label: '选项数据(JSON/逗号分隔)',
            type: 'text',
            placeholder: '[{"label":"选项1","value":"1"}] 或 选项1,选项2,选项3',
            default: '',
          },
          {
            key: 'defaultValue',
            label: '默认值',
            type: 'text',
            placeholder: '默认选中的值',
            default: '',
          },
          {
            key: 'placeholder',
            label: '占位文本',
            type: 'text',
            placeholder: '请选择',
            default: '请选择',
          },
          {
            key: 'clearable',
            label: '可清空',
            type: 'switch',
            default: true,
          },
          {
            key: 'filterable',
            label: '可搜索',
            type: 'switch',
            default: false,
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'labelField',
            label: '标签字段名',
            type: 'text',
            placeholder: 'label',
            default: 'label',
          },
          {
            key: 'valueField',
            label: '值字段名',
            type: 'text',
            placeholder: 'value',
            default: 'value',
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无选项',
            default: '暂无选项',
          },
        ]

      case 'multiSelect':
        return [
          {
            key: 'options',
            label: '选项数据(JSON/逗号分隔)',
            type: 'text',
            placeholder: '[{"label":"选项1","value":"1"}] 或 选项1,选项2,选项3',
            default: '',
          },
          {
            key: 'defaultValue',
            label: '默认值(逗号分隔)',
            type: 'text',
            placeholder: '1,2,3',
            default: '',
          },
          {
            key: 'placeholder',
            label: '占位文本',
            type: 'text',
            placeholder: '请选择',
            default: '请选择',
          },
          {
            key: 'clearable',
            label: '可清空',
            type: 'switch',
            default: true,
          },
          {
            key: 'filterable',
            label: '可搜索',
            type: 'switch',
            default: false,
          },
          {
            key: 'collapseTags',
            label: '折叠标签',
            type: 'switch',
            default: true,
          },
          {
            key: 'collapseTagsTooltip',
            label: '显示标签提示',
            type: 'switch',
            default: true,
          },
          {
            key: 'maxCollapseTags',
            label: '最大显示标签数',
            type: 'number',
            min: 1,
            max: 10,
            step: 1,
            default: 2,
          },
          {
            key: 'multipleLimit',
            label: '最大选择数(0为不限制)',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'labelField',
            label: '标签字段名',
            type: 'text',
            placeholder: 'label',
            default: 'label',
          },
          {
            key: 'valueField',
            label: '值字段名',
            type: 'text',
            placeholder: 'value',
            default: 'value',
          },
          {
            key: 'emptyText',
            label: '空数据文本',
            type: 'text',
            placeholder: '暂无选项',
            default: '暂无选项',
          },
        ]

      case 'dateRange':
        return [
          {
            key: 'defaultValue',
            label: '默认日期范围(JSON)',
            type: 'text',
            placeholder: '["2024-01-01","2024-12-31"]',
            default: '',
          },
          {
            key: 'startPlaceholder',
            label: '开始日期占位文本',
            type: 'text',
            placeholder: '开始日期',
            default: '开始日期',
          },
          {
            key: 'endPlaceholder',
            label: '结束日期占位文本',
            type: 'text',
            placeholder: '结束日期',
            default: '结束日期',
          },
          {
            key: 'rangeSeparator',
            label: '分隔符',
            type: 'text',
            placeholder: '至',
            default: '至',
          },
          {
            key: 'format',
            label: '显示格式',
            type: 'text',
            placeholder: 'YYYY-MM-DD',
            default: 'YYYY-MM-DD',
          },
          {
            key: 'valueFormat',
            label: '绑定值格式',
            type: 'text',
            placeholder: 'YYYY-MM-DD',
            default: 'YYYY-MM-DD',
          },
          {
            key: 'clearable',
            label: '可清空',
            type: 'switch',
            default: true,
          },
          {
            key: 'editable',
            label: '可手动输入',
            type: 'switch',
            default: true,
          },
          {
            key: 'enableShortcuts',
            label: '启用快捷选项',
            type: 'switch',
            default: true,
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
        ]

      case 'searchBox':
        return [
          {
            key: 'placeholder',
            label: '占位文本',
            type: 'text',
            placeholder: '请输入搜索内容',
            default: '请输入搜索内容',
          },
          {
            key: 'defaultValue',
            label: '默认值',
            type: 'text',
            placeholder: '',
            default: '',
          },
          {
            key: 'clearable',
            label: '可清空',
            type: 'switch',
            default: true,
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false,
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'prefixIcon',
            label: '前缀图标',
            type: 'text',
            placeholder: 'Search',
            default: '',
          },
          {
            key: 'suffixIcon',
            label: '后缀图标',
            type: 'text',
            placeholder: '',
            default: '',
          },
          {
            key: 'maxlength',
            label: '最大长度',
            type: 'number',
            min: 0,
            max: 1000,
            step: 1,
            default: undefined,
          },
          {
            key: 'showWordLimit',
            label: '显示字数统计',
            type: 'switch',
            default: false,
          },
          {
            key: 'showSearchButton',
            label: '显示搜索按钮',
            type: 'switch',
            default: true,
          },
          {
            key: 'buttonText',
            label: '按钮文字',
            type: 'text',
            placeholder: '搜索',
            default: '搜索',
          },
          {
            key: 'buttonType',
            label: '按钮类型',
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
        ]

      case 'slider':
        return [
          {
            key: 'min',
            label: '最小值',
            type: 'number',
            min: -1000,
            max: 1000,
            step: 1,
            default: 0,
          },
          {
            key: 'max',
            label: '最大值',
            type: 'number',
            min: 0,
            max: 10000,
            step: 1,
            default: 100,
          },
          {
            key: 'step',
            label: '步长',
            type: 'number',
            min: 1,
            max: 100,
            step: 1,
            default: 1,
          },
          {
            key: 'defaultValue',
            label: '默认值',
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
            default: 0,
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false,
          },
          {
            key: 'showStops',
            label: '显示间断点',
            type: 'switch',
            default: false,
          },
          {
            key: 'showTooltip',
            label: '显示提示',
            type: 'switch',
            default: true,
          },
          {
            key: 'range',
            label: '范围选择',
            type: 'switch',
            default: false,
          },
          {
            key: 'vertical',
            label: '垂直模式',
            type: 'switch',
            default: false,
          },
          {
            key: 'height',
            label: '垂直高度',
            type: 'text',
            placeholder: '200px',
            default: '200px',
          },
          {
            key: 'showValue',
            label: '显示数值',
            type: 'switch',
            default: true,
          },
          {
            key: 'valueFormat',
            label: '数值格式',
            type: 'text',
            placeholder: '{value}',
            default: '{value}',
          },
          {
            key: 'marks',
            label: '标记点(JSON)',
            type: 'text',
            placeholder: '{"0": "起点", "100": "终点"}',
            default: undefined,
          },
        ]

      case 'switch':
        return [
          {
            key: 'defaultValue',
            label: '默认值',
            type: 'switch',
            default: false,
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false,
          },
          {
            key: 'loading',
            label: '加载中',
            type: 'switch',
            default: false,
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'activeText',
            label: '开启文字',
            type: 'text',
            placeholder: '开',
            default: '',
          },
          {
            key: 'inactiveText',
            label: '关闭文字',
            type: 'text',
            placeholder: '关',
            default: '',
          },
          {
            key: 'inlinePrompt',
            label: '文字显示在内部',
            type: 'switch',
            default: false,
          },
          {
            key: 'activeValue',
            label: '开启时的值',
            type: 'text',
            placeholder: 'true',
            default: true,
          },
          {
            key: 'inactiveValue',
            label: '关闭时的值',
            type: 'text',
            placeholder: 'false',
            default: false,
          },
        ]

      case 'checkboxGroup':
        return [
          {
            key: 'options',
            label: '选项数据(JSON/逗号分隔)',
            type: 'text',
            placeholder: '[{"label":"选项1","value":"1"}] 或 选项1,选项2',
            default: '',
          },
          {
            key: 'defaultValue',
            label: '默认值(逗号分隔)',
            type: 'text',
            placeholder: '1,2,3',
            default: '',
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false,
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'min',
            label: '最少选择数',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: undefined,
          },
          {
            key: 'max',
            label: '最多选择数',
            type: 'number',
            min: 0,
            max: 20,
            step: 1,
            default: undefined,
          },
          {
            key: 'layout',
            label: '布局样式',
            type: 'select',
            options: [
              { label: '默认', value: 'default' },
              { label: '按钮', value: 'button' },
            ],
            default: 'default',
          },
          {
            key: 'showBorder',
            label: '显示边框',
            type: 'switch',
            default: false,
          },
          {
            key: 'labelField',
            label: '标签字段名',
            type: 'text',
            placeholder: 'label',
            default: 'label',
          },
          {
            key: 'valueField',
            label: '值字段名',
            type: 'text',
            placeholder: 'value',
            default: 'value',
          },
        ]

      case 'buttonGroup':
        return [
          {
            key: 'buttons',
            label: '按钮数据(JSON/逗号分隔)',
            type: 'text',
            placeholder: '[{"label":"按钮1","value":"1","type":"primary"}] 或 按钮1,按钮2',
            default: '',
          },
          {
            key: 'type',
            label: '默认类型',
            type: 'select',
            options: [
              { label: '默认', value: 'default' },
              { label: '主要', value: 'primary' },
              { label: '成功', value: 'success' },
              { label: '警告', value: 'warning' },
              { label: '危险', value: 'danger' },
              { label: '信息', value: 'info' },
            ],
            default: 'default',
          },
          {
            key: 'size',
            label: '尺寸',
            type: 'select',
            options: [
              { label: '大', value: 'large' },
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' },
            ],
            default: 'default',
          },
          {
            key: 'disabled',
            label: '禁用',
            type: 'switch',
            default: false,
          },
          {
            key: 'plain',
            label: '朴素按钮',
            type: 'switch',
            default: false,
          },
          {
            key: 'round',
            label: '圆角按钮',
            type: 'switch',
            default: false,
          },
          {
            key: 'circle',
            label: '圆形按钮',
            type: 'switch',
            default: false,
          },
          {
            key: 'labelField',
            label: '标签字段名',
            type: 'text',
            placeholder: 'label',
            default: 'label',
          },
          {
            key: 'valueField',
            label: '值字段名',
            type: 'text',
            placeholder: 'value',
            default: 'value',
          },
        ]

      // 布局组件配置
      case 'row':
        return [
          {
            key: 'gutter',
            label: '栅格间隔',
            type: 'number',
            min: 0,
            max: 50,
            step: 1,
            default: 0,
          },
          {
            key: 'justify',
            label: '水平排列',
            type: 'select',
            options: [
              { label: '左对齐', value: 'start' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'end' },
              { label: '两端对齐', value: 'space-between' },
              { label: '环绕对齐', value: 'space-around' },
              { label: '均匀对齐', value: 'space-evenly' },
            ],
            default: 'start',
          },
          {
            key: 'align',
            label: '垂直对齐',
            type: 'select',
            options: [
              { label: '顶部', value: 'top' },
              { label: '居中', value: 'middle' },
              { label: '底部', value: 'bottom' },
            ],
            default: 'top',
          },
          {
            key: 'tag',
            label: 'HTML标签',
            type: 'text',
            placeholder: 'div',
            default: 'div',
          },
          {
            key: 'content',
            label: '占位内容',
            type: 'text',
            placeholder: '请输入内容',
            default: '',
          },
        ]

      case 'col':
        return [
          {
            key: 'span',
            label: '栅格占位',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: 12,
          },
          {
            key: 'offset',
            label: '左偏移',
            type: 'number',
            min: 0,
            max: 24,
            step: 1,
            default: 0,
          },
          {
            key: 'push',
            label: '向右推',
            type: 'number',
            min: 0,
            max: 24,
            step: 1,
            default: 0,
          },
          {
            key: 'pull',
            label: '向左拉',
            type: 'number',
            min: 0,
            max: 24,
            step: 1,
            default: 0,
          },
          {
            key: 'xs',
            label: '<768px',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: undefined,
          },
          {
            key: 'sm',
            label: '≥768px',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: undefined,
          },
          {
            key: 'md',
            label: '≥992px',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: undefined,
          },
          {
            key: 'lg',
            label: '≥1200px',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: undefined,
          },
          {
            key: 'xl',
            label: '≥1920px',
            type: 'number',
            min: 1,
            max: 24,
            step: 1,
            default: undefined,
          },
          {
            key: 'tag',
            label: 'HTML标签',
            type: 'text',
            placeholder: 'div',
            default: 'div',
          },
          {
            key: 'content',
            label: '占位内容',
            type: 'text',
            placeholder: '请输入内容',
            default: '',
          },
        ]

      case 'flex':
        return [
          {
            key: 'content',
            label: '占位内容',
            type: 'text',
            placeholder: '请输入内容',
            default: '',
          },
        ]

      case 'grid':
        return [
          {
            key: 'content',
            label: '占位内容',
            type: 'text',
            placeholder: '请输入内容',
            default: '',
          },
        ]

      case 'modal':
        return [
          {
            key: 'visible',
            label: '显示对话框',
            type: 'switch',
            default: false,
          },
          {
            key: 'title',
            label: '标题',
            type: 'text',
            placeholder: '对话框标题',
            default: '对话框标题',
          },
          {
            key: 'width',
            label: '宽度',
            type: 'text',
            placeholder: '50%',
            default: '50%',
          },
          {
            key: 'fullscreen',
            label: '全屏',
            type: 'switch',
            default: false,
          },
          {
            key: 'closeOnClickModal',
            label: '点击遮罩关闭',
            type: 'switch',
            default: true,
          },
          {
            key: 'showClose',
            label: '显示关闭按钮',
            type: 'switch',
            default: true,
          },
          {
            key: 'showFooter',
            label: '显示底部',
            type: 'switch',
            default: true,
          },
          {
            key: 'content',
            label: '内容',
            type: 'text',
            placeholder: '这是对话框内容',
            default: '这是对话框内容',
          },
        ]

      case 'panel':
        return [
          {
            key: 'title',
            label: '标题',
            type: 'text',
            placeholder: '面板标题',
            default: '面板标题',
          },
          {
            key: 'collapsible',
            label: '可折叠',
            type: 'switch',
            default: false,
          },
          {
            key: 'collapsed',
            label: '默认折叠',
            type: 'switch',
            default: false,
          },
          {
            key: 'showHeader',
            label: '显示头部',
            type: 'switch',
            default: true,
          },
          {
            key: 'showFooter',
            label: '显示底部',
            type: 'switch',
            default: false,
          },
          {
            key: 'footerContent',
            label: '底部内容',
            type: 'text',
            placeholder: '',
            default: '',
          },
          {
            key: 'content',
            label: '内容',
            type: 'text',
            placeholder: '这是面板内容',
            default: '这是面板内容',
          },
        ]

      case 'tabs':
        return [
          {
            key: 'activeTab',
            label: '当前激活标签',
            type: 'text',
            placeholder: 'tab1',
            default: '',
          },
          {
            key: 'type',
            label: '标签页类型',
            type: 'select',
            options: [
              { label: '卡片化', value: 'card' },
              { label: '边框卡片', value: 'border-card' },
              { label: '默认', value: '' },
            ],
            default: 'border-card',
          },
          {
            key: 'tabPosition',
            label: '标签位置',
            type: 'select',
            options: [
              { label: '顶部', value: 'top' },
              { label: '右侧', value: 'right' },
              { label: '底部', value: 'bottom' },
              { label: '左侧', value: 'left' },
            ],
            default: 'top',
          },
          {
            key: 'closable',
            label: '可关闭',
            type: 'switch',
            default: false,
          },
          {
            key: 'addable',
            label: '可增加',
            type: 'switch',
            default: false,
          },
          {
            key: 'tabs',
            label: '标签页数据(JSON)',
            type: 'text',
            placeholder: '[{"label":"Tab 1","name":"tab1","content":"Content 1"}]',
            default: '',
          },
        ]

      case 'image':
        return [
          {
            key: 'url',
            label: '图片地址',
            type: 'text',
            placeholder: 'https://example.com/image.jpg',
            default: '',
          },
          {
            key: 'fit',
            label: '图片填充模式',
            type: 'select',
            options: [
              { label: '填充', value: 'fill' },
              { label: '包含', value: 'contain' },
              { label: '覆盖', value: 'cover' },
              { label: '无缩放', value: 'none' },
              { label: '按比例缩小', value: 'scale-down' },
            ],
            default: 'cover',
          },
          {
            key: 'lazy',
            label: '懒加载',
            type: 'switch',
            default: true,
          },
          {
            key: 'preview',
            label: '启用预览',
            type: 'switch',
            default: false,
          },
          {
            key: 'previewZIndex',
            label: '预览层级',
            type: 'number',
            min: 0,
            max: 10000,
            step: 1,
            default: 2000,
          },
          {
            key: 'hideOnClickModal',
            label: '点击遮罩关闭预览',
            type: 'switch',
            default: false,
          },
          {
            key: 'errorText',
            label: '加载失败提示',
            type: 'text',
            placeholder: '图片加载失败',
            default: '图片加载失败',
          },
          {
            key: 'placeholder',
            label: '占位文本',
            type: 'text',
            placeholder: '加载中...',
            default: '加载中...',
          },
        ]

      case 'video':
        return [
          {
            key: 'url',
            label: '视频地址',
            type: 'text',
            placeholder: 'https://example.com/video.mp4',
            default: '',
          },
          {
            key: 'poster',
            label: '封面图',
            type: 'text',
            placeholder: 'https://example.com/poster.jpg',
            default: '',
          },
          {
            key: 'controls',
            label: '显示控制栏',
            type: 'switch',
            default: true,
          },
          {
            key: 'autoplay',
            label: '自动播放',
            type: 'switch',
            default: false,
          },
          {
            key: 'loop',
            label: '循环播放',
            type: 'switch',
            default: false,
          },
          {
            key: 'muted',
            label: '静音',
            type: 'switch',
            default: false,
          },
          {
            key: 'preload',
            label: '预加载',
            type: 'select',
            options: [
              { label: '元数据', value: 'metadata' },
              { label: '自动', value: 'auto' },
              { label: '不预加载', value: 'none' },
            ],
            default: 'metadata',
          },
          {
            key: 'noDownload',
            label: '禁止下载',
            type: 'switch',
            default: false,
          },
          {
            key: 'noPictureInPicture',
            label: '禁用画中画',
            type: 'switch',
            default: false,
          },
          {
            key: 'placeholder',
            label: '无视频提示',
            type: 'text',
            placeholder: '暂无视频',
            default: '暂无视频',
          },
        ]

      case 'markdown':
        return [
          {
            key: 'content',
            label: 'Markdown内容',
            type: 'text',
            placeholder: '# 标题\n\n请输入Markdown文本...',
            default: '# Markdown 内容\n\n请输入 Markdown 文本...',
          },
        ]

      case 'html':
        return [
          {
            key: 'content',
            label: 'HTML内容',
            type: 'text',
            placeholder: '<div>HTML内容</div>',
            default: '<div>HTML内容</div>',
          },
          {
            key: 'sanitize',
            label: '启用XSS防护',
            type: 'switch',
            default: true,
          },
          {
            key: 'allowedTags',
            label: '允许的HTML标签',
            type: 'text',
            placeholder: 'div,span,p,h1,h2,h3,img,a',
            default:
              'div,span,p,h1,h2,h3,h4,h5,h6,ul,ol,li,strong,em,br,img,a,table,thead,tbody,tr,th,td,code,pre,blockquote',
          },
          {
            key: 'allowedAttributes',
            label: '允许的HTML属性',
            type: 'text',
            placeholder: 'class,style,href,src,alt',
            default: 'class,style,href,src,alt,target,title,id',
          },
        ]

      case 'iframe':
        return [
          {
            key: 'url',
            label: '页面地址',
            type: 'text',
            placeholder: 'https://example.com',
            default: '',
          },
          {
            key: 'title',
            label: '标题',
            type: 'text',
            placeholder: '外部页面',
            default: '外部页面',
          },
          {
            key: 'sandbox',
            label: '安全限制',
            type: 'text',
            placeholder: 'allow-scripts allow-same-origin',
            default: 'allow-scripts allow-same-origin allow-forms allow-popups',
          },
          {
            key: 'allow',
            label: '权限策略',
            type: 'text',
            placeholder: 'fullscreen; camera; microphone',
            default: 'fullscreen',
          },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            placeholder: '请输入外部页面地址',
            default: '请输入外部页面地址',
          },
        ]

      // 高级功能组件
      case 'scripting':
        return [
          {
            key: 'script',
            label: 'JavaScript代码',
            type: 'text',
            placeholder: 'console.log("Hello World");',
            default: '// JavaScript 代码\nconsole.log("Hello, World!");',
          },
          {
            key: 'autoRun',
            label: '自动执行',
            type: 'switch',
            default: false,
          },
          {
            key: 'showCode',
            label: '显示代码',
            type: 'switch',
            default: true,
          },
          {
            key: 'showControls',
            label: '显示控制按钮',
            type: 'switch',
            default: true,
          },
          {
            key: 'showPlaceholder',
            label: '显示占位提示',
            type: 'switch',
            default: true,
          },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            placeholder: '点击执行按钮运行脚本',
            default: '点击执行按钮运行脚本',
          },
        ]

      case 'state':
        return [
          {
            key: 'state',
            label: '状态数据(JSON)',
            type: 'text',
            placeholder: '{"key": "value"}',
            default: JSON.stringify(
              {
                count: 0,
                status: 'idle',
              },
              null,
              2,
            ),
          },
          {
            key: 'viewMode',
            label: '视图模式',
            type: 'select',
            options: [
              { label: '列表视图', value: 'list' },
              { label: 'JSON视图', value: 'json' },
              { label: '表格视图', value: 'table' },
            ],
            default: 'list',
          },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            placeholder: '暂无状态数据',
            default: '暂无状态数据',
          },
        ]

      case 'trigger':
        return [
          {
            key: 'enabled',
            label: '启用触发器',
            type: 'switch',
            default: true,
          },
          {
            key: 'triggerType',
            label: '触发类型',
            type: 'select',
            options: [
              { label: '手动触发', value: 'manual' },
              { label: '定时触发', value: 'interval' },
            ],
            default: 'manual',
          },
          {
            key: 'interval',
            label: '触发间隔(毫秒)',
            type: 'number',
            min: 1000,
            max: 3600000,
            step: 1000,
            default: 5000,
          },
          {
            key: 'action',
            label: '动作类型',
            type: 'select',
            options: [
              { label: '日志记录', value: 'log' },
              { label: '弹窗提示', value: 'alert' },
              { label: '派发事件', value: 'dispatch' },
              { label: '调用API', value: 'api' },
            ],
            default: 'log',
          },
          {
            key: 'actionData',
            label: '动作数据',
            type: 'text',
            placeholder: '触发器执行的数据',
            default: '触发器已执行',
          },
          {
            key: 'condition',
            label: '触发条件',
            type: 'text',
            placeholder: '例: value > 100',
            default: '',
          },
          {
            key: 'showClearButton',
            label: '显示清除按钮',
            type: 'switch',
            default: true,
          },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            placeholder: '暂无执行记录',
            default: '暂无执行记录',
          },
        ]

      // 地图组件 - 完整配置项以支持高度自定义
      case 'base':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 13 },
          {
            key: 'minZoom',
            label: '最小缩放',
            type: 'number',
            min: 1,
            max: 18,
            step: 1,
            default: 1,
          },
          {
            key: 'maxZoom',
            label: '最大缩放',
            type: 'number',
            min: 1,
            max: 18,
            step: 1,
            default: 18,
          },
          {
            key: 'tileUrl',
            label: '瓦片URL',
            type: 'text',
            placeholder: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            default: '',
          },
          {
            key: 'attribution',
            label: '版权信息',
            type: 'text',
            default: '&copy; OpenStreetMap contributors',
          },
          { key: 'zoomControl', label: '缩放控件', type: 'switch', default: true },
          { key: 'dragging', label: '允许拖拽', type: 'switch', default: true },
          { key: 'scrollWheelZoom', label: '滚轮缩放', type: 'switch', default: true },
          { key: 'doubleClickZoom', label: '双击缩放', type: 'switch', default: true },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            default: '配置地图中心点以显示底图',
          },
        ]

      case 'tile':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 10 },
          {
            key: 'tileUrl',
            label: '瓦片URL',
            type: 'text',
            placeholder: 'https://.../{z}/{x}/{y}.png',
            default: '',
          },
          { key: 'attribution', label: '版权信息', type: 'text', default: '' },
          {
            key: 'opacity',
            label: '透明度',
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
            default: 1,
          },
          {
            key: 'zIndex',
            label: '图层层级',
            type: 'number',
            min: 1,
            max: 1000,
            step: 1,
            default: 1,
          },
          {
            key: 'minZoom',
            label: '最小缩放',
            type: 'number',
            min: 1,
            max: 18,
            step: 1,
            default: 1,
          },
          {
            key: 'maxZoom',
            label: '最大缩放',
            type: 'number',
            min: 1,
            max: 18,
            step: 1,
            default: 18,
          },
          { key: 'placeholder', label: '占位提示', type: 'text', default: '配置瓦片URL以显示图层' },
        ]

      case 'marker':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 10 },
          { key: 'showLabel', label: '显示标签', type: 'switch', default: false },
          { key: 'draggableMarkers', label: '可拖拽标记', type: 'switch', default: false },
          { key: 'placeholder', label: '占位提示', type: 'text', default: '配置标记点数据以显示' },
        ]

      case 'cluster':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 5 },
          {
            key: 'maxClusterRadius',
            label: '聚合半径',
            type: 'number',
            min: 20,
            max: 200,
            step: 10,
            default: 80,
          },
          { key: 'spiderfyOnMaxZoom', label: '最大缩放时展开', type: 'switch', default: true },
          { key: 'showCoverageOnHover', label: '悬停显示覆盖', type: 'switch', default: true },
          { key: 'zoomToBoundsOnClick', label: '点击缩放到边界', type: 'switch', default: true },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            default: '配置标记点数据以显示聚合',
          },
        ]

      case 'heat':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 10 },
          {
            key: 'radius',
            label: '热点半径',
            type: 'number',
            min: 10,
            max: 50,
            step: 1,
            default: 25,
          },
          { key: 'blur', label: '模糊度', type: 'number', min: 5, max: 30, step: 1, default: 15 },
          {
            key: 'maxZoom',
            label: '最大缩放',
            type: 'number',
            min: 1,
            max: 18,
            step: 1,
            default: 17,
          },
          {
            key: 'max',
            label: '最大强度',
            type: 'number',
            min: 0.1,
            max: 2,
            step: 0.1,
            default: 1,
          },
          {
            key: 'minOpacity',
            label: '最小透明度',
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
            default: 0.4,
          },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            default: '配置热力数据以显示热力图',
          },
        ]

      case 'legend':
        return [
          { key: 'title', label: '图例标题', type: 'text', default: '图例' },
          {
            key: 'symbolShape',
            label: '符号形状',
            type: 'select',
            options: [
              { label: '方形', value: 'square' },
              { label: '圆形', value: 'circle' },
            ],
            default: 'square',
          },
          {
            key: 'symbolWidth',
            label: '符号宽度',
            type: 'number',
            min: 10,
            max: 40,
            step: 1,
            default: 20,
          },
          {
            key: 'symbolHeight',
            label: '符号高度',
            type: 'number',
            min: 10,
            max: 40,
            step: 1,
            default: 20,
          },
          { key: 'placeholder', label: '占位提示', type: 'text', default: '配置图例项以显示' },
        ]

      case 'scale':
        return [
          {
            key: 'maxWidth',
            label: '最大宽度',
            type: 'number',
            min: 50,
            max: 200,
            step: 10,
            default: 100,
          },
          { key: 'metric', label: '公制单位', type: 'switch', default: true },
          { key: 'imperial', label: '英制单位', type: 'switch', default: false },
          { key: 'segments', label: '段数', type: 'number', min: 2, max: 8, step: 1, default: 4 },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 10 },
        ]

      case 'layers':
        return [
          { key: 'title', label: '控件标题', type: 'text', default: '图层控制' },
          { key: 'showOpacity', label: '显示透明度控制', type: 'switch', default: true },
          { key: 'placeholder', label: '占位提示', type: 'text', default: '配置图层列表以显示' },
        ]

      case 'vector':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 10 },
          { key: 'showPopup', label: '显示弹窗', type: 'switch', default: true },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            default: '配置矢量数据以显示图层',
          },
        ]

      case 'geojson':
        return [
          {
            key: 'centerLat',
            label: '中心纬度',
            type: 'number',
            min: -90,
            max: 90,
            step: 0.0001,
            default: 39.9,
          },
          {
            key: 'centerLng',
            label: '中心经度',
            type: 'number',
            min: -180,
            max: 180,
            step: 0.0001,
            default: 116.4,
          },
          { key: 'zoom', label: '缩放级别', type: 'number', min: 1, max: 18, step: 1, default: 10 },
          { key: 'showPopup', label: '显示弹窗', type: 'switch', default: true },
          {
            key: 'placeholder',
            label: '占位提示',
            type: 'text',
            default: '配置GeoJSON数据以显示图层',
          },
        ]

      default:
        return []
    }
  })

  return { styleSchema, dataSourceSchema, componentSchema }
}
