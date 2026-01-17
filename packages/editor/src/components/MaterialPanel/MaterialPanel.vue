<template>
  <div class="material-panel">
    <div class="panel-header">
      <h3>物料面板</h3>
    </div>

    <div class="panel-body">
      <div class="material-group">
        <div class="group-title">基础组件</div>
        <div class="material-list">
          <div
            v-for="item in basicComponents"
            :key="item.name"
            class="material-item"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-name">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MaterialItem {
  name: string
  label: string
  icon: string
  props?: Record<string, any>
  style?: Record<string, any>
}

const basicComponents = ref<MaterialItem[]>([
  {
    name: 'Text',
    label: '文本',
    icon: '📝',
    props: { content: '这是一段文本' },
  },
  {
    name: 'Button',
    label: '按钮',
    icon: '🔘',
    props: { text: '点击按钮', type: 'primary' },
  },
  {
    name: 'Image',
    label: '图片',
    icon: '🖼️',
    props: { src: 'https://via.placeholder.com/150' },
  },
  {
    name: 'Container',
    label: '容器',
    icon: '📦',
    style: {
      border: '1px dashed #ccc',
      padding: '20px',
      minHeight: '100px',
    },
  },
])

const handleDragStart = (e: DragEvent, item: MaterialItem) => {
  const data = {
    componentName: item.name,
    props: item.props || {},
    style: item.style || {},
  }
  e.dataTransfer?.setData('application/x-lowcode', JSON.stringify(data))
}
</script>

<style scoped>
.material-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.material-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 12px;
  font-weight: 500;
}

.material-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.material-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s;
  background: white;
}

.material-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.item-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.item-name {
  font-size: 12px;
  color: #595959;
  text-align: center;
}
</style>
