<template>
  <div class="gauge-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { useComponent } from '@/stores/component'
import type { component } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { parseNumberInput, extractNumberArray, extractString } from '../../../datasource/dataUtils'

// 按需引入
use([TitleComponent, TooltipComponent, GaugeChart, CanvasRenderer])

const props = defineProps<{
  id: string
}>()

const componentStore = useComponent()
const comp = computed(() => componentStore.componentStore.find((c: component) => c.id === props.id))

// 使用数据源 hook
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

const chartOption = ref<EChartsOption>({})

function buildOption(): EChartsOption {
  const p = comp.value?.props || {}
  const ds = comp.value?.dataSource

  // 默认数据
  let value = 75
  let name = 'Progress'
  let min = 0
  let max = 100

  // 如果数据源启用且有数据
  if (ds?.enabled && remoteData.value) {
    // 提取数值
    const extractedValue = extractNumberArray(remoteData.value, ds.dataPath as string)
    if (extractedValue && extractedValue.length > 0 && extractedValue[0] !== undefined) {
      value = extractedValue[0]
    }

    // 提取名称
    const extractedName = extractString(remoteData.value, ds.namePath as string)
    if (extractedName) {
      name = extractedName
    }

    // 提取最小值和最大值
    const extractedMin = extractNumberArray(remoteData.value, ds.minPath as string)
    if (extractedMin && extractedMin.length > 0 && extractedMin[0] !== undefined) {
      min = extractedMin[0]
    }

    const extractedMax = extractNumberArray(remoteData.value, ds.maxPath as string)
    if (extractedMax && extractedMax.length > 0 && extractedMax[0] !== undefined) {
      max = extractedMax[0]
    }
  } else {
    // 使用手动输入的数据
    if (p.value !== undefined) {
      value = p.value as number
    } else if (p.valueInput) {
      const parsed = parseNumberInput(p.valueInput as string, [])
      if (parsed.length > 0 && parsed[0] !== undefined) {
        value = parsed[0]
      }
    }

    if (p.name) {
      name = p.name as string
    }

    if (p.min !== undefined) {
      min = p.min as number
    }

    if (p.max !== undefined) {
      max = p.max as number
    }
  }

  const option: EChartsOption = {
    title: {
      text: (p.title as string) || '',
      left: 'center',
    },
    tooltip: {
      formatter: '{b}: {c}',
    },
    series: [
      {
        name: name,
        type: 'gauge',
        min: min,
        max: max,
        startAngle: (p.startAngle as number) || 225,
        endAngle: (p.endAngle as number) || -45,
        splitNumber: (p.splitNumber as number) || 10,
        progress: {
          show: (p.showProgress as boolean) !== false,
          width: (p.progressWidth as number) || 10,
        },
        axisLine: {
          lineStyle: {
            width: (p.axisLineWidth as number) || 10,
            color: (p.axisLineColor as Array<[number, string]>) || [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: (p.pointerColor as string) || 'auto',
          },
          length: (p.pointerLength as string) || '70%',
          width: (p.pointerWidth as number) || 8,
        },
        axisTick: {
          show: (p.showAxisTick as boolean) !== false,
          splitNumber: (p.axisTickSplitNumber as number) || 5,
        },
        splitLine: {
          show: (p.showSplitLine as boolean) !== false,
          length: (p.splitLineLength as number) || 15,
        },
        axisLabel: {
          show: (p.showAxisLabel as boolean) !== false,
          distance: (p.axisLabelDistance as number) || 25,
          fontSize: (p.axisLabelFontSize as number) || 12,
        },
        detail: {
          valueAnimation: true,
          formatter: (p.detailFormatter as string) || '{value}',
          fontSize: (p.detailFontSize as number) || 20,
          offsetCenter: [(p.detailOffsetX as string) || '0%', (p.detailOffsetY as string) || '70%'],
        },
        data: [
          {
            value: value,
            name: name,
          },
        ],
      },
    ],
  }

  return option
}

// 监听组件属性、数据源变化
watch(
  [() => comp.value?.props, () => comp.value?.dataSource, remoteData],
  () => {
    chartOption.value = buildOption()
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
.gauge-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
