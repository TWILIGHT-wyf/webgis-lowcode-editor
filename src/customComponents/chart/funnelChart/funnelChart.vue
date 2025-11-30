<template>
  <div class="funnel-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { FunnelChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { useComponent } from '@/stores/component'
import type { Component } from '@/types/components'
import { useDataSource } from '@/datasource/useDataSource'
import {
  parseNumberInput,
  parseStringInput,
  extractNumberArray,
  extractStringArray,
} from '../../../datasource/dataUtils'

// 按需引入
use([TitleComponent, TooltipComponent, LegendComponent, FunnelChart, CanvasRenderer])

const props = defineProps<{
  id: string
}>()

const componentStore = useComponent()
const comp = computed(() => componentStore.componentStore.find((c: Component) => c.id === props.id))

// 使用数据源 hook
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

const chartOption = ref<EChartsOption>({})

function buildOption(): EChartsOption {
  const p = comp.value?.props || {}
  const ds = comp.value?.dataSource

  // 默认数据
  let data: Array<{ name: string; value: number }> = [
    { name: '展示', value: 100 },
    { name: '访问', value: 80 },
    { name: '咨询', value: 60 },
    { name: '订单', value: 40 },
    { name: '成交', value: 20 },
  ]

  // 如果数据源启用且有数据
  if (ds?.enabled && remoteData.value) {
    const values = extractNumberArray(remoteData.value, ds.dataPath)
    const labels = extractStringArray(remoteData.value, ds.labelsPath)

    // 只要有 values 或 labels 其中之一就可以更新
    if (values || labels) {
      const finalValues = values || data.map((d) => d.value)
      const finalLabels = labels || finalValues.map((_, idx) => `Stage ${idx + 1}`)

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
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
    },
    legend: {
      bottom: 10,
      data: data.map((d) => d.name),
    },
    series: [
      {
        name: (p.seriesName as string) || 'Funnel',
        type: 'funnel',
        left: (p.left as string) || '10%',
        top: (p.top as string) || '20%',
        bottom: (p.bottom as string) || '20%',
        width: (p.width as string) || '80%',
        min: (p.min as number) || 0,
        max: (p.max as number) || 100,
        minSize: (p.minSize as string) || '0%',
        maxSize: (p.maxSize as string) || '100%',
        sort: (p.sort as 'descending' | 'ascending' | 'none') || 'descending',
        gap: (p.gap as number) || 2,
        label: {
          show: (p.showLabel as boolean) !== false,
          position: (p.labelPosition as 'left' | 'right' | 'inside') || 'inside',
          formatter: (p.labelFormatter as string) || '{b}: {c}',
        },
        labelLine: {
          show: (p.showLabelLine as boolean) !== false,
          length: (p.labelLineLength as number) || 10,
        },
        itemStyle: {
          borderColor: (p.borderColor as string) || '#fff',
          borderWidth: (p.borderWidth as number) || 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
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
.funnel-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
