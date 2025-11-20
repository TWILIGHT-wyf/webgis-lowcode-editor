<template>
  <el-scrollbar class="componentBar">
    <div class="scroll-inner">
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
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

// 组件类型
const categories = ref<Category[]>([
  {
    key: 'map',
    title: '地图图层',
    items: [
      {
        type: 'map.base',
        label: '底图',
        tags: ['tile', 'basemap'],
        width: 300,
        height: 200,
      },
      {
        type: 'map.tile',
        label: '瓦片图层',
        tags: ['leaflet', 'tile'],
        width: 300,
        height: 200,
      },
      {
        type: 'map.vector',
        label: '矢量图层',
        tags: ['point', 'line', 'polygon'],
        width: 300,
        height: 200,
      },
      {
        type: 'map.geojson',
        label: 'GeoJSON',
        tags: ['geojson'],
        width: 300,
        height: 200,
      },
      {
        type: 'map.marker',
        label: '标记点',
        tags: ['marker'],
        width: 120,
        height: 120,
      },
      {
        type: 'map.cluster',
        label: '聚合',
        tags: ['cluster'],
        width: 300,
        height: 200,
      },
      {
        type: 'map.heat',
        label: '热力图',
        tags: ['heat'],
        width: 300,
        height: 200,
      },
      {
        type: 'map.control.legend',
        label: '图例',
        tags: ['legend'],
        width: 160,
        height: 120,
      },
      {
        type: 'map.control.scale',
        label: '比例尺',
        tags: ['scale'],
        width: 120,
        height: 50,
      },
      {
        type: 'map.control.layers',
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
        type: 'numberTicker',
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
        type: 'card',
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
        type: 'search',
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
</script>

<style scoped>
.componentBar {
  width: 100%;
  height: 100%;
}

:deep(.el-scrollbar) {
  height: 100%;
  width: 100%;
}

.scroll-inner {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px 0; /* 适度内边距避免贴边 */
}

.collapse {
  width: 90%;
  max-width: 520px; /* 防止过宽 */
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

/* Dark theme */
:deep(.theme-dark) .componentBar {
  background: #0f1720;
  color: #e6eef8;
}
:deep(.theme-dark) .palette-item {
  background: #111319;
  border-color: #2b2f36;
  color: #d8dbe0;
}
:deep(.theme-dark) .palette-item:hover {
  background: #16202a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}
</style>
