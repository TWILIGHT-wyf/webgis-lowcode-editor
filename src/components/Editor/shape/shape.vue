<template>
  <div
    ref="wrapperRef"
    class="shape-wrapper"
    :style="wrapperStyle"
    @contextmenu.stop.prevent="emitOpenContextMenu"
  >
    <!-- 统一动画容器：内容 + 边框 一起动 -->
    <div class="shape-box" :class="contentClass" :style="contentStyle">
      <div class="shape-content">
        <slot />
      </div>
      <!-- 边框 -->
      <div v-if="isSelected" class="shape-border" :style="borderStyle" />

      <!-- 八个缩放节点（随动画一起） -->
      <template v-if="isSelected">
        <div
          v-for="handle in handles"
          :key="handle.id"
          class="shape-handle"
          :class="handle.class"
          @mousedown.stop="onHandleMouseDown($event, handle)"
        />

        <!-- 旋转手柄（随动画一起） -->
        <div class="shape-rotate" @mousedown.stop="onRotateMouseDown">
          <div class="rotate-icon">↻</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShape } from './shape'

const props = defineProps<{ id: string }>()

const {
  wrapperRef,
  isSelected,
  wrapperStyle,
  borderStyle,
  handles,
  onHandleMouseDown,
  onRotateMouseDown,
  contentClass,
  contentStyle,
} = useShape(props.id)

const emit = defineEmits<{
  (e: 'open-context-menu', payload: { id: string; event: MouseEvent }): void
}>()
function emitOpenContextMenu(e: MouseEvent) {
  emit('open-context-menu', { id: props.id, event: e })
}
</script>

<style>
.shape-box {
  position: relative;
  width: 100%;
  height: 100%;
}
.shape-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #409eff;
  border: 1px solid #fff;
  pointer-events: auto;
  cursor: pointer;
}

.nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}
.ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}
.sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}
.se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}
.n {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}
.s {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}
.w {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}
.e {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}

.shape-rotate {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #409eff;
  border-radius: 50%;
  cursor: alias;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rotate-icon {
  color: #fff;
  font-size: 12px;
}
</style>
