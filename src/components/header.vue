<template>
  <header class="header-bar">
    <div class="left">
      <el-button-group>
        <el-button size="small" type="primary" plain @click="undo" :disabled="!canUndoRef">
          <el-icon><Back /></el-icon>
        </el-button>
        <el-button size="small" type="primary" plain @click="redo" :disabled="!canRedoRef">
          <el-icon><Right /></el-icon>
        </el-button>
      </el-button-group>

      <el-button size="small" type="primary" plain>
        <el-icon><View /></el-icon>
        <span class="btn-label">预览</span>
      </el-button>
      <el-button size="small" type="primary" plain>
        <el-icon><Finished /></el-icon>
        <span class="btn-label">保存</span>
      </el-button>
      <el-button size="small" type="danger" @click="reset"> 清空画布 </el-button>
    </div>

    <div class="center">
      <div class="app-title">WebGIS Studio</div>
    </div>

    <div class="right">
      <div class="control-row">
        <label class="control-label">画布</label>
        <el-input-number class="num" size="small" label="width" v-model="width" :controls="false" />
        <span class="sep">×</span>
        <el-input-number
          class="num"
          size="small"
          label="height"
          v-model="height"
          :controls="false"
        />
      </div>

      <div class="control-row">
        <label class="control-label">缩放</label>
        <el-input-number class="num" size="small" v-model="scalePercent" :controls="false" />
        <span class="percent">%</span>
      </div>

      <div class="control-row">
        <label class="control-label">主题</label>
        <el-switch size="small" v-model="isDark" active-text="暗" inactive-text="亮" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { computed, ref, watch, onMounted } from 'vue'

const sizeStore = useSizeStore()
const { width, height, scale } = storeToRefs(sizeStore)
const { reset, undo, redo, canUndo, canRedo } = useComponent()
const canUndoRef = computed(() => canUndo())
const canRedoRef = computed(() => canRedo())
// 缩放
const scalePercent = computed({
  get: () => Math.round((scale.value ?? 0) * 100),
  set: (val: number) => {
    const n = Number(val)
    if (!Number.isNaN(n)) scale.value = n / 100
  },
})

// 主题
const isDark = ref(false)
onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  applyTheme(isDark.value)
})
watch(isDark, (v) => {
  localStorage.setItem('theme', v ? 'dark' : 'light')
  applyTheme(v)
})

function applyTheme(dark: boolean) {
  if (dark) document.body.classList.add('theme-dark')
  else document.body.classList.remove('theme-dark')
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 12px;
  background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.06);
  border-bottom: 1px solid #eef2f6;
  height: 56px;
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-title {
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
}
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.control-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.02);
  padding: 4px 8px;
  border-radius: 6px;
}
.control-label {
  font-size: 12px;
  color: #606266;
}
.num {
  width: 72px;
}
.sep {
  color: #909399;
}
.percent {
  font-size: 12px;
  color: #606266;
}
.btn-label {
  margin-left: 6px;
}
</style>
