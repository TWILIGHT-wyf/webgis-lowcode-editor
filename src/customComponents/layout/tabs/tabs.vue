<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'
import Shape from '@/components/Editor/shape/shape.vue'
import { getComponent } from '@/customComponents/registry'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 当前激活的 tab
const activeTab = ref('')

// 监听 props 变化
watch(
  () => comp.value?.props?.activeTab,
  (newValue) => {
    if (newValue) {
      activeTab.value = String(newValue)
    }
  },
  { immediate: true },
)

// Tab 数据
const tabs = computed(() => {
  // 如果有数据源
  if (dataSourceData.value && Array.isArray(dataSourceData.value)) {
    const labelField: string = (comp.value?.dataSource?.labelField as string) || 'label'
    const valueField: string = (comp.value?.dataSource?.valueField as string) || 'value'
    const contentField: string = (comp.value?.dataSource?.contentField as string) || 'content'

    return dataSourceData.value.map((item) => {
      const emptyStr: string = ''
      return {
        label: extractWithFallback<string>(item, labelField, emptyStr),
        name: extractWithFallback<string>(item, valueField, emptyStr),
        content: extractWithFallback<string>(item, contentField, emptyStr),
      }
    })
  }

  // 使用 props 中的 tabs
  if (comp.value?.props?.tabs && Array.isArray(comp.value.props.tabs)) {
    return comp.value.props.tabs
  }

  // 默认 tabs
  return [
    { label: 'Tab 1', name: 'tab1', content: 'Content of Tab 1' },
    { label: 'Tab 2', name: 'tab2', content: 'Content of Tab 2' },
    { label: 'Tab 3', name: 'tab3', content: 'Content of Tab 3' },
  ]
})

function getChildComponent(childId: string) {
  return componentStore.value.find((c) => c.id === childId)
}

// 初始化 activeTab
watch(
  tabs,
  (newTabs) => {
    if (!activeTab.value && newTabs.length > 0) {
      activeTab.value = String(newTabs[0].name)
    }
  },
  { immediate: true },
)

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    backgroundColor: String(s.backgroundColor || '#ffffff'),
    padding: `${s.padding || 0}px`,
    color: String(s.textColor || '#333333'),
  }
})
</script>

<template>
  <div :style="containerStyle">
    <el-tabs
      v-model="activeTab"
      :type="comp?.props?.type || 'border-card'"
      :tab-position="comp?.props?.tabPosition || 'top'"
      :closable="comp?.props?.closable || false"
      :addable="comp?.props?.addable || false"
    >
      <el-tab-pane
        v-for="(tab, idx) in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="String(tab.name)"
      >
        <template v-if="comp?.children && comp.children.length > 0 && idx === 0">
          <Shape v-for="childId in comp.children" :key="childId" :id="childId">
            <component
              :is="getComponent(getChildComponent(childId)?.type || '')"
              :id="childId"
              :style="{ width: '100%', height: '100%' }"
            />
          </Shape>
        </template>
        <template v-else>
          {{ tab.content }}
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
/* 样式已内联 */
</style>
