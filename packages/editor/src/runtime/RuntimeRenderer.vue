<template>
  <div ref="stageRef" class="runtime-renderer">
    <!-- 空状态 -->
    <div v-if="topLevelComponents.length === 0" class="empty-state">
      <div class="empty-illustration">📄</div>
      <p class="empty-title">画布为空</p>
      <p class="empty-desc">当前页面暂无组件</p>
    </div>

    <!-- 渲染顶层组件 -->
    <RuntimeComponent
      v-for="comp in topLevelComponents"
      :key="comp.id"
      :component="comp"
      :allComponents="components"
      @trigger-event="handleComponentEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import RuntimeComponent from '@/views/RuntimeComponent.vue'
import { useDataBindingEngine } from '@/runtime/useDataBindingEngine'
import { useEventExecutor } from '@/runtime/useEventExecutor'
import type { Component } from '@/types/components'
import type { Page } from '@/stores/project'

/**
 * 运行时渲染器
 *
 * 职责：
 * 1. 管理组件树的渲染
 * 2. 初始化并维护数据联动引擎
 * 3. 处理组件事件并分发给事件执行器
 *
 */

const props = withDefaults(
  defineProps<{
    components: Component[]
    pages: Page[]
    isProjectMode: boolean
    mode?: 'edit' | 'simulation' | 'runtime' // 运行模式
  }>(),
  {
    mode: 'runtime',
  },
)

const emit = defineEmits<{
  'navigate-page': [pageId: string]
  'select-component': [componentId: string] // 编辑模式下的选中事件
}>()

const router = useRouter()
const stageRef = ref<HTMLDivElement | null>(null)

// 本地响应式组件数组（用于数据联动引擎）
const localComponents = ref<Component[]>([])

// 数据联动引擎
const bindingEngine = useDataBindingEngine(localComponents)

// 事件执行器
const localPages = computed(() => props.pages)
const localIsProjectMode = computed(() => props.isProjectMode)

const { handleComponentEvent } = useEventExecutor({
  components: localComponents,
  pages: localPages,
  isProjectMode: localIsProjectMode,
  router,
  onNavigate: (pageId: string) => {
    emit('navigate-page', pageId)
  },
})

// 只渲染顶层组件（非嵌套组件）
const topLevelComponents = computed(() => {
  return localComponents.value.filter((c) => !c.groupId)
})

// 监听 props.components 变化并同步到本地
// 注意：不使用深拷贝，而是直接引用，确保响应式系统正常工作
watch(
  () => props.components,
  (newComponents) => {
    // 直接引用，不要深拷贝，否则会断开响应式连接
    localComponents.value = newComponents
    console.log('[RuntimeRenderer] components synced, count:', newComponents.length)
  },
  { immediate: true },
)

// 生命周期：启动引擎
onMounted(() => {
  bindingEngine.start()
  // 编辑模式下默认禁用数据联动
  if (props.mode === 'edit') {
    bindingEngine.setEnabled(false)
  }
})

// 监听模式变化
watch(
  () => props.mode,
  (newMode) => {
    if (newMode === 'edit') {
      bindingEngine.setEnabled(false)
    } else {
      bindingEngine.setEnabled(true)
    }
  },
)

// 生命周期：清理引擎
onBeforeUnmount(() => {
  bindingEngine.stop()
})
</script>

<style scoped>
.runtime-renderer {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
}

/* 空状态 */
.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.empty-illustration {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}
</style>
