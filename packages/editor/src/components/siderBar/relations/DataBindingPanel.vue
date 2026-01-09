<template>
  <div class="data-binding-panel">
    <!-- 空状态 -->
    <div v-if="!dataBindings.length" class="empty-state">
      <el-icon class="empty-icon" :size="40"><Connection /></el-icon>
      <p class="empty-text">暂无数据联动规则</p>
      <el-button type="primary" size="small" icon="Plus" @click="addBinding">创建联动</el-button>
    </div>

    <!-- 绑定列表 -->
    <div v-else class="bindings-container">
      <div v-for="(binding, index) in dataBindings" :key="index" class="linkage-rule-card">
        <!-- 卡片头部 -->
        <div class="rule-header">
          <div class="header-left">
            <el-icon class="rule-icon"><Link /></el-icon>
            <span class="rule-title">联动规则 {{ index + 1 }}</span>
          </div>
          <el-button link type="danger" icon="Delete" @click="removeDataBinding(index)" />
        </div>

        <!-- 自然语言式配置  -->
        <div class="rule-content-v2">
          <!-- 源组件选择 -->
          <div class="config-row">
            <label class="row-label">源组件</label>
            <el-select
              v-model="binding.sourceId"
              placeholder="选择源组件"
              filterable
              class="full-width-select"
              @change="onSourceComponentChange(binding)"
            >
              <el-option
                v-for="comp in otherComponents"
                :key="comp.id"
                :value="comp.id"
                :label="comp.name || comp.type"
              >
                <div class="comp-option-v2">
                  <el-icon><component :is="getComponentIcon(comp.type)" /></el-icon>
                  <span class="comp-name">{{ comp.name || comp.type }}</span>
                  <el-tag size="small" type="info">{{ comp.id.slice(0, 6) }}</el-tag>
                </div>
              </el-option>
            </el-select>
          </div>

          <!-- 源属性选择 -->
          <div class="config-row">
            <label class="row-label">源属性</label>
            <el-cascader
              v-model="binding.sourcePath"
              :options="getSourcePropertyOptions(binding.sourceId)"
              placeholder="选择要监听的属性"
              class="full-width-cascader"
              :props="{
                expandTrigger: 'hover',
                emitPath: false,
                value: 'path',
                label: 'label',
              }"
            />
          </div>

          <div class="arrow-divider">
            <el-icon><Right /></el-icon>
          </div>

          <!-- 目标组件（当前组件） -->
          <div class="config-row">
            <label class="row-label">目标组件</label>
            <div class="current-comp-display">
              <el-icon><component :is="getComponentIcon(currentComponent?.type)" /></el-icon>
              <span>{{ currentComponent?.name || '当前组件' }}</span>
              <el-tag size="small" type="success">当前</el-tag>
            </div>
          </div>

          <!-- 目标属性选择 -->
          <div class="config-row">
            <label class="row-label">目标属性</label>
            <el-cascader
              v-model="binding.targetPath"
              :options="getTargetPropertyOptions()"
              placeholder="选择要更新的属性"
              class="full-width-cascader"
              :props="{
                expandTrigger: 'hover',
                emitPath: false,
                value: 'path',
                label: 'label',
              }"
            />
          </div>

          <!-- 数据转换 -->
          <div class="config-row transformer-row">
            <label class="row-label">
              <el-icon><EditPen /></el-icon>
              数据转换
            </label>
            <el-radio-group
              v-model="binding.transformerType"
              size="small"
              class="transformer-type-v2"
            >
              <el-radio-button :value="undefined">直接复制</el-radio-button>
              <el-radio-button value="expression">表达式</el-radio-button>
              <el-radio-button value="template">模板</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 转换器编辑器 -->
          <div v-if="binding.transformerType" class="transformer-editor-v2">
            <el-input
              v-model="binding.transformer"
              :placeholder="
                binding.transformerType === 'template'
                  ? '示例: 当前值: ${value}℃'
                  : '示例: value * 100 或 value > 50 ? \'高\' : \'低\''
              "
              type="textarea"
              :rows="3"
              clearable
              class="transformer-input"
            />
            <div class="transformer-hint-v2">
              <el-icon><InfoFilled /></el-icon>
              <span v-if="binding.transformerType === 'template'">
                使用 <code>${'value'}</code> 引用源值
              </span>
              <span v-else> 可用变量: <code>value</code>，支持任意 JS 表达式 </span>
            </div>
          </div>

          <!-- 实时预览 -->
          <div
            v-if="binding.sourceId && binding.sourcePath && binding.targetPath"
            class="linkage-preview"
          >
            <el-icon class="preview-icon"><View /></el-icon>
            <div class="preview-content">
              <div class="preview-row">
                <span class="label">源值:</span>
                <code class="value">{{
                  getPropertyValue(binding.sourceId, binding.sourcePath)
                }}</code>
              </div>
              <el-icon class="arrow"><Right /></el-icon>
              <div class="preview-row">
                <span class="label">目标值:</span>
                <code class="value">{{
                  getPropertyValue(currentComponent?.id, binding.targetPath)
                }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加更多按钮 -->
      <el-button class="add-more-btn" icon="Plus" @click="addBinding"> 添加更多联动规则 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Connection,
  Link,
  Right,
  View,
  Document,
  FolderOpened,
  Picture,
  EditPen,
  Histogram,
  InfoFilled,
  Setting,
} from '@element-plus/icons-vue'
import { get } from 'lodash-es'
import { useComponentHierarchy, useDataBindings } from './relations'
import type { DataBinding } from './relations'
import type { Component } from '@/types/components'
import type { Component as VueComponent } from 'vue'

// 使用现有的组合式函数
const { otherComponents, selectComponent: currentComponent } = useComponentHierarchy()
const { dataBindings, addDataBinding, removeDataBinding } = useDataBindings()

// 属性选项的数据类型
interface PropertyOption {
  label: string
  path: string
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string // 属性说明
  example?: string // 示例值
  icon?: VueComponent
  children?: PropertyOption[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // 兼容 CascaderOption
}

// 获取组件图标
function getComponentIcon(type?: string): VueComponent {
  const iconMap: Record<string, VueComponent> = {
    Text: EditPen,
    Image: Picture,
    Chart: Histogram,
    Group: FolderOpened,
    Panel: FolderOpened,
  }
  return iconMap[type || ''] || Document
}

// 获取源组件的属性选项
function getSourcePropertyOptions(sourceId: string): PropertyOption[] {
  if (!sourceId) return []

  const component = otherComponents.value.find((c) => c.id === sourceId)
  if (!component) return []

  // 根据组件类型返回可用属性
  const baseOptions: PropertyOption[] = [
    {
      label: '属性 (Props)',
      path: 'props',
      children: getPropsOptions(component),
    },
    {
      label: '样式 (Style)',
      path: 'style',
      children: getStyleOptions(),
    },
    {
      label: '位置尺寸',
      path: 'position',
      children: [
        { label: 'X 坐标', path: 'position.x', type: 'number', icon: Setting },
        { label: 'Y 坐标', path: 'position.y', type: 'number', icon: Setting },
        { label: '宽度', path: 'size.width', type: 'number', icon: Setting },
        { label: '高度', path: 'size.height', type: 'number', icon: Setting },
      ],
    },
  ]

  // 如果组件有数据源，添加数据源选项
  if (component.dataSource?.enabled) {
    baseOptions.unshift({
      label: '数据源',
      path: 'dataSource',
      children: [
        { label: '数据结果', path: 'dataSource.data', type: 'object', icon: Histogram },
        { label: '是否加载中', path: 'dataSource.loading', type: 'boolean', icon: Setting },
      ],
    })
  }

  return baseOptions
}

// 获取目标组件的属性选项
function getTargetPropertyOptions(): PropertyOption[] {
  if (!currentComponent.value) return []

  return [
    {
      label: '属性 (Props)',
      path: 'props',
      children: getPropsOptions(currentComponent.value),
    },
    {
      label: '样式 (Style)',
      path: 'style',
      children: getStyleOptions(),
    },
    {
      label: '位置尺寸',
      path: 'position',
      children: [
        { label: 'X 坐标', path: 'position.x', type: 'number', icon: Setting },
        { label: 'Y 坐标', path: 'position.y', type: 'number', icon: Setting },
        { label: '宽度', path: 'size.width', type: 'number', icon: Setting },
        { label: '高度', path: 'size.height', type: 'number', icon: Setting },
      ],
    },
  ]
}

// 根据组件类型获取 Props 选项
function getPropsOptions(component: Component): PropertyOption[] {
  const commonProps: PropertyOption[] = []

  // 根据组件类型添加特定属性
  switch (component.type) {
    case 'Text':
      commonProps.push({
        label: '文本内容',
        path: 'props.text',
        type: 'string',
        icon: EditPen,
        description: '显示的文本',
        example: '"你好世界"',
      })
      break
    case 'Image':
      commonProps.push({
        label: '图片地址',
        path: 'props.src',
        type: 'string',
        icon: Picture,
        description: '图片URL',
        example: '"https://example.com/image.jpg"',
      })
      break
    case 'Chart':
      commonProps.push(
        {
          label: '图表数据',
          path: 'props.data',
          type: 'array',
          icon: Histogram,
          description: '图表的数据数组',
          example: '[1, 2, 3, 4, 5]',
        },
        {
          label: '图表配置',
          path: 'props.option',
          type: 'object',
          icon: Setting,
          description: 'ECharts配置对象',
        },
      )
      break
    case 'Switch':
      commonProps.push({
        label: '开关状态',
        path: 'props.value',
        type: 'boolean',
        icon: Setting,
        description: 'true为开启，false为关闭',
        example: 'true / false',
      })
      break
    case 'Input':
      commonProps.push({
        label: '输入值',
        path: 'props.value',
        type: 'string',
        icon: EditPen,
        description: '输入框的当前值',
        example: '"用户输入的文本"',
      })
      break
    case 'Slider':
      commonProps.push({
        label: '滑块值',
        path: 'props.value',
        type: 'number',
        icon: Setting,
        description: '滑块的当前数值',
        example: '50',
      })
      break
    case 'Checkbox':
      commonProps.push({
        label: '勾选状态',
        path: 'props.checked',
        type: 'boolean',
        icon: Setting,
        description: 'true为选中，false为未选中',
        example: 'true / false',
      })
      break
    case 'Select':
      commonProps.push({
        label: '选中值',
        path: 'props.value',
        type: 'string',
        icon: Setting,
        description: '下拉框选中的值',
        example: '"option1"',
      })
      break
    default:
      // 通用属性
      if (component.props) {
        Object.keys(component.props).forEach((key) => {
          const value = component.props![key]
          const valueType = Array.isArray(value) ? 'array' : typeof value
          commonProps.push({
            label: key,
            path: `props.${key}`,
            type: valueType as PropertyOption['type'],
            icon: Setting,
            description: `属性: ${key}`,
            example: JSON.stringify(value),
          })
        })
      }
  }

  return commonProps
}

// 获取样式选项
function getStyleOptions(): PropertyOption[] {
  return [
    {
      label: '可见性',
      path: 'style.visible',
      type: 'boolean',
      icon: View,
      description: 'true显示，false隐藏',
      example: 'true / false',
    },
    {
      label: '透明度',
      path: 'style.opacity',
      type: 'number',
      icon: Setting,
      description: '0-100，0为完全透明',
      example: '100',
    },
    {
      label: '背景色',
      path: 'style.backgroundColor',
      type: 'string',
      icon: Setting,
      description: 'CSS颜色值',
      example: '"#ffffff"',
    },
    {
      label: '字体大小',
      path: 'style.fontSize',
      type: 'number',
      icon: EditPen,
      description: '字号（像素）',
      example: '16',
    },
    {
      label: '字体颜色',
      path: 'style.fontColor',
      type: 'string',
      icon: EditPen,
      description: 'CSS颜色值',
      example: '"#000000"',
    },
    {
      label: '字体粗细',
      path: 'style.fontWeight',
      type: 'string',
      icon: EditPen,
      description: 'normal, bold等',
      example: '"normal"',
    },
  ]
}

// 添加绑定
function addBinding() {
  addDataBinding()
}

// 源组件变化时的处理
function onSourceComponentChange(binding: DataBinding) {
  // 清空源属性选择
  binding.sourcePath = ''
}

// 获取属性的当前值（使用 lodash get 方法，与 engine.ts 保持一致）
function getPropertyValue(componentId: string | undefined, path: string): string {
  if (!componentId || !path) return '-'

  const comp =
    componentId === currentComponent.value?.id
      ? currentComponent.value
      : otherComponents.value.find((c) => c.id === componentId)

  if (!comp) return '-'

  try {
    // 使用 lodash-es 的 get 方法，与引擎保持一致
    // 导入需要在 script 顶部添加：import { get } from 'lodash-es'
    const value = get(comp, path)

    if (value === undefined || value === null) return '-'
    if (typeof value === 'boolean') return value ? '✓ 开启' : '✗ 关闭'
    if (typeof value === 'object') return JSON.stringify(value).substring(0, 50) + '...'
    return String(value)
  } catch {
    return '-'
  }
}
</script>

<style scoped lang="scss">
.data-binding-panel {
  padding: 16px 20px;
}

.empty-state {
  padding: 32px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .empty-icon {
    color: #909399;
  }

  .empty-text {
    color: #909399;
    font-size: 14px;
    margin: 0;
  }
}

.bindings-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.linkage-rule-card {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 16px;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.12);
    transform: translateY(-2px);
  }
}

/* 卡片头部 */
.rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;

    .rule-icon {
      font-size: 20px;
    }

    .rule-title {
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.3px;
    }
  }

  :deep(.el-button) {
    color: rgba(255, 255, 255, 0.9);

    &:hover {
      color: #f56c6c;
    }
  }
}

.rule-content {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  line-height: 32px;
  min-height: 32px;

  .keyword {
    font-size: 14px;
    font-weight: 600;
    color: #606266;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .inline-select {
    min-width: 160px;
    max-width: 220px;
    flex-shrink: 0;
  }

  .inline-cascader {
    min-width: 180px;
    max-width: 260px;
    flex-shrink: 0;

    :deep(.el-input__wrapper) {
      display: flex;
      align-items: center;
      line-height: 1;
    }

    :deep(.el-input__inner) {
      line-height: normal;
      height: auto;
      padding: 0;
    }
  }

  .current-comp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
    border: 1px solid #4dd0e1;
    border-radius: 20px;
    font-weight: 500;
    color: #00838f;
    font-size: 13px;
    white-space: nowrap;

    .el-icon {
      font-size: 16px;
    }
  }

  &.transformer-line {
    margin-top: 4px;
    padding-top: 16px;
    border-top: 1px dashed #e4e7ed;

    .transformer-type {
      :deep(.el-radio-button__inner) {
        padding: 8px 16px;
        font-size: 13px;
      }
    }
  }
}

/* 转换器编辑区 */
.transformer-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;

  :deep(.el-textarea__inner) {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
  }

  .transformer-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #909399;

    .el-icon {
      color: #409eff;
      flex-shrink: 0;
    }

    code {
      padding: 2px 6px;
      background: #ecf5ff;
      border: 1px solid #d9ecff;
      border-radius: 4px;
      color: #409eff;
      font-family: 'Consolas', monospace;
      font-size: 11px;
    }
  }
}

/* 实时预览卡片 */
.linkage-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%);
  border: 1px solid #ffe58f;
  border-radius: 8px;
  margin-top: 8px;

  .preview-icon {
    font-size: 18px;
    color: #faad14;
    flex-shrink: 0;
  }

  .preview-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    overflow: hidden;

    .preview-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex: 1;
      min-width: 0;

      .label {
        font-size: 12px;
        color: #8c8c8c;
        white-space: nowrap;
      }

      .value {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        font-weight: 600;
        color: #d48806;
        background: #fff7e6;
        padding: 2px 8px;
        border-radius: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .arrow {
      font-size: 16px;
      color: #faad14;
      flex-shrink: 0;
    }
  }
}

/* 组件选项样式优化 */
.comp-option {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-icon {
    color: #606266;
  }

  span {
    flex: 1;
  }

  .el-tag {
    flex-shrink: 0;
  }
}

.add-more-btn {
  width: 100%;
  height: 40px;
  border-style: dashed;
  color: #409eff;
  font-weight: 500;

  &:hover {
    border-color: #409eff;
    background: #ecf5ff;
  }
}

/* ==================== V2 重构样式 ==================== */
.rule-content-v2 {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.full-width-select,
.full-width-cascader {
  width: 100%;
}

/* 修复级联选择器文字错位 */
.full-width-cascader :deep(.el-cascader__tags) {
  flex-wrap: nowrap;
  overflow: hidden;
}

.full-width-cascader :deep(.el-tag) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.full-width-cascader :deep(.el-cascader-node__label) {
  line-height: 1.5;
  padding: 4px 0;
}

.comp-option-v2 {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;

  .comp-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.current-comp-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border: 1px solid #4dd0e1;
  border-radius: 8px;
  font-weight: 500;
  color: #00838f;
  font-size: 14px;
}

.arrow-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;

  .el-icon {
    font-size: 24px;
    color: #409eff;
  }
}

.transformer-row {
  padding-top: 12px;
  border-top: 1px dashed #e4e7ed;
}

.transformer-type-v2 {
  width: 100%;

  :deep(.el-radio-button) {
    flex: 1;
  }

  :deep(.el-radio-button__inner) {
    width: 100%;
    padding: 10px 16px;
  }
}

.transformer-editor-v2 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.transformer-input :deep(.el-textarea__inner) {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  background: #ffffff;
}

.transformer-hint-v2 {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;

  .el-icon {
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
  }

  code {
    padding: 2px 6px;
    background: #e0f2fe;
    border: 1px solid #bae6fd;
    border-radius: 4px;
    color: #0284c7;
    font-family: 'Consolas', monospace;
    font-size: 11px;
  }
}
</style>
