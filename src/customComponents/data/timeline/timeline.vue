<template>
  <div class="timeline-container" :style="containerStyle">
    <el-scrollbar :height="scrollHeight">
      <div v-if="timelineData.length === 0" class="empty-state">
        <el-empty :description="emptyText" :image-size="80" />
      </div>
      <el-timeline v-else :style="timelineStyle">
        <el-timeline-item
          v-for="(item, index) in timelineData"
          :key="index"
          :timestamp="getTimestamp(item)"
          :placement="timestampPlacement"
          :type="getItemType(item, index)"
          :color="getItemColor(item)"
          :size="itemSize"
          :hollow="hollow"
          :icon="getItemIcon(item)"
        >
          <el-card v-if="showCard" :shadow="cardShadow" :style="cardStyle">
            <template #header>
              <div class="card-header" :style="headerStyle">
                <span class="card-title">{{ getTitle(item) }}</span>
                <span v-if="showTimestamp" class="card-time">{{ getTimestamp(item) }}</span>
              </div>
            </template>
            <div class="card-content" :style="contentStyle">
              {{ getContent(item) }}
            </div>
            <div v-if="showExtra && getExtra(item)" class="card-extra" :style="extraStyle">
              {{ getExtra(item) }}
            </div>
          </el-card>

          <div v-else class="timeline-content">
            <div v-if="showTitle" class="content-title" :style="titleStyle">
              {{ getTitle(item) }}
            </div>
            <div class="content-text" :style="textStyle">
              {{ getContent(item) }}
            </div>
            <div v-if="showExtra && getExtra(item)" class="content-extra" :style="extraTextStyle">
              {{ getExtra(item) }}
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
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
import { Clock } from '@element-plus/icons-vue'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 时间轴数据
const timelineData = computed(() => {
  const ds = comp.value?.dataSource
  const localData = (comp.value?.props.data as Record<string, unknown>[]) ?? []

  if (ds?.enabled && remoteData.value) {
    const extracted = extractWithFallback(remoteData.value, ds.dataPath, localData)
    return Array.isArray(extracted) ? extracted : localData
  }

  if (localData.length > 0) return localData

  // 默认示例数据
  return [
    {
      title: '活动开始',
      content: '这是活动的开始阶段',
      timestamp: '2024-01-01 10:00',
      type: 'primary',
    },
    { title: '进行中', content: '活动正在进行中', timestamp: '2024-01-02 14:30', type: 'success' },
    { title: '活动结束', content: '活动已经顺利结束', timestamp: '2024-01-03 18:00', type: 'info' },
  ]
})

// 配置项
const showCard = computed(() => (comp.value?.props.showCard as boolean) ?? true)
const showTitle = computed(() => (comp.value?.props.showTitle as boolean) ?? true)
const showTimestamp = computed(() => (comp.value?.props.showTimestamp as boolean) ?? true)
const showExtra = computed(() => (comp.value?.props.showExtra as boolean) ?? false)
const timestampPlacement = computed(
  () => (comp.value?.props.timestampPlacement as 'top' | 'bottom') ?? 'top',
)
const itemSize = computed(() => (comp.value?.props.itemSize as 'normal' | 'large') ?? 'normal')
const hollow = computed(() => (comp.value?.props.hollow as boolean) ?? false)
const cardShadow = computed(
  () => (comp.value?.props.cardShadow as 'always' | 'hover' | 'never') ?? 'hover',
)
const emptyText = computed(() => (comp.value?.props.emptyText as string) ?? '暂无数据')
const scrollHeight = computed(() => (comp.value?.props.scrollHeight as string) ?? '100%')

// 字段映射
const titleField = computed(() => (comp.value?.props.titleField as string) ?? 'title')
const contentField = computed(() => (comp.value?.props.contentField as string) ?? 'content')
const timestampField = computed(() => (comp.value?.props.timestampField as string) ?? 'timestamp')
const typeField = computed(() => (comp.value?.props.typeField as string) ?? 'type')
const colorField = computed(() => (comp.value?.props.colorField as string) ?? 'color')
const extraField = computed(() => (comp.value?.props.extraField as string) ?? 'extra')

// 获取项数据
function getTitle(item: Record<string, unknown>): string {
  return String(item[titleField.value] ?? '')
}

function getContent(item: Record<string, unknown>): string {
  return String(item[contentField.value] ?? '')
}

function getTimestamp(item: Record<string, unknown>): string {
  return String(item[timestampField.value] ?? '')
}

function getExtra(item: Record<string, unknown>): string {
  return String(item[extraField.value] ?? '')
}

function getItemType(
  item: Record<string, unknown>,
  index: number,
): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  const type = item[typeField.value] as string | undefined
  if (type && ['primary', 'success', 'warning', 'danger', 'info'].includes(type)) {
    return type as 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }
  // 默认根据索引自动分配颜色
  const types: ('primary' | 'success' | 'warning' | 'danger' | 'info')[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ]
  return types[index % types.length] as 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

function getItemColor(item: Record<string, unknown>): string | undefined {
  const color = item[colorField.value]
  return color ? String(color) : undefined
}

function getItemIcon(item: Record<string, unknown>) {
  const icon = item.icon
  return icon ? icon : Clock
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
    padding: `${(s.padding as number) ?? 16}px`,
    overflow: 'hidden',
  }
})

const timelineStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    paddingLeft: `${(s.timelinePadding as number) ?? 0}px`,
  }
})

const cardStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    marginBottom: `${(s.cardMargin as number) ?? 12}px`,
    borderRadius: `${(s.cardBorderRadius as number) ?? 4}px`,
  }
})

const headerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: `${(s.headerFontSize as number) ?? 15}px`,
    fontWeight: (s.headerFontWeight as string) ?? '600',
    color: (s.headerColor as string) ?? '#303133',
  }
})

const contentStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.contentFontSize as number) ?? 14}px`,
    color: (s.contentColor as string) ?? '#606266',
    lineHeight: 1.6,
  }
})

const extraStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    marginTop: '8px',
    fontSize: `${(s.extraFontSize as number) ?? 12}px`,
    color: (s.extraColor as string) ?? '#909399',
  }
})

const titleStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.titleFontSize as number) ?? 15}px`,
    fontWeight: (s.titleFontWeight as string) ?? '600',
    color: (s.titleColor as string) ?? '#303133',
    marginBottom: '4px',
  }
})

const textStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.textFontSize as number) ?? 14}px`,
    color: (s.textColor as string) ?? '#606266',
    lineHeight: 1.6,
  }
})

const extraTextStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    marginTop: '6px',
    fontSize: `${(s.extraFontSize as number) ?? 12}px`,
    color: (s.extraColor as string) ?? '#909399',
  }
})
</script>

<style scoped>
.timeline-container {
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  flex: 1;
}

.card-time {
  font-size: 13px;
  color: #909399;
  font-weight: normal;
  margin-left: 12px;
}

.card-content {
  margin: 0;
}

.card-extra {
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
}

.timeline-content {
  padding: 8px 0;
}

.content-title {
  margin-bottom: 4px;
}

.content-text {
  margin: 0;
}

.content-extra {
  padding-top: 6px;
}
</style>
