<template>
  <div class="properties-panel">
    <el-scrollbar class="properties-scrollbar" view-class="scrollbar-view">
      <div class="scroll-content">
        <div v-if="!selectComponent" class="config-group">
          <div class="panel-header">画布设置</div>

          <el-form label-position="top" size="small" class="modern-form">
            <div class="form-grid-2">
              <el-form-item label="宽度">
                <el-input-number
                  :model-value="canvasWidth"
                  @update:model-value="setCanvasSize($event, canvasHeight)"
                  :min="100"
                  :max="10000"
                  :controls="false"
                  class="modern-input"
                />
              </el-form-item>
              <el-form-item label="高度">
                <el-input-number
                  :model-value="canvasHeight"
                  @update:model-value="setCanvasSize(canvasWidth, $event)"
                  :min="100"
                  :max="10000"
                  :controls="false"
                  class="modern-input"
                />
              </el-form-item>
            </div>

            <el-form-item label="背景颜色">
              <div class="color-picker-row">
                <el-color-picker v-model="canvasConfig.backgroundColor" show-alpha />
                <span class="color-text">{{ canvasConfig.backgroundColor || '透明' }}</span>
              </div>
            </el-form-item>

            <el-form-item label="背景图片">
              <el-input
                v-model="canvasConfig.backgroundImage"
                placeholder="输入图片 URL"
                clearable
                class="modern-input"
              >
                <template #prefix>
                  <el-icon><Picture /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <div class="divider"></div>

            <div class="switch-row">
              <span>显示网格</span>
              <el-switch v-model="canvasConfig.showGrid" size="small" />
            </div>

            <template v-if="canvasConfig.showGrid">
              <div class="form-grid-2">
                <el-form-item label="网格大小">
                  <el-input-number
                    v-model="canvasConfig.gridSize"
                    :min="5"
                    :max="100"
                    :step="5"
                    :controls="false"
                    class="modern-input"
                  />
                </el-form-item>
                <el-form-item label="主网格">
                  <el-input-number
                    v-model="canvasConfig.gridMajorSize"
                    :min="20"
                    :max="500"
                    :step="10"
                    :controls="false"
                    class="modern-input"
                  />
                </el-form-item>
              </div>
              <div class="form-grid-2">
                <el-form-item label="网格颜色">
                  <div class="color-picker-row small">
                    <el-color-picker v-model="canvasConfig.gridColor" show-alpha size="small" />
                  </div>
                </el-form-item>
                <el-form-item label="主网格颜色">
                  <div class="color-picker-row small">
                    <el-color-picker
                      v-model="canvasConfig.gridMajorColor"
                      show-alpha
                      size="small"
                    />
                  </div>
                </el-form-item>
              </div>
            </template>
          </el-form>

          <div class="shortcuts-section">
            <div class="section-title">快捷键</div>
            <div class="shortcut-grid">
              <div class="shortcut-card">
                <span class="key">Space + 拖拽</span><span class="desc">平移画布</span>
              </div>
              <div class="shortcut-card">
                <span class="key">Ctrl + 拖拽</span><span class="desc">网格吸附</span>
              </div>
              <div class="shortcut-card">
                <span class="key">Alt + 拖拽</span><span class="desc">放入容器</span>
              </div>
              <div class="shortcut-card">
                <span class="key">Ctrl + C/V</span><span class="desc">复制粘贴</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="config-group">
          <div v-if="isMultiSelect" class="multi-select-banner">
            <el-icon><CopyDocument /></el-icon>
            <span>已选中 {{ selectedIds.length }} 个组件</span>
          </div>

          <el-collapse v-model="activeCollapse" class="clean-collapse">
            <el-collapse-item name="basic" title="基础属性">
              <el-form label-position="top" size="small" class="modern-form">
                <el-form-item label="组件名称">
                  <el-input
                    v-model="selectComponent.name"
                    placeholder="未命名组件"
                    class="modern-input"
                    @change="storeComponent.commitDebounced()"
                    @blur="storeComponent.commitDebounced()"
                  />
                </el-form-item>

                <div class="form-grid-2">
                  <el-form-item label="X">
                    <el-input-number
                      v-model="selectComponent.position.x"
                      :controls="false"
                      class="modern-input"
                    />
                  </el-form-item>
                  <el-form-item label="Y">
                    <el-input-number
                      v-model="selectComponent.position.y"
                      :controls="false"
                      class="modern-input"
                    />
                  </el-form-item>
                  <el-form-item label="宽">
                    <el-input-number
                      v-model="selectComponent.size.width"
                      :controls="false"
                      :min="10"
                      class="modern-input"
                    />
                  </el-form-item>
                  <el-form-item label="高">
                    <el-input-number
                      v-model="selectComponent.size.height"
                      :controls="false"
                      :min="10"
                      class="modern-input"
                    />
                  </el-form-item>
                </div>

                <el-form-item label="旋转">
                  <el-slider
                    v-model="rotationForUi"
                    :min="0"
                    :max="360"
                    :step="1"
                    show-input
                    input-size="small"
                  />
                </el-form-item>

                <div class="form-grid-2">
                  <el-form-item label="Z-Index">
                    <el-input-number
                      v-model="selectComponent.zindex"
                      :controls="false"
                      class="modern-input"
                    />
                  </el-form-item>
                  <el-form-item label="ID">
                    <el-input
                      :model-value="selectComponent.id.slice(0, 8)"
                      disabled
                      class="modern-input disabled"
                    />
                  </el-form-item>
                </div>

                <el-form-item label="层级操作">
                  <div class="layer-actions">
                    <el-tooltip content="置顶"
                      ><el-button size="small" circle @click="handleBringToFront"
                        ><el-icon><Top /></el-icon></el-button
                    ></el-tooltip>
                    <el-tooltip content="上移"
                      ><el-button size="small" circle @click="handleBringForward"
                        ><el-icon><CaretTop /></el-icon></el-button
                    ></el-tooltip>
                    <el-tooltip content="下移"
                      ><el-button size="small" circle @click="handleSendBackward"
                        ><el-icon><CaretBottom /></el-icon></el-button
                    ></el-tooltip>
                    <el-tooltip content="置底"
                      ><el-button size="small" circle @click="handleSendToBack"
                        ><el-icon><Bottom /></el-icon></el-button
                    ></el-tooltip>
                  </div>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item name="style" title="外观样式">
              <el-form label-position="top" size="small" class="modern-form">
                <div class="switch-group">
                  <div class="switch-row">
                    <span>可见性</span>
                    <el-switch v-model="selectComponent.style.visible" size="small" />
                  </div>
                  <div class="switch-row">
                    <span>锁定位置</span>
                    <el-switch v-model="selectComponent.style.locked" size="small" />
                  </div>
                </div>

                <el-form-item label="不透明度">
                  <el-slider v-model="selectComponent.style.opacity" :min="0" :max="100" />
                </el-form-item>

                <template v-if="styleSchema.length">
                  <template v-for="field in styleSchema" :key="field.key">
                    <el-form-item :label="field.label">
                      <el-input
                        v-if="field.type === 'text'"
                        v-model="getStyleValue(field.key).value"
                        :placeholder="field.placeholder"
                        class="modern-input"
                      />
                      <el-input-number
                        v-else-if="field.type === 'number'"
                        v-model="getStyleValue(field.key).value"
                        :min="field.min"
                        :max="field.max"
                        :step="field.step ?? 1"
                        :controls="false"
                        class="modern-input"
                      />
                      <div v-else-if="field.type === 'color'" class="color-picker-row">
                        <el-color-picker v-model="getStyleValue(field.key).value" show-alpha />
                        <span class="color-text">{{ getStyleValue(field.key).value }}</span>
                      </div>
                      <el-select
                        v-else-if="field.type === 'select'"
                        v-model="getStyleValue(field.key).value"
                        class="modern-select"
                      >
                        <el-option
                          v-for="opt in field.options"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        />
                      </el-select>
                      <el-switch
                        v-else-if="field.type === 'switch'"
                        v-model="getStyleValue(field.key).value"
                      />
                    </el-form-item>
                  </template>
                </template>
              </el-form>
            </el-collapse-item>

            <el-collapse-item v-if="dataSourceSchema.length" title="数据来源" name="dataSource">
              <el-form label-position="top" size="small" class="modern-form">
                <template v-for="field in dataSourceSchema" :key="field.key">
                  <el-form-item :label="field.label">
                    <template v-if="field.type === 'text' && selectComponent.dataSource">
                      <el-input
                        v-if="field.key === 'headers'"
                        v-model="headersInput"
                        :placeholder="field.placeholder"
                        type="textarea"
                        :rows="3"
                        class="modern-input"
                        @change="applyHeadersFromInput"
                        @blur="applyHeadersFromInput"
                      />
                      <el-input
                        v-else
                        v-model="selectComponent.dataSource[field.key]"
                        :placeholder="field.placeholder"
                        class="modern-input"
                        @change="storeComponent.commitDebounced()"
                        @blur="storeComponent.commitDebounced()"
                      />
                    </template>
                    <el-input-number
                      v-else-if="field.type === 'number' && selectComponent.dataSource"
                      v-model="selectComponent.dataSource[field.key]"
                      :min="field.min"
                      :max="field.max"
                      :step="field.step ?? 1"
                      :controls="false"
                      class="modern-input"
                      @change="storeComponent.commitDebounced()"
                      @blur="storeComponent.commitDebounced()"
                    />
                    <el-select
                      v-else-if="field.type === 'select' && selectComponent.dataSource"
                      v-model="selectComponent.dataSource[field.key]"
                      class="modern-select"
                      @change="storeComponent.commitDebounced()"
                    >
                      <el-option
                        v-for="opt in field.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </el-select>
                    <el-switch
                      v-else-if="field.type === 'switch' && selectComponent.dataSource"
                      v-model="selectComponent.dataSource[field.key]"
                      @change="storeComponent.commitDebounced()"
                    />
                  </el-form-item>
                </template>
              </el-form>

              <div v-if="selectComponent.dataSource?.enabled" class="preview-card">
                <div class="preview-header">数据预览</div>
                <div v-if="previewLoading" class="preview-status">加载中...</div>
                <div v-else-if="previewError" class="preview-status error">{{ previewError }}</div>
                <div v-else-if="previewData" class="code-wrapper">
                  <pre class="code-block">{{ JSON.stringify(previewData, null, 2) }}</pre>
                </div>
                <div v-else class="preview-status">暂无数据</div>
              </div>
            </el-collapse-item>

            <el-collapse-item v-if="componentSchema.length" title="组件配置" name="component">
              <el-form label-position="top" size="small" class="modern-form">
                <template v-for="field in componentSchema" :key="field.key">
                  <el-form-item :label="field.label">
                    <template v-if="field.type === 'text'">
                      <el-input
                        v-model="componentFieldInput[field.key]"
                        type="textarea"
                        :rows="4"
                        :placeholder="field.placeholder"
                        class="modern-input"
                        @blur="applyComponentField(field.key)"
                      />
                    </template>
                    <div v-else-if="field.type === 'color'" class="color-picker-row">
                      <el-color-picker
                        v-model="selectComponent.props[field.key]"
                        show-alpha
                        @change="storeComponent.commitDebounced()"
                      />
                    </div>
                    <el-input-number
                      v-else-if="field.type === 'number'"
                      v-model="selectComponent.props[field.key]"
                      :min="field.min"
                      :max="field.max"
                      :step="field.step ?? 1"
                      :controls="false"
                      class="modern-input"
                      @change="storeComponent.commitDebounced()"
                    />
                    <el-select
                      v-else-if="field.type === 'select'"
                      v-model="selectComponent.props[field.key]"
                      class="modern-select"
                      @change="storeComponent.commitDebounced()"
                    >
                      <el-option
                        v-for="opt in field.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </el-select>
                    <el-switch
                      v-else-if="field.type === 'switch'"
                      v-model="selectComponent.props[field.key]"
                      @change="storeComponent.commitDebounced()"
                    />
                  </el-form-item>
                </template>
              </el-form>
            </el-collapse-item>
          </el-collapse>

          <div v-if="selectComponent.type === 'Text'" class="text-content-section">
            <div class="section-title">文本内容</div>
            <el-input
              v-model="selectComponent.props.text"
              type="textarea"
              :rows="4"
              placeholder="请输入文本内容"
              class="modern-input"
            />
          </div>

          <div class="action-buttons">
            <el-button type="danger" plain class="delete-btn" @click="handleDeleteComponent">
              <el-icon class="icon-margin"><Delete /></el-icon> 删除组件
            </el-button>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  Top,
  Bottom,
  CaretTop,
  CaretBottom,
  Picture,
  CopyDocument,
  Delete,
} from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import {
  customProperties,
  useCanvasSettings,
  useComponentProperties,
  useDataPreview,
  useComponentFields,
  useLayerActions,
  useMultiSelect,
  useComponentInitialization,
} from './properties'

const storeComponent = useComponent()

// Canvas settings
const { canvasWidth, canvasHeight, canvasConfig, setCanvasSize } = useCanvasSettings()

// Component properties
const {
  selectComponent,
  selectedIds,
  activeCollapse,
  isMultiSelect,
  getStyleValue,
  rotationForUi,
} = useComponentProperties()

// Data preview
const { previewData, previewLoading, previewError } = useDataPreview()

// Component fields
const { headersInput, applyHeadersFromInput, componentFieldInput, applyComponentField } =
  useComponentFields()

// Layer actions
const {
  handleBringToFront,
  handleBringForward,
  handleSendBackward,
  handleSendToBack,
  handleDelete,
} = useLayerActions()

// Multi select
const { handleDeleteMulti } = useMultiSelect()

// Component initialization
useComponentInitialization()

const { styleSchema, dataSourceSchema, componentSchema } = customProperties()

// Multi-select delete handler
const handleDeleteComponent = () => (isMultiSelect.value ? handleDeleteMulti() : handleDelete())
</script>

<style scoped>
/* 根容器：Flex 布局，填满高度 */
.properties-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止出现双重滚动条 */
  background: transparent;
}

/* 滚动组件：flex: 1 自动占据剩余空间，height: 0 强制 Flex 容器收缩 */
.properties-scrollbar {
  flex: 1;
  height: 0;
  width: 100%;
}

/* 内容容器：提供内边距，解决左右贴边问题 */
.scroll-content {
  padding: 16px;
  box-sizing: border-box;
}

/* 标题样式 */
.panel-header {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-left: 4px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 24px 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 现代表单样式 */
.modern-form .el-form-item {
  margin-bottom: 16px;
}

.modern-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--text-secondary);
  padding-bottom: 6px;
  line-height: 1.2;
}

/* 输入框：浅灰填充 + 无边框 */
.modern-input :deep(.el-input__wrapper) {
  background-color: var(--bg-hover);
  box-shadow: none !important;
  border-radius: 8px;
  padding: 4px 11px;
}

.modern-input :deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #1967d2 !important; /* Google Blue */
}

/* Select 特殊处理 */
.modern-select :deep(.el-input__wrapper) {
  background-color: var(--bg-hover);
  box-shadow: none !important;
  border-radius: 8px;
}

/* 禁用状态 */
.modern-input.disabled :deep(.el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.04);
  color: var(--text-tertiary);
}

/* 网格布局工具 */
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 颜色选择器 */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-hover);
  padding: 6px 10px;
  border-radius: 8px;
  width: fit-content;
}

.color-picker-row.small {
  padding: 4px;
  background: transparent;
}

.color-text {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
}

/* 开关组 */
.switch-group {
  background: var(--bg-hover);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.divider {
  height: 1px;
  background: var(--border-light);
  margin: 20px 0;
}

/* 快捷键卡片网格 */
.shortcut-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.shortcut-card {
  background: var(--bg-hover);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.shortcut-card .key {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-primary);
}

.shortcut-card .desc {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* 多选横幅 */
.multi-select-banner {
  background: #e8f0fe;
  color: #1967d2;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 现代化折叠面板 (Clean Collapse) */
.clean-collapse {
  border: none;
  --el-collapse-header-bg-color: transparent;
  --el-collapse-content-bg-color: transparent;
  --el-collapse-border-color: transparent;
}

:deep(.el-collapse-item__header) {
  border-bottom: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  height: 48px;
  padding-left: 0;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 24px;
}

:deep(.el-collapse-item__wrap) {
  border-bottom: 1px solid var(--border-light);
}

:deep(.el-collapse-item:last-child .el-collapse-item__wrap) {
  border-bottom: none;
}

/* 层级操作按钮 */
.layer-actions {
  display: flex;
  gap: 8px;
}

/* 预览卡片 */
.preview-card {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
}

.preview-header {
  color: #999;
  font-size: 11px;
  margin-bottom: 8px;
}

.code-wrapper {
  max-height: 200px;
  overflow-y: auto;
}

.code-block {
  margin: 0;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 11px;
  color: #d4d4d4;
  white-space: pre-wrap;
  word-break: break-all;
}

.preview-status {
  color: #666;
  font-size: 12px;
  text-align: center;
  padding: 10px;
}

.preview-status.error {
  color: #f56c6c;
}

/* 底部按钮 */
.action-buttons {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.delete-btn {
  width: 100%;
  border-radius: 8px;
  height: 36px;
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

.delete-btn:hover {
  background-color: #f56c6c;
  color: white;
}

.icon-margin {
  margin-right: 4px;
}
</style>
