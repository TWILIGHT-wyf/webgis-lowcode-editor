<template>
  <div class="dashboard-layout">
    <!-- 顶部 Header -->
    <header class="header-card">
      <div class="header-left">
        <div class="brand">
          <div class="logo-bg">
            <el-icon class="logo-icon" :size="20"><MapLocation /></el-icon>
          </div>
          <span class="logo-text">WebGIS Studio</span>
        </div>
      </div>

      <div class="header-right">
        <el-input
          v-model="searchText"
          placeholder="搜索项目..."
          class="search-input"
          :prefix-icon="Search"
          clearable
        />
        <div class="divider"></div>
        <el-button type="primary" round icon="Plus" class="new-project-btn" @click="handleCreate"
          >新建项目</el-button
        >
        <div class="divider"></div>
        <el-avatar :size="32" class="user-avatar">U</el-avatar>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <el-scrollbar>
        <div class="content-container">
          <div class="welcome-section">
            <h2 class="welcome-title">下午好，Designer 👋</h2>
            <p class="welcome-subtitle">您有 {{ projects.length }} 个正在进行的项目</p>
          </div>

          <div class="project-grid" v-loading="loading">
            <!-- 新建卡片 -->
            <div class="project-card create-card" @click="handleCreate">
              <div class="create-content">
                <div class="create-icon-wrapper">
                  <el-icon :size="28"><Plus /></el-icon>
                </div>
                <span class="create-text">创建新项目</span>
              </div>
            </div>

            <!-- 项目列表卡片 -->
            <div
              v-for="p in filteredProjects"
              :key="p.id"
              class="project-card"
              @click="p.id && handleOpen(p.id)"
            >
              <div class="card-preview">
                <div class="preview-placeholder" :style="{ background: p.thumbnailBg }">
                  <!-- 动态图标装饰 -->
                  <el-icon class="bg-icon" :size="80"><component :is="p.icon" /></el-icon>
                  <span class="preview-tag">{{ p.categoryLabel }}</span>
                </div>
                <div class="card-overlay">
                  <el-button type="primary" round @click.stop="p.id && handleOpen(p.id!)">
                    进入编辑
                  </el-button>
                  <el-button round @click.stop="p.id && handlePreview(p.id!)"> 预览 </el-button>
                </div>
              </div>

              <div class="card-info">
                <div class="info-main">
                  <div class="project-name" :title="p.name">{{ p.name }}</div>
                  <div class="project-time">最后编辑: {{ p.updatedAt }}</div>
                </div>

                <el-dropdown
                  trigger="click"
                  @command="(cmd: string) => handleCommand(cmd, p)"
                  @click.stop
                >
                  <div class="more-btn" @click.stop>
                    <el-icon><MoreFilled /></el-icon>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="rename" icon="Edit">重命名</el-dropdown-item>
                      <el-dropdown-item command="copy" icon="CopyDocument"
                        >创建副本</el-dropdown-item
                      >
                      <el-dropdown-item
                        command="delete"
                        divided
                        style="color: #f56c6c"
                        icon="Delete"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </main>

    <!-- 美化后的创建项目对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建新项目"
      width="600px"
      align-center
      class="custom-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="createForm" label-position="top" class="create-form">
        <!-- 项目名称 -->
        <el-form-item label="项目名称" required>
          <el-input
            v-model="createForm.name"
            placeholder="给您的项目起个名字，例如：智慧城市监控大屏"
            maxlength="50"
            show-word-limit
            size="large"
            class="custom-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><Edit /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 类别选择 (卡片式) -->
        <el-form-item label="选择项目类型">
          <div class="category-grid">
            <div
              v-for="opt in categoryOptions"
              :key="opt.value"
              class="category-card-option"
              :class="{ active: createForm.category === opt.value }"
              @click="createForm.category = opt.value"
            >
              <div class="cat-icon" :style="{ color: opt.color, backgroundColor: opt.bgColor }">
                <el-icon><component :is="opt.icon" /></el-icon>
              </div>
              <div class="cat-info">
                <span class="cat-name">{{ opt.label }}</span>
                <span class="cat-desc">{{ opt.desc }}</span>
              </div>
              <div class="cat-check" v-if="createForm.category === opt.value">
                <el-icon><Select /></el-icon>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="项目描述 (可选)">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="简要描述项目用途和目标..."
            maxlength="200"
            show-word-limit
            class="custom-textarea"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="createDialogVisible = false" size="large" class="cancel-btn"
            >取消</el-button
          >
          <el-button
            type="primary"
            :loading="loading"
            @click="submitCreate"
            size="large"
            class="submit-btn"
            icon="ArrowRight"
          >
            立即创建
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import {
  MapLocation,
  Search,
  Plus,
  MoreFilled,
  Edit,
  Select,
  DataLine,
  Cpu,
  Files,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import * as projectService from '@/services/projects'

const router = useRouter()
const projectStore = useProjectStore()
const searchText = ref('')
const loading = ref(false)

// 创建项目对话框
const createDialogVisible = ref(false)
const createForm = ref({
  name: '',
  description: '',
  category: 'GIS' as string,
})

// 增强的分类配置
const categoryOptions = [
  {
    label: 'GIS 地图',
    value: 'GIS',
    icon: markRaw(MapLocation),
    color: '#4285F4',
    bgColor: '#e8f0fe',
    desc: '基于地理信息的空间可视化',
  },
  {
    label: '数据图表',
    value: 'Chart',
    icon: markRaw(DataLine),
    color: '#8E44AD',
    bgColor: '#f4ecf7',
    desc: '统计分析与BI报表展示',
  },
  {
    label: '物联网 IoT',
    value: 'IoT',
    icon: markRaw(Cpu),
    color: '#00B894',
    bgColor: '#e0f9f1',
    desc: '设备状态监控与孪生',
  },
  {
    label: '通用空白',
    value: 'Other',
    icon: markRaw(Files),
    color: '#636E72',
    bgColor: '#f5f6fa',
    desc: '从零开始自由绘制',
  },
]

// 项目列表
import type { ServerProject, ProjectInput } from '@vela/core/types/api'
import type { PageSchema } from '@vela/core'

// Dashboard 显示用的扩展项目类型
interface DashboardProject {
  id: string
  name: string
  description?: string
  category?: string
  pages?: PageSchema[]
  createdAt?: string
  updatedAt?: string
  categoryLabel?: string
  icon?: unknown
  thumbnailBg?: string
  pageCount?: number
}

const projects = ref<DashboardProject[]>([])

onMounted(async () => {
  await loadProjects()
})

async function loadProjects() {
  loading.value = true
  try {
    const list = await projectService.listProjects()
    projects.value = list.map((p) => formatServerProject(p))
  } catch (error) {
    console.error('加载项目失败:', error)
    // 降级到空列表（本地 Store 不存储项目列表）
    projects.value = []
  } finally {
    loading.value = false
  }
}

function formatServerProject(p: ServerProject): DashboardProject {
  const categoryKey = p.description?.includes('GIS')
    ? 'GIS'
    : p.description?.includes('图表')
      ? 'Chart'
      : p.description?.includes('IoT')
        ? 'IoT'
        : 'Other'
  const categoryConfig = categoryOptions.find((c) => c.value === categoryKey) || categoryOptions[0]
  const pages = p.schema?.pages || []

  return {
    id: p._id,
    name: p.name,
    description: p.description || '',
    category: categoryKey,
    pages: pages,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    categoryLabel: categoryConfig?.label || '未分类',
    icon: categoryConfig?.icon || markRaw(Select),
    thumbnailBg: getGradientByCategory(categoryKey),
    pageCount: pages.length,
  }
}

function getGradientByCategory(cat: string): string {
  switch (cat) {
    case 'GIS':
      return 'linear-gradient(135deg, #1f1c2c, #928dab)'
    case 'Chart':
      return 'linear-gradient(135deg, #667eea, #764ba2)'
    case 'IoT':
      return 'linear-gradient(135deg, #11998e, #38ef7d)'
    default:
      return 'linear-gradient(135deg, #bdc3c7, #2c3e50)'
  }
}

const filteredProjects = computed(() => {
  if (!searchText.value) return projects.value
  return projects.value.filter((p) => p.name.toLowerCase().includes(searchText.value.toLowerCase()))
})

// 打开创建对话框
const handleCreate = () => {
  createForm.value = { name: '', description: '', category: 'GIS' }
  createDialogVisible.value = true
}

// 提交创建项目
const submitCreate = async () => {
  if (!createForm.value.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }

  loading.value = true
  try {
    const selectedCat = categoryOptions.find((c) => c.value === createForm.value.category)
    await projectService.createProject({
      name: createForm.value.name,
      description: `${selectedCat?.label || ''}#${createForm.value.description}`, // 将类型标签存入描述方便解析
      schema: {
        version: '1.5.0',
        name: createForm.value.name,
        description: createForm.value.description,
        config: {
          layout: 'pc',
          theme: 'light',
        },
        pages: [],
      },
    })

    ElMessage.success('项目创建成功')
    createDialogVisible.value = false
    // 刷新项目列表
    await loadProjects()
  } catch (error) {
    console.error('创建项目失败:', error)
    ElMessage.error('创建失败，请检查服务器连接')
  } finally {
    loading.value = false
  }
}

const handleOpen = (id: string) => {
  router.push(`/editor/${id}`)
}
const handlePreview = (id: string) => window.open(`/runtime?projectId=${id}`, '_blank')
const handleCommand = async (cmd: string, project: DashboardProject) => {
  switch (cmd) {
    case 'rename':
      // TODO: 实现重命名功能
      ElMessage.info('重命名功能待实现')
      break
    case 'copy':
      // TODO: 实现复制功能
      ElMessage.info('复制功能待实现')
      break
    case 'delete':
      if (project.id) {
        try {
          await ElMessageBox.confirm(
            `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
            '删除项目',
            {
              confirmButtonText: '删除',
              cancelButtonText: '取消',
              type: 'warning',
            },
          )

          // 删除后端数据
          await projectService.deleteProject(project.id)

          ElMessage.success('项目已删除')

          // 重新加载列表
          await loadProjects()
        } catch (error) {
          // 用户取消或删除失败
          if (error !== 'cancel') {
            console.error('删除项目失败:', error)
            ElMessage.error('删除失败，请重试')
          }
        }
      }
      break
  }
}
</script>

<style scoped>
/* 复用变量
  建议在全局 theme.css 中定义，这里作为回退值
*/
.dashboard-layout {
  --bg-app: #f5f7fa;
  --bg-card: #ffffff;
  --text-primary: #2c3e50;
  --text-secondary: #606266;
  --text-tertiary: #909399;
  --primary-color: #4285f4;
  --border-light: #ebeef5;
  --radius-card: 12px;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 8px 16px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-app);
  padding: 20px 24px;
  box-sizing: border-box;
  gap: 24px;
}

/* --- Header --- */
.header-card {
  height: 64px;
  flex-shrink: 0;
  background-color: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border: 1px solid white;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-bg {
  width: 32px;
  height: 32px;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 260px;
}
.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #f5f7fa;
  box-shadow: none !important;
  padding-left: 12px;
}
.search-input :deep(.el-input__inner) {
  font-size: 13px;
}

.new-project-btn {
  font-weight: 500;
  padding: 8px 20px;
  box-shadow: 0 4px 10px rgba(66, 133, 244, 0.3);
}

.user-avatar {
  background-color: var(--primary-color);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: var(--border-light);
}

/* --- 内容区 --- */
.main-content {
  flex: 1;
  overflow: hidden;
}
.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.welcome-section {
  margin-bottom: 32px;
  padding: 0 4px;
}
.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px 0;
}
.welcome-subtitle {
  color: var(--text-tertiary);
  margin: 0;
  font-size: 14px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* --- 项目卡片 --- */
.project-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 240px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid transparent;
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* 新建卡片 */
.create-card {
  border: 2px dashed #dcdfe6;
  background-color: transparent;
  box-shadow: none;
  align-items: center;
  justify-content: center;
}
.create-card:hover {
  border-color: var(--primary-color);
  background-color: rgba(66, 133, 244, 0.02);
}
.create-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-tertiary);
}
.create-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
  transition: transform 0.3s;
}
.create-card:hover .create-icon-wrapper {
  transform: scale(1.1);
  background-color: var(--primary-color);
  color: white;
}
.create-text {
  font-weight: 500;
  font-size: 14px;
}

/* 普通卡片 */
.card-preview {
  flex: 1;
  position: relative;
  background-color: #f0f0f0;
  overflow: hidden;
}
.preview-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-icon {
  color: rgba(255, 255, 255, 0.2);
  transform: rotate(-10deg) scale(1.5);
}
.preview-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}
.project-card:hover .card-overlay {
  opacity: 1;
}

.card-info {
  height: 72px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-light);
  background: white;
}
.info-main {
  flex: 1;
  min-width: 0;
}
.project-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-time {
  font-size: 12px;
  color: var(--text-tertiary);
}
.more-btn {
  padding: 8px;
  border-radius: 8px;
  color: var(--text-tertiary);
  transition: background 0.2s;
}
.more-btn:hover {
  background-color: #f5f7fa;
  color: var(--text-primary);
}

/* --- 增强的对话框样式 --- */
.custom-dialog :deep(.el-dialog) {
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.custom-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}
.custom-dialog :deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 18px;
}
.custom-dialog :deep(.el-dialog__body) {
  padding: 24px;
}
.custom-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  background-color: #f9fafc;
  border-top: 1px solid var(--border-light);
}

/* 表单样式 */
.create-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-primary);
  padding-bottom: 8px;
}
.custom-input :deep(.el-input__wrapper),
.custom-textarea :deep(.el-textarea__inner) {
  background-color: #f5f7fa;
  box-shadow: none;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.2s;
}
.custom-input :deep(.el-input__wrapper):hover,
.custom-textarea :deep(.el-textarea__inner):hover {
  background-color: #eef1f6;
}
.custom-input :deep(.el-input__wrapper.is-focus),
.custom-textarea :deep(.el-textarea__inner:focus) {
  background-color: white;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}
.input-icon {
  color: var(--text-tertiary);
}

/* 分类 Grid 选择器 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}
.category-card-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.category-card-option:hover {
  border-color: #bdc3c7;
  background-color: #fdfdfd;
}
.category-card-option.active {
  border-color: var(--primary-color);
  background-color: rgba(66, 133, 244, 0.04);
}
.cat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.cat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.cat-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.cat-desc {
  font-size: 11px;
  color: var(--text-tertiary);
}
.cat-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--primary-color);
  font-size: 16px;
}

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.cancel-btn {
  border-radius: 8px;
  font-weight: 500;
}
.submit-btn {
  border-radius: 8px;
  font-weight: 500;
  background-color: var(--primary-color);
}
</style>
