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

      <el-button size="small" type="primary" plain @click="openPreview">
        <el-icon><View /></el-icon>
        <span class="btn-label">预览</span>
      </el-button>

      <el-divider direction="vertical" />

      <el-button size="small" type="primary" @click="openAIAssist" :badge="pendingCount">
        <el-icon><MagicStick /></el-icon>
        <span class="btn-label">AI助手</span>
        <el-badge v-if="pendingCount > 0" :value="pendingCount" :max="9" class="header-badge" />
      </el-button>

      <el-button size="small" type="success" plain @click="saveProject">
        <el-icon><Finished /></el-icon>
        <span class="btn-label">保存</span>
      </el-button>
      <el-button size="small" type="info" plain @click="loadProject">
        <el-icon><FolderOpened /></el-icon>
        <span class="btn-label">加载</span>
      </el-button>
      <el-button size="small" type="warning" plain @click="exportJSON">
        <el-icon><Download /></el-icon>
        <span class="btn-label">导出JSON</span>
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
import { useSuggestion } from '@/stores/suggestion'
import { storeToRefs } from 'pinia'
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick } from '@element-plus/icons-vue'
import { componentsToJSON } from '@/utils/toCode'

const router = useRouter()
const sizeStore = useSizeStore()
const { width, height, scale } = storeToRefs(sizeStore)
const compStore = useComponent()
const { reset, undo, redo, canUndo, canRedo } = compStore
const { componentStore } = storeToRefs(compStore)
const canUndoRef = computed(() => canUndo())
const canRedoRef = computed(() => canRedo())

// AI 助手
const suggestionStore = useSuggestion()
const pendingCount = computed(() => suggestionStore.pendingSuggestions.length)

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

// 打开预览页面
function openPreview() {
  router.push('/runtime')
}

// 打开 AI 助手
const emit = defineEmits<{
  'open-ai-assist': []
}>()

function openAIAssist() {
  emit('open-ai-assist')
  ElMessage.info('AI 助手已在右侧面板打开')
}

// 保存项目到localStorage
function saveProject() {
  try {
    const projectData = {
      components: componentStore.value,
      canvasSize: {
        width: width.value,
        height: height.value,
      },
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem('webgis_project', JSON.stringify(projectData))
    ElMessage.success('项目已保存到本地')
  } catch (error) {
    ElMessage.error('保存失败: ' + (error as Error).message)
  }
}

// 从localStorage加载项目
async function loadProject() {
  try {
    const saved = localStorage.getItem('webgis_project')
    if (!saved) {
      ElMessage.warning('没有找到保存的项目')
      return
    }

    await ElMessageBox.confirm('加载项目将覆盖当前画布，是否继续？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const projectData = JSON.parse(saved)

    // 清空当前画布
    componentStore.value = []

    // 加载组件数据
    if (projectData.components) {
      componentStore.value = projectData.components
    }

    // 恢复画布尺寸
    if (projectData.canvasSize) {
      width.value = projectData.canvasSize.width
      height.value = projectData.canvasSize.height
    }

    compStore.commit()
    ElMessage.success('项目加载成功')
  } catch (error) {
    if ((error as any) !== 'cancel') {
      ElMessage.error('加载失败: ' + (error as Error).message)
    }
  }
}

// 导出JSON文件
function exportJSON() {
  try {
    const jsonData = componentsToJSON(componentStore.value)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `webgis-project-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('JSON文件已导出')
  } catch (error) {
    ElMessage.error('导出失败: ' + (error as Error).message)
  }
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 12px;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  box-shadow: 0 1px 4px var(--shadow-light);
  border-bottom: 1px solid var(--border-light);
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
  color: var(--text-primary);
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
  background: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 6px;
}
.control-label {
  font-size: 12px;
  color: var(--text-secondary);
}
.num {
  width: 72px;
}
.sep {
  color: var(--text-tertiary);
}
.percent {
  font-size: 12px;
  color: var(--text-secondary);
}
.btn-label {
  margin-left: 6px;
}
</style>
