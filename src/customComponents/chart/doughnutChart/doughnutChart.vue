<template>
  <div class="doughnut-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { useComponent } from '@/stores/component'
import type { component } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import {
  parseNumberInput,
  parseStringInput,
  extractNumberArray,
  extractStringArray,
} from '../../../datasource/dataUtils'

// 按需引入
use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

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
  let data: Array<{ name: string; value: number }> = [
    { name: 'Direct', value: 335 },
    { name: 'Email', value: 310 },
    { name: 'Union Ads', value: 234 },
    { name: 'Video Ads', value: 135 },
    { name: 'Search Engine', value: 1548 },
  ]

  // 如果数据源启用且有数据，优先使用数据源
  if (ds?.enabled && remoteData.value) {
    const values = extractNumberArray(remoteData.value, ds.dataPath)
    const labels = extractStringArray(remoteData.value, ds.labelsPath)

    // 只要有 values 或 labels 其中之一就可以更新
    if (values || labels) {
      const finalValues = values || data.map((d) => d.value)
      const finalLabels = labels || finalValues.map((_, idx) => `Category ${idx + 1}`)

      // 取较短的长度，避免数组越界
      const len = Math.min(finalValues.length, finalLabels.length)
      data = finalLabels.slice(0, len).map((name, idx) => ({
        name: name,
        value: finalValues[idx] || 0,
      }))
    }
  } else {
    // 使用手动输入的数据
    if (p.dataInput && p.labelsInput) {
      const values = parseNumberInput(p.dataInput as string, [])
      const labels = parseStringInput(p.labelsInput as string, [])
      if (values.length > 0 && labels.length > 0) {
        data = labels.map((name, idx) => ({
          name,
          value: values[idx] || 0,
        }))
      }
    } else if (p.data && Array.isArray(p.data)) {
      data = p.data as Array<{ name: string; value: number }>
    }
  }

  const option: EChartsOption = {
    title: {
      text: (p.title as string) || '',
      left: (p.titleAlign as string) || 'center',
      textStyle: {
        fontSize: (p.titleSize as number) || 16,
        color: (p.titleColor as string) || '#333',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      show: (p.showLegend as boolean) !== false,
      orient: (p.legendOrient as 'horizontal' | 'vertical') || 'horizontal',
      left: (p.legendLeft as string) || 'center',
      top: (p.legendTop as string) || 'bottom',
    },
    series: [
      {
        name: (p.seriesName as string) || 'Access From',
        type: 'pie',
        radius: [(p.innerRadius as string) || '40%', (p.outerRadius as string) || '70%'],
        center: [(p.centerX as string) || '50%', (p.centerY as string) || '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: (p.borderRadius as number) || 10,
          borderColor: (p.borderColor as string) || '#fff',
          borderWidth: (p.borderWidth as number) || 2,
        },
        label: {
          show: (p.showLabel as boolean) !== false,
          formatter: (p.labelFormatter as string) || '{b}: {c}',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: (p.showLabelLine as boolean) !== false,
        },
        data: data,
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
div {
  width: 100%;
  height: 100%;
}
</style>
