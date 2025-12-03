<template>
  <div class="legend-control" :style="containerStyle">
    <div v-if="!items || items.length === 0" class="legend-placeholder">
      <span class="placeholder-icon">📋</span>
      <div class="placeholder-text">{{ placeholder }}</div>
    </div>
    <div v-else class="legend-content">
      <div v-if="title" class="legend-title">{{ title }}</div>
      <div class="legend-items">
        <div v-for="(item, index) in items" :key="index" class="legend-item">
          <div
            class="legend-symbol"
            :style="{
              backgroundColor: item.color,
              width: symbolWidth + 'px',
              height: symbolHeight + 'px',
              borderRadius: symbolShape === 'circle' ? '50%' : '0',
            }"
          ></div>
          <span class="legend-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

export interface LegendItem {
  label: string
  color: string
}

export interface LegendProps {
  /** 图例项 */
  items?: LegendItem[]
  /** 标题 */
  title?: string
  /** 占位符文本 */
  placeholder?: string
  /** 符号宽度 */
  symbolWidth?: number
  /** 符号高度 */
  symbolHeight?: number
  /** 符号形状 */
  symbolShape?: 'square' | 'circle'
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

const props = withDefaults(defineProps<LegendProps>(), {
  placeholder: '配置图例项以显示',
  symbolWidth: 20,
  symbolHeight: 20,
  symbolShape: 'square',
  backgroundColor: '#ffffff',
  textColor: '#303133',
  borderColor: '#dcdfe6',
  fontSize: 14,
  padding: 12,
})

const containerStyle = computed<CSSProperties>(() => ({
  backgroundColor: props.backgroundColor,
  color: props.textColor,
  border: `1px solid ${props.borderColor}`,
  fontSize: `${props.fontSize}px`,
  padding: `${props.padding}px`,
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}))
</script>

<style scoped>
.legend-control {
  display: inline-block;
  min-width: 120px;
  max-width: 300px;
}

.legend-placeholder {
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

.legend-content .legend-title {
  font-weight: 600;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-symbol {
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
