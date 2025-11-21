<template>
  <div class="stat-card" :style="cardStyle">
    <div class="stat-header">
      <div class="stat-title" :style="titleStyle">{{ displayTitle }}</div>
    </div>
    <div class="stat-body">
      <div class="stat-icon" v-if="icon">
        <i :class="icon"></i>
      </div>
      <div class="stat-value" :style="valueStyle">
        {{
          displayValue.toLocaleString(undefined, {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
          })
        }}{{ suffix }}
      </div>
    </div>
    <div v-if="displayChange !== 0" class="stat-footer">
      <span class="stat-change" :style="changeStyle">
        {{ displayChange > 0 ? '+' : '' }}{{ displayChange.toFixed(1) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useComponent } from '@/stores/component'
import { storeToRefs } from 'pinia'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback, extractNumber } from '@/datasource/dataUtils'

const props = defineProps<{ id: string }>()
const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = toRef(() => comp.value?.dataSource)
const { data: remoteData } = useDataSource(dataSourceRef)

// 从远程数据或本地props获取值（支持同时提取多个字段）
const displayTitle = computed<string>(() => {
  const ds = comp.value?.dataSource
  const localTitle = (comp.value?.props.title as string) ?? '指标标题'

  if (ds?.enabled && remoteData.value) {
    return extractWithFallback(remoteData.value, ds.titlePath, localTitle) as string
  }
  return localTitle
})

const displayValue = computed<number>(() => {
  const ds = comp.value?.dataSource
  const localValue = (comp.value?.props.value as number) ?? 0

  if (ds?.enabled && remoteData.value) {
    return extractNumber(remoteData.value, ds.valuePath, localValue)
  }
  return localValue
})

const displayChange = computed<number>(() => {
  const ds = comp.value?.dataSource
  const localChange = (comp.value?.props.change as number) ?? 0

  if (ds?.enabled && remoteData.value) {
    return extractNumber(remoteData.value, ds.changePath, localChange)
  }
  return localChange
})

const icon = computed<string>(() => (comp.value?.props.icon as string) ?? 'el-icon-star-on')
const precision = computed<number>(() => (comp.value?.props.precision as number) ?? 0)
const suffix = computed<string>(() => (comp.value?.props.suffix as string) ?? '')

const titleStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.titleColor as string) ?? '#333',
    fontSize: `${(s.titleFontSize as number) ?? 14}px`,
    fontWeight: (s.titleFontWeight as string) ?? 'normal',
  }
})

const valueStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    color: (s.valueColor as string) ?? '#3f8600',
    fontSize: `${(s.valueFontSize as number) ?? 24}px`,
    fontWeight: (s.valueFontWeight as string) ?? 'bold',
  }
})

const cardStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  return {
    opacity: ((s.opacity ?? 100) as number) / 100,
    display: s.visible === false ? 'none' : 'block',
    backgroundColor: (s.backgroundColor as string) ?? '#fff',
    borderColor: (s.borderColor as string) ?? '#e0e0e0',
    borderWidth: `${(s.borderWidth as number) ?? 1}px`,
    borderRadius: `${(s.borderRadius as number) ?? 8}px`,
    boxShadow: (s.boxShadow as string) ?? '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: `${(s.padding as number) ?? 20}px`,
  }
})

const changeStyle = computed<CSSProperties>(() => {
  const s = comp.value?.style || {}
  const color =
    displayChange.value > 0
      ? ((s.changeColorPositive as string) ?? '#28a745')
      : ((s.changeColorNegative as string) ?? '#dc3545')
  return {
    color,
    fontSize: `${(s.changeFontSize as number) ?? 14}px`,
    fontWeight: (s.changeFontWeight as string) ?? 'normal',
  }
})
</script>

<style scoped>
.stat-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.stat-header {
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.stat-body {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.stat-icon {
  font-size: 32px;
  color: #409eff;
  display: flex;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-footer {
  margin-top: 8px;
}

.stat-change {
  font-size: 14px;
  font-weight: 500;
}
</style>
