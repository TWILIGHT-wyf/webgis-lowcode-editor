import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createHistory, createClipboard, createGrouping, createZOrder } from '@/stores/componentOps'

export interface DataSource {
  enabled: boolean
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string
  interval?: number
  // 通用路径
  dataPath?: string // 通用数据路径（text, 图表数据等）
  valuePath?: string // KPI 组件数值路径（countUp, progress, badge）
  // 图表专用路径
  xAxisPath?: string // 图表 X 轴标签路径
  labelsPath?: string // 饼图/环形图标签路径
  seriesNamePath?: string // 图表系列名称路径
  seriesNamesPath?: string // 堆叠图表多系列名称路径
  seriesDataPath?: string // 堆叠图表多系列数据路径
  // KPI 专用路径
  titlePath?: string // stat 组件标题路径
  changePath?: string // stat 组件变化值路径
  // 扩展字段
  [key: string]: unknown
}

export interface component {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  zindex: number
  style: {
    opacity?: number
    visible?: boolean
    locked?: boolean
    [key: string]: unknown
  }
  props: Record<string, unknown>
  dataSource?: DataSource
  animation?: {
    name: string
    class: string
    duration?: number
    delay?: number
    iterationCount?: number | 'infinite'
    timingFunction?: string
    trigger?: 'load' | 'hover' | 'click'
  }
  groupId?: string // 所属组合的ID（如果是组合成员）
  children?: string[] // 子组件ID列表（如果是组合容器）
}

export const useComponent = defineStore('component', () => {
  const componentStore = ref<component[]>([])
  const selectComponent = ref<component | null>(null)
  const selectedIds = ref<string[]>([])
  const isDragging = ref<boolean>(false)

  // —— 历史快照（撤销/重做）—— 抽离到模块
  const {
    commit,
    undo: _undo,
    redo: _redo,
    canUndo,
    canRedo,
    commitDebounced,
    commitThrottled,
    init: initHistory,
  } = createHistory<component>(componentStore)

  function undo() {
    _undo()
    clearSelection()
  }
  function redo() {
    _redo()
    clearSelection()
  }

  // 不同类型组件的默认样式
  function defaultStyleByType(type: string): component['style'] {
    const base: component['style'] = {
      opacity: 100,
      visible: true,
      locked: false,
    }
    switch (type) {
      case 'Text':
        return {
          ...base,
          fontSize: 16,
          fontColor: '#000000',
          fontWeight: 'normal',
          textAlign: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          paddingX: 0,
          paddingY: 0,
        }
      case 'stat':
        return {
          ...base,
          backgroundColor: '#fff',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: 20,
          titleColor: '#333',
          valueColor: '#3f8600',
          changeColorPositive: '#28a745',
          changeColorNegative: '#dc3545',
          titleFontSize: 14,
          valueFontSize: 24,
          changeFontSize: 14,
          titleFontWeight: 'normal',
          valueFontWeight: 'bold',
          changeFontWeight: 'normal',
        }
      case 'countUp':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          padding: 10,
          align: 'center',
          valueColor: '#303133',
          valueFontSize: 32,
          valueFontWeight: 'bold',
          prefixColor: '#909399',
          prefixFontSize: 16,
          prefixFontWeight: 'normal',
          suffixColor: '#909399',
          suffixFontSize: 16,
          suffixFontWeight: 'normal',
          fontFamily: 'inherit',
        }
      case 'progress':
        return {
          ...base,
          padding: 0,
          strokeWidth: 20,
          trackColor: '#e4e7ed',
          barColor: '#409eff',
          successColor: '#67c23a',
          warningColor: '#e6a23c',
          exceptionColor: '#f56c6c',
          borderRadius: 10,
          textColor: '#606266',
          textInsideColor: '#fff',
          textFontSize: 14,
          textFontWeight: 'normal',
        }
      case 'badge':
        return {
          ...base,
          padding: 4,
          backgroundColor: '#409eff',
          successColor: '#67c23a',
          warningColor: '#e6a23c',
          dangerColor: '#f56c6c',
          infoColor: '#909399',
          textColor: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          paddingX: 6,
          paddingY: 2,
          borderRadius: 10,
          borderWidth: 0,
          borderColor: 'transparent',
          boxShadow: 'none',
        }

      default:
        return base
    }
  }

  // 不同类型组件的默认非样式属性
  function defaultPropsByType(type: string): Record<string, unknown> {
    switch (type) {
      case 'Text':
        return {
          text: '示例文本',
        }
      case 'lineChart':
        return {
          dataInput: '150, 230, 224, 218, 135, 147, 260',
          xAxisInput: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          seriesName: 'Series',
          title: '',
          lineColor: '#5470c6',
          lineWidth: 2,
          smooth: true,
          showArea: false,
          areaOpacity: 0.3,
          showSymbol: true,
          symbolSize: 6,
          lineType: 'solid',
          showLegend: true,
          legendPosition: 'top',
          showTooltip: true,
          xAxisName: '',
          yAxisName: '',
          showXAxisLine: true,
          showYAxisLine: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          showGrid: true,
          option: undefined,
        }
      case 'chart.bar':
        return {
          dataInput: '120, 200, 150, 180, 270, 210, 220',
          xAxisInput: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          seriesName: 'Series',
          title: '',
          barColor: '#5470c6',
          barWidth: '60%',
          borderRadius: 0,
          showLabel: false,
          showLegend: true,
          legendPosition: 'top',
          showTooltip: true,
          xAxisName: '',
          yAxisName: '',
          showXAxisLine: true,
          showYAxisLine: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          showGrid: true,
          option: undefined,
        }
      case 'chart.stackedBar':
        return {
          xAxisInput: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          seriesNamesInput: 'Series 1, Series 2, Series 3',
          series1Input: '120, 132, 101, 134, 90, 230, 210',
          series2Input: '220, 182, 191, 234, 290, 330, 310',
          series3Input: '150, 232, 201, 154, 190, 330, 410',
          title: '',
          color1: '#5470c6',
          color2: '#91cc75',
          color3: '#fac858',
          barWidth: '60%',
          borderRadius: 0,
          showLabel: false,
          showLegend: true,
          legendPosition: 'top',
          showTooltip: true,
          xAxisName: '',
          yAxisName: '',
          showXAxisLine: true,
          showYAxisLine: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          showGrid: true,
          option: undefined,
        }
      case 'pieChart':
        return {
          dataInput: '335, 310, 234, 135, 148',
          labelsInput: 'Category A, Category B, Category C, Category D, Category E',
          seriesName: 'Data',
          title: '',
          titleAlign: 'center',
          titleSize: 16,
          titleColor: '#333',
          radius: '60%',
          centerX: '50%',
          centerY: '50%',
          showLabel: true,
          labelFormatter: '{b}: {c}',
          showLegend: true,
          legendOrient: 'horizontal',
          legendLeft: 'center',
          legendTop: 'bottom',
        }
      case 'doughnutChart':
        return {
          dataInput: '335, 310, 234, 135, 1548',
          labelsInput: 'Direct, Email, Union Ads, Video Ads, Search Engine',
          seriesName: 'Access From',
          title: '',
          titleAlign: 'center',
          titleSize: 16,
          titleColor: '#333',
          innerRadius: '40%',
          outerRadius: '70%',
          centerX: '50%',
          centerY: '50%',
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          showLabel: true,
          labelFormatter: '{b}: {c}',
          showLabelLine: true,
          showLegend: true,
          legendOrient: 'horizontal',
          legendLeft: 'center',
          legendTop: 'bottom',
        }
      case 'scatterChart':
        return {
          dataInput:
            '[[10.0, 8.04], [8.07, 6.95], [13.0, 7.58], [9.05, 8.81], [11.0, 8.33], [14.0, 7.66], [13.4, 6.81], [10.0, 6.33], [14.0, 8.96], [12.5, 6.82]]',
          seriesName: 'Data',
          title: '',
          titleAlign: 'center',
          titleSize: 16,
          titleColor: '#333',
          symbolSize: 10,
          color: '#5470c6',
          opacity: 0.8,
          xAxisName: '',
          yAxisName: '',
          showXAxisSplitLine: true,
          showYAxisSplitLine: true,
          gridLeft: '10%',
          gridRight: '10%',
          gridTop: '15%',
          gridBottom: '15%',
          showLegend: true,
          legendLeft: 'center',
          legendTop: 'bottom',
        }
      case 'radarChart':
        return {
          indicatorNamesInput: '销售,管理,技术,客服,研发,市场',
          indicatorMaxsInput: '100,100,100,100,100,100',
          title: '',
          radarShape: 'polygon',
          splitNumber: 5,
          axisNameColor: '#333',
          showArea: true,
          areaOpacity: 0.3,
          seriesName: 'Radar',
        }
      case 'gaugeChart':
        return {
          value: 75,
          name: 'Progress',
          min: 0,
          max: 100,
          title: '',
          startAngle: 225,
          endAngle: -45,
          splitNumber: 10,
          showProgress: true,
          progressWidth: 10,
          axisLineWidth: 10,
          pointerColor: 'auto',
          pointerLength: '70%',
          pointerWidth: 8,
          showAxisTick: true,
          axisTickSplitNumber: 5,
          showSplitLine: true,
          splitLineLength: 15,
          showAxisLabel: true,
          axisLabelDistance: 25,
          axisLabelFontSize: 12,
          detailFormatter: '{value}',
          detailFontSize: 20,
          detailOffsetX: '0%',
          detailOffsetY: '70%',
        }
      case 'funnelChart':
        return {
          dataInput: '100,80,60,40,20',
          labelsInput: '展示,访问,咨询,订单,成交',
          title: '',
          seriesName: 'Funnel',
          left: '10%',
          top: '20%',
          bottom: '20%',
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          showLabel: true,
          labelPosition: 'inside',
          labelFormatter: '{b}: {c}',
          showLabelLine: true,
          labelLineLength: 10,
          borderColor: '#fff',
          borderWidth: 1,
        }
      case 'sankeyChart':
        return {
          nodesInput: '["a","b","c","d","e","f"]',
          linksInput:
            '[{"source":"a","target":"b","value":5},{"source":"a","target":"c","value":3},{"source":"b","target":"d","value":8},{"source":"b","target":"e","value":3},{"source":"c","target":"e","value":4},{"source":"d","target":"f","value":6},{"source":"e","target":"f","value":5}]',
          title: '',
          orient: 'horizontal',
          left: '5%',
          top: '10%',
          right: '20%',
          bottom: '10%',
          nodeWidth: 20,
          nodeGap: 8,
          layoutIterations: 32,
          nodeAlign: 'justify',
          showLabel: true,
          labelPosition: 'right',
          labelFontSize: 12,
          labelColor: '#000',
          lineColor: 'source',
          lineOpacity: 0.2,
          lineCurveness: 0.5,
        }
      case 'stat':
        return {
          title: '指标标题',
          value: 0,
          icon: 'el-icon-star-on',
          change: 0,
          precision: 0,
          suffix: '',
        }
      case 'countUp':
        return {
          value: 0,
          startValue: 0,
          duration: 2000,
          decimals: 0,
          separator: ',',
          prefix: '',
          suffix: '',
          showPrefix: true,
          showSuffix: true,
          useEasing: true,
        }
      case 'progress':
        return {
          value: 50,
          type: 'line',
          status: '',
          showText: true,
          textPosition: 'right',
          textFormat: '{value}%',
          showStripe: false,
          animateStripe: false,
        }
      case 'badge':
        return {
          value: 0,
          type: 'primary',
          dot: false,
          maxValue: 99,
        }
      default:
        return {}
    }
  }

  // 不同类型组件的默认数据源配置
  function defaultDataSourceByType(type: string): DataSource | undefined {
    switch (type) {
      case 'Text':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          body: '',
          interval: 0,
          dataPath: '',
        }
      case 'lineChart':
      case 'chart.bar':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          xAxisPath: '',
          seriesNamePath: '',
        }
      case 'chart.stackedBar':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          xAxisPath: '',
          seriesNamesPath: '',
          seriesDataPath: '',
        }
      case 'pieChart':
      case 'doughnutChart':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          labelsPath: '',
        }
      case 'scatterChart':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
        }
      case 'radarChart':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          indicatorNamesPath: '',
          indicatorMaxsPath: '',
          seriesNamesPath: '',
          seriesValuesPath: '',
        }
      case 'gaugeChart':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          namePath: '',
          minPath: '',
          maxPath: '',
        }
      case 'funnelChart':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          labelsPath: '',
        }
      case 'sankeyChart':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          nodesPath: '',
          linksPath: '',
        }
      case 'stat':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          titlePath: '',
          valuePath: '',
          changePath: '',
        }
      case 'countUp':
      case 'progress':
      case 'badge':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          valuePath: '',
        }
      default:
        return undefined
    }
  }

  // 不同类型组件的默认动画配置（默认无动画）
  function defaultAnimationByType(): component['animation'] | undefined {
    return undefined
  }

  // 添加组件
  function addComponent(
    component: Omit<component, 'id' | 'zindex' | 'style' | 'props'> & {
      style?: component['style']
      props?: Record<string, unknown>
    },
  ) {
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    const newComponent: component = {
      ...component,
      id: Date.now().toString(),
      zindex: maxZ + 1,
      style: {
        ...defaultStyleByType(component.type),
        ...(component.style || {}),
      },
      props: {
        ...defaultPropsByType(component.type),
        ...(component.props || {}),
      },
      dataSource: component.dataSource || defaultDataSourceByType(component.type),
      animation: component.animation || defaultAnimationByType(),
    }
    componentStore.value.push(newComponent)
    commit()
  }

  // 组件Id
  function selectedId(id: string) {
    selectComponent.value = componentStore.value.find((com) => com.id === id) || null
    // 单选时同步更新selectedIds
    if (selectComponent.value) {
      selectedIds.value = [id]
    } else {
      selectedIds.value = []
    }
  }

  // 切换选中状态（支持Ctrl多选）
  function toggleSelect(id: string, ctrlKey: boolean) {
    if (ctrlKey) {
      // Ctrl+点击：切换选中
      const index = selectedIds.value.indexOf(id)
      if (index > -1) {
        selectedIds.value.splice(index, 1)
      } else {
        selectedIds.value.push(id)
      }
      // 更新主选择对象为第一个选中项
      if (selectedIds.value.length > 0) {
        selectComponent.value =
          componentStore.value.find((c) => c.id === selectedIds.value[0]) || null
      } else {
        selectComponent.value = null
      }
    } else {
      // 普通点击：单选
      selectedId(id)
    }
  }

  // 批量选中
  function selectMultiple(ids: string[]) {
    selectedIds.value = [...ids]
    if (ids.length > 0) {
      selectComponent.value = componentStore.value.find((c) => c.id === ids[0]) || null
    } else {
      selectComponent.value = null
    }
  }

  // 清空选择
  function clearSelection() {
    selectedIds.value = []
    selectComponent.value = null
  }

  // 判断是否选中
  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id)
  }

  // 更新组件大小
  function updateComponentSize(size: { width: number; height: number }) {
    if (selectComponent.value) {
      selectComponent.value.size.width = size.width
      selectComponent.value.size.height = size.height
      commitDebounced()
    }
  }
  // 更新组件位置
  function updateComponentPosition(position: { x: number; y: number }) {
    if (selectComponent.value) {
      selectComponent.value.position.x = position.x
      selectComponent.value.position.y = position.y
      commitDebounced()
    }
  }

  // 更新组件旋转
  function updateComponentRotation(rotate: number) {
    if (selectComponent.value) {
      selectComponent.value.rotation = rotate
      commitDebounced()
    }
  }

  // 删除组件
  function removeComponent(id: string) {
    const index = componentStore.value.findIndex((c) => c.id === id)
    if (index > -1) {
      componentStore.value.splice(index, 1)
    }
    // 从selectedIds中移除
    const selectedIndex = selectedIds.value.indexOf(id)
    if (selectedIndex > -1) {
      selectedIds.value.splice(selectedIndex, 1)
    }
    if (selectComponent.value?.id === id) {
      selectComponent.value = null
    }
    commit()
  }

  // 批量删除组件
  function removeMultipleComponents(ids: string[]) {
    ids.forEach((id) => {
      const index = componentStore.value.findIndex((c) => c.id === id)
      if (index > -1) {
        componentStore.value.splice(index, 1)
      }
    })
    clearSelection()
    commit()
  }

  // 复制/剪切/粘贴模块化
  const { clipboard, copy, cut, copyMultiple, cutMultiple, paste } = createClipboard<component>(
    componentStore,
    { selectedId, selectMultiple, commit },
  )

  // —— 图层（z-index）操作模块 ——
  const { bringForward, sendBackward, bringToFront, sendToBack } = createZOrder<component>(
    componentStore,
    { commit },
  )

  // 组合/取消组合模块化
  const { groupComponents, ungroupComponents } = createGrouping<component>(componentStore, {
    selectedId,
    selectMultiple,
    commit,
  })

  // 清空画布
  function reset() {
    componentStore.value.length = 0
    selectComponent.value = null
    selectedIds.value = []
    clipboard.value.length = 0
    isDragging.value = false
    commit()
  }

  // 初始化历史：记录初始空白状态
  initHistory()
  return {
    cut,
    copy,
    paste,
    copyMultiple,
    cutMultiple,
    componentStore,
    addComponent,
    updateComponentSize,
    updateComponentPosition,
    selectedId,
    toggleSelect,
    selectMultiple,
    clearSelection,
    isSelected,
    updateComponentRotation,
    removeComponent,
    removeMultipleComponents,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupComponents,
    ungroupComponents,
    selectComponent,
    selectedIds,
    isDragging,
    clipboard,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
    commitDebounced,
    commitThrottled,
    reset,
  }
})
