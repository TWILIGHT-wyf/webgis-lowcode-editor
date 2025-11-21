<template>
  <div class="line-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import {
  parseNumberInput,
  parseStringInput,
  extractNumberArray,
  extractStringArray,
  extractString,
} from '../../../datasource/dataUtils'

//按需引入
use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer])

const props = defineProps<{ id: string }>()

// 从 store 获取组件数据
const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

const chartOption = ref<EChartsOption>({})

function buildOption(): EChartsOption {
  if (!comp.value) return {}

  const p = comp.value.props

  // 如果有高级配置 option，优先使用它作为基础
  if (p.option) {
    const customOption = typeof p.option === 'string' ? JSON.parse(p.option) : p.option
    // 简单配置覆盖高级配置
    const simpleOption = buildSimpleOption()
    return {
      ...customOption,
      ...simpleOption,
    }
  }

  return buildSimpleOption()
}

function buildSimpleOption(): EChartsOption {
  if (!comp.value) return {}

  const p = comp.value.props
  const ds = comp.value.dataSource

  // 默认数据
  const defaultData = [150, 230, 224, 218, 135, 147, 260]
  const defaultXAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // 获取数据 - 优先使用数据源，其次使用手动输入
  let data: number[] = defaultData
  let xAxisData: string[] = defaultXAxis
  let seriesName: string = (p.seriesName as string) || 'Series'

  // 如果数据源启用且有数据
  if (ds?.enabled && remoteData.value) {
    console.log('=== LineChart Debug Info ===')
    console.log('remoteData.value:', remoteData.value)
    console.log('ds.dataPath:', ds.dataPath)
    console.log('ds.xAxisPath:', ds.xAxisPath)
    console.log('ds.seriesNamePath:', ds.seriesNamePath)

    // 提取数据值
    const extractedData = extractNumberArray(remoteData.value, ds.dataPath)
    console.log('extractedData:', extractedData)
    if (extractedData) {
      data = extractedData
    }

    // 提取 X 轴标签
    const extractedXAxis = extractStringArray(remoteData.value, ds.xAxisPath)
    console.log('extractedXAxis:', extractedXAxis)
    if (extractedXAxis) {
      xAxisData = extractedXAxis
    }

    // 提取系列名称
    const extractedName = extractString(remoteData.value, ds.seriesNamePath)
    console.log('extractedName:', extractedName)
    if (extractedName) {
      seriesName = extractedName
    }

    console.log('Final data:', data)
    console.log('Final xAxisData:', xAxisData)
    console.log('Final seriesName:', seriesName)
    console.log('=== End Debug Info ===')
  } else {
    // 使用手动输入的数据
    if (p.dataInput) {
      data = parseNumberInput(p.dataInput as string, defaultData)
    } else if (p.data) {
      data = p.data as number[]
    }

    if (p.xAxisInput) {
      xAxisData = parseStringInput(p.xAxisInput as string, defaultXAxis)
    } else if (p.xAxisData) {
      xAxisData = p.xAxisData as string[]
    }
  }

  // 先根据简单配置构建基础 option
  const simpleOption: EChartsOption = {
    // 标题
    title: p.title
      ? {
          text: p.title as string,
          left: 'center',
          textStyle: {
            fontSize: 16,
          },
        }
      : undefined,

    // 提示框
    tooltip:
      p.showTooltip !== false
        ? {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              },
            },
          }
        : undefined,

    // 图例
    legend:
      p.showLegend !== false
        ? {
            [(p.legendPosition as string) || 'top']: 10,
            data: [seriesName],
          }
        : undefined,

    // 网格
    grid: {
      left: '6%',
      right: '6%',
      bottom: '8%',
      top: p.title ? '15%' : '10%',
      containLabel: true,
      show: p.showGrid !== false,
    },

    // X 轴
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: (p.xAxisName as string) || '',
      nameLocation: 'middle',
      nameGap: 30,
      axisLine: {
        show: p.showXAxisLine !== false,
      },
      axisLabel: {
        show: p.showXAxisLabel !== false,
      },
      splitLine: {
        show: p.showGrid !== false,
      },
    },

    // Y 轴
    yAxis: {
      type: 'value',
      name: (p.yAxisName as string) || '',
      nameLocation: 'middle',
      nameGap: 50,
      axisLine: {
        show: p.showYAxisLine !== false,
      },
      axisLabel: {
        show: p.showYAxisLabel !== false,
      },
      splitLine: {
        show: p.showGrid !== false,
      },
    },

    // 系列
    series: [
      {
        name: seriesName,
        type: 'line',
        data: data,
        smooth: p.smooth !== false,
        showSymbol: p.showSymbol !== false,
        symbolSize: (p.symbolSize as number) || 6,
        lineStyle: {
          color: (p.lineColor as string) || '#5470c6',
          width: (p.lineWidth as number) || 2,
          type: (p.lineType as 'solid' | 'dashed' | 'dotted') || 'solid',
        },
        itemStyle: {
          color: (p.lineColor as string) || '#5470c6',
        },
        areaStyle: p.showArea
          ? {
              color: (p.lineColor as string) || '#5470c6',
              opacity: (p.areaOpacity as number) || 0.3,
            }
          : undefined,
      },
    ],
  }

  return simpleOption
}

// 监听组件 props 和数据源变化，重新构建图表
watch(
  [() => comp.value?.props, () => comp.value?.dataSource, remoteData],
  () => {
    chartOption.value = buildOption()
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
