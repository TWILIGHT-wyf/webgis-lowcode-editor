<template>
  <BaseLayers
    v-if="layers && layers.length > 0"
    :layers="layers"
    :title="title"
    :show-opacity="showOpacity"
    :background-color="containerStyle.backgroundColor"
    :text-color="containerStyle.textColor"
    :border-color="containerStyle.borderColor"
    :font-size="containerStyle.fontSize"
    :padding="containerStyle.padding"
    @toggle="handleToggle"
    @opacity-change="handleOpacityChange"
  />
  <div v-else class="layers-placeholder" :style="placeholderStyle">
    <el-icon class="placeholder-icon"><Files /></el-icon>
    <div class="placeholder-text">{{ placeholder }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Files } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import { vLayers as BaseLayers, useDataSource, getValueByPath } from '@one/visual-lib'

interface LayerItem {
  label: string
  type?: 'base' | 'tile' | 'vector' | 'marker' | 'heat'
  visible: boolean
  id?: string
}

const props = defineProps<{ id: string }>()

const emit = defineEmits<{
  layerToggle: [layer: LayerItem & { index: number }]
  opacityChange: [opacity: number]
}>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const dataSourceConfig = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceConfig)

const layers = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.layersField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return Array.isArray(value) ? (value as LayerItem[]) : undefined
    }
  }
  return comp.value?.props.layers as LayerItem[] | undefined
})

const title = computed(() => {
  if (dataSourceData.value) {
    const field = dataSourceConfig.value?.titleField as string | undefined
    if (field) {
      const value = getValueByPath(dataSourceData.value, field)
      return typeof value === 'string' ? value : undefined
    }
  }
  return comp.value?.props.title as string
})

const placeholder = computed(
  () => (comp.value?.props.placeholder as string) || '配置图层列表以显示',
)
const showOpacity = computed(() => (comp.value?.props.showOpacity as boolean) ?? false)

const containerStyle = computed(() => ({
  backgroundColor: (comp.value?.props.backgroundColor as string) || '#ffffff',
  textColor: (comp.value?.props.textColor as string) || '#303133',
  borderColor: (comp.value?.props.borderColor as string) || '#dcdfe6',
  fontSize: (comp.value?.props.fontSize as number) ?? 14,
  padding: (comp.value?.props.padding as number) ?? 12,
}))

const placeholderStyle = computed(() => ({
  backgroundColor: containerStyle.value.backgroundColor,
  color: containerStyle.value.textColor,
  border: `1px solid ${containerStyle.value.borderColor}`,
  fontSize: `${containerStyle.value.fontSize}px`,
  padding: `${containerStyle.value.padding}px`,
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  minWidth: '180px',
  maxWidth: '300px',
}))

function handleToggle(layer: LayerItem, index: number) {
  emit('layerToggle', { ...layer, index })
}

function handleOpacityChange(opacity: number) {
  emit('opacityChange', opacity)
}
</script>

<style scoped lang="scss">
.layers-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #909399;
  background-color: #f9f9f9;

  .placeholder-icon {
    font-size: 32px;
    margin-bottom: 8px;
    color: #c0c4cc;
  }

  .placeholder-text {
    font-size: 12px;
    text-align: center;
  }
}
</style>
