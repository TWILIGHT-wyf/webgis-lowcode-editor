<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@vela/editor/stores/component'
import { vTabs as BaseTabs, useDataSource, extractWithFallback } from '@vela/ui'
import Shape from '@vela/editor/components/Editor/shape/shape.vue'
import { getComponent } from '@vela/materials/registry'

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
    // normalize to objects with label/name/content
    return comp.value.props.tabs.map((item: unknown) => {
      if (typeof item === 'object' && item !== null) {
        const itemObj = item as Record<string, unknown>
        return {
          label: String(itemObj.label ?? itemObj.name ?? ''),
          name: String(itemObj.name ?? itemObj.value ?? ''),
          content: String(itemObj.content ?? ''),
        }
      }
      // if primitive, use as both label and name
      return { label: String(item), name: String(item), content: String(item) }
    })
  }

  // 默认 tabs
  return [
    { label: 'Tab 1', name: 'tab1', content: 'Content of Tab 1' },
    { label: 'Tab 2', name: 'tab2', content: 'Content of Tab 2' },
    { label: 'Tab 3', name: 'tab3', content: 'Content of Tab 3' },
  ]
})

// 初始化 activeTab
watch(
  tabs,
  (newTabs) => {
    if (newTabs?.length && !activeTab.value) {
      activeTab.value = String(newTabs[0]?.name ?? '')
    }
  },
  { immediate: true },
)

// 聚合所有 Props 传递给 Base 组件
const tabsProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // Tabs 数据
    tabs: tabs.value,
    activeTab: activeTab.value,
    // Tabs 配置
    type: p.type ?? 'border-card',
    tabPosition: p.tabPosition ?? 'top',
    closable: p.closable ?? false,
    addable: p.addable ?? false,
    // 容器样式
    backgroundColor: s.backgroundColor ?? '#ffffff',
    padding: s.padding ?? 0,
    textColor: s.textColor ?? '#333333',
  }
})

// 处理 tab 切换
const handleTabChange = (tabName: string) => {
  activeTab.value = tabName
}

function getChildComponent(childId: string) {
  return componentStore.value.find((c) => c.id === childId)
}
</script>

<template>
  <BaseTabs v-bind="tabsProps" @tab-change="handleTabChange">
    <!-- 自定义第一个 tab 的内容（放置子组件） -->
    <template #tab-0="{ tab }">
      <template v-if="comp?.children && comp.children.length > 0">
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
    </template>
  </BaseTabs>
</template>

<style scoped>
/* 样式已内联 */
</style>
