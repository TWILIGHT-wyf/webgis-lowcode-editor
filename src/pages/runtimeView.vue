<template>
  <div class="runtime">
    <MapWidget/>
  </div>
</template>

<script setup lang="ts">
import MapWidget from '@/components/map/mapWidget.vue';




</script>

<style scoped>
.runtime {
  position: relative;
  width: 100%;
  height: 100%;
}
.canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
}
.widget-cell {
  position: absolute;
  padding: 8px;
}
.widget-title {
  font-weight: 600;
  margin-bottom: 6px;
}
</style>
