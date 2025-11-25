<!--
  AI 助手入口组件
  可作为独立浮动窗口使用,也可嵌入到其他面板中
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="AI 建议助手"
    width="900px"
    :close-on-click-modal="false"
    :destroy-on-close="false"
    top="5vh"
  >
    <el-tabs v-model="activeTab" class="ai-assist-tabs">
      <el-tab-pane name="suggest">
        <template #label>
          <span class="tab-label">
            <el-icon><MagicStick /></el-icon>
            生成建议
            <el-badge v-if="pendingCount > 0" :value="pendingCount" :max="99" class="tab-badge" />
          </span>
        </template>
        <SuggestionPanel />
      </el-tab-pane>

      <el-tab-pane name="audit">
        <template #label>
          <span class="tab-label">
            <el-icon><Clock /></el-icon>
            审计日志
            <el-badge
              v-if="auditCount > 0"
              :value="auditCount"
              :max="99"
              class="tab-badge"
              type="info"
            />
          </span>
        </template>
        <AuditPanel />
      </el-tab-pane>

      <el-tab-pane name="help">
        <template #label>
          <span class="tab-label">
            <el-icon><QuestionFilled /></el-icon>
            帮助
          </span>
        </template>
        <div class="help-content">
          <el-alert title="使用说明" type="info" :closable="false" show-icon>
            <template #default>
              <div class="help-text">
                <p><strong>如何使用:</strong></p>
                <ol>
                  <li>在"生成建议"标签页输入自然语言描述,如:"添加一个 KPI 和折线图"</li>
                  <li>点击"生成建议"按钮或按 Ctrl+Enter</li>
                  <li>查看生成的建议列表,点击"预览"查看详细变更</li>
                  <li>选择需要应用的变更项,点击"应用选中"</li>
                  <li>在"审计日志"中查看所有操作历史,支持回滚</li>
                </ol>

                <p><strong>支持的意图示例:</strong></p>
                <ul>
                  <li>添加 KPI 和折线图</li>
                  <li>创建一个柱状图显示销售数据</li>
                  <li>生成饼图展示占比</li>
                  <li>添加统计指标卡片</li>
                </ul>

                <p><strong>安全保障:</strong></p>
                <ul>
                  <li>✅ 组件类型白名单过滤(70+ 种安全组件)</li>
                  <li>✅ 属性路径校验(禁止 __proto__, constructor 等危险属性)</li>
                  <li>✅ 值沙箱隔离(自动清理脚本、危险模式)</li>
                  <li>✅ 完整审计日志(可回滚到任意历史状态)</li>
                </ul>
              </div>
            </template>
          </el-alert>

          <el-divider />

          <div class="shortcut-list">
            <h4>快捷键</h4>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="生成建议">
                <el-tag size="small">Ctrl + Enter</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="关闭对话框">
                <el-tag size="small">Esc</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <el-divider />

          <div class="version-info">
            <el-text size="small" type="info">
              AI 助手版本: 1.0.0 | Agent: Mock (开发模式)
            </el-text>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button
          v-if="activeTab === 'suggest'"
          type="primary"
          :icon="MagicStick"
          :disabled="isGenerating"
          @click="focusInput"
        >
          {{ isGenerating ? '生成中...' : '快速生成' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MagicStick, Clock, QuestionFilled } from '@element-plus/icons-vue'
import SuggestionPanel from './siderBar/suggestion/SuggestionPanel.vue'
import AuditPanel from './siderBar/suggestion/AuditPanel.vue'
import { useSuggestion } from '@/stores/suggestion'

// Props
interface Props {
  visible?: boolean
  defaultTab?: 'suggest' | 'audit' | 'help'
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  defaultTab: 'suggest',
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

// State
const dialogVisible = ref(props.visible)
const activeTab = ref(props.defaultTab)
const suggestionStore = useSuggestion()

// Computed
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)
const auditCount = computed(() => suggestionStore.auditRecords.length)
const isGenerating = computed(() => suggestionStore.isGenerating)

// Watchers
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
  },
)

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
  if (!newVal) {
    emit('close')
  }
})

// Methods
function handleClose() {
  dialogVisible.value = false
}

function focusInput() {
  // 聚焦到建议面板的输入框
  // 注: 实际实现需要通过 ref 或事件通信
  activeTab.value = 'suggest'
}
</script>

<style scoped>
.ai-assist-tabs {
  height: 70vh;
  overflow: hidden;
}

.ai-assist-tabs :deep(.el-tabs__content) {
  height: calc(70vh - 55px);
  overflow-y: auto;
  padding: 0;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-badge {
  margin-left: 4px;
}

.help-content {
  padding: 16px;
  max-width: 800px;
}

.help-text {
  line-height: 1.8;
}

.help-text p {
  margin: 12px 0;
}

.help-text ul,
.help-text ol {
  margin: 8px 0;
  padding-left: 24px;
}

.help-text li {
  margin: 6px 0;
}

.shortcut-list {
  margin: 16px 0;
}

.shortcut-list h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.version-info {
  text-align: center;
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
