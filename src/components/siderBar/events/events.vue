<template>
  <div class="events-panel">
    <el-scrollbar class="events-scrollbar">
      <div v-if="!selectComponent" class="empty-state">
        <el-empty description="请先选择一个组件" :image-size="120" />
      </div>

      <div v-else class="events-content">
        <!-- 点击事件 -->
        <div class="event-section">
          <div class="section-header">
            <span class="label">点击事件</span>
            <el-button type="primary" size="small" @click="addClickAction" icon="Plus">
              添加
            </el-button>
          </div>
          <div v-if="clickActions.length > 0" class="actions-list">
            <el-card
              v-for="(action, index) in clickActions"
              :key="index"
              class="action-card"
              shadow="hover"
            >
              <div class="action-content">
                <el-form label-position="top" size="small">
                  <el-form-item label="动作类型">
                    <el-select v-model="action.type" placeholder="选择动作类型">
                      <el-option label="显示/隐藏组件" value="toggle-visibility" />
                      <el-option label="跳转到组件" value="scroll-to" />
                      <el-option label="触发数据刷新" value="refresh-data" />
                      <el-option label="执行动画" value="play-animation" />
                      <el-option label="打开弹窗" value="open-modal" />
                      <el-option label="自定义事件" value="custom-event" />
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    v-if="
                      action.type &&
                      action.type !== 'refresh-data' &&
                      action.type !== 'custom-event'
                    "
                    label="目标组件"
                  >
                    <el-select v-model="action.targetId" placeholder="选择目标组件" filterable>
                      <el-option
                        v-for="comp in otherComponents"
                        :key="comp.id"
                        :label="getComponentLabel(comp)"
                        :value="comp.id"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="action.type === 'custom-event'" label="事件名称">
                    <el-input v-model="action.eventName" placeholder="输入自定义事件名" />
                  </el-form-item>

                  <el-form-item v-if="action.type === 'custom-event'" label="事件参数">
                    <el-input
                      v-model="action.eventParams"
                      type="textarea"
                      :rows="3"
                      placeholder='JSON格式，如: {"key": "value"}'
                    />
                  </el-form-item>
                </el-form>
                <div class="action-footer">
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeClickAction(index)"
                    icon="Delete"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <el-empty v-else description="暂无点击事件" :image-size="80" />
        </div>

        <!-- 悬停事件 -->
        <div class="event-section">
          <div class="section-header">
            <span class="label">悬停事件</span>
            <el-button type="primary" size="small" @click="addHoverAction" icon="Plus">
              添加
            </el-button>
          </div>
          <div v-if="hoverActions.length > 0" class="actions-list">
            <el-card
              v-for="(action, index) in hoverActions"
              :key="index"
              class="action-card"
              shadow="hover"
            >
              <div class="action-content">
                <el-form label-position="top" size="small">
                  <el-form-item label="动作类型">
                    <el-select v-model="action.type" placeholder="选择动作类型">
                      <el-option label="显示提示" value="show-tooltip" />
                      <el-option label="高亮组件" value="highlight" />
                      <el-option label="显示详情面板" value="show-detail" />
                      <el-option label="预览内容" value="preview" />
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    v-if="action.type && action.type !== 'show-tooltip'"
                    label="目标组件"
                  >
                    <el-select v-model="action.targetId" placeholder="选择目标组件" filterable>
                      <el-option
                        v-for="comp in otherComponents"
                        :key="comp.id"
                        :label="getComponentLabel(comp)"
                        :value="comp.id"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="action.type === 'show-tooltip'" label="提示内容">
                    <el-input v-model="action.content" type="textarea" :rows="2" />
                  </el-form-item>
                </el-form>
                <div class="action-footer">
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeHoverAction(index)"
                    icon="Delete"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <el-empty v-else description="暂无悬停事件" :image-size="80" />
        </div>

        <!-- 双击事件 -->
        <div class="event-section">
          <div class="section-header">
            <span class="label">双击事件</span>
            <el-button type="primary" size="small" @click="addDoubleClickAction" icon="Plus">
              添加
            </el-button>
          </div>
          <div v-if="doubleClickActions.length > 0" class="actions-list">
            <el-card
              v-for="(action, index) in doubleClickActions"
              :key="index"
              class="action-card"
              shadow="hover"
            >
              <div class="action-content">
                <el-form label-position="top" size="small">
                  <el-form-item label="动作类型">
                    <el-select v-model="action.type" placeholder="选择动作类型">
                      <el-option label="进入全屏" value="fullscreen" />
                      <el-option label="打开编辑" value="edit-mode" />
                      <el-option label="展开详情" value="expand-detail" />
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="action-footer">
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeDoubleClickAction(index)"
                    icon="Delete"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <el-empty v-else description="暂无双击事件" :image-size="80" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent, type component } from '@/stores/component'

const componentStore = useComponent()
const { selectComponent, componentStore: components } = storeToRefs(componentStore)

// 事件动作类型
interface Action {
  type: string
  targetId?: string
  eventName?: string
  eventParams?: string
  content?: string
}

// 临时存储事件（后续需要集成到组件数据结构中）
const clickActions = computed<Action[]>(() => {
  // TODO: 从 selectComponent 中读取
  return []
})

const hoverActions = computed<Action[]>(() => {
  // TODO: 从 selectComponent 中读取
  return []
})

const doubleClickActions = computed<Action[]>(() => {
  // TODO: 从 selectComponent 中读取
  return []
})

// 其他组件列表（排除当前选中的）
const otherComponents = computed(() => {
  if (!selectComponent.value) return []
  return components.value.filter((c: component) => c.id !== selectComponent.value?.id)
})

// 获取组件显示标签
function getComponentLabel(comp: component) {
  if (comp.name) {
    return `${comp.name} (${comp.type})`
  }
  return `${comp.type} #${comp.id.slice(0, 6)}`
}

// 添加点击事件
function addClickAction() {
  // TODO: 添加到 selectComponent 的事件列表
  console.log('添加点击事件')
}

// 移除点击事件
function removeClickAction(index: number) {
  // TODO: 从 selectComponent 的事件列表移除
  console.log('移除点击事件', index)
}

// 添加悬停事件
function addHoverAction() {
  // TODO: 添加到 selectComponent 的事件列表
  console.log('添加悬停事件')
}

// 移除悬停事件
function removeHoverAction(index: number) {
  // TODO: 从 selectComponent 的事件列表移除
  console.log('移除悬停事件', index)
}

// 添加双击事件
function addDoubleClickAction() {
  // TODO: 添加到 selectComponent 的事件列表
  console.log('添加双击事件')
}

// 移除双击事件
function removeDoubleClickAction(index: number) {
  // TODO: 从 selectComponent 的事件列表移除
  console.log('移除双击事件', index)
}
</script>

<style scoped lang="scss">
.events-panel {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--el-bg-color-page);
}

.events-scrollbar {
  height: 100%;

  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
}

.events-content {
  padding: 16px;
}

.event-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-border-color);

  .label {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-card {
  :deep(.el-card__body) {
    padding: 16px;
  }
}

.action-content {
  .el-form {
    margin-bottom: 12px;
  }

  .el-form-item {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.action-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
