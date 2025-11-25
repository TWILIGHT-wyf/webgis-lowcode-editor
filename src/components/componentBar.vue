<template>
  <div class="componentBar-container">
    <!-- 组件库部分 -->
    <div class="componentBar-section" :style="{ height: componentLibHeight + 'px' }">
      <div class="section-header">
        <span class="section-title">组件库</span>
      </div>
      <el-scrollbar class="componentBar">
        <div class="scroll-inner">
          <!-- 页面模板选项卡 -->
          <el-tabs v-model="activeTab" class="component-tabs">
            <el-tab-pane label="组件" name="components">
              <el-collapse class="collapse">
                <el-collapse-item
                  :title="cat.title"
                  :name="cat.title"
                  v-for="cat in categories"
                  :key="cat.key"
                >
                  <div class="palette-list">
                    <div
                      class="palette-item"
                      v-for="item in cat.items"
                      :key="item.type"
                      draggable="true"
                      @dragstart="onDrag($event, item)"
                    >
                      {{ item.label }}
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="模板" name="templates">
              <div class="templates-container">
                <div
                  class="template-card"
                  v-for="template in pageTemplates"
                  :key="template.id"
                  @click="handleLoadTemplate(template)"
                >
                  <div class="template-icon">
                    <el-icon><DocumentCopy /></el-icon>
                  </div>
                  <div class="template-info">
                    <h4 class="template-name">{{ template.name }}</h4>
                    <p class="template-desc">{{ template.description }}</p>
                  </div>
                  <el-tag :type="getCategoryTagType(template.category)" size="small">
                    {{ getCategoryLabel(template.category) }}
                  </el-tag>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
    </div>

    <!-- 关系图谱区域（包含拖拽条和关系图） -->
    <div class="relation-wrapper">
      <!-- 拖拽分隔条 -->
      <div class="resizer-horizontal" @mousedown="startResize">
        <div class="resizer-line"></div>
      </div>

      <!-- 关系图部分 -->
      <div class="relation-graph-section" :style="relationStyle">
        <div class="section-header">
          <span class="section-title">组件关系图</span>
          <el-button
            :icon="graphVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            size="small"
            text
            @click="toggleGraph"
          >
            {{ graphVisible ? '收起' : '展开' }}
          </el-button>
        </div>
        <div v-if="graphVisible" class="graph-content">
          <div class="graph-controls">
            <el-button-group>
              <el-button
                :type="graphType === 'all' ? 'primary' : ''"
                size="small"
                @click="graphType = 'all'"
              >
                全部
              </el-button>
              <el-button
                :type="graphType === 'hierarchy' ? 'primary' : ''"
                size="small"
                @click="graphType = 'hierarchy'"
              >
                层级
              </el-button>
              <el-button
                :type="graphType === 'events' ? 'primary' : ''"
                size="small"
                @click="graphType = 'events'"
              >
                事件
              </el-button>
              <el-button
                :type="graphType === 'data' ? 'primary' : ''"
                size="small"
                @click="graphType = 'data'"
              >
                数据
              </el-button>
            </el-button-group>
          </div>
          <div ref="graphContainer" class="graph-container"></div>
          <div class="graph-legend">
            <div class="legend-item">
              <span class="legend-dot" style="background: #5470c6"></span>
              <span>普通</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #91cc75"></span>
              <span>容器</span>
            </div>
            <div class="legend-item">
              <span class="legend-line" style="background: #409eff"></span>
              <span>父子</span>
            </div>
            <div class="legend-item">
              <span class="legend-line" style="background: #67c23a"></span>
              <span>事件</span>
            </div>
            <div class="legend-item">
              <span class="legend-line" style="background: #e6a23c"></span>
              <span>数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { templates, type PageTemplate } from '@/templates'
import { ElMessageBox, ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

type Category = {
  key: string
  title: string
  items: Item[]
}
type Item = {
  type: string
  label: string
  tags?: string[]
  width?: number
  height?: number
}

// 组件 store
const componentStore = useComponent()
const { componentStore: components } = storeToRefs(componentStore)

// 布局状态
const componentLibHeight = ref(400)
const graphVisible = ref(true)
// 折叠时的最小高度（保留 header）
const collapsedGraphHeight = 50
// 展开时的默认高度
const expandedGraphHeight = ref(300)

// 常量：最小高度与分隔条高度（module level so can be reused）
const MIN_COMPONENT_HEIGHT = 200
const MIN_GRAPH_HEIGHT = 150
const RESIZER_HEIGHT = 8

// 根据容器高度调整两个区块的初始/切换后高度，确保两者之和填满可用高度
function adjustHeightsToContainer() {
  const container = document.querySelector('.componentBar-container') as HTMLElement
  if (!container) return

  const total = container.clientHeight - RESIZER_HEIGHT

  if (graphVisible.value) {
    // 如果当前和不足以填满容器，则把图谱高度扩展以填满剩余空间
    const currentSum = componentLibHeight.value + expandedGraphHeight.value
    if (currentSum < total) {
      // 尽量让 expandedGraphHeight 吸收多余空间
      expandedGraphHeight.value = Math.max(
        MIN_GRAPH_HEIGHT,
        expandedGraphHeight.value + (total - currentSum),
      )
    } else if (currentSum > total) {
      // 如果当前和超过可用高度，优先压缩图谱到最小，再压缩组件库
      let remaining = total
      const graphAlloc = Math.max(
        MIN_GRAPH_HEIGHT,
        Math.min(expandedGraphHeight.value, remaining - MIN_COMPONENT_HEIGHT),
      )
      remaining -= graphAlloc
      const compAlloc = Math.max(MIN_COMPONENT_HEIGHT, remaining)
      expandedGraphHeight.value = graphAlloc
      componentLibHeight.value = compAlloc
    }
  } else {
    // 折叠时：组件库占满除折叠头部外的所有空间
    componentLibHeight.value = Math.max(MIN_COMPONENT_HEIGHT, total - collapsedGraphHeight)
  }
}

// 窗口尺寸变化统一处理：调整图表并修正分区高度
function onWindowResize() {
  if (chartInstance) chartInstance.resize()
  adjustHeightsToContainer()
}
// 关系图容器的动态样式：折叠时只显示header，展开时使用设定高度
const relationStyle = computed(() => {
  if (!graphVisible.value) {
    return {
      height: collapsedGraphHeight + 'px',
      flex: '0 0 auto',
    }
  }
  return {
    height: expandedGraphHeight.value + 'px',
    flex: '0 0 auto',
  }
})
const isResizing = ref(false)

// 关系图
const graphContainer = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
const graphType = ref<'all' | 'hierarchy' | 'events' | 'data'>('all')

// 模板相关
const activeTab = ref<'components' | 'templates'>('components')
const pageTemplates = ref<PageTemplate[]>(templates)

// 加载模板
const handleLoadTemplate = async (template: PageTemplate) => {
  try {
    await ElMessageBox.confirm(
      `确定要加载"${template.name}"模板吗？这将清空当前画布内容。`,
      '加载模板',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
    componentStore.loadTemplate(template.components)
    ElMessage.success(`已加载模板: ${template.name}`)
  } catch {
    // 用户取消
  }
}

// 获取分类标签类型
const getCategoryTagType = (category: PageTemplate['category']) => {
  const typeMap = {
    dashboard: 'success',
    gis: 'primary',
    chart: 'warning',
    form: 'info',
    other: '',
  }
  return typeMap[category] || ''
}

// 获取分类标签文本
const getCategoryLabel = (category: PageTemplate['category']) => {
  const labelMap = {
    dashboard: '大屏',
    gis: '地图',
    chart: '图表',
    form: '表单',
    other: '其他',
  }
  return labelMap[category] || '其他'
}

// 组件类型
const categories = ref<Category[]>([
  {
    key: 'map',
    title: '地图图层',
    items: [
      {
        type: 'base',
        label: '底图',
        tags: ['tile', 'basemap'],
        width: 300,
        height: 200,
      },
      {
        type: 'tile',
        label: '瓦片图层',
        tags: ['leaflet', 'tile'],
        width: 300,
        height: 200,
      },
      {
        type: 'vector',
        label: '矢量图层',
        tags: ['point', 'line', 'polygon'],
        width: 300,
        height: 200,
      },
      {
        type: 'geojson',
        label: 'GeoJSON',
        tags: ['geojson'],
        width: 300,
        height: 200,
      },
      {
        type: 'marker',
        label: '标记点',
        tags: ['marker'],
        width: 120,
        height: 120,
      },
      {
        type: 'cluster',
        label: '聚合',
        tags: ['cluster'],
        width: 300,
        height: 200,
      },
      {
        type: 'heat',
        label: '热力图',
        tags: ['heat'],
        width: 300,
        height: 200,
      },
      {
        type: 'legend',
        label: '图例',
        tags: ['legend'],
        width: 160,
        height: 120,
      },
      {
        type: 'scale',
        label: '比例尺',
        tags: ['scale'],
        width: 120,
        height: 50,
      },
      {
        type: 'layers',
        label: '图层控制',
        tags: ['layers'],
        width: 160,
        height: 160,
      },
    ],
  },
  {
    key: 'chart',
    title: '图表',
    items: [
      {
        type: 'lineChart',
        label: '折线图',
        tags: ['echarts', 'line'],
        width: 320,
        height: 200,
      },
      {
        type: 'barChart',
        label: '柱状图',
        tags: ['echarts', 'bar'],
        width: 320,
        height: 200,
      },
      {
        type: 'stackedBarChart',
        label: '堆叠柱状',
        tags: ['echarts', 'bar', 'stack'],
        width: 360,
        height: 220,
      },
      {
        type: 'pieChart',
        label: '饼图',
        tags: ['echarts', 'pie'],
        width: 280,
        height: 280,
      },
      {
        type: 'doughnutChart',
        label: '环形图',
        tags: ['echarts', 'pie', 'donut'],
        width: 280,
        height: 280,
      },
      {
        type: 'scatterChart',
        label: '散点图',
        tags: ['echarts', 'scatter'],
        width: 320,
        height: 240,
      },
      {
        type: 'radarChart',
        label: '雷达图',
        tags: ['echarts', 'radar'],
        width: 300,
        height: 300,
      },
      {
        type: 'gaugeChart',
        label: '仪表盘',
        tags: ['echarts', 'gauge'],
        width: 260,
        height: 260,
      },
      {
        type: 'funnelChart',
        label: '漏斗图',
        tags: ['echarts', 'funnel'],
        width: 300,
        height: 240,
      },
      {
        type: 'sankeyChart',
        label: '桑基图',
        tags: ['echarts', 'sankey'],
        width: 360,
        height: 240,
      },
    ],
  },
  {
    key: 'kpi',
    title: 'KPI 与信息',
    items: [
      {
        type: 'stat',
        label: '指标卡',
        tags: ['kpi'],
        width: 160,
        height: 100,
      },
      {
        type: 'Text',
        label: '文本',
        tags: ['title', 'desc'],
        width: 120,
        height: 50,
      },
      {
        type: 'countUp',
        label: '数字跳动',
        tags: ['kpi', 'number'],
        width: 160,
        height: 80,
      },
      {
        type: 'progress',
        label: '进度条',
        tags: ['kpi', 'progress'],
        width: 200,
        height: 40,
      },
      {
        type: 'badge',
        label: '徽章',
        tags: ['kpi', 'badge'],
        width: 100,
        height: 40,
      },
      {
        type: 'box',
        label: '占位盒',
        tags: ['layout'],
        width: 120,
        height: 80,
      },
    ],
  },
  {
    key: 'data',
    title: '数据与列表',
    items: [
      {
        type: 'table',
        label: '表格',
        tags: ['data', 'table'],
        width: 400,
        height: 240,
      },
      {
        type: 'list',
        label: '列表',
        tags: ['data', 'list'],
        width: 240,
        height: 300,
      },
      {
        type: 'timeline',
        label: '时间轴',
        tags: ['data', 'timeline'],
        width: 320,
        height: 200,
      },
      {
        type: 'cardGrid',
        label: '卡片网格',
        tags: ['data', 'card'],
        width: 360,
        height: 240,
      },
      {
        type: 'pivot',
        label: '透视分析',
        tags: ['data', 'pivot'],
        width: 420,
        height: 260,
      },
    ],
  },
  {
    key: 'controls',
    title: '交互控件',
    items: [
      {
        type: 'select',
        label: '下拉选择',
        tags: ['filter', 'select'],
        width: 160,
        height: 40,
      },
      {
        type: 'multiSelect',
        label: '多选选择',
        tags: ['filter', 'select', 'multi'],
        width: 180,
        height: 50,
      },
      {
        type: 'dateRange',
        label: '日期范围',
        tags: ['filter', 'date'],
        width: 220,
        height: 50,
      },
      {
        type: 'searchBox',
        label: '搜索框',
        tags: ['filter', 'search'],
        width: 200,
        height: 40,
      },
      {
        type: 'slider',
        label: '滑块',
        tags: ['filter', 'slider'],
        width: 200,
        height: 50,
      },
      {
        type: 'switch',
        label: '开关',
        tags: ['filter', 'switch'],
        width: 100,
        height: 40,
      },
      {
        type: 'checkboxGroup',
        label: '复选组',
        tags: ['filter', 'checkbox'],
        width: 200,
        height: 80,
      },
      {
        type: 'buttonGroup',
        label: '按钮组',
        tags: ['filter', 'button'],
        width: 220,
        height: 60,
      },
    ],
  },
  {
    key: 'layout',
    title: '布局容器',
    items: [
      {
        type: 'row',
        label: '行',
        tags: ['layout'],
        width: 400,
        height: 120,
      },
      {
        type: 'col',
        label: '列',
        tags: ['layout'],
        width: 160,
        height: 400,
      },
      {
        type: 'tabs',
        label: '选项卡',
        tags: ['layout', 'tabs'],
        width: 400,
        height: 300,
      },
      {
        type: 'grid',
        label: '网格',
        tags: ['layout', 'grid'],
        width: 400,
        height: 300,
      },
      {
        type: 'panel',
        label: '面板',
        tags: ['layout', 'panel'],
        width: 300,
        height: 220,
      },
      {
        type: 'modal',
        label: '弹窗',
        tags: ['layout', 'modal'],
        width: 360,
        height: 240,
      },
      {
        type: 'flex',
        label: 'Flex容器',
        tags: ['layout', 'flex'],
        width: 400,
        height: 240,
      },
    ],
  },
  {
    key: 'media',
    title: '媒体',
    items: [
      {
        type: 'image',
        label: '图片',
        tags: ['media', 'image'],
        width: 240,
        height: 180,
      },
      {
        type: 'video',
        label: '视频',
        tags: ['media', 'video'],
        width: 320,
        height: 200,
      },
    ],
  },
  {
    key: 'content',
    title: '内容扩展',
    items: [
      {
        type: 'markdown',
        label: 'Markdown',
        tags: ['content', 'markdown'],
        width: 360,
        height: 260,
      },
      {
        type: 'html',
        label: '自定义HTML',
        tags: ['content', 'html'],
        width: 360,
        height: 260,
      },
      {
        type: 'iframe',
        label: '外部Iframe',
        tags: ['content', 'iframe'],
        width: 400,
        height: 300,
      },
    ],
  },
  {
    key: 'advanced',
    title: '高级功能',
    items: [
      {
        type: 'scripting',
        label: '脚本组件',
        tags: ['advanced', 'script'],
        width: 320,
        height: 180,
      },
      {
        type: 'trigger',
        label: '触发器',
        tags: ['advanced', 'event'],
        width: 160,
        height: 80,
      },
      {
        type: 'state',
        label: '状态变量',
        tags: ['advanced', 'state'],
        width: 160,
        height: 80,
      },
    ],
  },
])

function onDrag(e: DragEvent, item: Item) {
  e.dataTransfer?.setData('application/x-component', JSON.stringify(item))
  e.dataTransfer?.setData('text/plain', item.type)
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy'
  }
}

// 拖拽调整高度
function startResize(e: MouseEvent) {
  // 只有在关系图展开时才允许拖拽
  if (!graphVisible.value) return

  isResizing.value = true
  const startY = e.clientY
  const startComponentHeight = componentLibHeight.value
  const startGraphHeight = expandedGraphHeight.value

  // 获取容器总高度
  const container = document.querySelector('.componentBar-container') as HTMLElement
  if (!container) return

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!isResizing.value || !container) return

    const deltaY = moveEvent.clientY - startY
    const newComponentHeight = startComponentHeight + deltaY
    const newGraphHeight = startGraphHeight - deltaY

    // 获取容器总高度，减去拖拽条高度
    const totalHeight = container.clientHeight
    const maxTotalHeight = totalHeight - RESIZER_HEIGHT

    // 确保两个高度都满足最小值，且总和不超过容器高度
    if (
      newComponentHeight >= MIN_COMPONENT_HEIGHT &&
      newGraphHeight >= MIN_GRAPH_HEIGHT &&
      newComponentHeight + newGraphHeight <= maxTotalHeight
    ) {
      componentLibHeight.value = newComponentHeight
      expandedGraphHeight.value = newGraphHeight

      // 调整图表大小
      if (chartInstance) {
        nextTick(() => {
          chartInstance?.resize()
        })
      }
    } else {
      // 超出约束则不应用
    }
  }

  const onMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 切换关系图显示
function toggleGraph() {
  graphVisible.value = !graphVisible.value

  nextTick(() => {
    if (graphVisible.value) {
      // 展开时，如果图表实例不存在则重新初始化
      if (!chartInstance && graphContainer.value) {
        chartInstance = echarts.init(graphContainer.value)
        updateGraph()
      } else {
        chartInstance?.resize()
      }
    }
    // 切换后调整高度以填充容器（展开或折叠都会影响分配）
    adjustHeightsToContainer()
  })
}

// 初始化关系图
function initChart() {
  if (!graphContainer.value || chartInstance) return

  chartInstance = echarts.init(graphContainer.value)
  updateGraph()
}

// 构建图数据
interface GraphNode {
  id: string
  name: string
  type: string
  symbolSize: number
  itemStyle: { color: string }
}

interface GraphLink {
  source: string
  target: string
  relationName: string
  lineStyle: { color: string; width: number }
}

function buildGraphData() {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []

  // 构建节点
  components.value.forEach((comp) => {
    const hasChildren = comp.children && comp.children.length > 0
    const label = comp.name || `${comp.type} #${comp.id.slice(0, 6)}`
    nodes.push({
      id: comp.id,
      name: label,
      type: comp.type,
      symbolSize: hasChildren ? 40 : 30,
      itemStyle: {
        color: hasChildren ? '#91cc75' : '#5470c6',
      },
    })
  })

  // 根据类型过滤关系
  if (graphType.value === 'all' || graphType.value === 'hierarchy') {
    // 父子关系
    components.value.forEach((comp) => {
      if (comp.groupId) {
        links.push({
          source: comp.groupId,
          target: comp.id,
          relationName: '父子',
          lineStyle: { color: '#409eff', width: 2 },
        })
      }
    })
  }

  // TODO: 添加事件和数据联动关系

  return { nodes, links }
}

// 更新图表
function updateGraph() {
  if (!chartInstance) return

  const { nodes, links } = buildGraphData()

  const option: echarts.EChartsOption = {
    tooltip: {
      formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
        if (Array.isArray(params)) return ''
        const data = params.data as { name?: string; type?: string; relationName?: string }
        if (params.dataType === 'node' && data) {
          return `${data.name}<br/>类型: ${data.type}`
        } else if (params.dataType === 'edge' && data) {
          return data.relationName || ''
        }
        return ''
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        roam: true,
        draggable: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 11,
        },
        labelLayout: {
          hideOverlap: true,
        },
        scaleLimit: {
          min: 0.4,
          max: 2,
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
          },
        },
        force: {
          repulsion: 120,
          edgeLength: [80, 150],
          layoutAnimation: true,
        },
      },
    ],
  }

  chartInstance.setOption(option)

  // 点击节点选中组件
  chartInstance.off('click')
  chartInstance.on('click', (params: echarts.ECElementEvent) => {
    if (params.dataType === 'node' && params.data) {
      const nodeData = params.data as { id: string }
      componentStore.selectedId(nodeData.id)
    }
  })
}

// 监听 components 变化
watch(
  () => components.value,
  () => {
    if (chartInstance && graphVisible.value) {
      updateGraph()
    }
  },
  { deep: true },
)

// 监听图表类型切换
watch(graphType, () => {
  if (chartInstance) {
    updateGraph()
  }
})

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart()
    // 初始时根据容器大小调整两个区域的高度
    adjustHeightsToContainer()
    // 注册统一的窗口 resize 处理
    window.addEventListener('resize', onWindowResize)
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped>
.componentBar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.componentBar-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.relation-wrapper {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  height: fit-content;
}

.relation-wrapper {
  margin-top: auto;
}

.relation-graph-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  transition: height 0.3s ease;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.section-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.resizer-horizontal {
  height: 8px;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  position: relative;
}

.resizer-horizontal:hover {
  background: var(--el-color-primary-light-7);
}

.resizer-line {
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: var(--el-border-color-darker);
}

.resizer-horizontal:hover .resizer-line {
  background: var(--el-color-primary);
}

.componentBar {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

:deep(.el-scrollbar) {
  height: 100%;
  width: 100%;
}

.scroll-inner {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px 12px;
}

.collapse {
  width: 90%;
  max-width: 520px;
}

.palette-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 4px;
}

.palette-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-fill-color-blank);
  cursor: grab;
  user-select: none;
  transition:
    background 0.15s,
    box-shadow 0.15s,
    border-color 0.15s;
}

.palette-item:hover {
  background: var(--el-fill-color-lighter);
  box-shadow: var(--el-box-shadow-light);
  border-color: var(--el-color-primary-light-5);
}

/* 模板选项卡样式 */
.component-tabs {
  width: 100%;
}

:deep(.el-tabs__content) {
  padding: 0;
}

.templates-container {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-fill-color-blank);
  cursor: pointer;
  transition:
    all 0.2s,
    box-shadow 0.2s;
}

.template-card:hover {
  background: var(--el-fill-color-light);
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.template-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 24px;
}

.template-info {
  flex: 1;
}

.template-name {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.template-desc {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.template-card .el-tag {
  position: absolute;
  top: 16px;
  right: 16px;
}

/* 关系图样式 */
.graph-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 8px;
}

.graph-controls {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
}

.graph-container {
  flex: 1;
  min-height: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--el-bg-color);
}

.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-line {
  width: 16px;
  height: 2px;
}

/* Dark theme */
:deep(.theme-dark) .componentBar-container {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

:deep(.theme-dark) .palette-item {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.theme-dark) .palette-item:hover {
  background: var(--bg-primary);
  box-shadow: 0 4px 12px var(--shadow-light);
}

:deep(.theme-dark) .section-header {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.theme-dark) .graph-container {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

:deep(.theme-dark) .graph-legend {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

:deep(.theme-dark) .template-card {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

:deep(.theme-dark) .template-card:hover {
  background: var(--bg-primary);
  border-color: var(--text-tertiary);
}

:deep(.theme-dark) .template-name {
  color: var(--text-primary);
}

:deep(.theme-dark) .template-desc {
  color: var(--text-secondary);
}

:deep(.theme-dark) .template-icon {
  background: var(--bg-primary);
}

:deep(.theme-dark) .resizer-horizontal {
  background: var(--bg-tertiary);
}

:deep(.theme-dark) .resizer-line {
  background: var(--border-color);
}
</style>
