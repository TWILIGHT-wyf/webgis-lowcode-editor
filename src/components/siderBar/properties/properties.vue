<template>
  <div class="properties-panel">
    <el-scrollbar class="properties-scrollbar">
      <!-- 未选中任何组件时的提示 -->
      <div v-if="!selectComponent" class="empty-state">
        <el-empty description="未选中任何组件" />
      </div>

      <!-- 选中组件时显示属性表单 -->
      <div v-else class="properties-form">
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
            </el-form>
          </el-collapse-item>

          <!-- 数据来源 -->
          <el-collapse-item v-if="dataSourceSchema.length" title="数据来源" name="dataSource">
            <el-form label-position="top" size="small">
              <template v-for="field in dataSourceSchema" :key="field.key">
                <el-form-item :label="field.label">
                  <el-input
                    v-if="field.type === 'text' && selectComponent.dataSource"
                    v-model="selectComponent.dataSource[field.key]"
                    :placeholder="field.placeholder"
                  />
                  <el-input-number
                    v-else-if="field.type === 'number' && selectComponent.dataSource"
                    v-model="selectComponent.dataSource[field.key]"
                    :min="field.min"
                    :max="field.max"
                    :step="field.step ?? 1"
                    style="width: 100%"
                  />
                  <el-select
                    v-else-if="field.type === 'select' && selectComponent.dataSource"
                    v-model="selectComponent.dataSource[field.key]"
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
                    v-else-if="field.type === 'switch' && selectComponent.dataSource"
                    v-model="selectComponent.dataSource[field.key]"
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
import { storeToRefs } from 'pinia'
import { customProperties } from './properties'
// 状态管理
const storeComponent = useComponent()
const { selectComponent } = storeToRefs(storeComponent)
const activeCollapse = ref(['basic'])
const { styleSchema, dataSourceSchema } = customProperties()

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
  const id = selectComponent.value?.id
  if (id) storeComponent.removeComponent(id)
}

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
      if (comp.style[f.key] === undefined) comp.style[f.key] = f.default as never
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

/* 滚动条样式 */
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>
