<template>
  <div class="sider-root">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="menuSelect"
      class="sider-menu"
    >
      <el-menu-item index="1">属性</el-menu-item>
      <el-menu-item index="2">动画</el-menu-item>
      <el-menu-item index="3">事件</el-menu-item>
    </el-menu>

    <el-scrollbar class="sidebar-scroll" view-class="sidebar-scroll-view">
      <div class="sidebar-content">
        <Propertie v-if="activeIndex === '1'" class="fill" />
        <Animation v-if="activeIndex === '2'" class="fill" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Propertie from './properties/properties.vue'
import Animation from './animation/animation.vue'

const activeIndex = ref('1')

const menuSelect = (index: string) => {
  activeIndex.value = index
}
</script>

<style scoped>
.sider-root {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sider-menu {
  flex: 0 0 auto;
}

.sidebar-scroll {
  flex: 1 1 auto;
  width: 100%;
}

:deep(.sidebar-scroll-view) {
  box-sizing: border-box;
  padding: 0;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

/* 让内部面板（Propertie/Animation）撑满可用高度 */
.fill {
  flex: 1 1 auto;
  min-height: 0;
}

.sidebar-scroll,
:deep(.sidebar-scroll-view),
.sidebar-content,
.fill {
  overflow-x: hidden;
  width: 100%;
  min-width: 0;
}
</style>
