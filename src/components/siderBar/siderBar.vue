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
      <el-menu-item index="3">联动</el-menu-item>
      <el-menu-item index="4">事件</el-menu-item>
    </el-menu>

    <div class="sidebar-content">
      <Propertie v-if="activeIndex === '1'" class="fill" />
      <Animation v-if="activeIndex === '2'" class="fill" />
      <Relations v-if="activeIndex === '3'" class="fill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Propertie from './properties/properties.vue'
import Animation from './animation/animation.vue'
import Relations from './relations/relations.vue'

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

.sidebar-content {
  flex: 1 1 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 让内部面板（Propertie/Animation/Relations）撑满可用高度 */
.fill {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

/* Dark theme */
:deep(.theme-dark) .sider-root {
  background: #0b1116;
  color: #dfe7ee;
}
:deep(.theme-dark) .sider-menu {
  background: transparent;
}
:deep(.theme-dark) .sidebar-content {
  background: transparent;
}
:deep(.theme-dark) .fill {
  background: transparent;
}
</style>
