<template>
  <div class="layers-control" :style="containerStyle">
    <div v-if="!layers || layers.length === 0" class="layers-placeholder">
      <el-icon class="placeholder-icon"><Files /></el-icon>
      <div class="placeholder-text">{{ placeholder || '配置图层列表以显示' }}</div>
    </div>
    <div v-else class="layers-content">
      <div v-if="title" class="layers-title">{{ title }}</div>
      <div class="layers-list">
        <div
          v-for="(layer, index) in layers"
          :key="index"
          class="layer-item"
          :class="{ active: layer.visible }"
          @click="toggleLayer(index)"
        >
          <el-icon class="layer-icon">
            <View v-if="layer.visible" />
            <Hide v-else />
          </el-icon>
          <span class="layer-label">{{ layer.label }}</span>
          <el-tag
            v-if="layer.type"
            size="small"
            :type="getLayerTypeTag(layer.type)"
            class="layer-type"
          >
            {{ layer.type }}
          </el-tag>
        </div>
      </div>
      <div v-if="showOpacity" class="opacity-control">
        <div class="opacity-label">透明度</div>
        <el-slider v-model="globalOpacity" :min="0" :max="100" :show-tooltip="false" size="small" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Files, View, Hide } from '@element-plus/icons-vue'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { getValueByPath } from '@/datasource/dataUtils'

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

const placeholder = computed(() => comp.value?.props.placeholder as string)
const showOpacity = computed(() => comp.value?.props.showOpacity as boolean)

const globalOpacity = ref(100)

// 切换图层可见性
function toggleLayer(index: number) {
  if (!layers.value || !Array.isArray(layers.value)) return
  const layer = layers.value[index] as LayerItem
  layer.visible = !layer.visible
  emit('layerToggle', { ...layer, index })
}

// 获取图层类型标签颜色
function getLayerTypeTag(type: string) {
  const typeMap: Record<string, 'success' | 'info' | 'warning' | 'danger' | ''> = {
    base: 'success',
    tile: 'info',
    vector: 'warning',
    marker: 'danger',
    heat: '',
  }
  return typeMap[type] || 'info'
}

// 监听透明度变化
watch(globalOpacity, (val) => {
  emit('opacityChange', val / 100)
})

const containerStyle = computed(() => ({
  backgroundColor: (comp.value?.props.backgroundColor as string) || '#ffffff',
  color: (comp.value?.props.textColor as string) || '#303133',
  border: `1px solid ${(comp.value?.props.borderColor as string) || '#dcdfe6'}`,
  fontSize: `${(comp.value?.props.fontSize as number) ?? 14}px`,
  padding: `${(comp.value?.props.padding as number) ?? 12}px`,
  borderRadius: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  minWidth: '180px',
  maxWidth: '300px',
}))
</script>

<style scoped lang="scss">
.layers-control {
  display: inline-block;
}

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

.layers-content {
  .layers-title {
    font-weight: 600;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e4e7ed;
  }

  .layers-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 300px;
    overflow-y: auto;
  }

  .layer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    &.active {
      background-color: #ecf5ff;

      .layer-icon {
        color: #409eff;
      }
    }

    .layer-icon {
      flex-shrink: 0;
      font-size: 16px;
      color: #909399;
      transition: color 0.2s;
    }

    .layer-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layer-type {
      flex-shrink: 0;
    }
  }

  .opacity-control {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e4e7ed;

    .opacity-label {
      font-size: 12px;
      color: #606266;
      margin-bottom: 8px;
    }
  }
}
</style>
