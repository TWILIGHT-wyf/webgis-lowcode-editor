<template>
  <div class="animation-panel">
    <div class="preview-area">
      <div class="preview-box" :key="replayKey" :class="previewClass">预览</div>
    </div>

    <ul class="animation-list">
      <li
        v-for="a in animations"
        :key="a.name"
        class="animation-item"
        @mouseenter="triggerPreview(a.class)"
        @mouseleave="cancelPreview()"
        @click="selectAnimation(a)"
      >
        <span class="animation-label">{{ a.label }}</span>
        <span class="animation-desc">{{ a.desc }}</span>
        <span class="mini-demo" :class="a.class"></span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { animations } from './animation'
import { useComponent } from '@/stores/component'
// 预览当前使用的动画 class
const currentClass = ref<string | null>(null)
// 用于强制重新渲染触发动画
const replayKey = ref(0)

function triggerPreview(cls: string) {
  // 通过清空再设置的方式强制浏览器重新计算动画
  currentClass.value = null
  nextTick(() => {
    currentClass.value = cls
    replayKey.value++
  })
}

function cancelPreview() {
  // 悬停移出后保留最后一次效果或清空，这里选择保留
}


// 写入当前选中组件的 animation 配置
function selectAnimation(a: { name: string; class: string }) {
  const store = useComponent()
  const target = store.selectComponent
  if (target) {
    target.animation = {
      name: a.name,
      class: a.class,
      duration: 0.7,
      iterationCount: 1,
      timingFunction: 'ease',
      trigger: 'load',
    }
  }
}

const previewClass = computed(() => {
  return ['preview-box', currentClass.value].filter(Boolean)
})

</script>

<style scoped>
.animation-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}
.preview-area {
  display: flex;
  justify-content: center;
}
.preview-box {
  width: 140px;
  height: 70px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.animation-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}
.animation-item {
  position: relative;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 8px 10px 26px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.25s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.animation-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}
.animation-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.animation-desc {
  font-size: 12px;
  color: #909399;
}
.mini-demo {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 30px;
  height: 18px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #606266;
  overflow: hidden;
}

/* 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.anim-fade {
  animation: fadeIn 0.8s ease both;
}

@keyframes zoomIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
.anim-zoom {
  animation: zoomIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slideLeft {
  0% {
    transform: translateX(40px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.anim-slide-left {
  animation: slideLeft 0.6s ease-out both;
}

@keyframes slideUp {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.anim-slide-up {
  animation: slideUp 0.6s ease-out both;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
.anim-bounce {
  animation: bounceIn 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55) both;
}

@keyframes rotateIn {
  0% {
    transform: rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg);
    opacity: 1;
  }
}
.anim-rotate {
  animation: rotateIn 0.7s ease-out both;
}
</style>
