<template>
  <div class="layers-control" :style="containerStyle">
    <div v-if="!layers || layers.length === 0" class="layers-placeholder">
      <span class="placeholder-icon">📑</span>
      <div class="placeholder-text">{{ placeholder }}</div>
    </div>
    <div v-else class="layers-content">
      <div v-if="title" class="layers-title">{{ title }}</div>
      <div class="layers-list">
        <div
          v-for="(layer, index) in layers"
          :key="index"
          class="layer-item"
          :class="{ active: layer.visible }"
          @click="handleToggle(index)"
        >
          <span class="layer-icon">{{ layer.visible ? '👁️' : '🚫' }}</span>
          <span class="layer-label">{{ layer.label }}</span>
          <span v-if="layer.type" class="layer-type" :class="getTypeClass(layer.type)">
            {{ layer.type }}
          </span>
        </div>
      </div>
      <div v-if="showOpacity" class="opacity-control">
        <div class="opacity-label">透明度</div>
        <input
          type="range"
          :value="opacity"
          min="0"
          max="100"
          @input="handleOpacityChange"
          class="opacity-slider"
        />
        <span class="opacity-value">{{ opacity }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

export interface LayerItem {
  label: string
  type?: 'base' | 'tile' | 'vector' | 'marker' | 'heat'
  visible: boolean
  id?: string
}

export interface LayersProps {
  /** 图层列表 */
  layers?: LayerItem[]
  /** 标题 */
  title?: string
  /** 占位符文本 */
  placeholder?: string
  /** 是否显示透明度控制 */
  showOpacity?: boolean
  /** 全局透明度 0-100 */
  opacity?: number
  /** 背景色 */
  backgroundColor?: string
  /** 文字颜色 */
  textColor?: string
  /** 边框颜色 */
  borderColor?: string
  /** 字体大小 */
  fontSize?: number
  /** 内边距 */
  padding?: number
}

const props = withDefaults(defineProps<LayersProps>(), {
  placeholder: '配置图层列表以显示',
  showOpacity: false,
  opacity: 100,
  backgroundColor: '#ffffff',
  textColor: '#303133',
  borderColor: '#dcdfe6',
  fontSize: 14,
  padding: 12,
})

const emit = defineEmits<{
  'layer-toggle': [layer: LayerItem, index: number]
  'opacity-change': [opacity: number]
}>()

const containerStyle = computed<CSSProperties>(() => ({
  backgroundColor: props.backgroundColor,
  color: props.textColor,
  border: `1px solid ${props.borderColor}`,
  fontSize: `${props.fontSize}px`,
  padding: `${props.padding}px`,
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  minWidth: '180px',
  maxWidth: '300px',
}))

function handleToggle(index: number) {
  if (props.layers && props.layers[index]) {
    emit('layer-toggle', props.layers[index], index)
  }
}

function handleOpacityChange(e: Event) {
  const target = e.target as HTMLInputElement
  emit('opacity-change', Number(target.value))
}

function getTypeClass(type: string): string {
  const classMap: Record<string, string> = {
    base: 'type-success',
    tile: 'type-info',
    vector: 'type-warning',
    marker: 'type-danger',
    heat: 'type-default',
  }
  return classMap[type] || 'type-default'
}
</script>

<style scoped>
.layers-control {
  display: inline-block;
}

.layers-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #909399;
  background-color: #f9f9f9;
}

.placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 12px;
  text-align: center;
}

.layers-content .layers-title {
  font-weight: 600;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-item:hover {
  background-color: #f5f7fa;
}

.layer-item.active {
  background-color: #ecf5ff;
}

.layer-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.layer-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-type {
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
}

.type-success {
  background-color: #e1f3d8;
  color: #67c23a;
}

.type-info {
  background-color: #d9ecff;
  color: #409eff;
}

.type-warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.type-danger {
  background-color: #fef0f0;
  color: #f56c6c;
}

.type-default {
  background-color: #f4f4f5;
  color: #909399;
}

.opacity-control {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  gap: 8px;
}

.opacity-label {
  font-size: 12px;
  color: #606266;
}

.opacity-slider {
  flex: 1;
  height: 4px;
}

.opacity-value {
  font-size: 12px;
  min-width: 36px;
  text-align: right;
}
</style>
