<template>
  <div class="editor-layout">
    <header class="header">
      <div class="logo">
        <span class="logo-icon">🚀</span>
        <span class="logo-text">Vela Engine V1.5</span>
      </div>
      <div class="actions">
        <el-button type="primary" size="small" @click="handlePreview">
          <span class="btn-icon">👁️</span>
          预览
        </el-button>
        <el-button size="small" @click="handleExport">
          <span class="btn-icon">📦</span>
          出码
        </el-button>
        <el-button size="small" @click="handleSave">
          <span class="btn-icon">💾</span>
          保存
        </el-button>
      </div>
    </header>

    <div class="main-container">
      <aside class="left-panel">
        <MaterialPanel />
      </aside>

      <main class="center-stage">
        <CanvasBoard />
      </main>

      <aside class="right-panel">
        <SetterPanel />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElButton, ElMessage } from 'element-plus'
import MaterialPanel from '@/components/MaterialPanel/MaterialPanel.vue'
import CanvasBoard from '@/components/Canvas/CanvasBoard.vue'
import SetterPanel from '@/components/SetterPanel/SetterPanel.vue'
import { useComponentStoreV2 } from '@/stores/componentV2'

const router = useRouter()
const compStore = useComponentStoreV2()

const handlePreview = () => {
  // 跳转到预览页面
  router.push('/preview')
}

const handleExport = () => {
  // TODO: 调用代码生成器
  const projectData = compStore.project
  console.log('[Editor] Export project:', projectData)
  ElMessage.success('代码生成功能开发中...')
}

const handleSave = () => {
  // TODO: 保存到服务器
  const projectData = compStore.project
  console.log('[Editor] Save project:', projectData)
  ElMessage.success('保存成功！')
}
</script>

<style scoped>
.editor-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.header {
  height: 56px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 24px;
  justify-content: space-between;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #262626;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  margin-right: 4px;
  font-size: 14px;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 260px;
  border-right: 1px solid #e8e8e8;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.center-stage {
  flex: 1;
  background: #f0f2f5;
  position: relative;
  overflow: hidden;
}

.right-panel {
  width: 320px;
  border-left: 1px solid #e8e8e8;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

/* 响应式调整 */
@media (max-width: 1440px) {
  .left-panel {
    width: 240px;
  }
  .right-panel {
    width: 280px;
  }
}
</style>
