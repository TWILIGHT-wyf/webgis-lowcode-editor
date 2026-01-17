<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@vela/editor/stores/component'
import {
  vScripting as BaseScripting,
  useDataSource,
  extractWithFallback,
} from '@vela/ui'

const props = defineProps<{
  id: string
}>()

const { componentStore } = storeToRefs(useComponent())

const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

// 数据源
const dataSourceRef = computed(() => comp.value?.dataSource)
const { data: dataSourceData } = useDataSource(dataSourceRef)

// 脚本内容
const scriptCode = computed(() => {
  // 优先使用数据源
  if (dataSourceData.value) {
    const scriptField: string = (comp.value?.dataSource?.scriptField as string) || 'script'
    return extractWithFallback<string>(dataSourceData.value, scriptField, '')
  }
  // 使用 props 中的 script
  return String(
    comp.value?.props?.script || '// 请输入 JavaScript 代码\nconsole.log("Hello World");',
  )
})

// 执行结果
const output = ref<string>('')
const error = ref<string>('')

// 执行脚本
const executeScript = () => {
  output.value = ''
  error.value = ''

  if (!scriptCode.value.trim()) {
    error.value = '脚本内容为空'
    return
  }

  try {
    // 创建一个沙箱环境
    const logs: string[] = []
    const sandboxConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map((arg) => String(arg)).join(' '))
      },
      error: (...args: unknown[]) => {
        logs.push('Error: ' + args.map((arg) => String(arg)).join(' '))
      },
      warn: (...args: unknown[]) => {
        logs.push('Warning: ' + args.map((arg) => String(arg)).join(' '))
      },
    }

    // 使用 Function 构造函数执行用户脚本
    const fn = new Function('console', scriptCode.value)
    fn(sandboxConsole)

    output.value = logs.join('\n') || '执行成功(无输出)'
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

// 自动执行模式
watch(
  () => [scriptCode.value, comp.value?.props?.autoRun],
  () => {
    if (comp.value?.props?.autoRun === true) {
      executeScript()
    }
  },
  { immediate: true },
)

// 聚合属性
const componentProps = computed(() => {
  const p = comp.value?.props || {}
  const s = comp.value?.style || {}

  return {
    title: String(p.title || '脚本执行器'),
    scriptCode: scriptCode.value,
    output: output.value,
    error: error.value,
    autoRun: Boolean(p.autoRun),
    showCode: p.showCode !== false,
    showControls: p.showControls !== false,
    showPlaceholder: p.showPlaceholder !== false,
    placeholder: String(p.placeholder || '点击执行按钮运行脚本'),
    // 样式
    padding: Number(s.padding || 16),
    backgroundColor: String(s.backgroundColor || '#1e1e1e'),
    textColor: String(s.textColor || '#d4d4d4'),
    fontSize: Number(s.fontSize || 14),
    lineHeight: Number(s.lineHeight || 1.6),
    borderRadius: Number(s.borderRadius || 4),
    border: String(s.border || '1px solid #3c3c3c'),
    fontFamily: String(s.fontFamily || 'Consolas, Monaco, "Courier New", monospace'),
  }
})
</script>

<template>
  <BaseScripting v-bind="componentProps" @execute="executeScript" />
</template>
