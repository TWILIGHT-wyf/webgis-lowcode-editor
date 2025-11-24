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
                    <el-select
                      v-model="action.type"
                      placeholder="选择动作类型"
                      @change="onActionTypeChange(action)"
                    >
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
                    <el-select
                      v-model="action.targetId"
                      placeholder="选择目标组件"
                      filterable
                      @change="componentStore.commitDebounced()"
                    >
                      <el-option
                        v-for="comp in otherComponents"
                        :key="comp.id"
                        :label="getComponentLabel(comp)"
                        :value="comp.id"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="action.type === 'custom-event'" label="事件名称">
                    <el-input
                      v-model="action.eventName"
                      placeholder="输入自定义事件名"
                      @input="componentStore.commitDebounced()"
                    />
                  </el-form-item>

                  <el-form-item v-if="action.type === 'custom-event'" label="事件参数">
                    <el-input
                      v-model="action.eventParams"
                      type="textarea"
                      :rows="3"
                      placeholder='JSON格式，如: {"key": "value"}'
                      @input="componentStore.commitDebounced()"
                    />
                  </el-form-item>

                  <!-- 高级选项：延迟执行 -->
                  <el-form-item v-if="action.type" label="延迟执行（毫秒）">
                    <el-input-number
                      v-model="action.delay"
                      :min="0"
                      :max="10000"
                      :step="100"
                      placeholder="0"
                      @change="componentStore.commitDebounced()"
                    />
                  </el-form-item>

                  <!-- 高级选项：条件触发 -->
                  <el-form-item v-if="action.type" label="条件触发">
                    <el-checkbox
                      :model-value="action.condition?.enabled || false"
                      @update:model-value="
                        (value: boolean) => {
                          if (!action.condition) {
                            action.condition = { enabled: false, expression: '' }
                          }
                          action.condition.enabled = value
                          componentStore.commitDebounced()
                        }
                      "
                    >
                      启用条件
                    </el-checkbox>
                    <el-input
                      v-if="action.condition?.enabled"
                      v-model="action.condition.expression"
                      type="textarea"
                      :rows="2"
                      placeholder="例如: component.props.value > 100"
                      @input="componentStore.commitDebounced()"
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
                    <el-select
                      v-model="action.type"
                      placeholder="选择动作类型"
                      @change="onActionTypeChange(action)"
                    >
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
                    <el-select
                      v-model="action.targetId"
                      placeholder="选择目标组件"
                      filterable
                      @change="componentStore.commitDebounced()"
                    >
                      <el-option
                        v-for="comp in otherComponents"
                        :key="comp.id"
                        :label="getComponentLabel(comp)"
                        :value="comp.id"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="action.type === 'show-tooltip'" label="提示内容">
                    <el-input
                      v-model="action.content"
                      type="textarea"
                      :rows="2"
                      @input="componentStore.commitDebounced()"
                    />
                  </el-form-item>

                  <el-form-item v-if="action.type" label="延迟执行（毫秒）">
                    <el-input-number
                      v-model="action.delay"
                      :min="0"
                      :max="10000"
                      :step="100"
                      placeholder="0"
                      @change="componentStore.commitDebounced()"
                    />
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
                    <el-select
                      v-model="action.type"
                      placeholder="选择动作类型"
                      @change="onActionTypeChange(action)"
                    >
                      <el-option label="进入全屏" value="fullscreen" />
                      <el-option label="打开编辑" value="edit-mode" />
                      <el-option label="展开详情" value="expand-detail" />
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="action.type" label="延迟执行（毫秒）">
                    <el-input-number
                      v-model="action.delay"
                      :min="0"
                      :max="10000"
                      :step="100"
                      placeholder="0"
                      @change="componentStore.commitDebounced()"
                    />
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

        <!-- 自定义事件 -->
        <div class="event-section">
          <div class="section-header">
            <span class="label">自定义事件</span>
            <el-button type="primary" size="small" @click="addCustomEvent" icon="Plus">
              添加事件
            </el-button>
          </div>

          <div v-if="customEvents.length > 0" class="custom-events-list">
            <el-collapse v-model="activeCustomEvents" accordion>
              <el-collapse-item
                v-for="customEvent in customEvents"
                :key="customEvent.name"
                :name="customEvent.name"
              >
                <template #title>
                  <div class="custom-event-header">
                    <span class="event-name">{{ customEvent.name }}</span>
                    <div class="header-actions">
                      <el-button
                        type="primary"
                        size="small"
                        @click.stop="promptRenameEvent(customEvent.name)"
                        icon="Edit"
                      >
                        重命名
                      </el-button>
                      <el-button
                        type="danger"
                        size="small"
                        @click.stop="removeCustomEvent(customEvent.name)"
                        icon="Delete"
                      >
                        删除事件
                      </el-button>
                    </div>
                  </div>
                </template>

                <div class="actions-list">
                  <el-card
                    v-for="(action, index) in customEvent.actions"
                    :key="action.id"
                    class="action-card"
                    shadow="hover"
                  >
                    <div class="action-content">
                      <el-form label-position="top" size="small">
                        <el-form-item label="动作类型">
                          <el-select
                            v-model="action.type"
                            placeholder="选择动作类型"
                            @change="onActionTypeChange(action)"
                          >
                            <el-option label="显示/隐藏组件" value="toggle-visibility" />
                            <el-option label="跳转到组件" value="scroll-to" />
                            <el-option label="触发数据刷新" value="refresh-data" />
                            <el-option label="执行动画" value="play-animation" />
                            <el-option label="打开弹窗" value="open-modal" />
                            <el-option label="显示提示" value="show-tooltip" />
                            <el-option label="高亮组件" value="highlight" />
                            <el-option label="自定义脚本" value="custom-script" />
                          </el-select>
                        </el-form-item>

                        <el-form-item
                          v-if="
                            action.type &&
                            [
                              'toggle-visibility',
                              'scroll-to',
                              'play-animation',
                              'open-modal',
                              'highlight',
                            ].includes(action.type)
                          "
                          label="目标组件"
                        >
                          <el-select
                            v-model="action.targetId"
                            placeholder="选择目标组件"
                            filterable
                            @change="componentStore.commitDebounced()"
                          >
                            <el-option
                              v-for="comp in otherComponents"
                              :key="comp.id"
                              :label="getComponentLabel(comp)"
                              :value="comp.id"
                            />
                          </el-select>
                        </el-form-item>

                        <el-form-item
                          v-if="['show-tooltip', 'custom-script'].includes(action.type)"
                          label="内容"
                        >
                          <el-input
                            v-model="action.content"
                            type="textarea"
                            :rows="3"
                            :placeholder="
                              action.type === 'custom-script'
                                ? '输入JavaScript代码'
                                : '输入提示内容'
                            "
                            @input="componentStore.commitDebounced()"
                          />
                        </el-form-item>

                        <!-- 延迟执行 -->
                        <el-form-item v-if="action.type" label="延迟执行（毫秒）">
                          <el-input-number
                            v-model="action.delay"
                            :min="0"
                            :max="10000"
                            :step="100"
                            placeholder="0"
                            @change="componentStore.commitDebounced()"
                          />
                        </el-form-item>
                      </el-form>
                      <div class="action-footer">
                        <el-button
                          type="danger"
                          size="small"
                          @click="removeCustomEventAction(customEvent.name, index)"
                          icon="Delete"
                        >
                          删除
                        </el-button>
                      </div>
                    </div>
                  </el-card>

                  <el-button
                    type="primary"
                    size="small"
                    @click="addCustomEventAction(customEvent.name)"
                    icon="Plus"
                    style="width: 100%; margin-top: 8px"
                  >
                    添加动作
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-empty v-else description="暂无自定义事件" :image-size="80" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent, type component, type EventAction } from '@/stores/component'
import { nanoid } from 'nanoid'

const componentStore = useComponent()
const { selectComponent, componentStore: components } = storeToRefs(componentStore)

// 当前激活的自定义事件折叠面板
const activeCustomEvents = ref<string[]>([])

// 初始化事件对象
function ensureEvents() {
  if (!selectComponent.value) return
  if (!selectComponent.value.events) {
    selectComponent.value.events = {}
  }
}

// 点击事件列表
const clickActions = computed<EventAction[]>({
  get: () => {
    if (!selectComponent.value?.events?.click) return []
    return selectComponent.value.events.click
  },
  set: (value) => {
    if (selectComponent.value?.events) {
      selectComponent.value.events.click = value
    }
  },
})

// 悬停事件列表
const hoverActions = computed<EventAction[]>({
  get: () => {
    if (!selectComponent.value?.events?.hover) return []
    return selectComponent.value.events.hover
  },
  set: (value) => {
    if (selectComponent.value?.events) {
      selectComponent.value.events.hover = value
    }
  },
})

// 双击事件列表
const doubleClickActions = computed<EventAction[]>({
  get: () => {
    if (!selectComponent.value?.events?.doubleClick) return []
    return selectComponent.value.events.doubleClick
  },
  set: (value) => {
    if (selectComponent.value?.events) {
      selectComponent.value.events.doubleClick = value
    }
  },
})

// 自定义事件列表
const customEvents = computed(() => {
  if (!selectComponent.value?.events?.custom) return []
  return Object.keys(selectComponent.value.events.custom).map((eventName) => ({
    name: eventName,
    actions: selectComponent.value!.events!.custom![eventName] || [],
  }))
})

// 所有组件列表（包括当前组件，因为可以给自己添加事件）
const otherComponents = computed(() => {
  return components.value
})

// 获取组件显示标签
function getComponentLabel(comp: component) {
  if (comp.name) {
    return `${comp.name} (${comp.type})`
  }
  return `${comp.type} #${comp.id.slice(0, 6)}`
}

// ==================== 点击事件 ====================
function addClickAction() {
  ensureEvents()
  if (!selectComponent.value!.events!.click) {
    selectComponent.value!.events!.click = []
  }
  selectComponent.value!.events!.click.push({
    id: nanoid(),
    type: '',
  })
  componentStore.commit()
}

function removeClickAction(index: number) {
  if (!selectComponent.value?.events?.click) return
  selectComponent.value.events.click.splice(index, 1)
  componentStore.commit()
}

// ==================== 悬停事件 ====================
function addHoverAction() {
  ensureEvents()
  if (!selectComponent.value!.events!.hover) {
    selectComponent.value!.events!.hover = []
  }
  selectComponent.value!.events!.hover.push({
    id: nanoid(),
    type: '',
  })
  componentStore.commit()
}

function removeHoverAction(index: number) {
  if (!selectComponent.value?.events?.hover) return
  selectComponent.value.events.hover.splice(index, 1)
  componentStore.commit()
}

// ==================== 双击事件 ====================
function addDoubleClickAction() {
  ensureEvents()
  if (!selectComponent.value!.events!.doubleClick) {
    selectComponent.value!.events!.doubleClick = []
  }
  selectComponent.value!.events!.doubleClick.push({
    id: nanoid(),
    type: '',
  })
  componentStore.commit()
}

function removeDoubleClickAction(index: number) {
  if (!selectComponent.value?.events?.doubleClick) return
  selectComponent.value.events.doubleClick.splice(index, 1)
  componentStore.commit()
}

// ==================== 自定义事件 ====================
function addCustomEvent() {
  ensureEvents()
  if (!selectComponent.value!.events!.custom) {
    selectComponent.value!.events!.custom = {}
  }
  const eventName = `customEvent${Object.keys(selectComponent.value!.events!.custom).length + 1}`
  selectComponent.value!.events!.custom[eventName] = []
  componentStore.commit()
}

function removeCustomEvent(eventName: string) {
  if (!selectComponent.value?.events?.custom) return
  delete selectComponent.value.events.custom[eventName]
  componentStore.commit()
}

function renameCustomEvent(oldName: string, newName: string) {
  if (!selectComponent.value?.events?.custom || !newName || oldName === newName) return
  if (selectComponent.value.events.custom[newName]) {
    alert('事件名称已存在')
    return
  }
  const actions = selectComponent.value.events.custom[oldName]
  if (actions) {
    delete selectComponent.value.events.custom[oldName]
    selectComponent.value.events.custom[newName] = actions
    componentStore.commit()
  }
}

function promptRenameEvent(oldName: string) {
  const newName = prompt('输入新的事件名称:', oldName)
  if (newName && newName !== oldName) {
    renameCustomEvent(oldName, newName)
  }
}

function addCustomEventAction(eventName: string) {
  if (!selectComponent.value?.events?.custom?.[eventName]) return
  selectComponent.value.events.custom[eventName].push({
    id: nanoid(),
    type: '',
  })
  componentStore.commit()
}

function removeCustomEventAction(eventName: string, index: number) {
  if (!selectComponent.value?.events?.custom?.[eventName]) return
  selectComponent.value.events.custom[eventName].splice(index, 1)
  componentStore.commit()
}

// 动作类型变化时，清理不相关的字段
function onActionTypeChange(action: EventAction) {
  // 清理字段
  if (action.type !== 'custom-event') {
    delete action.eventName
    delete action.eventParams
  }
  if (action.type !== 'show-tooltip') {
    delete action.content
  }
  if (
    ![
      'toggle-visibility',
      'scroll-to',
      'play-animation',
      'open-modal',
      'highlight',
      'show-detail',
      'preview',
    ].includes(action.type)
  ) {
    delete action.targetId
  }
  componentStore.commitDebounced()
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

.custom-event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 12px;

  .event-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.custom-events-list {
  :deep(.el-collapse-item__header) {
    padding: 0;
  }
}
</style>
