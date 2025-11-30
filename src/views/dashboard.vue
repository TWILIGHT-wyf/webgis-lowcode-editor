<template>
  <div class="dashboard-layout">
    <header class="header-card">
      <div class="header-left">
        <div class="brand">
          <el-icon class="logo-icon" :size="24"><MapLocation /></el-icon>
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
        <el-button type="primary" round icon="Plus" @click="handleCreate">新建项目</el-button>
        <div class="divider"></div>
        <el-avatar :size="32" style="background-color: #4285F4">U</el-avatar>
      </div>
    </header>

    <main class="main-content">
      <el-scrollbar>
        <div class="content-container">

          <div class="welcome-section">
            <h2 class="welcome-title">下午好，Designer 👋</h2>
            <p class="welcome-subtitle">您有 {{ projects.length }} 个正在进行的项目</p>
          </div>

          <div class="project-grid">

            <div class="project-card create-card" @click="handleCreate">
              <div class="create-content">
                <div class="create-icon-wrapper">
                  <el-icon :size="32"><Plus /></el-icon>
                </div>
                <span class="create-text">创建新大屏</span>
              </div>
            </div>

            <div
              v-for="p in filteredProjects"
              :key="p.id"
              class="project-card"
              @click="handleOpen(p.id)"
            >
              <div class="card-preview">
                <div class="preview-placeholder" :style="{ background: p.thumbnailBg }">
                  <span class="preview-tag">{{ p.category }}</span>
                </div>
                <div class="card-overlay">
                  <el-button type="primary" round @click.stop="handleOpen(p.id)">
                    进入编辑
                  </el-button>
                  <el-button round @click.stop="handlePreview(p.id)">
                    预览
                  </el-button>
                </div>
              </div>

              <div class="card-info">
                <div class="info-main">
                  <div class="project-name" :title="p.name">{{ p.name }}</div>
                  <div class="project-time">最后编辑: {{ p.updatedAt }}</div>
                </div>

                <el-dropdown trigger="click" @command="(cmd) => handleCommand(cmd, p)" @click.stop>
                  <div class="more-btn">
                    <el-icon><MoreFilled /></el-icon>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="rename" icon="Edit">重命名</el-dropdown-item>
                      <el-dropdown-item command="copy" icon="CopyDocument">创建副本</el-dropdown-item>
                      <el-dropdown-item command="delete" divided style="color: #F56C6C" icon="Delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>

          </div>
        </div>
      </el-scrollbar>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MapLocation, Search, Plus, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchText = ref('')

// 模拟项目数据
const projects = ref([
  { id: '1', name: '智慧城市监控大屏', category: 'GIS', updatedAt: '10分钟前', thumbnailBg: 'linear-gradient(135deg, #1f1c2c, #928dab)' },
  { id: '2', name: 'Q3 销售数据报表', category: 'Chart', updatedAt: '2小时前', thumbnailBg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)' },
  { id: '3', name: '物联网设备状态', category: 'IoT', updatedAt: '昨天', thumbnailBg: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
])

const filteredProjects = computed(() => {
  if (!searchText.value) return projects.value
  return projects.value.filter(p => p.name.toLowerCase().includes(searchText.value.toLowerCase()))
})

// 操作处理
const handleCreate = () => {
  const newId = Date.now().toString()
  // 实际逻辑应调用 API 创建
  router.push(`/editor/${newId}`)
}

const handleOpen = (id: string) => router.push(`/editor/${id}`)
const handlePreview = (id: string) => window.open(`/preview/${id}`, '_blank')

const handleCommand = (cmd: string, project: any) => {
  if (cmd === 'delete') {
    ElMessageBox.confirm(`确定要删除 "${project.name}" 吗？`, '警告', {
      type: 'warning',
      confirmButtonText: '删除',
      confirmButtonClass: 'el-button--danger'
    }).then(() => {
      projects.value = projects.value.filter(p => p.id !== project.id)
      ElMessage.success('删除成功')
    })
  } else {
    ElMessage.info(`点击了: ${cmd}`)
  }
}
</script>

<style scoped>
/* 复用 src/styles/theme.css 中的变量
  --bg-app, --bg-card, --text-primary, --border-light, --radius-card, --shadow-card
*/

.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-app);
  padding: 20px; /* 比编辑器稍宽的内边距 */
  box-sizing: border-box;
  gap: 20px;
}

/* --- 顶部 Header --- */
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
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.logo-icon {
  color: #4285F4; /* Google Blue */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 240px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: var(--bg-app);
  box-shadow: none !important;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-light);
}

/* --- 主内容区 --- */
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
  padding: 0 8px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  color: var(--text-tertiary);
  margin: 0;
  font-size: 14px;
}

/* --- Grid 布局 --- */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* 通用卡片样式 */
.project-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
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

/* --- 新建卡片样式 --- */
.create-card {
  border: 2px dashed var(--border-light);
  background-color: transparent;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-card:hover {
  border-color: #4285F4;
  background-color: rgba(66, 133, 244, 0.04);
}

.create-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-tertiary);
}

.create-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card);
  color: #4285F4;
}

.create-text {
  font-weight: 500;
}

/* --- 普通项目卡片样式 --- */
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
}

.preview-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.4);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  backdrop-filter: blur(2px);
}

.project-card:hover .card-overlay {
  opacity: 1;
}

.card-info {
  height: 72px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-light);
}

.info-main {
  flex: 1;
  min-width: 0; 
}

.project-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
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
  background-color: var(--bg-app);
  color: var(--text-primary);
}
</style>
