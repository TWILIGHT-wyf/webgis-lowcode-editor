<template>
  <div class="properties-panel">
    <el-scrollbar class="properties-scrollbar">
      <!-- 未选中任何组件时显示画布配置 -->
      <div v-if="!selectComponent" class="canvas-config">
        <el-form label-position="top" size="small">
          <el-form-item label="画布宽度">
            <el-input-number
              :model-value="canvasWidth"
              @update:model-value="setCanvasSize($event, canvasHeight)"
              :min="100"
              :max="10000"
              :step="10"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="画布高度">
            <el-input-number
              :model-value="canvasHeight"
              @update:model-value="setCanvasSize(canvasWidth, $event)"
              :min="100"
              :max="10000"
              :step="10"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker v-model="canvasConfig.backgroundColor" show-alpha />
          </el-form-item>
          <el-form-item label="显示网格">
            <el-switch v-model="canvasConfig.showGrid" active-text="显示" inactive-text="隐藏" />
          </el-form-item>
          <template v-if="canvasConfig.showGrid">
            <el-form-item label="网格大小(px)">
              <el-input-number
                v-model="canvasConfig.gridSize"
                :min="5"
                :max="100"
                :step="5"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="主网格大小(px)">
              <el-input-number
                v-model="canvasConfig.gridMajorSize"
                :min="20"
                :max="500"
                :step="10"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="网格颜色">
              <el-color-picker v-model="canvasConfig.gridColor" />
            </el-form-item>
            <el-form-item label="主网格颜色">
              <el-color-picker v-model="canvasConfig.gridMajorColor" />
            </el-form-item>
          </template>
          <el-form-item label="背景图片URL">
            <el-input
              v-model="canvasConfig.backgroundImage"
              placeholder="https://example.com/bg.jpg"
              clearable
            />
          </el-form-item>
        </el-form>

        <el-space direction="vertical" :size="8" style="width: 100%">
          <el-alert type="info" :closable="false">
            <template #title> <strong>Ctrl + 拖动</strong>：吸附到网格 </template>
          </el-alert>
          <el-alert type="info" :closable="false">
            <template #title> <strong>Alt + 点击</strong>：选中锁定的组件 </template>
          </el-alert>
          <el-alert type="success" :closable="false">
            <template #title> <strong>Ctrl + C / V</strong>：复制/粘贴组件 </template>
          </el-alert>
          <el-alert type="success" :closable="false">
            <template #title> <strong>Delete</strong>：删除选中组件 </template>
          </el-alert>
        </el-space>
      </div>

      <!-- 选中组件时显示属性表单 -->
      <div v-else class="properties-form">
        <!-- 多选提示 -->
        <el-alert
          v-if="isMultiSelect"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 16px"
        >
          <template #title>
            已选中 {{ selectedIds.length }} 个组件，修改属性将应用到所有选中组件
          </template>
        </el-alert>
        <!-- 组件基本信息 -->
        <el-collapse v-model="activeCollapse" accordion>
          <!-- 基础信息 -->
          <el-collapse-item title="基础" name="basic">
            <el-form label-position="top" size="small">
              <el-form-item label="组件ID">
                <el-input v-model="selectComponent.id" disabled />
              </el-form-item>
              <el-form-item label="组件类型">
                <el-input v-model="selectComponent.type" disabled />
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="X">
                    <el-input-number
                      v-model="selectComponent.position.x"
                      :controls="true"
                      :step="1"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y">
                    <el-input-number
                      v-model="selectComponent.position.y"
                      :controls="true"
                      :step="1"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item label="宽">
                    <el-input-number
                      v-model="selectComponent.size.width"
                      :controls="true"
                      :step="1"
                      :min="10"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="高">
                    <el-input-number
                      v-model="selectComponent.size.height"
                      :controls="true"
                      :step="1"
                      :min="10"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="旋转">
                <el-slider v-model="rotationForUi" :min="0" :max="360" :step="1" show-input />
              </el-form-item>
              <el-form-item label="Z-Index">
                <el-input-number
                  v-model="selectComponent.zindex"
                  :controls="true"
                  :step="1"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="层级操作">
                <el-space wrap>
                  <el-button size="small" @click="handleBringToFront">
                    <el-icon><Top /></el-icon>
                    置顶
                  </el-button>
                  <el-button size="small" @click="handleBringForward">
                    <el-icon><CaretTop /></el-icon>
                    上移
                  </el-button>
                  <el-button size="small" @click="handleSendBackward">
                    <el-icon><CaretBottom /></el-icon>
                    下移
                  </el-button>
                  <el-button size="small" @click="handleSendToBack">
                    <el-icon><Bottom /></el-icon>
                    置底
                  </el-button>
                </el-space>
              </el-form-item>
            </el-form>
          </el-collapse-item>

          <!-- 样式 -->
          <el-collapse-item title="样式" name="style">
            <el-form label-position="top" size="small">
              <el-form-item label="不透明度">
                <el-slider
                  v-model="selectComponent.style.opacity"
                  :min="0"
                  :max="100"
                  :step="1"
                  show-input
                />
              </el-form-item>
              <el-form-item label="可见性">
                <el-switch
                  v-model="selectComponent.style.visible"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </el-form-item>
              <el-form-item label="锁定">
                <el-switch
                  v-model="selectComponent.style.locked"
                  active-text="已锁定"
                  inactive-text="未锁定"
                />
              </el-form-item>
            </el-form>
            <el-form label-position="top" size="small">
              <template v-if="styleSchema.length">
                <!-- Row 类型：样式字段写入 props，其他类型写入 style -->
                <template v-if="isRow">
                  <template v-for="field in styleSchema" :key="field.key">
                    <el-form-item :label="field.label">
                      <el-input
                        v-if="field.type === 'text'"
                        v-model="selectComponent.props[field.key]"
                        :placeholder="field.placeholder"
                      />
                      <el-input-number
                        v-else-if="field.type === 'number'"
                        v-model="selectComponent.props[field.key]"
                        :min="field.min"
                        :max="field.max"
                        :step="field.step ?? 1"
                        style="width: 100%"
                      />
                      <el-color-picker
                        v-else-if="field.type === 'color'"
                        v-model="selectComponent.props[field.key]"
                      />
                      <el-select
                        v-else-if="field.type === 'select'"
                        v-model="selectComponent.props[field.key]"
                        style="width: 100%"
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
                      />
                    </el-form-item>
                  </template>
                </template>
                <template v-else>
                  <template v-for="field in styleSchema" :key="field.key">
                    <el-form-item :label="field.label">
                      <el-input
                        v-if="field.type === 'text'"
                        v-model="selectComponent.style[field.key]"
                        :placeholder="field.placeholder"
                      />
                      <el-input-number
                        v-else-if="field.type === 'number'"
                        v-model="selectComponent.style[field.key]"
                        :min="field.min"
                        :max="field.max"
                        :step="field.step ?? 1"
                        style="width: 100%"
                      />
                      <el-color-picker
                        v-else-if="field.type === 'color'"
                        v-model="selectComponent.style[field.key]"
                      />
                      <el-select
                        v-else-if="field.type === 'select'"
                        v-model="selectComponent.style[field.key]"
                        style="width: 100%"
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
                        v-model="selectComponent.style[field.key]"
                      />
                    </el-form-item>
                  </template>
                </template>
              </template>
            </el-form>
          </el-collapse-item>

          <!-- 数据来源 -->
          <el-collapse-item v-if="dataSourceSchema.length" title="数据来源" name="dataSource">
            <el-form label-position="top" size="small">
              <template v-for="field in dataSourceSchema" :key="field.key">
                <el-form-item :label="field.label">
                  <template v-if="field.type === 'text' && selectComponent.dataSource">
                    <el-input
                      v-if="field.key === 'headers'"
                      v-model="headersInput"
                      :placeholder="field.placeholder"
                      type="textarea"
                      :rows="3"
                      @change="applyHeadersFromInput"
                      @blur="applyHeadersFromInput"
                    />
                    <el-input
                      v-else
                      v-model="selectComponent.dataSource[field.key]"
                      :placeholder="field.placeholder"
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
                    style="width: 100%"
                    @change="storeComponent.commitDebounced()"
                    @blur="storeComponent.commitDebounced()"
                  />
                  <el-select
                    v-else-if="field.type === 'select' && selectComponent.dataSource"
                    v-model="selectComponent.dataSource[field.key]"
                    style="width: 100%"
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

            <!-- 数据源预览 -->
            <el-divider v-if="selectComponent.dataSource?.enabled" content-position="left">
              <el-text size="small" type="info">数据预览</el-text>
            </el-divider>
            <div v-if="selectComponent.dataSource?.enabled" style="margin-top: 12px">
              <el-alert v-if="previewLoading" type="info" :closable="false" show-icon>
                <template #title>正在加载数据...</template>
              </el-alert>
              <el-alert v-else-if="previewError" type="error" :closable="false" show-icon>
                <template #title>{{ previewError }}</template>
              </el-alert>
              <div v-else-if="previewData" style="max-height: 300px; overflow: auto">
                <el-input
                  :model-value="JSON.stringify(previewData, null, 2)"
                  type="textarea"
                  :rows="10"
                  readonly
                  style="font-family: 'Consolas', monospace; font-size: 12px"
                />
              </div>
              <el-empty v-else description="暂无数据" :image-size="60" />
            </div>
          </el-collapse-item>

          <!-- 组件自定义配置 -->
          <el-collapse-item v-if="componentSchema.length" title="组件配置" name="component">
            <el-form label-position="top" size="small">
              <template v-for="field in componentSchema" :key="field.key">
                <el-form-item :label="field.label">
                  <template v-if="field.type === 'text'">
                    <el-input
                      v-model="componentFieldInput[field.key]"
                      type="textarea"
                      :rows="4"
                      :placeholder="field.placeholder"
                      @blur="applyComponentField(field.key)"
                    />
                  </template>
                  <el-color-picker
                    v-else-if="field.type === 'color'"
                    v-model="selectComponent.props[field.key]"
                    show-alpha
                    @change="storeComponent.commitDebounced()"
                  />
                  <el-input-number
                    v-else-if="field.type === 'number'"
                    v-model="selectComponent.props[field.key]"
                    :min="field.min"
                    :max="field.max"
                    :step="field.step ?? 1"
                    style="width: 100%"
                    @change="storeComponent.commitDebounced()"
                  />
                  <el-select
                    v-else-if="field.type === 'select'"
                    v-model="selectComponent.props[field.key]"
                    style="width: 100%"
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

        <!-- 文本内容 -->
        <div v-if="selectComponent.type === 'Text'" class="text-content-section">
          <el-form label-position="top" size="small">
            <el-form-item label="文本内容">
              <el-input
                v-model="selectComponent.props.text"
                type="textarea"
                :rows="4"
                placeholder="请输入文本内容"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="danger" size="small" style="width: 100%" @click="handleDelete">
            删除组件
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Top, Bottom, CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import { useSizeStore } from '@/stores/size'
import { storeToRefs } from 'pinia'
import { customProperties } from './properties'
import { useDataSource } from '@/datasource/useDataSource'
// 状态管理
const storeComponent = useComponent()
const { selectComponent, selectedIds } = storeToRefs(storeComponent)
const sizeStore = useSizeStore()
const { width: canvasWidth, height: canvasHeight, canvasConfig } = storeToRefs(sizeStore)
const { setSize: setCanvasSize } = sizeStore

const activeCollapse = ref(['basic'])
const canvasActiveCollapse = ref(['canvas'])
const { styleSchema, dataSourceSchema, componentSchema } = customProperties()
const isRow = computed(() => {
  const t = selectComponent.value?.type
  return t === 'Row' || t === 'layout.row'
})

// 数据源预览
const {
  data: previewData,
  loading: previewLoading,
  error: previewError,
} = useDataSource(computed(() => selectComponent.value?.dataSource))

// DataSource.headers 使用字符串输入并在提交时解析为对象，避免类型不匹配
const headersInput = ref('')

function applyHeadersFromInput() {
  const ds = selectComponent.value?.dataSource
  if (!ds) return
  try {
    const text = headersInput.value.trim()
    ds.headers = text ? (JSON.parse(text) as Record<string, string>) : {}
    storeComponent.commitDebounced()
  } catch {
    // 非法 JSON 时，不落库，仅保持输入框文本
  }
}

// 切换组件或数据源变更时，同步输入框展示
watch(
  () => selectComponent.value?.dataSource,
  (ds) => {
    if (!ds) return
    const raw = ds.headers
    if (typeof raw === 'string') {
      headersInput.value = raw
    } else {
      headersInput.value = JSON.stringify(raw ?? {}, null, 2)
    }
  },
  { immediate: true, deep: true },
)

// 组件字段输入缓存（用于 JSON 文本输入 -> props 值）
const componentFieldInput = ref<Record<string, string>>({})

function applyComponentField(key: string) {
  const comp = selectComponent.value
  if (!comp) return
  const text = componentFieldInput.value[key]?.trim() ?? ''
  if (!text) {
    // 设置为空值
    Reflect.set(comp.props as Record<string, unknown>, key, undefined)
    storeComponent.commitDebounced()
    return
  }
  // 尝试解析 JSON，否则当作普通字符串
  try {
    const parsed = JSON.parse(text)
    Reflect.set(comp.props as Record<string, unknown>, key, parsed)
  } catch {
    Reflect.set(comp.props as Record<string, unknown>, key, text)
  }
  storeComponent.commitDebounced()
}

// 当切换组件或组件 props 改变时，同步 componentFieldInput
watch(
  () => selectComponent.value,
  (comp) => {
    if (!comp) {
      componentFieldInput.value = {}
      return
    }
    // 初始化 componentSchema 字段默认值（若 props 缺失）
    for (const f of componentSchema.value) {
      if (!('props' in comp) || !comp.props) comp.props = {}
      if (comp.props[f.key] === undefined) {
        Reflect.set(comp.props as Record<string, unknown>, f.key, f.default ?? undefined)
      }
      // 同步到输入缓存（JSON 格式化）
      const v = comp.props[f.key]
      componentFieldInput.value[f.key] =
        v === undefined ? '' : typeof v === 'string' ? v : JSON.stringify(v, null, 2)
    }
  },
  { immediate: true, deep: true },
)

// 多选提示
const isMultiSelect = computed(() => selectedIds.value.length > 1)

// 旋转
const rotationForUi = computed({
  get: () => {
    const rot = selectComponent.value?.rotation ?? 0
    const n = rot % 360
    return n < 0 ? n + 360 : n
  },
  set: (val: number) => {
    const comp = selectComponent.value
    if (!comp) return
    const current = comp.rotation ?? 0
    const k = Math.round((current - val) / 360)
    const target = val + 360 * k
    storeComponent.updateComponentRotation(target)
  },
})

// 事件处理函数
const handleBringToFront = () => {
  const id = selectComponent.value?.id
  if (id) storeComponent.bringToFront(id)
}

const handleBringForward = () => {
  const id = selectComponent.value?.id
  if (id) storeComponent.bringForward(id)
}

const handleSendBackward = () => {
  const id = selectComponent.value?.id
  if (id) storeComponent.sendBackward(id)
}

const handleSendToBack = () => {
  const id = selectComponent.value?.id
  if (id) storeComponent.sendToBack(id)
}

const handleDelete = () => {
  if (isMultiSelect.value) {
    storeComponent.removeMultipleComponents([...selectedIds.value])
  } else {
    const id = selectComponent.value?.id
    if (id) storeComponent.removeComponent(id)
  }
}

// 监听属性变化，批量同步到所有选中组件
watch(
  () => selectComponent.value?.position,
  (newPos) => {
    if (!isMultiSelect.value || !newPos) return
    selectedIds.value.forEach((id) => {
      const comp = storeComponent.componentStore.find((c) => c.id === id)
      if (comp && comp.id !== selectComponent.value?.id) {
        comp.position.x = newPos.x
        comp.position.y = newPos.y
      }
    })
    // 记录批量修改历史
    storeComponent.commitDebounced()
  },
  { deep: true },
)

watch(
  () => selectComponent.value?.size,
  (newSize) => {
    if (!isMultiSelect.value || !newSize) return
    selectedIds.value.forEach((id) => {
      const comp = storeComponent.componentStore.find((c) => c.id === id)
      if (comp && comp.id !== selectComponent.value?.id) {
        comp.size.width = newSize.width
        comp.size.height = newSize.height
      }
    })
    // 记录批量修改历史
    storeComponent.commitDebounced()
  },
  { deep: true },
)

watch(
  () => selectComponent.value?.rotation,
  (newRotation) => {
    if (!isMultiSelect.value || newRotation === undefined) return
    selectedIds.value.forEach((id) => {
      const comp = storeComponent.componentStore.find((c) => c.id === id)
      if (comp && comp.id !== selectComponent.value?.id) {
        comp.rotation = newRotation
      }
    })
    // 记录批量修改历史
    storeComponent.commitDebounced()
  },
)

watch(
  () => selectComponent.value?.style,
  (newStyle) => {
    if (!isMultiSelect.value || !newStyle) return
    selectedIds.value.forEach((id) => {
      const comp = storeComponent.componentStore.find((c) => c.id === id)
      if (comp && comp.id !== selectComponent.value?.id && comp.style) {
        // 同步样式属性
        Object.assign(comp.style, { ...newStyle })
      }
    })
    // 记录批量修改历史
    storeComponent.commitDebounced()
  },
  { deep: true },
)

watch(
  () => selectComponent.value,
  (comp) => {
    if (!comp) return
    if (!('style' in comp) || !comp.style) {
      comp.style = {}
    }
    if (comp.style.opacity === undefined) comp.style.opacity = 100
    if (comp.style.visible === undefined) comp.style.visible = true
    if (comp.style.locked === undefined) comp.style.locked = false
    // 初始化样式字段默认值
    for (const f of styleSchema.value) {
      if (isRow.value) {
        if (comp.props[f.key] === undefined) {
          Reflect.set(comp.props as Record<string, unknown>, f.key, f.default)
        }
      } else {
        if (comp.style[f.key] === undefined) {
          Reflect.set(comp.style as Record<string, unknown>, f.key, f.default)
        }
      }
    }
    // 初始化 props
    if (!('props' in comp) || !comp.props) comp.props = {}
    if (!comp.props.text) comp.props.text = '示例文本'
    // 初始化 dataSource
    if (!('dataSource' in comp) || !comp.dataSource) {
      comp.dataSource = {
        enabled: false,
        url: '',
        method: 'GET',
        headers: {},
        body: '',
        interval: 0,
        dataPath: '',
      }
    }
    for (const f of dataSourceSchema.value) {
      if (comp.dataSource[f.key] === undefined) {
        comp.dataSource[f.key] = f.default as never
      }
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.properties-panel {
  height: 100%;
  background: #fff;
  border-left: 1px solid #e4e7ed;
}

.properties-scrollbar {
  height: 100%;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
}

.properties-form {
  padding: 16px;
}

.properties-form :deep(.el-collapse) {
  border: none;
}

.properties-form :deep(.el-collapse-item__header) {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  background: #f5f7fa;
  padding: 0 12px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.properties-form :deep(.el-collapse-item__wrap) {
  border: none;
}

.properties-form :deep(.el-collapse-item__content) {
  padding-bottom: 16px;
}

.properties-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.properties-form :deep(.el-form-item__label) {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  padding-bottom: 4px;
}

.text-content-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.action-buttons {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.properties-scrollbar > .el-scrollbar__wrap) {
  overflow-x: hidden;
}

.properties-panel,
.properties-form,
.properties-form * {
  box-sizing: border-box;
}
</style>
