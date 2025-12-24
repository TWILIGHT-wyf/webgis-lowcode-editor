<template>
  <div class="events-panel" data-testid="events-panel">
    <el-scrollbar class="events-scrollbar">
      <div v-if="!selectComponent" class="empty-state">
        <el-empty description="请先选择一个组件" :image-size="120" />
      </div>

      <div v-else class="events-content">
        <!-- 点击事件 -->
        <div class="section-card">
          <div class="card-header">
            <span class="title">点击事件</span>
            <div class="header-actions">
              <el-button
                type="primary"
                size="small"
                data-testid="add-click-event"
                @click="addClickAction"
                icon="Plus"
              >
                添加
              </el-button>
            </div>
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
                        (value: unknown) => {
                          if (!action.condition) {
                            action.condition = { enabled: false, expression: '' }
                          }
                          action.condition.enabled = !!value
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
          <div v-else class="empty-state">
            <el-empty description="暂无点击事件" :image-size="80" />
          </div>
        </div>

        <!-- 悬停事件 -->
        <div class="section-card">
          <div class="card-header">
            <span class="title">悬停事件</span>
            <div class="header-actions">
              <el-button type="primary" size="small" @click="addHoverAction" icon="Plus">
                添加
              </el-button>
            </div>
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
          <div v-else class="empty-state">
            <el-empty description="暂无悬停事件" :image-size="80" />
          </div>
        </div>

        <!-- 双击事件 -->
        <div class="section-card">
          <div class="card-header">
            <span class="title">双击事件</span>
            <div class="header-actions">
              <el-button type="primary" size="small" @click="addDoubleClickAction" icon="Plus">
                添加
              </el-button>
            </div>
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
          <div v-else class="empty-state">
            <el-empty description="暂无双击事件" :image-size="80" />
          </div>
        </div>

        <!-- 自定义事件 -->
        <div class="section-card">
          <div class="card-header">
            <span class="title">自定义事件</span>
            <div class="header-actions">
              <el-button type="primary" size="small" @click="addCustomEvent" icon="Plus">
                添加事件
              </el-button>
            </div>
          </div>

          <div v-if="customEvents.length > 0" class="custom-events-list">
            <div
              v-for="customEvent in customEvents"
              :key="customEvent.name"
              class="custom-event-card"
            >
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
                            action.type === 'custom-script' ? '输入JavaScript代码' : '输入提示内容'
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
            </div>
          </div>
          <div v-else class="empty-state">
            <el-empty description="暂无自定义事件" :image-size="80" />
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useEventConfiguration } from './events'
import { useComponent } from '@/stores/component'

const componentStore = useComponent()

const {
  selectComponent,
  clickActions,
  hoverActions,
  doubleClickActions,
  customEvents,
  otherComponents,
  getComponentLabel,
  addClickAction,
  removeClickAction,
  addHoverAction,
  removeHoverAction,
  addDoubleClickAction,
  removeDoubleClickAction,
  addCustomEvent,
  removeCustomEvent,
  promptRenameEvent,
  addCustomEventAction,
  removeCustomEventAction,
  onActionTypeChange,
} = useEventConfiguration()
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.actions-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  padding: 32px 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.custom-events-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-event-card {
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;

  .custom-event-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f0f0f0;
    border-bottom: 1px solid #e4e7ed;

    .event-name {
      font-weight: 600;
      font-size: 14px;
      color: #303133;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .actions-list {
    padding: 12px 16px;
  }
}
</style>
