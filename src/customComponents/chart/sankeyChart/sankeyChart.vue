<template>
  <div class="sankey-chart" :style="{ width: '100%', height: '100%' }">
    <v-chart :option="chartOption" autoresize class="echart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { SankeyChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { useComponent } from '@/stores/component'
import type { component } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { parseJSONInput, extractSankeyNodes, extractSankeyLinks } from '../chartUtils'

// 按需引入
use([TitleComponent, TooltipComponent, SankeyChart, CanvasRenderer])

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
  const defaultNodes = [
    { name: 'a' },
    { name: 'b' },
    { name: 'c' },
    { name: 'd' },
    { name: 'e' },
    { name: 'f' },
  ]

  const defaultLinks = [
    { source: 'a', target: 'b', value: 5 },
    { source: 'a', target: 'c', value: 3 },
    { source: 'b', target: 'd', value: 8 },
    { source: 'b', target: 'e', value: 3 },
    { source: 'c', target: 'e', value: 4 },
    { source: 'd', target: 'f', value: 6 },
    { source: 'e', target: 'f', value: 5 },
  ]

  let data = defaultNodes
  let links = defaultLinks

  // 如果数据源启用且有数据
  if (ds?.enabled && remoteData.value) {
    // 使用通用函数提取节点和连接数据
    const extractedNodes = extractSankeyNodes(remoteData.value, ds.nodesPath as string | undefined)
    const extractedLinks = extractSankeyLinks(remoteData.value, ds.linksPath as string | undefined)

    if (extractedNodes) data = extractedNodes
    if (extractedLinks) links = extractedLinks
  } else {
    // 使用手动输入的数据
    if (p.nodesInput) {
      const parsedNodes = parseJSONInput(p.nodesInput as string, defaultNodes)
      if (Array.isArray(parsedNodes) && parsedNodes.length > 0) {
        data = parsedNodes.map((node: unknown) => ({
          name:
            typeof node === 'string'
              ? node
              : String(
                  (node as Record<string, unknown>)?.name ||
                    (node as Record<string, unknown>)?.id ||
                    '',
                ),
          value:
            typeof node === 'object' && node !== null
              ? ((node as Record<string, unknown>).value as number | undefined)
              : undefined,
          depth:
            typeof node === 'object' && node !== null
              ? ((node as Record<string, unknown>).depth as number | undefined)
              : undefined,
          itemStyle:
            typeof node === 'object' && node !== null
              ? (node as Record<string, unknown>).itemStyle
              : undefined,
        }))
      }
    }

    if (p.linksInput) {
      const parsedLinks = parseJSONInput(p.linksInput as string, defaultLinks)
      if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
        links = parsedLinks.map((link: unknown) => {
          const l = link as Record<string, unknown>
          return {
            source: (l.source || l.from || '') as string,
            target: (l.target || l.to || '') as string,
            value: (l.value || 0) as number,
          }
        })
      }
    }

    if (p.data && Array.isArray(p.data)) {
      data = p.data as typeof defaultNodes
    }

    if (p.links && Array.isArray(p.links)) {
      links = p.links as typeof defaultLinks
    }
  }

  const option: EChartsOption = {
    title: {
      text: (p.title as string) || '',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'sankey',
        data: data,
        links: links,
        emphasis: {
          focus: 'adjacency',
        },
        orient: (p.orient as 'horizontal' | 'vertical') || 'horizontal',
        left: (p.left as string) || '5%',
        top: (p.top as string) || '10%',
        right: (p.right as string) || '20%',
        bottom: (p.bottom as string) || '10%',
        nodeWidth: (p.nodeWidth as number) || 20,
        nodeGap: (p.nodeGap as number) || 8,
        layoutIterations: (p.layoutIterations as number) || 32,
        nodeAlign: (p.nodeAlign as 'left' | 'right' | 'justify') || 'justify',
        label: {
          show: (p.showLabel as boolean) !== false,
          position: (p.labelPosition as 'left' | 'right' | 'top' | 'bottom') || 'right',
          fontSize: (p.labelFontSize as number) || 12,
          color: (p.labelColor as string) || '#000',
        },
        lineStyle: {
          color: (p.lineColor as string) || 'source',
          opacity: (p.lineOpacity as number) || 0.2,
          curveness: (p.lineCurveness as number) || 0.5,
        },
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
.sankey-chart {
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: 100%;
}
</style>
