import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { nanoid } from 'nanoid'
import { createHistory, createClipboard, createGrouping, createZOrder } from '@/stores/componentOps'
import type { Component, DataSource, PropValue } from '@lowcode/core/types/components'

export const useComponent = defineStore('component', () => {
  const componentStore = ref<Component[]>([])
  const selectComponent = ref<Component | null>(null)
  const selectedIds = ref<string[]>([])
  const isDragging = ref<boolean>(false)

  // 性能优化：组件ID索引，O(1) 查找复杂度
  const componentIndex = shallowRef<Map<string, Component>>(new Map())

  // 重建索引
  function rebuildIndex() {
    const newIndex = new Map<string, Component>()
    componentStore.value.forEach((c) => newIndex.set(c.id, c))
    componentIndex.value = newIndex
  }

  // 高效获取组件 - O(1) 复杂度
  function getComponentById(id: string): Component | undefined {
    return componentIndex.value.get(id)
  }

  // 批量获取组件
  function getComponentsByIds(ids: string[]): Component[] {
    return ids.map((id) => componentIndex.value.get(id)).filter(Boolean) as Component[]
  }

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
  } = createHistory<Component>(componentStore)

  function undo() {
    _undo()
    rebuildIndex()
    clearSelection()
  }
  function redo() {
    _redo()
    rebuildIndex()
    clearSelection()
  }

  // 不同类型组件的默认样式
  function defaultStyleByType(type: string): Component['style'] {
    const base: Component['style'] = {
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
          titleColor: '#909399',
          titleFontSize: 14,
          titleFontWeight: 'normal',
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

      case 'box':
        return {
          ...base,
          backgroundColor: '#f5f7fa',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#dcdfe6',
          borderStyle: 'solid',
          padding: 16,
          boxShadow: 'none',
          textAlign: 'center',
          fontSize: 14,
          color: '#606266',
          fontWeight: 'normal',
        }

      case 'table':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          headerBackgroundColor: '#f5f7fa',
          headerColor: '#909399',
          headerFontSize: 14,
          headerHeight: 40,
          cellColor: '#606266',
          cellFontSize: 13,
          rowHeight: 48,
          borderColor: '#ebeef5',
          hoverBackgroundColor: '#f5f7fa',
        }

      case 'list':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          itemBackgroundColor: '#ffffff',
          itemPadding: 12,
          itemPaddingX: 16,
          borderColor: 'transparent',
          splitColor: '#e4e7ed',
          titleFontSize: 15,
          titleColor: '#303133',
          titleFontWeight: '500',
          descriptionFontSize: 13,
          descriptionColor: '#909399',
          extraFontSize: 12,
          extraColor: '#409eff',
          iconColor: '#909399',
        }

      case 'timeline':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          padding: 16,
          timelinePadding: 0,
          cardMargin: 12,
          cardBorderRadius: 4,
          headerFontSize: 15,
          headerColor: '#303133',
          headerFontWeight: '600',
          contentFontSize: 14,
          contentColor: '#606266',
          titleFontSize: 15,
          titleColor: '#303133',
          titleFontWeight: '600',
          textFontSize: 14,
          textColor: '#606266',
          extraFontSize: 12,
          extraColor: '#909399',
        }

      case 'cardGrid':
        return {
          ...base,
          backgroundColor: '#f5f7fa',
          borderRadius: 4,
          padding: 16,
          cardBorderRadius: 4,
          cardPadding: 14,
          imageHeight: 150,
          imageBorderRadius: 4,
          titleFontSize: 16,
          titleColor: '#303133',
          titleFontWeight: '600',
          descriptionFontSize: 13,
          descriptionColor: '#606266',
          footerFontSize: 12,
          footerColor: '#909399',
          footerBorderColor: '#ebeef5',
        }

      case 'pivot':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          padding: 0,
          headerBackgroundColor: '#f5f7fa',
          headerColor: '#909399',
          borderColor: '#ebeef5',
          hoverBackgroundColor: '#f5f7fa',
          highlightColor: '#67c23a',
        }

      case 'select':
      case 'multiSelect':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderRadius: 4,
          padding: 8,
          selectWidth: 100,
          borderColor: '#dcdfe6',
          focusBorderColor: '#409eff',
          hoverBorderColor: '#c0c4cc',
          tagBackgroundColor: '#f0f2f5',
          tagTextColor: '#606266',
        }

      case 'dateRange':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderRadius: 4,
          padding: 8,
          pickerWidth: 100,
          borderColor: '#dcdfe6',
          focusBorderColor: '#409eff',
          hoverBorderColor: '#c0c4cc',
        }

      case 'searchBox':
        return {
          ...base,
          backgroundColor: 'transparent',
          padding: 16,
          inputWidth: '100%',
          borderColor: '#dcdfe6',
          borderFocusColor: '#409eff',
          borderHoverColor: '#c0c4cc',
          textColor: '#606266',
          placeholderColor: '#a8abb2',
          fontSize: 14,
        }

      case 'slider':
        return {
          ...base,
          backgroundColor: 'transparent',
          padding: 16,
          activeColor: '#409eff',
          inactiveColor: '#e4e7ed',
          buttonSize: 20,
          valueFontSize: 14,
          valueColor: '#606266',
          valueAlign: 'center',
        }

      case 'switch':
        return {
          ...base,
          backgroundColor: 'transparent',
          padding: 16,
          activeColor: '#409eff',
          inactiveColor: '#dcdfe6',
          borderColor: '#dcdfe6',
        }

      case 'checkboxGroup':
        return {
          ...base,
          backgroundColor: 'transparent',
          padding: 16,
          direction: 'horizontal',
          gap: 12,
          checkedColor: '#409eff',
          borderColor: '#dcdfe6',
          textColor: '#606266',
        }

      case 'buttonGroup':
        return {
          ...base,
          backgroundColor: 'transparent',
          padding: 16,
        }

      // 布局组件
      case 'row':
        return {
          ...base,
          gutter: 0,
          padding: 16,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 4,
          minHeight: 100,
          textColor: '#333333',
        }

      case 'col':
        return {
          ...base,
          span: 12,
          padding: 16,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 4,
          minHeight: 100,
          textColor: '#333333',
        }

      case 'flex':
        return {
          ...base,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          flexWrap: 'nowrap',
          gap: 16,
          padding: 16,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 4,
          minHeight: 100,
          textColor: '#333333',
        }

      case 'grid':
        return {
          ...base,
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'auto',
          gridGap: 16,
          gridAutoFlow: 'row',
          padding: 16,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 4,
          minHeight: 200,
          textColor: '#333333',
        }

      case 'modal':
        return {
          ...base,
          backgroundColor: '#ffffff',
          textColor: '#333333',
        }

      case 'panel':
        return {
          ...base,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 4,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          headerPadding: 16,
          headerBg: '#f9fafb',
          headerFontSize: 14,
          headerColor: '#111827',
          bodyPadding: 16,
          textColor: '#333333',
          fontSize: 14,
          footerPadding: 16,
          footerBg: '#f9fafb',
          footerFontSize: 12,
          footerColor: '#6b7280',
        }

      case 'tabs':
        return {
          ...base,
          backgroundColor: '#ffffff',
          padding: 0,
          textColor: '#333333',
        }

      // 媒体组件
      case 'image':
        return {
          ...base,
          objectFit: 'cover',
          backgroundColor: 'transparent',
          borderRadius: 0,
          border: 'none',
        }

      case 'video':
        return {
          ...base,
          objectFit: 'contain',
          backgroundColor: '#000000',
          borderRadius: 0,
          border: 'none',
        }

      // 内容组件
      case 'markdown':
        return {
          ...base,
          padding: 16,
          backgroundColor: '#ffffff',
          textColor: '#333333',
          fontSize: 14,
          lineHeight: 1.6,
          borderRadius: 0,
          border: 'none',
          fontFamily: 'inherit',
        }

      case 'html':
        return {
          ...base,
          padding: 16,
          backgroundColor: '#ffffff',
          textColor: '#333333',
          fontSize: 14,
          lineHeight: 1.6,
          borderRadius: 0,
          border: 'none',
          overflow: 'auto',
          fontFamily: 'inherit',
        }

      case 'iframe':
        return {
          ...base,
          backgroundColor: '#ffffff',
          borderRadius: 0,
          border: '1px solid #dcdfe6',
        }

      // 高级功能组件
      case 'scripting':
        return {
          ...base,
          padding: 16,
          backgroundColor: '#1e1e1e',
          textColor: '#d4d4d4',
          fontSize: 14,
          lineHeight: 1.6,
          borderRadius: 4,
          border: '1px solid #3c3c3c',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }

      case 'state':
        return {
          ...base,
          padding: 16,
          backgroundColor: '#2d2d2d',
          textColor: '#cccccc',
          fontSize: 14,
          lineHeight: 1.6,
          borderRadius: 4,
          border: '1px solid #3c3c3c',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }

      case 'trigger':
        return {
          ...base,
          padding: 16,
          backgroundColor: '#1a1a1a',
          textColor: '#e0e0e0',
          fontSize: 13,
          lineHeight: 1.5,
          borderRadius: 4,
          border: '1px solid #3c3c3c',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        }

      // 地图组件
      case 'base':
      case 'tile':
      case 'vector':
      case 'geojson':
      case 'marker':
      case 'cluster':
      case 'heat':
        return {
          ...base,
          borderRadius: 0,
          border: 'none',
        }

      case 'legend':
        return {
          ...base,
          backgroundColor: '#ffffff',
          textColor: '#303133',
          borderColor: '#dcdfe6',
          fontSize: 14,
          padding: 12,
          borderRadius: 4,
        }

      case 'scale':
        return {
          ...base,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          lineColor: '#303133',
          textColor: '#303133',
          fontSize: 11,
        }

      case 'layers':
        return {
          ...base,
          backgroundColor: '#ffffff',
          textColor: '#303133',
          borderColor: '#dcdfe6',
          fontSize: 14,
          padding: 12,
          borderRadius: 4,
        }

      default:
        return base
    }
  }

  // 不同类型组件的默认非样式属性
  function defaultPropsByType(type: string): Record<string, PropValue> | undefined {
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
      case 'barChart':
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
      case 'stackedBarChart':
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
          title: '',
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
          customPrefix: false,
          customSuffix: false,
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
          hidden: false,
          showZero: false,
          offsetX: 0,
          offsetY: 0,
          showSlot: true,
          slotText: '内容',
        }

      case 'box':
        return {
          content: '占位盒内容',
        }

      case 'table':
        return {
          data: [],
          columns: [
            {
              prop: 'name',
              label: '姓名',
              width: 120,
              align: 'left',
              sortable: false,
              fixed: false,
            },
            {
              prop: 'age',
              label: '年龄',
              width: 80,
              align: 'center',
              sortable: true,
              fixed: false,
            },
            {
              prop: 'address',
              label: '地址',
              width: 200,
              align: 'left',
              sortable: false,
              fixed: false,
            },
          ],
          showHeader: true,
          stripe: false,
          border: true,
          size: 'default',
          emptyText: '暂无数据',
          height: 'auto',
          maxHeight: undefined,
        }

      case 'list':
        return {
          data: [],
          showIcon: false,
          showTitle: true,
          showDescription: true,
          showExtra: false,
          showAction: true,
          showBorder: true,
          showSplit: true,
          emptyText: '暂无数据',
          iconSize: 20,
          scrollHeight: '100%',
          titleField: 'title',
          descriptionField: 'description',
          extraField: 'extra',
        }

      case 'timeline':
        return {
          data: [],
          showCard: true,
          showTitle: true,
          showTimestamp: true,
          showExtra: false,
          timestampPlacement: 'top',
          itemSize: 'normal',
          hollow: false,
          cardShadow: 'hover',
          emptyText: '暂无数据',
          scrollHeight: '100%',
          titleField: 'title',
          contentField: 'content',
          timestampField: 'timestamp',
          typeField: 'type',
          colorField: 'color',
          extraField: 'extra',
        }

      case 'cardGrid':
        return {
          data: [],
          showImage: false,
          showTitle: true,
          showDescription: true,
          showTags: false,
          showFooter: false,
          cardShadow: 'hover',
          tagSize: 'small',
          emptyText: '暂无数据',
          scrollHeight: '100%',
          columns: 3,
          gap: 16,
          titleField: 'title',
          descriptionField: 'description',
          footerField: 'footer',
          tagsField: 'tags',
          imageField: 'image',
        }

      case 'pivot':
        return {
          data: [],
          stripe: true,
          border: true,
          size: 'default',
          showSummary: true,
          emptyText: '暂无数据',
          height: 'auto',
          maxHeight: '',
          rowHeaders: ['category', 'region'],
          dataColumns: [],
          columnLabels: {},
          rowHeaderWidth: 120,
          fixedRowHeaders: true,
          rowHeaderAlign: 'left',
          valueFormat: 'number',
          highlightThreshold: 0,
        }

      case 'select':
        return {
          options: [],
          defaultValue: '',
          placeholder: '请选择',
          clearable: true,
          filterable: false,
          disabled: false,
          size: 'default',
          labelField: 'label',
          valueField: 'value',
        }

      case 'multiSelect':
        return {
          options: [],
          defaultValue: [],
          placeholder: '请选择',
          clearable: true,
          filterable: false,
          disabled: false,
          size: 'default',
          collapseTags: true,
          collapseTagsTooltip: true,
          maxCollapseTags: 2,
          multipleLimit: 0,
          labelField: 'label',
          valueField: 'value',
        }

      case 'dateRange':
        return {
          defaultValue: [],
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          disabled: false,
          clearable: true,
          size: 'default',
          editable: false,
          enableShortcuts: true,
        }

      case 'searchBox':
        return {
          placeholder: '请输入搜索内容',
          clearable: true,
          disabled: false,
          size: 'default',
          prefixIcon: '',
          suffixIcon: '',
          maxlength: undefined,
          showWordLimit: false,
          showSearchButton: true,
          buttonText: '搜索',
          buttonType: 'primary',
          defaultValue: '',
        }

      case 'slider':
        return {
          min: 0,
          max: 100,
          step: 1,
          disabled: false,
          showStops: false,
          showTooltip: true,
          range: false,
          vertical: false,
          height: '200px',
          showValue: true,
          valueFormat: '{value}',
          marks: undefined,
          defaultValue: 0,
        }

      case 'switch':
        return {
          disabled: false,
          loading: false,
          size: 'default',
          activeText: '',
          inactiveText: '',
          activeValue: true,
          inactiveValue: false,
          inlinePrompt: false,
          activeIcon: undefined,
          inactiveIcon: undefined,
          defaultValue: false,
        }

      case 'checkboxGroup':
        return {
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
            { label: '选项3', value: '3' },
          ],
          disabled: false,
          size: 'default',
          min: undefined,
          max: undefined,
          layout: 'default',
          showBorder: false,
          defaultValue: '1',
          labelField: 'label',
          valueField: 'value',
        }

      case 'buttonGroup':
        return {
          buttons: [
            { label: '按钮1', value: '1', type: 'default' },
            { label: '按钮2', value: '2', type: 'primary' },
            { label: '按钮3', value: '3', type: 'success' },
          ],
          type: 'default',
          size: 'default',
          disabled: false,
          plain: false,
          round: false,
          circle: false,
          labelField: 'label',
          valueField: 'value',
        }

      // 布局组件
      case 'row':
        return {
          gutter: 0,
          justify: 'start',
          align: 'top',
          tag: 'div',
          content: '',
        }

      case 'col':
        return {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          xs: undefined,
          sm: undefined,
          md: undefined,
          lg: undefined,
          xl: undefined,
          tag: 'div',
          content: '',
        }

      case 'flex':
        return {
          content: '',
        }

      case 'grid':
        return {
          content: '',
        }

      case 'modal':
        return {
          visible: false,
          title: '对话框标题',
          width: '50%',
          fullscreen: false,
          closeOnClickModal: true,
          showClose: true,
          showFooter: true,
          content: '这是对话框内容',
        }

      case 'panel':
        return {
          title: '面板标题',
          collapsible: false,
          collapsed: false,
          showHeader: true,
          showFooter: false,
          footerContent: '',
          content: '这是面板内容',
        }

      case 'tabs':
        return {
          activeTab: '',
          type: 'border-card',
          tabPosition: 'top',
          closable: false,
          addable: false,
          tabs: [],
        }

      // 媒体组件
      case 'image':
        return {
          url: 'https://via.placeholder.com/400x300',
          fit: 'cover',
          lazy: true,
          preview: true,
          previewZIndex: 2000,
          hideOnClickModal: true,
          errorText: '图片加载失败',
          placeholder: '请设置图片地址',
        }

      case 'video':
        return {
          url: '',
          poster: '',
          controls: true,
          autoplay: false,
          loop: false,
          muted: false,
          preload: 'metadata',
          noDownload: false,
          noPictureInPicture: false,
          placeholder: '请设置视频地址',
        }

      // 内容组件
      case 'markdown':
        return {
          content:
            '# Markdown 标题\n\n这是一段 **Markdown** 内容。\n\n- 列表项 1\n- 列表项 2\n- 列表项 3',
        }

      case 'html':
        return {
          content:
            '<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;"><h2 style="margin: 0 0 10px 0;">HTML 内容</h2><p style="margin: 0;">这是一段自定义 HTML 内容,支持样式和结构</p></div>',
          sanitize: true,
          allowedTags: 'div,h1,h2,h3,h4,h5,h6,p,span,strong,em,ul,ol,li,a,img,br',
          allowedAttributes: 'style,class,href,src,alt,target',
        }

      case 'iframe':
        return {
          url: 'https://www.openstreetmap.org/export/embed.html?bbox=116.3%2C39.8%2C116.5%2C40.0',
          title: 'iframe',
          sandbox: 'allow-scripts allow-same-origin',
          allow: 'fullscreen',
          placeholder: '请设置 iframe 地址',
        }

      // 高级功能组件
      case 'scripting':
        return {
          script:
            '// JavaScript 代码\nconsole.log("Hello, World!");\nconsole.log("当前时间:", new Date().toLocaleString());',
          autoRun: false,
          showCode: true,
          showControls: true,
          showPlaceholder: true,
          placeholder: '点击执行按钮运行脚本',
        }

      case 'state':
        return {
          state: JSON.stringify(
            {
              count: 0,
              status: 'idle',
              user: { name: 'Admin', role: 'admin' },
              settings: { theme: 'dark', language: 'zh-CN' },
            },
            null,
            2,
          ),
          viewMode: 'list', // list, json, table
          placeholder: '暂无状态数据',
        }

      case 'trigger':
        return {
          enabled: true,
          triggerType: 'manual', // manual, interval
          interval: 5000,
          action: 'log', // log, alert, dispatch, api
          actionData: '触发器已执行',
          condition: '',
          showClearButton: true,
          placeholder: '暂无执行记录',
        }

      // 地图组件
      case 'base':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 13,
          minZoom: 1,
          maxZoom: 18,
          tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
          zoomControl: true,
          dragging: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          placeholder: '配置地图中心点以显示底图',
        }

      case 'tile':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 10,
          tileUrl: '',
          attribution: '',
          opacity: 1,
          zIndex: 1,
          minZoom: 1,
          maxZoom: 18,
          subdomains: 'abc',
          placeholder: '配置瓦片URL以显示图层',
        }

      case 'vector':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 10,
          vectorData: [],
          defaultStyle: {
            color: '#3388ff',
            weight: 2,
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.4,
          },
          showPopup: true,
          placeholder: '配置矢量数据以显示图层',
        }

      case 'geojson':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 10,
          geojsonData: null,
          style: {
            color: '#3388ff',
            weight: 2,
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.4,
          },
          showPopup: true,
          popupFields: [],
          placeholder: '配置GeoJSON数据以显示图层',
        }

      case 'marker':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 10,
          markers: [],
          iconUrl: '',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          showLabel: false,
          draggableMarkers: false,
          placeholder: '配置标记点数据以显示',
        }

      case 'cluster':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 5,
          markers: [],
          maxClusterRadius: 80,
          disableClusteringAtZoom: undefined,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true,
          placeholder: '配置标记点数据以显示聚合',
        }

      case 'heat':
        return {
          centerLat: 39.9,
          centerLng: 116.4,
          zoom: 10,
          heatData: [],
          radius: 25,
          blur: 15,
          maxZoom: 17,
          max: 1.0,
          minOpacity: 0.4,
          gradient: {
            0.0: 'blue',
            0.5: 'lime',
            1.0: 'red',
          },
          placeholder: '配置热力数据以显示热力图',
        }

      case 'legend':
        return {
          title: '图例',
          items: [],
          position: 'top-right',
          backgroundColor: '#ffffff',
          textColor: '#303133',
          borderColor: '#dcdfe6',
          symbolShape: 'square',
          symbolWidth: 20,
          symbolHeight: 20,
          fontSize: 14,
          padding: 12,
          placeholder: '配置图例项以显示',
        }

      case 'scale':
        return {
          maxWidth: 100,
          metric: true,
          imperial: false,
          position: 'bottom-left',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          lineColor: '#303133',
          textColor: '#303133',
          fontSize: 11,
          segments: 4,
          zoom: 10,
        }

      case 'layers':
        return {
          title: '图层控制',
          layers: [],
          position: 'top-right',
          backgroundColor: '#ffffff',
          textColor: '#303133',
          borderColor: '#dcdfe6',
          fontSize: 14,
          padding: 12,
          showOpacity: true,
          placeholder: '配置图层列表以显示',
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
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          valuePath: '',
          titlePath: '',
        }
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

      case 'box':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          contentPath: '',
        }

      case 'table':
      case 'list':
      case 'timeline':
      case 'cardGrid':
      case 'pivot':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
        }

      case 'select':
      case 'multiSelect':
      case 'checkboxGroup':
      case 'buttonGroup':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
        }

      case 'tabs':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          labelField: 'label',
          valueField: 'value',
          contentField: 'content',
        }

      case 'image':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          urlField: 'url',
        }

      case 'video':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          urlField: 'url',
          posterField: 'poster',
        }

      case 'markdown':
      case 'html':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          contentField: 'content',
        }

      case 'iframe':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          urlField: 'url',
        }

      // 高级功能组件
      case 'scripting':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          scriptField: 'script',
        }

      case 'state':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          stateField: 'state',
        }

      case 'trigger':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          dataPath: '',
          conditionField: 'condition',
        }

      // 地图组件
      case 'base':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          centerLatField: 'centerLat',
          centerLngField: 'centerLng',
          zoomField: 'zoom',
          tileUrlField: 'tileUrl',
        }

      case 'tile':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          tileUrlField: 'tileUrl',
          opacityField: 'opacity',
          centerLatField: 'centerLat',
          centerLngField: 'centerLng',
        }

      case 'vector':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          vectorDataField: 'vectorData',
        }

      case 'geojson':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          geojsonDataField: 'geojsonData',
        }

      case 'marker':
      case 'cluster':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          markersField: 'markers',
        }

      case 'heat':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          heatDataField: 'heatData',
        }

      case 'legend':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          itemsField: 'items',
          titleField: 'title',
        }

      case 'layers':
        return {
          enabled: false,
          url: '',
          method: 'GET',
          headers: {},
          interval: 0,
          layersField: 'layers',
          titleField: 'title',
        }

      case 'scale':
      case 'dateRange':
      case 'searchBox':
      case 'slider':
      case 'switch':
      case 'row':
      case 'col':
      case 'flex':
      case 'grid':
      case 'modal':
      case 'panel':
        return undefined

      default:
        return undefined
    }
  }

  // 不同类型组件的默认动画配置（默认无动画）
  function defaultAnimationByType(): Component['animation'] | undefined {
    return undefined
  }

  // 添加组件
  function addComponent(
    component: Omit<Component, 'id' | 'zindex' | 'style' | 'props'> & {
      style?: Component['style']
      props?: Record<string, PropValue>
    },
  ) {
    const maxZ = componentStore.value.reduce((max, c) => Math.max(max, c.zindex ?? 0), 0)
    const newComponent: Component = {
      ...component,
      id: nanoid(),
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
    // 性能优化：更新索引
    componentIndex.value.set(newComponent.id, newComponent)
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
  const { clipboard, copy, cut, copyMultiple, cutMultiple, paste } = createClipboard<Component>(
    componentStore,
    { selectedId, selectMultiple, commit },
  )

  // —— 图层（z-index）操作模块 ——
  const { bringForward, sendBackward, bringToFront, sendToBack } = createZOrder<Component>(
    componentStore,
    { commit },
  )

  // 组合/取消组合模块化
  const { groupComponents, ungroupComponents } = createGrouping<Component>(componentStore, {
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
    // 性能优化：清空索引
    componentIndex.value.clear()
    commit()
  }

  // 加载模板
  function loadTemplate(templateComponents: Component[]) {
    // 清空当前画布
    reset()
    // 加载模板组件(使用深拷贝避免引用问题)
    componentStore.value = JSON.parse(JSON.stringify(templateComponents))
    // 性能优化：重建索引
    rebuildIndex()
    // 提交到历史
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
    loadTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
    commitDebounced,
    commitThrottled,
    reset,
    // 性能优化：暴露高效查找方法
    getComponentById,
    getComponentsByIds,
    rebuildIndex,
  }
})
