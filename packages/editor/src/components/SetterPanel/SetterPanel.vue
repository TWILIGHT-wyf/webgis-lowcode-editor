<template>
  <div class="setter-panel">
    <div class="panel-header">
      <h3>属性设置</h3>
    </div>

    <div class="panel-body">
      <template v-if="selectedComponent">
        <div class="setter-section">
          <div class="section-title">基本信息</div>
          <div class="setter-item">
            <label>组件ID</label>
            <div class="value">{{ selectedComponent.id }}</div>
          </div>
          <div class="setter-item">
            <label>组件类型</label>
            <div class="value">{{ selectedComponent.componentName }}</div>
          </div>
        </div>

        <div class="setter-section">
          <div class="section-title">属性配置</div>
          <div class="setter-item" v-for="(value, key) in selectedComponent.props" :key="key">
            <label>{{ key }}</label>
            <input
              type="text"
              :value="value"
              @input="handlePropChange(key, ($event.target as HTMLInputElement).value)"
              class="setter-input"
            />
          </div>
          <div
            v-if="!selectedComponent.props || Object.keys(selectedComponent.props).length === 0"
            class="empty-tip"
          >
            暂无可配置属性
          </div>
        </div>

        <div class="setter-section">
          <div class="section-title">样式配置</div>
          <div class="setter-item" v-for="(value, key) in selectedComponent.style" :key="key">
            <label>{{ key }}</label>
            <input
              type="text"
              :value="value"
              @input="handleStyleChange(key, ($event.target as HTMLInputElement).value)"
              class="setter-input"
            />
          </div>
        </div>

        <div class="setter-actions">
          <el-button type="danger" size="small" @click="handleDelete">删除组件</el-button>
        </div>
      </template>

      <div v-else class="empty-state">
        <div class="empty-icon">👈</div>
        <p>请从画布中选择一个组件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useComponentStoreV2 } from '@/stores/componentV2'
import { ElButton, ElMessageBox } from 'element-plus'

const compStore = useComponentStoreV2()
const { selectedComponent } = storeToRefs(compStore)
const { updateComponentProps, updateComponentStyle, removeComponent, clearSelection } = compStore

const handlePropChange = (key: string, value: string) => {
  if (!selectedComponent.value) return
  updateComponentProps(selectedComponent.value.id, { [key]: value })
}

const handleStyleChange = (key: string, value: string) => {
  if (!selectedComponent.value) return
  updateComponentStyle(selectedComponent.value.id, { [key]: value })
}

const handleDelete = async () => {
  if (!selectedComponent.value) return

  try {
    await ElMessageBox.confirm('确定要删除该组件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const success = removeComponent(selectedComponent.value.id)
    if (success) {
      clearSelection()
    }
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.setter-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.setter-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.setter-item {
  margin-bottom: 12px;
}

.setter-item label {
  display: block;
  font-size: 12px;
  color: #595959;
  margin-bottom: 4px;
}

.setter-item .value {
  font-size: 12px;
  color: #8c8c8c;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 2px;
  word-break: break-all;
}

.setter-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 12px;
  transition: all 0.2s;
}

.setter-input:hover {
  border-color: #40a9ff;
}

.setter-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.empty-tip {
  font-size: 12px;
  color: #bfbfbf;
  text-align: center;
  padding: 12px 0;
}

.setter-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #bfbfbf;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 13px;
  margin: 0;
}
</style>
