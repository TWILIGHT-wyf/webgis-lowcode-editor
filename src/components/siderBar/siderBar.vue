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
      <el-menu-item index="5">
        <el-icon><MagicStick /></el-icon>
        AI助手
        <el-badge v-if="pendingCount > 0" :value="pendingCount" :max="99" class="menu-badge" />
      </el-menu-item>
    </el-menu>

    <div class="sidebar-content">
      <Propertie v-if="activeIndex === '1'" class="fill" />
      <Animation v-if="activeIndex === '2'" class="fill" />
      <Relations v-if="activeIndex === '3'" class="fill" />
      <Events v-if="activeIndex === '4'" class="fill" />
      <div v-if="activeIndex === '5'" class="fill ai-assist-container">
        <el-tabs v-model="aiTab" class="ai-tabs">
          <el-tab-pane label="生成建议" name="suggest">
            <SuggestionPanel />
          </el-tab-pane>
          <el-tab-pane name="audit">
            <template #label>
              审计日志
              <el-badge
                v-if="auditCount > 0"
                :value="auditCount"
                :max="99"
                class="tab-badge"
                type="info"
              />
            </template>
            <AuditPanel />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import Propertie from './properties/properties.vue'
import Animation from './animation/animation.vue'
import Relations from './relations/relations.vue'
import Events from './events/events.vue'
import SuggestionPanel from './suggestion/SuggestionPanel.vue'
import AuditPanel from './suggestion/AuditPanel.vue'
import { useSuggestion } from '@/stores/suggestion'

const activeIndex = ref('1')
const aiTab = ref('suggest')
const suggestionStore = useSuggestion()
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)
const auditCount = computed(() => suggestionStore.auditRecords.length)

const menuSelect = (index: string) => {
  activeIndex.value = index
}

// 切换到 AI 助手标签页
function switchToAIAssist() {
  activeIndex.value = '5'
  aiTab.value = 'suggest'
}

// 暴露给父组件
defineExpose({
  switchToAIAssist,
})
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

.menu-badge {
  margin-left: 6px;
}

.ai-assist-container {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.ai-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  padding: 0 12px;
}

.ai-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.tab-badge {
  margin-left: 6px;
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
