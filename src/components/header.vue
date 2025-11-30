<template>
  <div class="header-container">
    <div class="left-section">
      <div class="brand">
        <span class="logo-text">WebGIS Studio</span>
      </div>

      <div class="divider"></div>

      <div class="history-controls">
        <el-tooltip content="撤销 (Ctrl+Z)" placement="bottom">
          <el-button text circle @click="undo" :disabled="!canUndoRef">
            <el-icon><Back /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="重做 (Ctrl+Y)" placement="bottom">
          <el-button text circle @click="redo" :disabled="!canRedoRef">
            <el-icon><Right /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="center-section">
    </div>

    <div class="right-section">
      <!-- 常用操作区 (原下拉菜单内容) -->
      <div class="action-group">
        <el-tooltip content="保存到本地缓存" placement="bottom">
          <el-button text circle @click="saveProject">
            <el-icon><Finished /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="从本地缓存加载" placement="bottom">
          <el-button text circle @click="loadProject">
            <el-icon><FolderOpened /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="导出 JSON 文件" placement="bottom">
          <el-button text circle @click="exportJSON">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="清空画布" placement="bottom">
          <el-button text circle type="danger" @click="handleReset">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <div class="divider"></div>

      <el-tooltip content="预览运行效果" placement="bottom">
        <el-button round @click="openPreview">
          <el-icon class="icon-left"><View /></el-icon>
          预览
        </el-button>
      </el-tooltip>

      <el-button type="primary" round @click="openAIAssist" class="ai-btn">
        <el-icon class="icon-left"><MagicStick /></el-icon>
        AI 助手
        <el-badge
          v-if="pendingCount > 0"
          :value="pendingCount"
          is-dot
          class="ai-badge"
        />
      </el-button>

      <div class="divider"></div>

      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        style="margin-left: 4px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { useSuggestion } from '@/stores/suggestion'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { componentsToJSON } from '@/utils/toCode'
import {
  Back, Right, View, MagicStick,
  Finished, FolderOpened, Download, Delete, Moon, Sunny
} from '@element-plus/icons-vue'

const router = useRouter()
const compStore = useComponent()
const sizeStore = useSizeStore()
const suggestionStore = useSuggestion()

const { width, height } = storeToRefs(sizeStore)
const { componentStore } = storeToRefs(compStore)
const { reset, undo, redo, canUndo, canRedo } = compStore

const canUndoRef = computed(() => canUndo())
const canRedoRef = computed(() => canRedo())
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)

// 主题切换
const isDark = ref(false)
onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  applyTheme(isDark.value)
})
watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
  applyTheme(val)
})
function applyTheme(dark: boolean) {
  document.body.classList.toggle('theme-dark', dark)
}

// 事件发射
const emit = defineEmits(['open-ai-assist'])
function openAIAssist() { emit('open-ai-assist') }
function openPreview() { router.push('/runtime') }

// 项目操作逻辑
function saveProject() {
  try {
    const data = {
      components: componentStore.value,
      canvasSize: { width: width.value, height: height.value },
      savedAt: new Date().toISOString()
    }
    localStorage.setItem('webgis_project', JSON.stringify(data))
    ElMessage.success('项目已保存到本地')
  } catch (e) {
    ElMessage.error(`保存失败${e}`)
  }
}

async function loadProject() {
  try {
    const saved = localStorage.getItem('webgis_project')
    if (!saved) return ElMessage.warning('暂无本地存档')
    await ElMessageBox.confirm('加载将覆盖当前画布内容，确定吗？', '提示', { type: 'warning' })
    const data = JSON.parse(saved)
    componentStore.value = data.components || []
    if (data.canvasSize) {
      width.value = data.canvasSize.width
      height.value = data.canvasSize.height
    }
    compStore.commit()
    ElMessage.success('加载成功')
  } catch (e) { if (e !== 'cancel') ElMessage.error('加载失败') }
}

function exportJSON() {
  const json = componentsToJSON(componentStore.value)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `project-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function handleReset() {
  ElMessageBox.confirm('确定要清空画布吗？此操作不可逆。', '警告', {
    type: 'warning',
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    confirmButtonClass: 'el-button--danger'
  }).then(() => {
    reset()
    ElMessage.success('画布已清空')
  }).catch(() => {})
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  /* 背景色由父级卡片决定 */
}

.left-section, .right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.brand {
  font-weight: 700;
  font-size: 18px;
  color: var(--text-primary);
  margin-right: 8px;
  letter-spacing: -0.5px;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: var(--border-light);
  margin: 0 8px;
}

.icon-left {
  margin-right: 4px;
}

.ai-btn {
  position: relative;
  background: linear-gradient(135deg, #4285F4, #34A853); /* Google 风格渐变 */
  border: none;
}

.ai-btn:hover {
  opacity: 0.9;
}

.ai-badge {
  position: absolute;
  top: -2px;
  right: -2px;
}
</style>
