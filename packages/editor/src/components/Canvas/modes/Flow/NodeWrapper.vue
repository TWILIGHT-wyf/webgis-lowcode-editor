<template>
  <div
    ref="wrapperRef"
    :class="wrapperClasses"
    :style="wrapperStyle"
    :data-label="componentLabel"
    :data-node-id="nodeId"
    :draggable="!isResizing"
    @click.stop="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Component content slot -->
    <slot></slot>

    <!-- Selection overlay with handles and toolbar (only when selected) -->
    <SelectionOverlay
      v-if="isSelected"
      :is-active="true"
      :label="componentLabel"
      :parent-label="parentLabel"
      :handles="['e', 's', 'se']"
      :show-toolbar="true"
      :show-rotate="false"
      :show-select-parent="hasParent"
      @resize-start="onResizeStart"
      @delete="handleDelete"
      @copy="handleCopy"
      @select-parent="handleSelectParent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject, type CSSProperties } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import SelectionOverlay from '../../common/SelectionOverlay.vue'
import { ElMessage } from 'element-plus'
import { throttle } from 'lodash-es'
import type { NodeSchema } from '@vela/core'
import type { UseFlowDropReturn } from './useFlowDrop'

interface Props {
  nodeId: string
  componentName?: string
  node?: NodeSchema
}

const props = withDefaults(defineProps<Props>(), {
  componentName: '',
  node: undefined,
})

const emit = defineEmits<{
  select: [id: string]
}>()

// ========== Inject Flow Drop Logic ==========
const flowDrop = inject<UseFlowDropReturn>('flowDrop')

// ========== Store ==========
const componentStore = useComponent()
const { selectedId, hoveredId, rootNode } = storeToRefs(componentStore)
const {
  selectComponent,
  deleteComponent,
  updateStyle,
  findNodeById,
  findParentNode,
  addComponent,
  setHovered,
} = componentStore

// ========== Refs ==========
const wrapperRef = ref<HTMLDivElement | null>(null)
const isResizing = ref(false)
const isDragging = ref(false)
const isDragOver = ref(false)

// ========== Computed ==========
const isSelected = computed(() => selectedId.value === props.nodeId)
const isHovered = computed(() => hoveredId.value === props.nodeId)

const currentNode = computed(() => {
  if (props.node) return props.node
  if (!rootNode.value) return null
  return findNodeById(rootNode.value, props.nodeId)
})

const componentLabel = computed(() => {
  return props.componentName || currentNode.value?.componentName || ''
})

const parentNode = computed(() => {
  if (!rootNode.value || !props.nodeId) return null
  return findParentNode(rootNode.value, props.nodeId)
})

const parentLabel = computed(() => {
  if (!parentNode.value || parentNode.value.id === rootNode.value?.id) return ''
  return parentNode.value.componentName || ''
})

const hasParent = computed(() => {
  return parentNode.value !== null && parentNode.value.id !== rootNode.value?.id
})

/** 判断是否为容器组件 */
const isContainer = computed(() => {
  return flowDrop?.isContainerNode(currentNode.value as NodeSchema) || false
})

/** 判断是否为空容器 */
const isEmpty = computed(() => {
  if (!isContainer.value || !currentNode.value) return false
  return !currentNode.value.children || currentNode.value.children.length === 0
})

/** Wrapper classes */
const wrapperClasses = computed(() => [
  'editor-node-wrapper',
  {
    'is-selected': isSelected.value,
    'is-hovered': isHovered.value && !isSelected.value,
    'is-resizing': isResizing.value,
    'is-dragging': isDragging.value,
    'is-drag-over': isDragOver.value,
    'is-container': isContainer.value,
    'is-empty': isEmpty.value,
  },
])

// ========== Styles ==========
const wrapperStyle = computed<CSSProperties>(() => {
  const node = currentNode.value
  if (!node?.style) {
    // 容器默认宽度 100%
    return isContainer.value ? { width: '100%' } : {}
  }

  return {
    width: node.style.width || (isContainer.value ? '100%' : 'auto'),
    minHeight: node.style.minHeight || node.style.height || 'auto',
  }
})

// ========== Hover Handlers (Exclusive) ==========
const handleMouseEnter = (e: MouseEvent) => {
  // 阻止事件冒泡，确保只有最内层组件触发悬停
  e.stopPropagation()
  if (!isDragging.value && !isResizing.value) {
    setHovered(props.nodeId)
  }
}

const handleMouseLeave = (e: MouseEvent) => {
  // 检查是否真的离开了元素
  const relatedTarget = e.relatedTarget as HTMLElement | null
  const currentTarget = e.currentTarget as HTMLElement

  // 如果移动到子元素，不清除 hover
  if (relatedTarget && currentTarget.contains(relatedTarget)) {
    return
  }

  // 只有当前 hover 的是自己时才清除
  if (hoveredId.value === props.nodeId) {
    setHovered(null)
  }
}

// ========== Drag & Drop Handlers ==========
const handleDragStart = (e: DragEvent) => {
  if (!e.dataTransfer || !currentNode.value) return

  isDragging.value = true
  setHovered(null) // 拖拽时清除 hover 状态

  // 设置拖拽数据
  const dragData = {
    nodeId: props.nodeId,
    componentName: currentNode.value.componentName,
  }
  e.dataTransfer.setData('application/x-vela', JSON.stringify(dragData))
  e.dataTransfer.effectAllowed = 'move'

  // 通知 flowDrop 当前正在拖拽的组件
  flowDrop?.setDraggingId(props.nodeId)

  // 设置拖拽图像
  if (wrapperRef.value) {
    e.dataTransfer.setDragImage(wrapperRef.value, 10, 10)
  }
}

const handleDragEnd = () => {
  isDragging.value = false
  isDragOver.value = false
  flowDrop?.setDraggingId(null)
  flowDrop?.hideIndicator()
}

const handleDragOver = (e: DragEvent) => {
  if (!flowDrop || !currentNode.value || !wrapperRef.value) return
  isDragOver.value = true
  flowDrop.handleDragOver(e, currentNode.value, wrapperRef.value)
}

const handleDragLeave = (e: DragEvent) => {
  // 检查是否真的离开了
  const relatedTarget = e.relatedTarget as HTMLElement | null
  const currentTarget = e.currentTarget as HTMLElement
  if (relatedTarget && currentTarget.contains(relatedTarget)) {
    return
  }
  isDragOver.value = false
  flowDrop?.handleDragLeave(e)
}

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (!flowDrop || !currentNode.value) return
  flowDrop.handleDrop(e, currentNode.value)
}

// ========== Event Handlers ==========
const handleClick = () => {
  selectComponent(props.nodeId)
  emit('select', props.nodeId)
}

const handleDelete = () => {
  deleteComponent(props.nodeId)
  ElMessage.success('组件已删除')
}

const handleCopy = () => {
  const node = currentNode.value
  if (!node || !rootNode.value) return

  const parent = findParentNode(rootNode.value, props.nodeId)
  const parentId = parent?.id || null

  // Deep clone the node
  const clonedNode = JSON.parse(JSON.stringify(node))

  // Generate new IDs
  const generateNewId = () => `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  function assignNewIds(n: NodeSchema) {
    n.id = generateNewId()
    if (n.children && Array.isArray(n.children)) {
      n.children.forEach(assignNewIds)
    }
  }

  assignNewIds(clonedNode)

  // Add cloned component
  addComponent(parentId, clonedNode)
  ElMessage.success('组件已复制')
}

const handleSelectParent = () => {
  if (parentNode.value && parentNode.value.id !== rootNode.value?.id) {
    selectComponent(parentNode.value.id)
  }
}

// ========== Resize Logic ==========
let startMouseX = 0
let startMouseY = 0
let startWidth = 0
let startHeight = 0
let currentHandle = ''

const onResizeStart = (handle: string, event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isResizing.value = true
  currentHandle = handle

  startMouseX = event.clientX
  startMouseY = event.clientY

  const el = wrapperRef.value
  if (el) {
    const rect = el.getBoundingClientRect()
    startWidth = rect.width
    startHeight = rect.height
  }

  window.addEventListener('mousemove', throttledResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
}

const onResizeMove = (event: MouseEvent) => {
  const dx = event.clientX - startMouseX
  const dy = event.clientY - startMouseY

  let newWidth = startWidth
  let newHeight = startHeight

  if (currentHandle.includes('e')) {
    newWidth = Math.max(50, startWidth + dx)
  }
  if (currentHandle.includes('s')) {
    newHeight = Math.max(30, startHeight + dy)
  }

  updateStyle(props.nodeId, {
    width: `${newWidth}px`,
    minHeight: `${newHeight}px`,
  })
}

const throttledResizeMove = throttle(onResizeMove, 16)

const onResizeEnd = () => {
  isResizing.value = false
  currentHandle = ''
  window.removeEventListener('mousemove', throttledResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
}
</script>

<style scoped>
/* ========== Base Styles ========== */
.editor-node-wrapper {
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  max-width: 100%; /* 核心修复：防止撑破画布 */
  min-width: 20px; /* 防止过小无法选中 */
  overflow: hidden; /* 防止内容溢出 */
  transition:
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

/* ========== Hover State (Exclusive - only innermost) ========== */
.editor-node-wrapper.is-hovered:not(.is-selected):not(.is-dragging) {
  box-shadow: inset 0 0 0 1px rgba(64, 158, 255, 0.5);
}

/* Hover label via ::after */
.editor-node-wrapper.is-hovered:not(.is-selected):not(.is-dragging):not(.is-empty)::after {
  content: attr(data-label);
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);
  font-size: 10px;
  line-height: 1;
  color: #fff;
  background: rgba(64, 158, 255, 0.85);
  padding: 2px 6px;
  border-radius: 2px 2px 0 0;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
}

/* ========== Selected State ========== */
.editor-node-wrapper.is-selected {
  box-shadow: 0 0 0 2px #409eff;
  z-index: 10;
}

/* ========== Dragging State ========== */
.editor-node-wrapper.is-dragging {
  opacity: 0.4;
  box-shadow:
    0 0 0 2px #409eff,
    inset 0 0 0 9999px rgba(64, 158, 255, 0.1) !important;
}

/* ========== Resizing State ========== */
.editor-node-wrapper.is-resizing {
  user-select: none;
  cursor: nwse-resize;
}

/* ========== Empty Container State (极简设计) ========== */
.editor-node-wrapper.is-empty {
  min-height: 60px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

/* 默认状态：显示"拖入组件"提示 */
.editor-node-wrapper.is-empty:not(.is-selected):not(.is-drag-over)::before {
  content: '拖入组件';
  font-size: 12px;
  color: #c0c4cc;
  pointer-events: none;
}

/* Empty + Hover (无拖拽): 轻微高亮，但不改变文字 */
.editor-node-wrapper.is-empty.is-hovered:not(.is-selected):not(.is-drag-over) {
  background-color: #f5f7fa;
  box-shadow: inset 0 0 0 1px rgba(64, 158, 255, 0.2);
}

/* Empty + Drag Over: 明显高亮 + 提示释放 */
.editor-node-wrapper.is-empty.is-drag-over:not(.is-selected) {
  background-color: #ecf5ff;
  box-shadow: inset 0 0 0 2px rgba(64, 158, 255, 0.5);
}

.editor-node-wrapper.is-empty.is-drag-over:not(.is-selected)::before {
  content: '释放以添加到 ' attr(data-label);
  color: #409eff;
  font-weight: 500;
}

/* Empty + Selected: 保持选中框，隐藏提示文字 */
.editor-node-wrapper.is-empty.is-selected {
  background-color: #fafcff;
}

/* ========== Container with children ========== */
.editor-node-wrapper.is-container:not(.is-empty) {
  /* 容器有子元素时的微小内边距，便于选中边缘 */
  padding: 2px;
}
</style>
