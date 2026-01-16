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
      width="75%"
      top="8vh"
      class="graph-modal"
      :append-to-body="true"
      @opened="initChart"
    >
      <div class="graph-toolbar">
        <el-radio-group v-model="graphType" size="small" @change="updateGraph">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="hierarchy">层级</el-radio-button>
          <el-radio-button label="data">数据联动</el-radio-button>
          <el-radio-button label="events">事件</el-radio-button>
        </el-radio-group>
        <div class="legend">
          <span class="legend-item"><i class="dot blue"></i> 组件</span>
          <span class="legend-item"><i class="dot green"></i> 容器</span>
          <span class="legend-item"><i class="dot orange"></i> 数据联动</span>
          <span class="legend-item"><i class="dot red"></i> 事件</span>
          <span class="legend-item"><i class="line solid"></i> 父子</span>
          <span class="legend-item"><i class="line dashed"></i> 数据流</span>
          <span class="legend-item"><i class="line dotted"></i> 事件触发</span>
        </div>
      </div>

      <div ref="graphContainer" class="graph-container"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import { useComponent } from '@/stores/component'
import { templates } from '@/templates'
import type { PageTemplate } from '@lowcode/core/types/page'
import type { MaterialMeta, NodeSchema } from '@lowcode/core/types'
import { ElMessageBox, ElMessage } from 'element-plus'
import { DocumentCopy, Connection } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { materialList, getMaterialsByCategory, extractDefaultProps } from '@lowcode/materials'

// --- 类型定义 ---
type Category = {
  key: string
  title: string
  items: Item[]
}

type Item = {
  componentName: string
  label: string
  meta: MaterialMeta
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
  lineStyle: { color: string; width: number; type?: 'solid' | 'dashed' | 'dotted' }
}

// --- 状态管理 ---
const activeTab = ref('components')
const pageTemplates = ref<PageTemplate[]>(templates)
const componentStore = useComponent()
const { componentStore: components } = storeToRefs(componentStore)

// --- 从物料包生成组件分类 ---
const categories = computed<Category[]>(() => {
  const grouped = getMaterialsByCategory()
  const result: Category[] = []

  // 定义分类顺序和默认尺寸
  const categoryConfig: Record<
    string,
    { order: number; defaultWidth: number; defaultHeight: number }
  > = {
    图表: { order: 1, defaultWidth: 320, defaultHeight: 200 },
    KPI: { order: 2, defaultWidth: 160, defaultHeight: 100 },
    数据展示: { order: 3, defaultWidth: 360, defaultHeight: 240 },
    基础控件: { order: 4, defaultWidth: 180, defaultHeight: 50 },
    布局容器: { order: 5, defaultWidth: 400, defaultHeight: 240 },
    内容: { order: 6, defaultWidth: 300, defaultHeight: 200 },
    媒体: { order: 7, defaultWidth: 300, defaultHeight: 200 },
    高级: { order: 8, defaultWidth: 300, defaultHeight: 150 },
  }

  Object.entries(grouped).forEach(([categoryName, materials]) => {
    const config = categoryConfig[categoryName] || {
      order: 99,
      defaultWidth: 300,
      defaultHeight: 200,
    }

    const items: Item[] = materials.map((meta) => ({
      componentName: meta.componentName,
      label: meta.title,
      meta: meta,
      width: config.defaultWidth,
      height: config.defaultHeight,
    }))

    result.push({
      key: categoryName.toLowerCase().replace(/\s+/g, '-'),
      title: categoryName,
      items,
    })
  })

  // 按配置的顺序排序
  result.sort((a, b) => {
    const orderA = categoryConfig[a.title]?.order ?? 99
    const orderB = categoryConfig[b.title]?.order ?? 99
    return orderA - orderB
  })

  return result
})

// 默认展开的分类
const activeNames = computed(() => categories.value.slice(0, 3).map((cat) => cat.title))

// --- 拖拽与模板 ---
function onDrag(e: DragEvent, item: Item) {
  // 构建符合 NodeSchema 结构的数据
  const nodeData: Partial<NodeSchema> = {
    componentName: item.componentName,
    props: extractDefaultProps(item.meta.props),
    style: {
      width: item.width || 300,
      height: item.height || 200,
    },
    children: [],
  }

  e.dataTransfer?.setData('application/x-component', JSON.stringify(nodeData))
  e.dataTransfer?.setData('text/plain', item.componentName)
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
const graphType = ref<'all' | 'hierarchy' | 'data' | 'events'>('all')
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
  window.addEventListener('resize', () => chartInstance?.resize())
}

function buildGraphData() {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []

  components.value.forEach((comp) => {
    const hasChildren = comp.children && comp.children.length > 0
    const hasBindings = comp.dataBindings && comp.dataBindings.length > 0
    const hasEvents = comp.events && (comp.events.click?.length || comp.events.hover?.length)
    const label = comp.name || comp.type

    // 根据组件特性设置颜色
    let color = '#4285F4' // 默认蓝色
    if (hasChildren)
      color = '#34A853' // 容器绿色
    else if (hasBindings)
      color = '#FBBC05' // 有数据联动橙色
    else if (hasEvents) color = '#EA4335' // 有事件红色

    nodes.push({
      id: comp.id,
      name: label,
      type: comp.type,
      symbolSize: hasChildren ? 45 : hasBindings || hasEvents ? 38 : 30,
      itemStyle: { color },
    })
  })

  // 父子关系（层级）
  if (graphType.value === 'all' || graphType.value === 'hierarchy') {
    components.value.forEach((comp) => {
      if (comp.groupId) {
        links.push({
          source: comp.groupId,
          target: comp.id,
          relationName: '父子',
          lineStyle: { color: '#9AA0A6', width: 2 },
        })
      }
    })
  }

  // 数据联动关系
  if (graphType.value === 'all' || graphType.value === 'data') {
    components.value.forEach((comp) => {
      if (comp.dataBindings) {
        comp.dataBindings.forEach((binding) => {
          if (binding.sourceId && binding.sourceId !== comp.id) {
            links.push({
              source: binding.sourceId,
              target: comp.id,
              relationName: '数据',
              lineStyle: { color: '#FBBC05', width: 2, type: 'dashed' as const },
            })
          }
        })
      }
    })
  }

  // 事件关系
  if (graphType.value === 'all' || graphType.value === 'events') {
    components.value.forEach((comp) => {
      const allActions = [
        ...(comp.events?.click || []),
        ...(comp.events?.hover || []),
        ...(comp.events?.doubleClick || []),
      ]
      allActions.forEach((action) => {
        if (action.targetId && action.targetId !== comp.id) {
          links.push({
            source: comp.id,
            target: action.targetId,
            relationName: '事件',
            lineStyle: { color: '#EA4335', width: 2, type: 'dotted' as const },
          })
        }
      })
    })
  }

  return { nodes, links }
}

function updateGraph() {
  if (!chartInstance) return
  const { nodes, links } = buildGraphData()

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const p = params as {
          dataType?: string
          data: { relationName?: string; name?: string; type?: string }
        }
        if (p.dataType === 'edge') {
          return `${p.data.relationName}关系`
        }
        return `${p.data.name} (${p.data.type})`
      },
    },
    legend: {
      data: ['组件', '容器', '数据联动', '事件'],
      bottom: 10,
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        roam: true,
        label: { show: true, position: 'bottom', fontSize: 11, color: '#333' },
        force: { repulsion: 250, edgeLength: 100, gravity: 0.08 },
        lineStyle: { curveness: 0.3, opacity: 0.8 },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
        },
      },
    ],
  }
  chartInstance.setOption(option, true)
}
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
  flex-wrap: wrap;
  gap: 10px;
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
.dot.orange {
  background: #fbbc05;
}
.dot.red {
  background: #ea4335;
}
.line {
  width: 20px;
  height: 2px;
  display: inline-block;
}
.line.solid {
  background: #9aa0a6;
}
.line.dashed {
  background: repeating-linear-gradient(
    90deg,
    #fbbc05 0,
    #fbbc05 4px,
    transparent 4px,
    transparent 8px
  );
}
.line.dotted {
  background: repeating-linear-gradient(
    90deg,
    #ea4335 0,
    #ea4335 2px,
    transparent 2px,
    transparent 6px
  );
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
