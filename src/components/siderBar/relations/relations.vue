<template>
  <div class="relations-panel">
    <el-scrollbar class="panel-scrollbar">
      <div class="panel-content">
        <div class="section-card">
          <div class="card-header">
            <span class="title">组件结构树</span>
            <div class="header-actions">
              <el-button link size="small" @click="expandAll">
                {{ allExpanded ? '全部折叠' : '全部展开' }}
              </el-button>
            </div>
          </div>

          <div class="tree-container">
            <el-tree
              ref="treeRef"
              :data="treeData"
              node-key="id"
              :expand-on-click-node="false"
              highlight-current
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              @node-click="handleNodeClick"
              @node-drop="handleNodeDrop"
              class="modern-tree"
            >
              <template #default="{ data }: { data: TreeNode }">
                <div class="tree-node-content">
                  <div class="node-main">
                    <el-icon class="node-icon">
                      <component :is="getComponentIcon(data.type)" />
                    </el-icon>
                    <span class="node-label">{{ data.label }}</span>
                    <span v-if="data.children?.length" class="child-count">
                      {{ data.children.length }}
                    </span>
                  </div>

                  <div class="node-actions" @click.stop>
                    <el-button
                      link
                      size="small"
                      icon="Plus"
                      @click="openAddChild"
                      title="添加子组件"
                    />
                    <el-button
                      v-if="data.groupId"
                      link
                      size="small"
                      icon="Back"
                      @click="removeParentFromTree(data.id)"
                      title="移出父组件"
                    />
                  </div>
                </div>
              </template>
            </el-tree>
          </div>

          <div class="tree-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>拖拽组件可建立父子关系 (仅限容器)</span>
          </div>
        </div>

        <div v-if="isContainer" class="section-card">
          <div class="card-header">
            <span class="title">容器布局</span>
          </div>

          <el-form label-position="top" size="small" class="modern-form">
            <el-form-item label="布局模式">
              <el-select v-model="layoutMode" class="modern-select">
                <el-option label="绝对定位 (Free)" value="absolute" />
                <el-option label="Flex 水平" value="horizontal" />
                <el-option label="Flex 垂直" value="vertical" />
                <el-option label="网格布局 (Grid)" value="grid" />
              </el-select>
            </el-form-item>

            <template v-if="layoutMode !== 'absolute'">
              <div class="form-grid-2">
                <el-form-item label="组件间距 (px)">
                  <el-input-number
                    v-model="layoutGap"
                    :min="0"
                    :max="100"
                    :controls="false"
                    class="modern-input"
                  />
                </el-form-item>
                <el-form-item label="容器内边距 (px)">
                  <el-input-number
                    v-model="layoutPadding"
                    :min="0"
                    :max="100"
                    :controls="false"
                    class="modern-input"
                  />
                </el-form-item>
              </div>

              <el-form-item label="对齐方式">
                <el-radio-group v-model="layoutAlign" size="small" class="modern-radio">
                  <el-radio-button label="start">起始</el-radio-button>
                  <el-radio-button label="center">居中</el-radio-button>
                  <el-radio-button label="end">末尾</el-radio-button>
                  <el-radio-button label="stretch">拉伸</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>

            <el-form-item v-if="layoutMode === 'grid'" label="网格列数">
              <el-slider v-model="layoutColumns" :min="1" :max="12" :step="1" show-stops />
            </el-form-item>
          </el-form>
        </div>

        <div v-if="childrenComponents.length" class="section-card">
          <div class="card-header">
            <span class="title">子组件位置 ({{ childrenComponents.length }})</span>
          </div>
          <div class="children-list">
            <div
              v-for="child in childrenComponents"
              :key="child.id"
              class="child-item"
              @dblclick="selectComponentById(child.id)"
            >
              <div class="child-info">
                <span class="child-name">{{ child.name || child.type }}</span>
                <el-tag size="small" effect="plain" type="info">
                  {{ child.id.slice(0, 4) }}
                </el-tag>
              </div>

              <div class="child-props-grid">
                <div class="prop-col">
                  <span class="label">X</span>
                  <el-input-number
                    v-model="child.position.x"
                    :controls="false"
                    size="small"
                    class="mini-input"
                  />
                </div>
                <div class="prop-col">
                  <span class="label">Y</span>
                  <el-input-number
                    v-model="child.position.y"
                    :controls="false"
                    size="small"
                    class="mini-input"
                  />
                </div>
                <div class="prop-col">
                  <span class="label">W</span>
                  <el-input-number
                    v-model="child.size.width"
                    :controls="false"
                    size="small"
                    class="mini-input"
                  />
                </div>
                <div class="prop-col">
                  <span class="label">H</span>
                  <el-input-number
                    v-model="child.size.height"
                    :controls="false"
                    size="small"
                    class="mini-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 使用新的数据联动面板 -->
        <div class="section-card">
          <div class="card-header">
            <span class="title">数据联动</span>
          </div>
          <DataBindingPanel />
        </div>

        <div class="section-card">
          <div class="card-header">
            <span class="title">组合关系</span>
          </div>

          <div
            v-if="groupComponent"
            class="child-item"
            @click="selectComponentById(groupComponent.id)"
          >
            <div class="child-info">
              <span class="child-name">{{ groupComponent.name || groupComponent.type }}</span>
              <el-tag size="small" type="success">Parent</el-tag>
            </div>
            <div style="text-align: right; margin-top: 8px">
              <el-button
                type="danger"
                link
                size="small"
                icon="Delete"
                @click.stop="removeFromGroup"
              >
                移出组合
              </el-button>
            </div>
          </div>

          <div v-if="childrenComponents.length" class="children-list">
            <div
              v-for="child in childrenComponents"
              :key="child.id"
              class="child-item"
              @dblclick="selectComponentById(child.id)"
            >
              <div class="child-info">
                <span class="child-name">{{ child.name || child.type }}</span>
                <el-tag size="small" effect="plain" type="info">
                  {{ child.id.slice(0, 4) }}
                </el-tag>
              </div>
            </div>
          </div>

          <div v-if="!groupComponent && !childrenComponents.length" class="empty-state">
            未加入组合
          </div>
        </div>
      </div>
    </el-scrollbar>

    <el-dialog v-model="showAddChildDialog" title="添加子组件" width="360px" center align-center>
      <el-select
        v-model="selectedChildId"
        placeholder="搜索组件..."
        filterable
        class="modern-select w-full"
      >
        <el-option
          v-for="c in availableChildren"
          :key="c.id"
          :label="c.name || `${c.type} (${c.id.slice(0, 4)})`"
          :value="c.id"
        />
      </el-select>
      <template #footer>
        <el-button @click="showAddChildDialog = false">取消</el-button>
        <el-button type="primary" @click="addChild">确定添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, FolderOpened, InfoFilled } from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'
import {
  useComponentHierarchy,
  useDialogState,
  useTreeOperations,
  useLayoutConfig,
  type TreeNode,
} from './relations'
import DataBindingPanel from './DataBindingPanel.vue'

// 组件层级关系
const {
  childrenComponents,
  groupComponent,
  availableChildren,
  addChild: addChildToComponent,
  removeFromGroup,
  selectComponentById,
} = useComponentHierarchy()

// 对话框状态
const { showAddChildDialog, selectedChildId, closeAddChildDialog } = useDialogState()

// 树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()
const allExpanded = ref(false)

// 树操作
const {
  treeData,
  handleNodeClick,
  getAllNodeKeys,
  removeParentFromTree,
  allowDrop,
  allowDrag,
  handleNodeDrop,
} = useTreeOperations()

// 布局配置
const { isContainer, layoutMode, layoutGap, layoutColumns, layoutAlign, layoutPadding } =
  useLayoutConfig()

// 展开/折叠所有节点
function expandAll() {
  allExpanded.value = !allExpanded.value
  if (allExpanded.value) {
    // 展开所有节点
    const allKeys = getAllNodeKeys(treeData.value)
    allKeys.forEach((key) => {
      const node = treeRef.value?.getNode(key)
      if (node) node.expanded = true
    })
  } else {
    // 折叠所有节点
    const allKeys = getAllNodeKeys(treeData.value)
    allKeys.forEach((key) => {
      const node = treeRef.value?.getNode(key)
      if (node) node.expanded = false
    })
  }
}

// 获取组件图标
function getComponentIcon(type: string) {
  // 可以根据组件类型返回不同图标
  if (['Badge', 'Group'].includes(type)) {
    return FolderOpened
  }
  return Document
}

// 添加子组件（包含对话框关闭逻辑）
function addChild() {
  if (!selectedChildId.value) return
  addChildToComponent(selectedChildId.value)
  closeAddChildDialog()
}

// 添加子组件对话框
function openAddChild() {
  showAddChildDialog.value = true
}
</script>

<style scoped lang="scss">
.relations-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .panel-scrollbar {
    height: 100%;

    :deep(.el-scrollbar__view) {
      height: 100%;
      padding: 16px;
    }
  }

  .panel-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.section-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.tree-container {
  padding: 16px 20px;
}

.modern-tree {
  :deep(.el-tree-node__content) {
    height: 40px;
    padding: 0;
  }

  .tree-node-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    .node-main {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      .node-icon {
        font-size: 16px;
        color: #606266;
      }

      .node-label {
        flex: 1;
        font-size: 14px;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .child-count {
        font-size: 12px;
        color: #909399;
        background: #e4e7ed;
        padding: 2px 6px;
        border-radius: 10px;
      }
    }

    .node-actions {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .node-actions {
      opacity: 1;
    }
  }
}

.tree-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f0f9ff;
  border-top: 1px solid #e4e7ed;
  font-size: 13px;
  color: #606266;

  .el-icon {
    color: #409eff;
  }
}

.modern-form {
  padding: 16px 20px;

  .form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .modern-select {
    width: 100%;
  }

  .modern-input {
    width: 100%;
  }

  .modern-radio {
    width: 100%;

    :deep(.el-radio-button) {
      flex: 1;
    }
  }
}

.children-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.child-item {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    background: #f0f9ff;
  }

  .child-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .child-name {
      font-weight: 500;
      color: #303133;
    }
  }

  .child-props-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;

    .prop-col {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 12px;
        color: #909399;
        text-align: center;
      }

      .mini-input {
        width: 100%;
      }
    }
  }
}

.empty-state {
  padding: 32px 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.add-btn {
  color: #409eff;
}
</style>
