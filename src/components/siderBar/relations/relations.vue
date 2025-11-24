<template>
  <div class="relations-panel">
    <el-scrollbar class="relations-scrollbar">
      <el-collapse v-model="activeNames">
        <!-- 组件树结构 -->
        <el-collapse-item name="tree" title="组件树">
          <div class="relation-section">
            <div class="section-header">
              <span class="label">全部组件 ({{ treeData.length }})</span>
              <el-button type="text" size="small" @click="expandAll" icon="el-icon-sort">
                {{ allExpanded ? '折叠' : '展开' }}
              </el-button>
            </div>
            <el-alert type="info" :closable="false" show-icon style="margin-bottom: 12px">
              拖拽组件到容器组件上可设置父子关系
            </el-alert>
            <el-tree
              ref="treeRef"
              :data="treeData"
              :props="treeProps"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              :highlight-current="true"
              :current-node-key="selectComponent?.id"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              @node-click="handleNodeClick"
              @node-drop="handleNodeDrop"
            >
              <template #default="{ data }">
                <div class="custom-tree-node">
                  <div class="node-info">
                    <el-icon class="node-icon">
                      <component :is="getComponentIcon(data.type)" />
                    </el-icon>
                    <span class="node-label">{{ data.label }}</span>
                    <el-tag
                      v-if="data.children && data.children.length > 0"
                      size="small"
                      type="info"
                    >
                      {{ data.children.length }}
                    </el-tag>
                  </div>
                  <div class="node-actions" @click.stop>
                    <el-button
                      type="text"
                      size="small"
                      @click="showAddChildDialog = true"
                      icon="el-icon-plus"
                      title="添加子组件"
                    />
                    <el-button
                      v-if="data.groupId"
                      type="text"
                      size="small"
                      @click="removeParentFromTree(data.id)"
                      icon="el-icon-back"
                      title="移出父组件"
                    />
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </el-collapse-item>

        <!-- 布局配置 -->
        <el-collapse-item name="layout" title="布局配置">
          <div class="relation-section">
            <el-alert
              v-if="!selectComponent?.children || selectComponent.children.length === 0"
              type="info"
              :closable="false"
              show-icon
            >
              当前组件没有子组件,布局配置仅对容器组件生效
            </el-alert>
            <el-form v-else label-position="top" size="small">
              <el-form-item label="布局模式">
                <el-select v-model="layoutMode" placeholder="选择布局模式">
                  <el-option label="绝对定位" value="absolute">
                    <div class="option-with-desc">
                      <span>绝对定位</span>
                      <span class="desc">子组件可自由拖动</span>
                    </div>
                  </el-option>
                  <el-option label="水平布局" value="horizontal">
                    <div class="option-with-desc">
                      <span>水平布局</span>
                      <span class="desc">子组件横向排列</span>
                    </div>
                  </el-option>
                  <el-option label="垂直布局" value="vertical">
                    <div class="option-with-desc">
                      <span>垂直布局</span>
                      <span class="desc">子组件纵向排列</span>
                    </div>
                  </el-option>
                  <el-option label="网格布局" value="grid">
                    <div class="option-with-desc">
                      <span>网格布局</span>
                      <span class="desc">子组件网格排列</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="layoutMode !== 'absolute'" label="组件间距">
                <el-input-number v-model="layoutGap" :min="0" :max="100" :step="1" />
              </el-form-item>

              <el-form-item v-if="layoutMode === 'grid'" label="网格列数">
                <el-input-number v-model="layoutColumns" :min="1" :max="12" :step="1" />
              </el-form-item>

              <el-form-item v-if="layoutMode !== 'absolute'" label="对齐方式">
                <el-select v-model="layoutAlign" placeholder="选择对齐">
                  <el-option label="起始对齐" value="start" />
                  <el-option label="居中对齐" value="center" />
                  <el-option label="末端对齐" value="end" />
                  <el-option label="拉伸填充" value="stretch" />
                </el-select>
              </el-form-item>

              <el-form-item label="内边距">
                <el-input-number v-model="layoutPadding" :min="0" :max="100" :step="1" />
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>

        <!-- 子组件位置 -->
        <el-collapse-item
          v-if="selectComponent?.children && selectComponent.children.length > 0"
          name="children"
          title="子组件位置"
        >
          <div class="relation-section">
            <div
              v-for="child in childrenComponents"
              :key="child.id"
              class="child-position-card"
              @dblclick="selectComponentById(child.id)"
            >
              <div class="child-header">
                <span class="child-type">{{ child.type }}</span>
                <span class="child-id">{{ child.id.slice(0, 8) }}</span>
                <el-tag size="small" type="info" style="margin-left: 8px">双击选中</el-tag>
              </div>
              <el-form label-position="top" size="small">
                <el-row :gutter="8">
                  <el-col :span="12">
                    <el-form-item label="X">
                      <el-input-number
                        v-model="child.position.x"
                        :controls="true"
                        :step="1"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Y">
                      <el-input-number
                        v-model="child.position.y"
                        :controls="true"
                        :step="1"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="8">
                  <el-col :span="12">
                    <el-form-item label="宽度">
                      <el-input-number
                        v-model="child.size.width"
                        :controls="true"
                        :step="1"
                        :min="1"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="高度">
                      <el-input-number
                        v-model="child.size.height"
                        :controls="true"
                        :step="1"
                        :min="1"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-collapse-item>

        <!-- 数据联动 -->
        <el-collapse-item name="data" title="数据联动">
          <div class="relation-section">
            <div class="section-header">
              <span class="label">数据源绑定</span>
              <el-button type="text" size="small" @click="addDataBinding" icon="el-icon-plus">
                添加
              </el-button>
            </div>
            <div v-if="dataBindings.length > 0" class="bindings-list">
              <div v-for="(binding, index) in dataBindings" :key="index" class="binding-card">
                <el-select
                  v-model="binding.sourceId"
                  placeholder="数据源组件"
                  size="small"
                  filterable
                >
                  <el-option
                    v-for="comp in otherComponents"
                    :key="comp.id"
                    :label="`${comp.type} (${comp.id.slice(0, 8)})`"
                    :value="comp.id"
                  />
                </el-select>
                <el-input v-model="binding.sourcePath" placeholder="源字段路径" size="small" />
                <span class="arrow">→</span>
                <el-input v-model="binding.targetPath" placeholder="目标字段路径" size="small" />
                <el-button
                  type="text"
                  size="small"
                  @click="removeDataBinding(index)"
                  icon="el-icon-delete"
                />
              </div>
            </div>
            <el-empty v-else description="暂无数据绑定" :image-size="60" />
          </div>
        </el-collapse-item>

        <!-- 组合关系 -->
        <el-collapse-item name="grouping" title="组合关系">
          <div class="relation-section">
            <div class="section-header">
              <span class="label">所属组合</span>
            </div>
            <div
              v-if="groupComponent"
              class="component-card"
              @click="selectComponentById(groupComponent.id)"
            >
              <div class="component-type">{{ groupComponent.type }}</div>
              <div class="component-id">ID: {{ groupComponent.id.slice(0, 8) }}</div>
              <el-button
                type="text"
                size="small"
                @click.stop="removeFromGroup"
                icon="el-icon-delete"
                class="remove-btn"
              />
            </div>
            <el-empty v-else description="未加入组合" :image-size="60" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>

    <!-- 添加子组件对话框 -->
    <el-dialog v-model="showAddChildDialog" title="添加子组件" width="400px">
      <el-select
        v-model="selectedChildId"
        placeholder="选择要添加的组件"
        filterable
        style="width: 100%"
      >
        <el-option
          v-for="comp in availableChildren"
          :key="comp.id"
          :label="`${comp.type} (${comp.id.slice(0, 8)})`"
          :value="comp.id"
        />
      </el-select>
      <template #footer>
        <el-button @click="showAddChildDialog = false">取消</el-button>
        <el-button type="primary" @click="addChild">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Document, FolderOpened } from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useComponentHierarchy, useDataBindings, useDialogState } from './relations'

// 激活的面板
const activeNames = ref(['graph'])

// 组件层级关系
const {
  selectComponent,
  childrenComponents,
  groupComponent,
  availableChildren,
  otherComponents,
  addChild: addChildToComponent,
  removeFromGroup,
  selectComponentById,
  components,
} = useComponentHierarchy()

// 数据联动
const { dataBindings, addDataBinding, removeDataBinding } = useDataBindings()

// 对话框状态
const { showAddChildDialog, selectedChildId, closeAddChildDialog } = useDialogState()

// 树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()
const allExpanded = ref(false)

interface TreeNode {
  id: string
  label: string
  type: string
  groupId?: string
  children?: TreeNode[]
}

const treeProps = {
  children: 'children',
  label: 'label',
}

// 构建树形数据
const treeData = computed<TreeNode[]>(() => {
  // 计算同类型组件的序号
  const typeCountMap = new Map<string, number>()
  const typeIndexMap = new Map<string, number>()

  // 统计每种类型的数量
  components.value.forEach((c) => {
    const count = typeCountMap.get(c.type) || 0
    typeCountMap.set(c.type, count + 1)
  })

  const buildTree = (compId: string): TreeNode => {
    const comp = components.value.find((c) => c.id === compId)
    if (!comp) return { id: compId, label: 'Unknown', type: 'Unknown' }

    // 优先使用自定义名称
    let label = ''
    if (comp.name) {
      label = comp.name
    } else {
      // 获取当前类型的序号
      const currentIndex = (typeIndexMap.get(comp.type) || 0) + 1
      typeIndexMap.set(comp.type, currentIndex)

      // 如果同类型组件多于1个，显示序号
      const count = typeCountMap.get(comp.type) || 0
      if (count > 1) {
        label = `${comp.type} #${currentIndex}`
      } else {
        label = comp.type
      }
    }

    const node: TreeNode = {
      id: comp.id,
      label: label,
      type: comp.type,
      groupId: comp.groupId,
    }

    if (comp.children && comp.children.length > 0) {
      node.children = comp.children.map(buildTree)
    }

    return node
  }

  // 只显示顶层组件(无父组件的组件)
  const topLevel = components.value.filter((c) => !c.groupId)
  return topLevel.map((c) => buildTree(c.id))
})

// 树节点点击
function handleNodeClick(data: TreeNode) {
  selectComponentById(data.id)
}

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

// 获取所有节点的key
function getAllNodeKeys(nodes: TreeNode[]): string[] {
  const keys: string[] = []
  nodes.forEach((node) => {
    keys.push(node.id)
    if (node.children) {
      keys.push(...getAllNodeKeys(node.children))
    }
  })
  return keys
}

// 获取组件图标
function getComponentIcon(type: string) {
  // 可以根据组件类型返回不同图标
  if (['Badge', 'Group'].includes(type)) {
    return FolderOpened
  }
  return Document
}

// 从树中移除父组件
function removeParentFromTree(childId: string) {
  const child = components.value.find((c) => c.id === childId)
  if (child && child.groupId) {
    const parent = components.value.find((c) => c.id === child.groupId)
    if (parent && parent.children) {
      parent.children = parent.children.filter((id) => id !== childId)
    }
    child.groupId = undefined
  }
}

// 树节点拖拽相关
interface TreeNodeInstance {
  data: TreeNode
}

function allowDrop(draggingNode: TreeNodeInstance, dropNode: TreeNodeInstance, type: string) {
  // 只允许拖入容器组件内部
  if (type === 'inner') {
    const dropNodeData = dropNode.data
    const draggingNodeData = draggingNode.data

    // 不能拖入自己
    if (dropNodeData.id === draggingNodeData.id) return false

    // 检查目标是否为容器组件
    const targetComp = components.value.find((c) => c.id === dropNodeData.id)
    if (!targetComp) return false

    // Text 组件不能作为容器
    if (targetComp.type === 'Text') return false

    // 不能拖入自己的子组件
    if (targetComp.groupId === draggingNodeData.id) return false

    return true
  }
  return false
}

function allowDrag() {
  // 所有组件都允许拖拽
  return true
}

function handleNodeDrop(
  draggingNode: TreeNodeInstance,
  dropNode: TreeNodeInstance,
  dropType: string,
) {
  if (dropType === 'inner') {
    const draggingNodeData = draggingNode.data
    const dropNodeData = dropNode.data

    const child = components.value.find((c) => c.id === draggingNodeData.id)
    const parent = components.value.find((c) => c.id === dropNodeData.id)

    if (!child || !parent) return

    // 移除原来的父子关系
    if (child.groupId) {
      const oldParent = components.value.find((c) => c.id === child.groupId)
      if (oldParent && oldParent.children) {
        oldParent.children = oldParent.children.filter((id) => id !== child.id)
      }
    }

    // 建立新的父子关系
    if (!parent.children) {
      parent.children = []
    }
    if (!parent.children.includes(child.id)) {
      parent.children.push(child.id)
    }
    child.groupId = parent.id

    // 初始化父组件的布局配置
    if (!parent.layout) {
      parent.layout = {
        mode: 'absolute',
        gap: 8,
        columns: 2,
        align: 'start',
        padding: 0,
      }
    }
  }
}

// 添加子组件（包含对话框关闭逻辑）
function addChild() {
  if (!selectedChildId.value) return
  addChildToComponent(selectedChildId.value)
  closeAddChildDialog()
}

// 布局配置
const layoutMode = computed({
  get: () => selectComponent.value?.layout?.mode || 'absolute',
  set: (val) => {
    if (!selectComponent.value) return
    if (!selectComponent.value.layout) {
      selectComponent.value.layout = {
        mode: val as 'absolute' | 'horizontal' | 'vertical' | 'grid',
      }
    } else {
      selectComponent.value.layout.mode = val as 'absolute' | 'horizontal' | 'vertical' | 'grid'
    }
  },
})

const layoutGap = computed({
  get: () => selectComponent.value?.layout?.gap ?? 8,
  set: (val) => {
    if (!selectComponent.value?.layout) return
    selectComponent.value.layout.gap = val
  },
})

const layoutColumns = computed({
  get: () => selectComponent.value?.layout?.columns ?? 2,
  set: (val) => {
    if (!selectComponent.value?.layout) return
    selectComponent.value.layout.columns = val
  },
})

const layoutAlign = computed({
  get: () => selectComponent.value?.layout?.align || 'start',
  set: (val) => {
    if (!selectComponent.value?.layout) return
    selectComponent.value.layout.align = val as 'start' | 'center' | 'end' | 'stretch'
  },
})

const layoutPadding = computed({
  get: () => selectComponent.value?.layout?.padding ?? 0,
  set: (val) => {
    if (!selectComponent.value?.layout) return
    selectComponent.value.layout.padding = val
  },
})

// 监听布局模式变化,初始化 layout 对象
watch(
  () => selectComponent.value,
  (newVal) => {
    if (newVal && !newVal.layout && newVal.children && newVal.children.length > 0) {
      newVal.layout = {
        mode: 'absolute',
        gap: 8,
        columns: 2,
        align: 'start',
        padding: 0,
      }
    }
  },
  { immediate: true },
)

// ==================== 关系图谱 ====================
const graphContainer = ref<HTMLDivElement>()
const graphType = ref<'all' | 'hierarchy' | 'events' | 'data'>('all')
let chartInstance: echarts.ECharts | null = null

// 初始化 ECharts
function initChart() {
  if (!graphContainer.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(graphContainer.value)
  updateChart()
}

// 更新图表
function updateChart() {
  if (!chartInstance) return

  const { nodes, links } = buildGraphData()

  const option: EChartsOption = {
    tooltip: {
      formatter: (params) => {
        if (typeof params === 'object' && !Array.isArray(params)) {
          if (params.dataType === 'node') {
            const nodeData = params.data as GraphNode
            return `${nodeData.name}<br/>类型: ${nodeData.type}`
          } else if (params.dataType === 'edge') {
            const linkData = params.data as GraphLink
            return `${linkData.relationName}`
          }
        }
        return ''
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        roam: true,
        draggable: true, // 允许节点拖拽
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
        },
        labelLayout: {
          hideOverlap: true,
        },
        scaleLimit: {
          min: 0.4,
          max: 2,
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
          },
        },
        force: {
          repulsion: 150,
          edgeLength: [100, 200],
          layoutAnimation: true, // 拖拽时动画效果
        },
      },
    ],
  }

  chartInstance.setOption(option)

  // 点击节点选中组件
  chartInstance.off('click')
  chartInstance.on('click', (params) => {
    if (params.dataType === 'node' && params.data) {
      const nodeData = params.data as GraphNode
      selectComponentById(nodeData.id)
    }
  })
}

// 图数据类型
interface GraphNode {
  id: string
  name: string
  type: string
  symbolSize: number
  itemStyle: {
    color: string
  }
}

interface GraphLink {
  source: string
  target: string
  relationName: string
  lineStyle: {
    color: string
    width: number
    type?: 'solid' | 'dashed' | 'dotted'
  }
}

// 构建图数据
function buildGraphData() {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []

  // 构建节点
  components.value.forEach((comp) => {
    const hasChildren = comp.children && comp.children.length > 0
    nodes.push({
      id: comp.id,
      name: `${comp.type}\n(${comp.id.slice(0, 6)})`,
      type: comp.type,
      symbolSize: hasChildren ? 40 : 30,
      itemStyle: {
        color: hasChildren ? '#91cc75' : '#5470c6',
      },
    })
  })

  // 根据类型过滤关系
  if (graphType.value === 'all' || graphType.value === 'hierarchy') {
    // 父子关系
    components.value.forEach((comp) => {
      if (comp.groupId) {
        links.push({
          source: comp.groupId,
          target: comp.id,
          relationName: '父子关系',
          lineStyle: {
            color: '#409eff',
            width: 2,
          },
        })
      }
    })
  }

  // TODO: 事件交互关系需要从组件数据结构中读取
  // if (graphType.value === 'all' || graphType.value === 'events') {
  //   // 事件交互关系将在事件数据集成到组件后实现
  // }

  if (graphType.value === 'all' || graphType.value === 'data') {
    // 数据联动关系
    dataBindings.value.forEach((binding) => {
      if (binding.sourceId && selectComponent.value) {
        links.push({
          source: binding.sourceId,
          target: selectComponent.value.id,
          relationName: `数据绑定: ${binding.sourcePath} → ${binding.targetPath}`,
          lineStyle: {
            color: '#e6a23c',
            width: 2,
            type: 'dashed',
          },
        })
      }
    })
  }

  return { nodes, links }
}

// 监听数据变化,更新图表
watch(
  [() => components.value.length, graphType, dataBindings],
  () => {
    nextTick(() => {
      if (chartInstance) {
        updateChart()
      }
    })
  },
  { deep: true },
)

// 监听面板展开,只在首次展开且未初始化时初始化图表
watch(activeNames, (newVal) => {
  if (newVal.includes('graph') && !chartInstance) {
    nextTick(() => {
      initChart()
    })
  }
})

// 监听 components 变化,实时更新关系图
watch(
  () => components.value,
  () => {
    if (chartInstance && activeNames.value.includes('graph')) {
      const { nodes, links } = buildGraphData()
      chartInstance.setOption({
        series: [
          {
            data: nodes,
            links: links,
          },
        ],
      })
    }
  },
  { deep: true },
)

// 监听图表类型切换,更新图表
watch(graphType, () => {
  if (chartInstance) {
    const { nodes, links } = buildGraphData()
    chartInstance.setOption({
      series: [
        {
          data: nodes,
          links: links,
        },
      ],
    })
  }
})

// 生命周期
onMounted(() => {
  if (activeNames.value.includes('graph')) {
    nextTick(() => {
      initChart()
    })
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped lang="scss">
.relations-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .relations-scrollbar {
    height: 100%;

    :deep(.el-scrollbar__view) {
      height: 100%;
    }
  }

  :deep(.el-collapse) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 500;
    color: #303133;
  }

  :deep(.el-collapse-item__content) {
    padding: 16px;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
}

.relation-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.current-component {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #b3d8ff;

  .label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 8px;
  }

  .component-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .component-type {
      font-weight: 500;
      color: #409eff;
    }

    .component-id {
      font-size: 12px;
      color: #909399;
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .label {
    font-size: 14px;
    font-weight: 500;
    color: #606266;
  }
}

.component-card {
  padding: 10px 12px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  &:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
  }

  .component-type {
    font-weight: 500;
    color: #303133;
    font-size: 13px;
  }

  .component-id {
    font-size: 12px;
    color: #909399;
  }

  .remove-btn {
    color: #f56c6c;

    &:hover {
      color: #f56c6c;
    }
  }
}

.children-list {
  max-height: 300px;
  overflow-y: auto;
}

.actions-list,
.bindings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 4px;

  .el-select {
    flex: 1;
  }
}

.binding-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 4px;

  .el-select,
  .el-input {
    flex: 1;
  }

  .arrow {
    color: #909399;
    font-weight: bold;
  }
}

.parent-section,
.children-section {
  margin-bottom: 20px;

  .el-select {
    width: 100%;
  }
}

:deep(.el-empty) {
  padding: 20px 0;

  .el-empty__description {
    font-size: 12px;
  }
}

// 树形结构样式
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .node-info {
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

// 子组件位置卡片
.child-position-card {
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
  }

  .child-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;

    .child-type {
      font-weight: 500;
      color: #303133;
    }

    .child-id {
      font-size: 12px;
      color: #909399;
    }
  }
}

// 选项描述样式
.option-with-desc {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .desc {
    font-size: 12px;
    color: #909399;
  }
}

// 关系图谱样式
.graph-container {
  width: 100%;
  height: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
}

.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #606266;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .legend-line {
    width: 20px;
    height: 2px;
  }
}
</style>
