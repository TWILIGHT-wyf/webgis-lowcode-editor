<template>
  <div class="runtime-view">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-button type="info" @click="backToEditor" icon="Back">返回编辑器</el-button>
      <div class="toolbar-divider"></div>
      <el-button type="primary" @click="refreshPreview" icon="Refresh">刷新预览</el-button>
      <el-button @click="viewJSON" icon="Document">查看JSON</el-button>
      <el-button @click="viewCode" icon="View">查看代码</el-button>
      <el-button @click="exportVue" icon="Download">导出Vue文件</el-button>
    </div>

    <!-- 预览区域 -->
    <div class="preview-container">
      <div class="preview-stage" ref="previewStage">
        <!-- 动态渲染组件 - 使用运行时渲染器 -->
        <RuntimeComponent
          v-for="comp in topLevelComponents"
          :key="comp.id"
          :component="comp"
          :allComponents="componentStore"
          @trigger-event="handleComponentEvent"
        />
      </div>
    </div>

    <!-- JSON查看对话框 -->
    <el-dialog v-model="jsonDialogVisible" title="组件JSON数据" width="60%">
      <el-input
        v-model="jsonContent"
        type="textarea"
        :rows="20"
        readonly
        style="font-family: monospace"
      />
      <template #footer>
        <el-button @click="copyJSON">复制</el-button>
        <el-button type="primary" @click="jsonDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 代码查看对话框 -->
    <el-dialog v-model="codeDialogVisible" title="生成的Vue代码" width="70%">
      <el-input
        v-model="vueCode"
        type="textarea"
        :rows="25"
        readonly
        style="font-family: monospace; font-size: 12px"
      />
      <template #footer>
        <el-button @click="copyCode">复制</el-button>
        <el-button type="primary" @click="codeDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { generateVueCode, componentsToJSON } from '@/utils/toCode'
import { ElMessage } from 'element-plus'
import RuntimeComponent from '@/pages/RuntimeComponent.vue'
import type { component, EventAction } from '@/stores/component'

const router = useRouter()

const compStore = useComponent()
const { componentStore } = storeToRefs(compStore)

const previewStage = ref<HTMLDivElement | null>(null)
const jsonDialogVisible = ref(false)
const codeDialogVisible = ref(false)
const jsonContent = ref('')
const vueCode = ref('')

// 只渲染顶层组件
const topLevelComponents = computed(() => {
  return componentStore.value.filter((c) => !c.groupId)
})

// 处理组件事件
async function handleComponentEvent(payload: {
  componentId: string
  eventType: string
  actions: EventAction[]
}) {
  const { componentId, actions } = payload
  const sourceComp = componentStore.value.find((c) => c.id === componentId)

  for (const action of actions) {
    await executeAction(action, sourceComp)
  }
}

// 执行事件动作
async function executeAction(action: EventAction, sourceComponent?: component): Promise<void> {
  // 延迟执行
  if (action.delay && action.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, action.delay))
  }

  switch (action.type) {
    case 'toggle-visibility':
      if (action.targetId) {
        const target = componentStore.value.find((c) => c.id === action.targetId)
        if (target) {
          // 确保style对象存在
          if (!target.style) {
            target.style = {}
          }
          // 切换可见性: undefined和true都视为可见,切换为false; false视为不可见,切换为true
          if (target.style.visible === false) {
            target.style.visible = true
          } else {
            target.style.visible = false
          }

          // 强制触发响应式更新
          compStore.commit()
        }
      }
      break

    case 'scroll-to':
      if (action.targetId) {
        const element = document.querySelector(`[data-component-id="${action.targetId}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      break

    case 'show-tooltip':
      if (action.content) {
        ElMessage.info(action.content)
      }
      break

    case 'navigate':
      if (action.content) {
        window.open(action.content, '_blank')
      }
      break

    case 'fullscreen':
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
      break

    case 'custom-script':
      if (action.content) {
        try {
          const fn = new Function('component', 'components', action.content)
          fn(sourceComponent, componentStore.value)
        } catch (error) {
          console.error('执行自定义脚本失败:', error)
        }
      }
      break

    default:
      console.log(`执行动作: ${action.type}`, action)
  }
}

// 返回编辑器
function backToEditor() {
  router.push('/')
}

// 刷新预览
function refreshPreview() {
  ElMessage.success('预览已刷新')
}

// 查看JSON
function viewJSON() {
  jsonContent.value = componentsToJSON(componentStore.value)
  jsonDialogVisible.value = true
}

// 查看代码
function viewCode() {
  vueCode.value = generateVueCode(componentStore.value)
  codeDialogVisible.value = true
}

// 复制JSON
function copyJSON() {
  navigator.clipboard.writeText(jsonContent.value)
  ElMessage.success('JSON已复制到剪贴板')
}

// 复制代码
function copyCode() {
  navigator.clipboard.writeText(vueCode.value)
  ElMessage.success('代码已复制到剪贴板')
}

// 导出Vue文件
function exportVue() {
  const code = generateVueCode(componentStore.value)
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `generated-page-${Date.now()}.vue`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  ElMessage.success('Vue文件已导出')
}
</script>

<style scoped>
.runtime-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #e5e7eb;
  margin: 0 4px;
}

.preview-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.preview-stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
}

:deep(.el-textarea__inner) {
  font-family: 'Courier New', Courier, monospace;
}
</style>
