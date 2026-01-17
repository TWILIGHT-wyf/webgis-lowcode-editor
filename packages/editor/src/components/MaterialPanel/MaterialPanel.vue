<template>
  <div class="component-bar-root">
    <div class="panel-header">
      <span class="title">组件库</span>
      <el-tooltip content="组件关系图适配中" placement="bottom">
        <el-button link class="icon-btn" disabled>
          <el-icon :size="18"><Connection /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-scrollbar class="panel-body">
      <el-tabs v-model="activeTab" class="modern-tabs" stretch>
        <el-tab-pane label="基础组件" name="components">
          <div class="component-list">
            <el-collapse v-model="activeNames" class="clean-collapse">
              <el-collapse-item
                v-for="cat in categories"
                :key="cat.key"
                :title="cat.title"
                :name="cat.title"
              >
                <div class="grid-layout">
                  <div
                    class="grid-item"
                    v-for="item in cat.items"
                    :key="item.componentName"
                    draggable="true"
                    @dragstart="onDrag($event, item)"
                  >
                    <div class="item-icon">
                      <component v-if="item.icon" :is="item.icon" />
                      <span v-else class="text-icon">{{ item.label[0] }}</span>
                    </div>
                    <span class="item-label">{{ item.label }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <el-tab-pane label="页面模板" name="templates">
          <div class="templates-placeholder">
            <el-empty description="模板功能升级中，敬请期待...">
              <template #image>
                <el-icon :size="64"><DocumentCopy /></el-icon>
              </template>
            </el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import type { MaterialMeta, NodeSchema } from '@vela/core'
import { DocumentCopy, Connection } from '@element-plus/icons-vue'
import { getMaterialsByCategory, extractDefaultProps } from '@vela/materials'
import { generateId } from '@vela/core'
import type { PropValue } from '@vela/core/types/expression'

// --- 类型定义 ---
type Category = {
  key: string
  title: string
  items: Item[]
}

type Item = {
  componentName: string
  label: string
  meta: MaterialMeta
  width?: number
  height?: number
  icon?: Component
}

// --- 状态管理 ---
const activeTab = ref('components')
const activeNames = ref<string[]>([])

// --- 从物料包生成组件分类 ---
const categories = computed<Category[]>(() => {
  const grouped = getMaterialsByCategory()
  const result: Category[] = []

  // 定义分类顺序和默认尺寸
  const categoryConfig: Record<
    string,
    { order: number; defaultWidth: number; defaultHeight: number }
  > = {
    图表: { order: 1, defaultWidth: 320, defaultHeight: 200 },
    KPI: { order: 2, defaultWidth: 160, defaultHeight: 100 },
    数据展示: { order: 3, defaultWidth: 360, defaultHeight: 240 },
    基础控件: { order: 4, defaultWidth: 180, defaultHeight: 50 },
    布局容器: { order: 5, defaultWidth: 400, defaultHeight: 240 },
    内容: { order: 6, defaultWidth: 300, defaultHeight: 200 },
    媒体: { order: 7, defaultWidth: 300, defaultHeight: 200 },
    高级: { order: 8, defaultWidth: 300, defaultHeight: 150 },
  }

  Object.entries(grouped).forEach(([categoryName, materials]) => {
    const config = categoryConfig[categoryName] || {
      order: 99,
      defaultWidth: 300,
      defaultHeight: 200,
    }

    const items: Item[] = materials.map((meta) => ({
      componentName: meta.componentName,
      label: meta.title,
      meta: meta,
      width: config.defaultWidth,
      height: config.defaultHeight,
    }))

    result.push({
      key: categoryName.toLowerCase().replace(/\s+/g, '-'),
      title: categoryName,
      items,
    })
  })

  // 按配置的顺序排序
  result.sort((a, b) => {
    const orderA = categoryConfig[a.title]?.order ?? 99
    const orderB = categoryConfig[b.title]?.order ?? 99
    return orderA - orderB
  })

  // 默认展开前三个分类
  if (activeNames.value.length === 0) {
    activeNames.value = result.slice(0, 3).map((cat) => cat.title)
  }

  return result
})

// --- 拖拽处理 (适配 V1.5 架构) ---
const onDrag = (event: DragEvent, item: Item) => {
  const { componentName, meta, width, height } = item

  // 从 MaterialMeta 提取默认 props
  const defaultProps = extractDefaultProps(meta.props || [])

  // 构建完整的 NodeSchema 结构
  const nodeSchema: Partial<NodeSchema> = {
    id: generateId(componentName),
    componentName,
    props: defaultProps as Record<string, PropValue>,
    style: {
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
    },
    children: [], // V1.5 必须包含 children 字段
  }

  // 使用 V1.5 标准数据格式
  event.dataTransfer?.setData('application/x-vela', JSON.stringify(nodeSchema))
}
</script>

<style scoped>
/* 根容器：透明背景 */
.component-bar-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  overflow: hidden;
}

/* 顶部标题栏 */
.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.icon-btn {
  color: var(--text-secondary);
  transition: color 0.2s;
}
.icon-btn:hover {
  color: #4285f4;
}

/* 滚动区域 */
.panel-body {
  flex: 1;
  width: 100%;
}

/* 现代化 Tabs */
.modern-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 10px;
}
.modern-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--border-light);
}
.modern-tabs :deep(.el-tabs__item) {
  height: 48px;
  font-weight: 500;
  color: var(--text-secondary);
}
.modern-tabs :deep(.el-tabs__item.is-active) {
  color: #1967d2;
  font-weight: 600;
}

/* 现代化 Collapse */
.clean-collapse {
  border: none;
}
.clean-collapse :deep(.el-collapse-item__header) {
  border-bottom: none;
  padding-left: 20px;
  background: transparent;
  font-weight: 500;
  color: var(--text-primary);
  height: 44px;
}
.clean-collapse :deep(.el-collapse-item__wrap) {
  border-bottom: none;
  background: transparent;
}
.clean-collapse :deep(.el-collapse-item__content) {
  padding: 0 16px 16px;
  background: transparent;
}

/* 网格布局 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-hover);
  border-radius: 12px;
  padding: 12px;
  cursor: grab;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.grid-item:hover {
  background-color: #e8f0fe;
  border-color: #d2e3fc;
  color: #1967d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.item-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 6px;
  color: var(--text-secondary);
}

.item-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

/* 模板占位符 */
.templates-placeholder {
  padding: 60px 20px;
  text-align: center;
}

/* 深度选择样式覆盖 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}
:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid var(--border-light);
  padding: 20px;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
