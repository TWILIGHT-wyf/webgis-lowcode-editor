<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vModal as BaseModal } from '@one/visual-lib'
import Shape from '@/components/Editor/shape/shape.vue'
import { getComponent } from '@/customComponents/registry'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 对话框可见性
const dialogVisible = ref(false)

// 监听 props 变化
watch(
  () => comp.value?.props?.visible,
  (newValue) => {
    dialogVisible.value = Boolean(newValue)
  },
  { immediate: true },
)

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

// 聚合所有 Props 传递给 Base 组件
const modalProps = computed((): Record<string, unknown> => {
  const s = comp.value?.style || {}
  const p = comp.value?.props || {}
  return {
    // Modal 配置
    visible: dialogVisible.value,
    title: p.title ?? '对话框标题',
    width: p.width ?? '50%',
    fullscreen: p.fullscreen ?? false,
    closeOnClickModal: p.closeOnClickModal !== false,
    showClose: p.showClose !== false,
    showFooter: p.showFooter !== false,
    content: p.content ?? '这是对话框内容',
    // 容器样式
    backgroundColor: s.backgroundColor ?? '#ffffff',
    textColor: s.textColor ?? '#333333',
  }
})

function getChildComponent(childId: string) {
  return componentStore.value.find((c) => c.id === childId)
}

const hasChildren = computed(() => comp.value?.children && comp.value.children.length > 0)
</script>

<template>
  <BaseModal v-bind="modalProps" @close="handleClose" @confirm="handleClose">
    <template v-if="hasChildren">
      <Shape v-for="childId in comp?.children" :key="childId" :id="childId">
        <component
          :is="getComponent(getChildComponent(childId)?.type || '')"
          :id="childId"
          :style="{ width: '100%', height: '100%' }"
        />
      </Shape>
    </template>
  </BaseModal>
</template>

<style scoped>
/* 样式已内联到 BaseModal */
</style>
