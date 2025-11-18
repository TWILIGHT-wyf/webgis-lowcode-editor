<script setup lang="ts">
import headerNav from './components/header.vue'
import SiderBar from './components/siderBar/siderBar.vue'
import componentBar from './components/componentBar.vue';
import CanvasBoard from './components/Editor/canvasBoard.vue';
</script>


<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <headerNav/>
      </el-header>
      <el-container>
        <el-aside width="200px"><componentBar/></el-aside>
        <el-main><CanvasBoard/></el-main>
        <el-aside width="290px"><SiderBar/></el-aside>
      </el-container>
    </el-container>
  </div>
</template>



<style>
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.el-container {
  height: 100%;
}
</style>

<style scoped>
.common-layout {
  height: 100vh;
}
.el-main {
  overflow: hidden;
  padding: 0;
  flex: 1;
}
.el-aside {
  overflow: auto;
}
</style>
