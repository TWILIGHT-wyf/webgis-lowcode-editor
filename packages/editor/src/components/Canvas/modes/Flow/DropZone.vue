<template>
  <div
    ref="dropZoneRef"
    class="drop-zone"
    :class="{
      'is-active': isActive,
      'is-above': position === 'above',
      'is-below': position === 'below',
    }"
  >
    <div v-if="isActive" class="drop-indicator">
      <span class="drop-line"></span>
      <span class="drop-icon">
        <el-icon><Plus /></el-icon>
      </span>
      <span class="drop-line"></span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Plus } from '@element-plus/icons-vue'

interface Props {
  nodeId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  drop: [e: DragEvent, nodeId?: string, position?: 'above' | 'below']
  'drag-over': [e: DragEvent, nodeId?: string, position?: 'above' | 'below']
  'drag-leave': [e: DragEvent]
}>()

const dropZoneRef = ref<HTMLElement | null>(null)
const isActive = ref(false)
const position = ref<'above' | 'below'>('above')

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!dropZoneRef.value) return

  const rect = dropZoneRef.value.getBoundingClientRect()
  const y = e.clientY
  const threshold = rect.height / 2

  position.value = y < threshold ? 'above' : 'below'
  isActive.value = true

  emit('drag-over', e, props.nodeId, position.value)
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!dropZoneRef.value) return

  const rect = dropZoneRef.value.getBoundingClientRect()
  const x = e.clientX
  const y = e.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isActive.value = false
    emit('drag-leave', e)
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()

  isActive.value = false
  emit('drop', e, props.nodeId, position.value)
}

onMounted(() => {
  const el = dropZoneRef.value
  if (el) {
    el.addEventListener('dragenter', handleDragEnter)
    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('drop', handleDrop)
  }
})

onBeforeUnmount(() => {
  const el = dropZoneRef.value
  if (el) {
    el.removeEventListener('dragenter', handleDragEnter)
    el.removeEventListener('dragover', handleDragOver)
    el.removeEventListener('dragleave', handleDragLeave)
    el.removeEventListener('drop', handleDrop)
  }
})
</script>

<style scoped>
.drop-zone {
  position: relative;
  transition: background-color 0.2s;
}

.drop-zone.is-active {
  background-color: rgba(64, 158, 255, 0.05);
}

.drop-indicator {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 24px;
  background-color: rgba(64, 158, 255, 0.1);
  border: 1px dashed #409eff;
  z-index: 1000;
}

.drop-zone.is-above .drop-indicator {
  top: -12px;
}

.drop-zone.is-below .drop-indicator {
  bottom: -12px;
}

.drop-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #409eff, transparent);
}

.drop-icon {
  color: #409eff;
  font-size: 16px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
