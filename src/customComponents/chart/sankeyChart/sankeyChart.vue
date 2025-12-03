<template>
  <SankeyChartBase v-bind="chartProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponent } from '@/stores/component'
import type { Component } from '@/types/components'

// 从视觉组件库导入基础组件和工具函数
import {
  sankeyChart as SankeyChartBase,
  useDataSource,
  extractSankeyNodes,
  extractSankeyLinks,
  parseJSONInput,
} from '@one/visual-lib'

const props = defineProps<{ id: string }>()

// 获取组件配置
const componentStore = useComponent()
const comp = computed(() => componentStore.componentStore.find((c: Component) => c.id === props.id))

// 获取数据源
const { data: remoteData } = useDataSource(computed(() => comp.value?.dataSource))

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

// 数据适配逻辑 - nodes
const chartData = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedNodes = extractSankeyNodes(remoteData.value, ds.nodesPath as string | undefined)
    if (extractedNodes) return extractedNodes
  }

  // 使用手动输入的数据
  if (p?.nodesInput) {
    const parsedNodes = parseJSONInput(p.nodesInput as string, defaultNodes)
    if (Array.isArray(parsedNodes) && parsedNodes.length > 0) {
      return parsedNodes.map((node: unknown) => ({
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
            ? ((node as Record<string, unknown>).itemStyle as Record<string, unknown> | undefined)
            : undefined,
      }))
    }
  }

  if (p?.data && Array.isArray(p.data)) {
    return p.data as typeof defaultNodes
  }

  return undefined
})

// 数据适配逻辑 - links
const chartLinks = computed(() => {
  const ds = comp.value?.dataSource
  const p = comp.value?.props

  if (ds?.enabled && remoteData.value) {
    const extractedLinks = extractSankeyLinks(remoteData.value, ds.linksPath as string | undefined)
    if (extractedLinks) return extractedLinks
  }

  // 使用手动输入的数据
  if (p?.linksInput) {
    const parsedLinks = parseJSONInput(p.linksInput as string, defaultLinks)
    if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
      return parsedLinks.map((link: unknown) => {
        const l = link as Record<string, unknown>
        return {
          source: (l.source || l.from || '') as string,
          target: (l.target || l.to || '') as string,
          value: (l.value || 0) as number,
        }
      })
    }
  }

  if (p?.links && Array.isArray(p.links)) {
    return p.links as typeof defaultLinks
  }

  return undefined
})

const customOption = computed(() => {
  const opt = comp.value?.props?.option
  return typeof opt === 'string' ? JSON.parse(opt) : opt
})

// 聚合要透传给库组件的 props
const chartProps = computed((): Record<string, unknown> => {
  const p = comp.value?.props
  return {
    data: chartData.value,
    links: chartLinks.value,

    // 样式/选项属性
    title: p?.title,
    orient: p?.orient,
    left: p?.left,
    top: p?.top,
    right: p?.right,
    bottom: p?.bottom,
    nodeWidth: p?.nodeWidth,
    nodeGap: p?.nodeGap,
    layoutIterations: p?.layoutIterations,
    nodeAlign: p?.nodeAlign,
    showLabel: p?.showLabel,
    labelPosition: p?.labelPosition,
    labelFontSize: p?.labelFontSize,
    labelColor: p?.labelColor,
    lineColor: p?.lineColor,
    lineOpacity: p?.lineOpacity,
    lineCurveness: p?.lineCurveness,

    // 高级配置覆盖
    option: customOption.value,
  }
})
</script>
