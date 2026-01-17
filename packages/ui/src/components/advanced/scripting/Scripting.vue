<template>
  <div :style="containerStyle">
    <div class="scripting-container">
      <div class="header">
        <span class="title">
          <el-icon><Document /></el-icon>
          {{ title }}
        </span>
        <el-button
          v-if="!autoRun && showControls"
          type="primary"
          size="small"
          @click="$emit('execute')"
        >
          执行
        </el-button>
      </div>

      <div v-if="showCode" class="code-section">
        <div class="section-title">代码:</div>
        <pre class="code-block">{{ scriptCode }}</pre>
      </div>

      <div v-if="output || error" class="output-section">
        <div class="section-title">输出:</div>
        <div v-if="error" class="error-output">{{ error }}</div>
        <pre v-else class="output-block">{{ output }}</pre>
      </div>

      <div v-if="!output && !error && showPlaceholder" class="placeholder">
        <el-icon><VideoPlay /></el-icon>
        <span>{{ placeholder }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { Document, VideoPlay } from '@element-plus/icons-vue'

export interface ScriptingProps {
  title?: string
  scriptCode?: string
  output?: string
  error?: string
  autoRun?: boolean
  showCode?: boolean
  showControls?: boolean
  showPlaceholder?: boolean
  placeholder?: string
  // 样式
  padding?: number
  backgroundColor?: string
  textColor?: string
  fontSize?: number
  lineHeight?: number
  borderRadius?: number
  border?: string
  fontFamily?: string
}

const props = withDefaults(defineProps<ScriptingProps>(), {
  title: '脚本执行器',
  scriptCode: '// 请输入 JavaScript 代码\nconsole.log("Hello World");',
  output: '',
  error: '',
  autoRun: false,
  showCode: true,
  showControls: true,
  showPlaceholder: true,
  placeholder: '点击执行按钮运行脚本',
  padding: 16,
  backgroundColor: '#1e1e1e',
  textColor: '#d4d4d4',
  fontSize: 14,
  lineHeight: 1.6,
  borderRadius: 4,
  border: '1px solid #3c3c3c',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
})

defineEmits<{
  execute: []
}>()

const containerStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  padding: `${props.padding}px`,
  backgroundColor: props.backgroundColor,
  color: props.textColor,
  fontSize: `${props.fontSize}px`,
  lineHeight: props.lineHeight,
  borderRadius: `${props.borderRadius}px`,
  border: props.border,
  overflow: 'auto',
  fontFamily: props.fontFamily,
}))
</script>

<style scoped>
.scripting-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #3c3c3c;
}

.title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 16px;
}

.section-title {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.code-section {
  flex-shrink: 0;
}

.code-block {
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.output-block {
  flex: 1;
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #4ec9b0;
}

.error-output {
  flex: 1;
  padding: 12px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 4px;
  color: #f87171;
  overflow: auto;
}

.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 8px;
  opacity: 0.5;
}

.placeholder .el-icon {
  font-size: 32px;
}
</style>
