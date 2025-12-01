<template>
  <div class="component-bar-root">
    <div class="panel-header">
      <span class="title">组件库</span>
      <el-tooltip content="查看组件关系图" placement="bottom">
        <el-button link class="icon-btn" @click="openGraphModal">
          <el-icon :size="18"><Connection /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-scrollbar class="panel-body">
      <el-tabs v-model="activeTab" class="modern-tabs" stretch>
        <el-tab-pane label="基础组件" name="components">
          <div class="component-list">
            <el-collapse v-model="activeNames" class="clean-collapse">
              <el-collapse-item
                v-for="cat in categories"
                :key="cat.key"
                :title="cat.title"
                :name="cat.title"
              >
                <div class="grid-layout">
                  <div
                    class="grid-item"
                    v-for="item in cat.items"
                    :key="item.type"
                    draggable="true"
                    @dragstart="onDrag($event, item)"
                  >
                    <div class="item-icon">
                      <component v-if="item.icon" :is="item.icon" />
                      <span v-else class="text-icon">{{ item.label[0] }}</span>
                    </div>
                    <span class="item-label">{{ item.label }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <el-tab-pane label="页面模板" name="templates">
          <div class="templates-list">
            <div
              v-for="tpl in pageTemplates"
              :key="tpl.id"
              class="template-item"
              @click="handleLoadTemplate(tpl)"
            >
              <div class="tpl-preview">
                <el-icon :size="20"><DocumentCopy /></el-icon>
              </div>
              <div class="tpl-info">
                <div class="tpl-name">{{ tpl.name }}</div>
                <div class="tpl-desc">{{ tpl.description }}</div>
              </div>
              <el-tag
                size="small"
                effect="plain"
                round
                class="tpl-tag"
                :type="getCategoryTagType(tpl.category)"
              >
                {{ getCategoryLabel(tpl.category) }}
              </el-tag>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>

    <el-dialog
      v-model="graphVisible"
      title="组件关系图谱"
      width="70%"
      top="10vh"
      class="graph-modal"
      :append-to-body="true"
      @opened="initChart"
    >
      <div class="graph-toolbar">
        <el-radio-group v-model="graphType" size="small" @change="updateGraph">
          <el-radio-button label="all">全部关系</el-radio-button>
          <el-radio-button label="hierarchy">仅层级</el-radio-button>
          <el-radio-button label="data">数据链路</el-radio-button>
        </el-radio-group>
        <div class="legend">
          <span class="legend-item"><i class="dot blue"></i> 组件</span>
          <span class="legend-item"><i class="dot green"></i> 容器</span>
          <span class="legend-item"><i class="line"></i> 父子关系</span>
        </div>
      </div>

      <div ref="graphContainer" class="graph-container"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import { useComponent } from '@/stores/component'
import { templates } from '@/templates'
import type { PageTemplate } from '@/types/page'
import { ElMessageBox, ElMessage } from 'element-plus'
import { DocumentCopy, Connection } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'

// --- 类型定义 ---
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
  icon?: Component
}

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

// --- 状态管理 ---
const activeTab = ref('components')
const activeNames = ref(['地图图层', '图表'])
const pageTemplates = ref<PageTemplate[]>(templates)
const componentStore = useComponent()
const { componentStore: components } = storeToRefs(componentStore)

// --- 拖拽与模板 ---
function onDrag(e: DragEvent, item: Item) {
  e.dataTransfer?.setData('application/x-component', JSON.stringify(item))
  e.dataTransfer?.setData('text/plain', item.type)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
}

const handleLoadTemplate = async (template: PageTemplate) => {
  try {
    await ElMessageBox.confirm(`确定要加载"${template.name}"吗？当前画布将被清空。`, '加载模板', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    componentStore.loadTemplate(template.components)
    ElMessage.success(`已加载模板: ${template.name}`)
  } catch {}
}

const getCategoryTagType = (category: PageTemplate['category']) => {
  const map: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger'> = {
    dashboard: 'success',
    gis: 'primary',
    chart: 'warning',
    form: 'info',
  }
  return map[category] || 'info'
}
const getCategoryLabel = (category: PageTemplate['category']) => {
  const map: Record<string, string> = {
    dashboard: '大屏',
    gis: '地图',
    chart: '图表',
    form: '表单',
  }
  return map[category] || '其他'
}

// --- 关系图谱逻辑 (移至弹窗) ---
const graphVisible = ref(false)
const graphContainer = ref<HTMLElement>()
const graphType = ref<'all' | 'hierarchy' | 'data'>('all')
let chartInstance: echarts.ECharts | null = null

function openGraphModal() {
  graphVisible.value = true
}

function initChart() {
  if (!graphContainer.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(graphContainer.value)
  }
  updateGraph()
  // 窗口大小改变时重绘
  window.addEventListener('resize', () => chartInstance?.resize())
}

function buildGraphData() {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []

  components.value.forEach((comp) => {
    const hasChildren = comp.children && comp.children.length > 0
    const label = comp.name || comp.type
    nodes.push({
      id: comp.id,
      name: label,
      type: comp.type,
      symbolSize: hasChildren ? 45 : 30,
      itemStyle: { color: hasChildren ? '#34A853' : '#4285F4' }, // Google Green & Blue
    })
  })

  if (graphType.value !== 'data') {
    components.value.forEach((comp) => {
      if (comp.groupId) {
        links.push({
          source: comp.groupId,
          target: comp.id,
          relationName: 'Parent',
          lineStyle: { color: '#9AA0A6', width: 2 },
        })
      }
    })
  }

  return { nodes, links }
}

function updateGraph() {
  if (!chartInstance) return
  const { nodes, links } = buildGraphData()

  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        roam: true,
        label: { show: true, position: 'bottom', fontSize: 11, color: '#333' },
        force: { repulsion: 200, edgeLength: 80, gravity: 0.1 },
        lineStyle: { curveness: 0.2, opacity: 0.7 },
      },
    ],
  }
  chartInstance.setOption(option)
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
        type: 'Row',
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
</script>

<style scoped>
/* 根容器：透明背景 */
.component-bar-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  overflow: hidden;
}

/* 顶部标题栏 */
.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.icon-btn {
  color: var(--text-secondary);
  transition: color 0.2s;
}
.icon-btn:hover {
  color: #4285f4;
}

/* 滚动区域 */
.panel-body {
  flex: 1;
  width: 100%;
}

/* 现代化 Tabs */
.modern-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 10px;
}
.modern-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--border-light);
}
.modern-tabs :deep(.el-tabs__item) {
  height: 48px;
  font-weight: 500;
  color: var(--text-secondary);
}
.modern-tabs :deep(.el-tabs__item.is-active) {
  color: #1967d2;
  font-weight: 600;
}

/* 现代化 Collapse */
.clean-collapse {
  border: none;
}
.clean-collapse :deep(.el-collapse-item__header) {
  border-bottom: none;
  padding-left: 20px;
  background: transparent;
  font-weight: 500;
  color: var(--text-primary);
  height: 44px;
}
.clean-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
  background: transparent;
}
.clean-collapse :deep(.el-collapse-item__content) {
  padding: 0 16px 16px;
  background: transparent;
}

/* 网格布局 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-hover);
  border-radius: 12px;
  padding: 12px;
  cursor: grab;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.grid-item:hover {
  background-color: #e8f0fe;
  border-color: #d2e3fc;
  color: #1967d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.item-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 6px;
  color: var(--text-secondary);
}

.item-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

/* 模板列表 */
.templates-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  background: var(--bg-app);
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  border-color: #1967d2;
  background-color: #e8f0fe;
}

.tpl-preview {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1967d2;
  border: 1px solid var(--border-light);
}

.tpl-info {
  flex: 1;
}

.tpl-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tpl-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.3;
}

.tpl-tag {
  position: absolute;
  top: 12px;
  right: 12px;
}

/* 关系图弹窗样式 */
.graph-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.graph-container {
  height: 60vh;
  width: 100%;
  background: var(--bg-app);
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.dot.blue {
  background: #4285f4;
}
.dot.green {
  background: #34a853;
}
.line {
  width: 20px;
  height: 2px;
  background: #9aa0a6;
  display: inline-block;
}

/* 深度选择样式覆盖 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}
:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid var(--border-light);
  padding: 20px;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
