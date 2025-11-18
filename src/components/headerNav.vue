<template>
  <el-menu :default-active="activeIndex" mode="horizontal" router="true" :key="activeIndex">
      <el-menu-item index="/dashboard">仪表盘</el-menu-item>
      <el-menu-item index="/map">地图</el-menu-item>
      <el-menu-item index="/workorders">设施管理</el-menu-item>
      <el-menu-item index="/report">报表</el-menu-item>
      <el-menu-item index="/config">设置</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = computed(() => route.path)



</script>

<style scoped>

</style>
