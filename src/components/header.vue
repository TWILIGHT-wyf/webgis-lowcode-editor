<template>
  <div class="buttonBar">
    <el-button-group>
        <el-button type="primary"><el-icon><Back /></el-icon></el-button>
        <el-button type="primary"><el-icon><Right /></el-icon></el-button>
    </el-button-group>
    <el-button type="primary"><el-icon><View /></el-icon>预览</el-button>
    <el-button type="primary"><el-icon><Finished /></el-icon>保存</el-button>
    <el-button type="primary" @click="reset()">清空画布</el-button>
    <div class="size">
      画布大小
      <el-input-number label="size" v-model="width"/>
      <el-icon><Close /></el-icon>
      <el-input-number label="size" v-model="height"/>
      缩放
      <el-input-number
        v-model="scalePercent"
        label="scale"

        />%
    </div>

  </div>
</template>

<script setup lang="ts">
import { useComponent } from '@/stores/component';
import { useSizeStore } from '@/stores/size';
import { storeToRefs } from 'pinia';
import { computed } from 'vue'


const sizeStore = useSizeStore()
const { width, height, scale } = storeToRefs(sizeStore)
const { reset } = useComponent()
// 缩放
const scalePercent = computed({
  get: () => Math.round((scale.value ?? 0) * 100),
  set: (val: number) => {
    const n = Number(val)
    if (!Number.isNaN(n)) scale.value = n / 100
  }
})

</script>

<style scoped>
.buttonBar {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 26px
}
.size {
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
