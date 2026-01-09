<!--
  AI 助手悬浮窗组件
  模仿主流 AI 网页版风格，支持拖拽，默认底部居中
-->
<template>
  <Teleport to="body">
    <Transition name="float-fade">
      <div
        v-if="visible"
        ref="windowRef"
        class="ai-floating-window"
        :class="{ 'is-dragging': isDragging }"
        :style="windowStyle"
      >
        <!-- 顶部拖拽区域 -->
        <div class="window-header" @mousedown="startDrag">
          <div class="header-left">
            <div class="logo-icon">
              <el-icon><MagicStick /></el-icon>
            </div>
            <span class="header-title">AI Assistant</span>
          </div>
          <div class="header-right">
            <div class="control-btn close" @click="handleClose">
              <el-icon><Close /></el-icon>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="window-content">
          <el-tabs v-model="activeTab" class="ai-tabs">
            <el-tab-pane name="suggest">
              <template #label>
                <span class="tab-label">生成建议</span>
                <el-badge
                  v-if="pendingCount > 0"
                  :value="pendingCount"
                  :max="99"
                  class="tab-badge"
                  type="primary"
                />
              </template>
              <el-scrollbar>
                <SuggestionPanel />
              </el-scrollbar>
            </el-tab-pane>

            <el-tab-pane name="audit">
              <template #label>
                <span class="tab-label">审计日志</span>
                <el-badge
                  v-if="auditCount > 0"
                  :value="auditCount"
                  :max="99"
                  class="tab-badge"
                  type="info"
                />
              </template>
              <el-scrollbar>
                <AuditPanel />
              </el-scrollbar>
            </el-tab-pane>

            <el-tab-pane name="help" label="帮助">
              <el-scrollbar>
                <div class="help-content">
                  <el-alert title="使用说明" type="info" :closable="false" show-icon>
                    <template #default>
                      <div class="help-text">
                        <p><strong>如何使用:</strong></p>
                        <ol>
                          <li>在"生成建议"标签页输入自然语言描述</li>
                          <li>点击"生成建议"按钮或按 Ctrl+Enter</li>
                          <li>预览并应用变更</li>
                        </ol>
                        <p><strong>支持意图:</strong> 添加图表、布局、组件等</p>
                      </div>
                    </template>
                  </el-alert>
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { MagicStick, Close } from '@element-plus/icons-vue'
import SuggestionPanel from '../siderBar/suggestion/SuggestionPanel.vue'
import AuditPanel from '../siderBar/suggestion/AuditPanel.vue'
import { useSuggestion } from '@/stores/suggestion'

// Props
interface Props {
  visible?: boolean
  defaultTab?: 'suggest' | 'audit' | 'help'
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  defaultTab: 'suggest',
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

// State
const activeTab = ref(props.defaultTab)
const suggestionStore = useSuggestion()
const windowRef = ref<HTMLElement | null>(null)

// Dragging State
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
// 默认位置：底部居中
const position = ref({
  left: '50%',
  top: 'auto',
  bottom: '40px',
  transform: 'translateX(-50%)',
})
const isCustomPosition = ref(false) // 是否已被拖拽过

// Computed
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)
const auditCount = computed(() => suggestionStore.auditRecords.length)

const windowStyle = computed(() => {
  if (isCustomPosition.value) {
    return {
      left: position.value.left,
      top: position.value.top,
      bottom: 'auto',
      transform: 'none',
    }
  }
  return {
    left: position.value.left,
    top: position.value.top,
    bottom: position.value.bottom,
    transform: position.value.transform,
  }
})

// Watchers
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && !isCustomPosition.value) {
      // 每次重新打开，如果没有拖拽过，重置到底部居中
      position.value = {
        left: '50%',
        top: 'auto',
        bottom: '40px',
        transform: 'translateX(-50%)',
      }
    }
  },
)

// Lifecycle
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

// Methods
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

// Drag Logic
function startDrag(e: MouseEvent) {
  if (!windowRef.value) return

  isDragging.value = true
  const rect = windowRef.value.getBoundingClientRect()

  // 如果是第一次拖拽，先将 CSS 定位转换为绝对像素定位
  if (!isCustomPosition.value) {
    isCustomPosition.value = true
    position.value = {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      bottom: 'auto',
      transform: 'none',
    }
  }

  // 计算鼠标相对于窗口左上角的偏移
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return

  const x = e.clientX - dragOffset.value.x
  const y = e.clientY - dragOffset.value.y

  position.value.left = `${x}px`
  position.value.top = `${y}px`
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
.ai-floating-window {
  position: fixed;
  width: 800px;
  max-width: 90vw;
  height: 600px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.ai-floating-window.is-dragging {
  user-select: none;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.16);
  cursor: grabbing;
}

/* Header */
.window-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  cursor: grab;
  background: rgba(255, 255, 255, 0.5);
}

.window-header:active {
  cursor: grabbing;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.header-title {
  font-weight: 600;
  font-size: 15px;
  color: #1f2937;
}

.header-right {
  display: flex;
  align-items: center;
}

.control-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f2937;
}

.control-btn.close:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* Content */
.window-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
}

/* Tabs Customization */
.ai-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.3);
}

.ai-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.04);
}

.ai-tabs :deep(.el-tabs__item) {
  height: 44px;
  font-size: 14px;
  color: #6b7280;
}

.ai-tabs :deep(.el-tabs__item.is-active) {
  color: #764ba2;
  font-weight: 600;
}

.ai-tabs :deep(.el-tabs__active-bar) {
  background-color: #764ba2;
  height: 2px;
  border-radius: 2px;
}

.ai-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.ai-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.ai-tabs :deep(.el-scrollbar__view) {
  min-height: 100%;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-badge {
  margin-left: 4px;
  transform: scale(0.8);
}

/* Help Content */
.help-content {
  padding: 20px;
}

.help-text {
  line-height: 1.6;
  color: #4b5563;
}

/* Transition */
.float-fade-enter-active,
.float-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.float-fade-enter-from,
.float-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.95);
}

/* Dark Mode Support */
:deep(.theme-dark) .ai-floating-window {
  background: rgba(30, 30, 30, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

:deep(.theme-dark) .header-title {
  color: #e5e7eb;
}

:deep(.theme-dark) .window-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:deep(.theme-dark) .control-btn {
  color: #9ca3af;
}

:deep(.theme-dark) .control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f3f4f6;
}

:deep(.theme-dark) .ai-tabs :deep(.el-tabs__header) {
  background: rgba(0, 0, 0, 0.2);
}

:deep(.theme-dark) .ai-tabs :deep(.el-tabs__item) {
  color: #9ca3af;
}

:deep(.theme-dark) .ai-tabs :deep(.el-tabs__item.is-active) {
  color: #a78bfa;
}

:deep(.theme-dark) .ai-tabs :deep(.el-tabs__active-bar) {
  background-color: #a78bfa;
}
</style>
