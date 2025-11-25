<!--
  示例: 在主界面集成 AI 助手
  可以复制此代码到 src/App.vue 或任何需要的地方
-->
<template>
  <div class="demo-container">
    <!-- 方式 1: 工具栏按钮 -->
    <div class="toolbar">
      <el-button type="primary" :icon="MagicStick" @click="aiDialogVisible = true">
        AI 助手
      </el-button>
    </div>

    <!-- 方式 2: 浮动按钮 -->
    <el-button
      class="floating-ai-button"
      type="primary"
      circle
      size="large"
      :icon="MagicStick"
      @click="aiDialogVisible = true"
    >
      <el-badge :value="pendingCount" :hidden="pendingCount === 0" />
    </el-button>

    <!-- AI 助手对话框 -->
    <AIAssistDialog
      v-model:visible="aiDialogVisible"
      :default-tab="defaultTab"
      @close="handleDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import AIAssistDialog from '@/components/AIAssistDialog.vue'
import { useSuggestion } from '@/stores/suggestion'

const aiDialogVisible = ref(false)
const defaultTab = ref<'suggest' | 'audit' | 'help'>('suggest')
const suggestionStore = useSuggestion()

const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)

function handleDialogClose() {
  console.log('AI 助手对话框已关闭')
}

// 可选: 通过快捷键打开
// 在 onMounted 中添加:
// document.addEventListener('keydown', (e) => {
//   if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
//     e.preventDefault()
//     aiDialogVisible.value = true
//   }
// })
</script>

<style scoped>
.demo-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.toolbar {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

/* 浮动按钮样式 */
.floating-ai-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s ease;
}

.floating-ai-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.floating-ai-button :deep(.el-badge) {
  position: absolute;
  top: -4px;
  right: -4px;
}
</style>
