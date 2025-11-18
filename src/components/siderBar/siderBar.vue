<template>
  <el-menu :default-active="activeIndex" mode="horizontal" @select="menuSelect" >
      <el-menu-item index="1">属性</el-menu-item>
      <el-menu-item index="2">动画</el-menu-item>
      <el-menu-item index="3">事件</el-menu-item>
  </el-menu>
  <div class="sidebar-content">
      <Propertie v-if="activeIndex === '1'"/>
      <Animation v-if="activeIndex === '2'"/>
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

</style>
