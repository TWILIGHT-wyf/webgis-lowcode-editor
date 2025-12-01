<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
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

// 样式
const dialogStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    backgroundColor: String(s.backgroundColor || '#ffffff'),
    color: String(s.textColor || '#333333'),
  }
})

function getChildComponent(childId: string) {
  return componentStore.value.find((c) => c.id === childId)
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="comp?.props?.title || '对话框标题'"
    :width="comp?.props?.width || '50%'"
    :fullscreen="comp?.props?.fullscreen || false"
    :close-on-click-modal="comp?.props?.closeOnClickModal !== false"
    :show-close="comp?.props?.showClose !== false"
    :append-to-body="true"
    @close="handleClose"
  >
    <div :style="dialogStyle">
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
        {{ comp?.props?.content || '这是对话框内容' }}
      </template>
    </div>
    <template #footer v-if="comp?.props?.showFooter !== false">
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
