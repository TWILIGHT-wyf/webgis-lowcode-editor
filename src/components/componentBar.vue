<template>
  <div class="componentBar">
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
                @dragstart="onDrag($event,item)"
                >
                {{ item.label}}
              </div>
            </div>
        </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Category = {
  key: string,
  title: string,
  items: Item[]
}
type Item = {
  type: string,
  label: string,
  tags?: string[],
  width?: number,
  height?: number
}

const categories = ref<Category[]>([
  {
    key: 'map',
    title: '地图图层',
    items: [
      {
        type: 'map.heat',
        label: '热力图',
        tags: ['leaflet', 'heat']
      },
      {
        type: 'map.cluster',
        label: '聚合',
        tags: ['cluster']
      },
      {
        type: 'map.vector',
        label: '矢量图层',
        tags: ['point', 'line', 'polygon']
      },
    ],
  },
  {
    key: 'chart',
    title: '图表',
    items: [
      {
        type: 'chart.line',
        label: '折线图',
        tags: ['echarts']
      },
      {
        type: 'chart.bar',
        label: '柱状图',
        tags: ['echarts']
      },
      {
        type: 'chart.pie',
        label: '饼图',
        tags: ['echarts'] },
    ],
  },
  {
    key: 'kpi',
    title: 'KPI 与信息',
    items: [
      {
        type: 'stat',
        label: '指标卡',
        tags: ['kpi'] },
      {
        type: 'Text',
        label: '文本',
        tags: ['title', 'desc'],
        width: 50,
        height: 50
      },
      {
        type: 'box',
        label: '占位盒',
        tags: ['layout']
      },
    ],
  },
  {
    key: 'data',
    title: '数据与列表',
    items: [{
      type: 'table',
      label: '表格',
      tags: ['data']
    }],
  },
  {
    key: 'layout',
    title: '布局容器',
    items: [
      {
        type: 'layout.row',
        label: '行'
      },
      {
        type: 'layout.col',
        label: '列'
      },
      {
        type: 'layout.tabs',
        label: '选项卡'
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.collapse {
  width: 90%;
  height: 100%;
  overflow: hidden;
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
  transition: background 0.15s, box-shadow 0.15s, border-color 0.15s;
}

.palette-item:hover {
  background: var(--el-fill-color-lighter);
  box-shadow: var(--el-box-shadow-light);
  border-color: var(--el-color-primary-light-5);
}


</style>
