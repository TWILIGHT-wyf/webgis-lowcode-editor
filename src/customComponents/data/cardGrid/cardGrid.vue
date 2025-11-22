<template>
  <div class="card-grid-container" :style="containerStyle">
    <el-scrollbar :height="scrollHeight">
      <div v-if="cardData.length === 0" class="empty-state">
        <el-empty :description="emptyText" :image-size="80" />
      </div>
      <div v-else class="grid-wrapper" :style="gridStyle">
        <el-card
          v-for="(item, index) in cardData"
          :key="index"
          :shadow="cardShadow"
          :body-style="cardBodyStyle"
          class="grid-card"
          :style="cardStyle"
          @click="handleCardClick(item, index)"
        >
          <!-- 卡片图片 -->
          <div v-if="showImage && getImage(item)" class="card-image" :style="imageStyle">
            <img :src="getImage(item)" :alt="getTitle(item)" />
          </div>

          <!-- 卡片内容 -->
          <div class="card-content">
            <!-- 标题 -->
            <div v-if="showTitle" class="card-title" :style="titleStyle">
              {{ getTitle(item) }}
            </div>

            <!-- 描述 -->
            <div v-if="showDescription" class="card-description" :style="descriptionStyle">
              {{ getDescription(item) }}
            </div>

            <!-- 标签 -->
            <div v-if="showTags && getTags(item).length > 0" class="card-tags">
              <el-tag
                v-for="(tag, tagIndex) in getTags(item)"
                :key="tagIndex"
                :type="getTagType(tagIndex)"
                :size="tagSize"
                :style="tagStyle"
              >
                {{ tag }}
              </el-tag>
            </div>

            <!-- 底部信息 -->
            <div v-if="showFooter" class="card-footer" :style="footerStyle">
              {{ getFooter(item) }}
            </div>
          </div>
        </el-card>
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

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 卡片数据
const cardData = computed(() => {
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
      title: '卡片 1',
      description: '这是卡片的描述信息',
      footer: '2024-01-01',
      tags: ['标签1', '标签2'],
    },
    { title: '卡片 2', description: '这是卡片的描述信息', footer: '2024-01-02', tags: ['标签3'] },
    {
      title: '卡片 3',
      description: '这是卡片的描述信息',
      footer: '2024-01-03',
      tags: ['标签4', '标签5'],
    },
  ]
})

// 配置项
const showImage = computed(() => (comp.value?.props.showImage as boolean) ?? false)
const showTitle = computed(() => (comp.value?.props.showTitle as boolean) ?? true)
const showDescription = computed(() => (comp.value?.props.showDescription as boolean) ?? true)
const showTags = computed(() => (comp.value?.props.showTags as boolean) ?? false)
const showFooter = computed(() => (comp.value?.props.showFooter as boolean) ?? false)
const cardShadow = computed(
  () => (comp.value?.props.cardShadow as 'always' | 'hover' | 'never') ?? 'hover',
)
const tagSize = computed(
  () => (comp.value?.props.tagSize as 'large' | 'default' | 'small') ?? 'small',
)
const emptyText = computed(() => (comp.value?.props.emptyText as string) ?? '暂无数据')
const scrollHeight = computed(() => (comp.value?.props.scrollHeight as string) ?? '100%')
const columns = computed(() => (comp.value?.props.columns as number) ?? 3)
const gap = computed(() => (comp.value?.props.gap as number) ?? 16)

// 字段映射
const titleField = computed(() => (comp.value?.props.titleField as string) ?? 'title')
const descriptionField = computed(
  () => (comp.value?.props.descriptionField as string) ?? 'description',
)
const footerField = computed(() => (comp.value?.props.footerField as string) ?? 'footer')
const tagsField = computed(() => (comp.value?.props.tagsField as string) ?? 'tags')
const imageField = computed(() => (comp.value?.props.imageField as string) ?? 'image')

// 获取数据
function getTitle(item: Record<string, unknown>): string {
  return String(item[titleField.value] ?? '')
}

function getDescription(item: Record<string, unknown>): string {
  return String(item[descriptionField.value] ?? '')
}

function getFooter(item: Record<string, unknown>): string {
  return String(item[footerField.value] ?? '')
}

function getTags(item: Record<string, unknown>): string[] {
  const tags = item[tagsField.value]
  if (Array.isArray(tags)) return tags.map(String)
  if (typeof tags === 'string') return tags.split(',').map((s) => s.trim())
  return []
}

function getImage(item: Record<string, unknown>): string {
  return String(item[imageField.value] ?? '')
}

function getTagType(index: number): 'primary' | 'success' | 'info' | 'warning' | 'danger' {
  const types: ('primary' | 'success' | 'info' | 'warning' | 'danger')[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ]
  return types[index % types.length] as 'primary' | 'success' | 'info' | 'warning' | 'danger'
}

// 样式
const containerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'block',
    width: '100%',
    height: '100%',
    backgroundColor: (s.backgroundColor as string) ?? '#f5f7fa',
    borderRadius: `${(s.borderRadius as number) ?? 4}px`,
    padding: `${(s.padding as number) ?? 16}px`,
    overflow: 'hidden',
  }
})

const gridStyle = computed<CSSProperties>(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns.value}, 1fr)`,
  gap: `${gap.value}px`,
}))

const cardStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    cursor: 'pointer',
    transition: 'all 0.3s',
    borderRadius: `${(s.cardBorderRadius as number) ?? 4}px`,
  }
})

const cardBodyStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    padding: `${(s.cardPadding as number) ?? 14}px`,
  }
})

const imageStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: `${(s.imageHeight as number) ?? 150}px`,
    marginBottom: '12px',
    borderRadius: `${(s.imageBorderRadius as number) ?? 4}px`,
    overflow: 'hidden',
  }
})

const titleStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.titleFontSize as number) ?? 16}px`,
    color: (s.titleColor as string) ?? '#303133',
    fontWeight: (s.titleFontWeight as string) ?? '600',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }
})

const descriptionStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.descriptionFontSize as number) ?? 13}px`,
    color: (s.descriptionColor as string) ?? '#606266',
    lineHeight: 1.6,
    marginBottom: '8px',
  }
})

const footerStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    fontSize: `${(s.footerFontSize as number) ?? 12}px`,
    color: (s.footerColor as string) ?? '#909399',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${(s.footerBorderColor as string) ?? '#ebeef5'}`,
  }
})

const tagStyle = computed<CSSProperties>(() => ({
  marginRight: '6px',
  marginTop: '6px',
}))

// 事件
function handleCardClick(item: Record<string, unknown>, index: number) {
  console.log('Card clicked:', item, index)
}
</script>

<style scoped>
.card-grid-container {
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.grid-wrapper {
  width: 100%;
}

.grid-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
  margin-right: -6px;
}
</style>
