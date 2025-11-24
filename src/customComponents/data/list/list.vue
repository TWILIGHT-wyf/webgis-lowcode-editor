<template>
  <div class="list-container" :style="containerStyle">
    <el-scrollbar :height="computedScrollHeight">
      <div v-if="listData.length === 0" class="empty-state">
        <el-empty :description="emptyText" :image-size="80" />
      </div>
      <div v-else class="list-wrapper">
        <div
          v-for="(item, index) in listData"
          :key="index"
          class="list-item"
          :style="getItemStyle(index)"
          @click="handleItemClick(item, index)"
        >
          <!-- 带图标的列表项 -->
          <div v-if="showIcon" class="item-icon" :style="iconStyle">
            <el-icon :size="iconSize">
              <component :is="getIcon()" />
            </el-icon>
          </div>

          <!-- 内容区 -->
          <div class="item-content" :style="contentStyle">
            <div v-if="showTitle" class="item-title" :style="titleStyle">
              {{ getItemTitle(item) }}
            </div>
            <div v-if="showDescription" class="item-description" :style="descriptionStyle">
              {{ getItemDescription(item) }}
            </div>
            <div v-if="showExtra" class="item-extra" :style="extraStyle">
              {{ getItemExtra(item) }}
            </div>
          </div>

          <!-- 右侧操作区 -->
          <div v-if="showAction" class="item-action">
            <el-icon>
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'
import { Document, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 列表数据
const listData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  if (localData.length > 0) return localData

  // 默认示例数据
  return [
    { title: '列表项 1', description: '这是列表项的描述信息', extra: '详情' },
    { title: '列表项 2', description: '这是列表项的描述信息', extra: '详情' },
    { title: '列表项 3', description: '这是列表项的描述信息', extra: '详情' },
  ]
})

// 配置项
const showIcon = computed(() => (comp.value?.props.showIcon as boolean) ?? false)
const showTitle = computed(() => (comp.value?.props.showTitle as boolean) ?? true)
const showDescription = computed(() => (comp.value?.props.showDescription as boolean) ?? true)
const showExtra = computed(() => (comp.value?.props.showExtra as boolean) ?? false)
const showAction = computed(() => (comp.value?.props.showAction as boolean) ?? true)
const showBorder = computed(() => (comp.value?.props.showBorder as boolean) ?? true)
const showSplit = computed(() => (comp.value?.props.showSplit as boolean) ?? true)
const emptyText = computed(() => (comp.value?.props.emptyText as string) ?? '暂无数据')
const iconSize = computed(() => (comp.value?.props.iconSize as number) ?? 20)
const scrollHeight = computed(() => (comp.value?.props.scrollHeight as string) ?? '100%')
const computedScrollHeight = computed(() => {
  const height = scrollHeight.value
  // 确保返回有效的高度值 (数字或带单位的字符串)
  if (typeof height === 'number') return `${height}px`
  if (typeof height === 'string' && (height.endsWith('px') || height.endsWith('%'))) return height
  return '100%' // 默认值
})

// 字段映射
const titleField = computed(() => (comp.value?.props.titleField as string) ?? 'title')
const descriptionField = computed(
  () => (comp.value?.props.descriptionField as string) ?? 'description',
)
const extraField = computed(() => (comp.value?.props.extraField as string) ?? 'extra')

// 获取项数据
function getItemTitle(item: Record<string, unknown>): string {
  return String(item[titleField.value] ?? '')
}

function getItemDescription(item: Record<string, unknown>): string {
  return String(item[descriptionField.value] ?? '')
}

function getItemExtra(item: Record<string, unknown>): string {
  return String(item[extraField.value] ?? '')
}

function getIcon() {
  return Document
}

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'block',
    width: '100%',
    height: '100%',
    backgroundColor: (s.backgroundColor as string) ?? '#ffffff',
    borderRadius: `${(s.borderRadius as number) ?? 4}px`,
    overflow: 'hidden',
  }
})

const getItemStyle = (index: number): CSSProperties => {
  const s = comp.value?.style || {}
  return {
    padding: `${(s.itemPadding as number) ?? 12}px ${(s.itemPaddingX as number) ?? 16}px`,
    backgroundColor: (s.itemBackgroundColor as string) ?? '#ffffff',
    borderBottom:
      showSplit.value && index < listData.value.length - 1
        ? `1px solid ${(s.splitColor as string) ?? '#e4e7ed'}`
        : 'none',
    borderLeft: showBorder.value
      ? `3px solid ${(s.borderColor as string) ?? 'transparent'}`
      : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
}

const iconStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.iconColor as string) ?? '#909399',
  }
})

const contentStyle = computed<CSSProperties>(() => ({
  flex: 1,
}))

const titleStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.titleFontSize as number) ?? 15}px`,
    color: (s.titleColor as string) ?? '#303133',
    fontWeight: (s.titleFontWeight as string) ?? '500',
    marginBottom: showDescription.value ? '4px' : '0',
  }
})

const descriptionStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.descriptionFontSize as number) ?? 13}px`,
    color: (s.descriptionColor as string) ?? '#909399',
    lineHeight: 1.5,
  }
})

const extraStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.extraFontSize as number) ?? 12}px`,
    color: (s.extraColor as string) ?? '#409eff',
    marginTop: '4px',
  }
})

// 事件
function handleItemClick(item: Record<string, unknown>, index: number) {
  console.log('Item clicked:', item, index)
}
</script>

<style scoped>
.list-container {
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.list-wrapper {
  width: 100%;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
}

.list-item:hover {
  background-color: #f5f7fa !important;
}

.item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-extra {
  margin-top: 4px;
}

.item-action {
  flex-shrink: 0;
  color: #c0c4cc;
  display: flex;
  align-items: center;
}
</style>
