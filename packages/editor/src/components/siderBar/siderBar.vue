<template>
  <div class="sider-root">
    <el-tabs v-model="activeIndex" class="property-tabs" stretch>
      <el-tab-pane label="属性" name="1">
        <div class="tab-content">
          <Propertie />
        </div>
      </el-tab-pane>
      <el-tab-pane label="动画" name="2">
        <div class="tab-content">
          <Animation />
        </div>
      </el-tab-pane>
      <el-tab-pane label="联动" name="3">
        <div class="tab-content">
          <Relations />
        </div>
      </el-tab-pane>
      <el-tab-pane label="事件" name="4">
        <div class="tab-content">
          <Events />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Propertie from './properties/properties.vue'
import Animation from './animation/animation.vue'
import Relations from './relations/relations.vue'
import Events from './events/events.vue'

// 默认激活属性面板
const activeIndex = ref('1')
</script>

<style scoped>
/* 根容器：占满父级卡片 */
.sider-root {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  overflow: hidden;
}

/* Tabs 容器：Flex 布局，垂直排列 */
.property-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Tab 头部样式优化 */
.property-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 8px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0; /* 防止头部被压缩 */
}

.property-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: transparent;
}

.property-tabs :deep(.el-tabs__item) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.property-tabs :deep(.el-tabs__item.is-active) {
  color: #1967D2;
  font-weight: 600;
}

.property-tabs :deep(.el-tabs__active-bar) {
  background-color: #1967D2;
  height: 3px;
  border-radius: 3px 3px 0 0;
}

/* 关键修复：Tab 内容区撑满剩余空间 */
.property-tabs :deep(.el-tabs__content) {
  flex: 1;
  height: 0; /* 关键：强制限制高度，触发内部滚动条 */
  padding: 0;
  overflow: hidden; /* 防止原生滚动条溢出 */
}


.property-tabs :deep(.el-tab-pane) {
  height: 100%;
}

/* 内部包装器：承载子组件 */
.tab-content {
  height: 100%;
  width: 100%;
  overflow: hidden; /* 禁止此处滚动，交给子组件(el-scrollbar) */
  display: flex;
  flex-direction: column;
}
</style>
