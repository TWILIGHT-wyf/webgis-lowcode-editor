<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { useDataSource } from '@/datasource/useDataSource'
import { extractWithFallback } from '@/datasource/dataUtils'

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

// 样式
const containerStyle = computed(() => {
  const s = comp.value?.style || {}
  return {
    width: '100%',
    height: '100%',
    padding: `${s.padding || 16}px`,
    backgroundColor: String(s.backgroundColor || '#1e1e1e'),
    color: String(s.textColor || '#d4d4d4'),
    fontSize: `${s.fontSize || 14}px`,
    lineHeight: String(s.lineHeight || 1.6),
    borderRadius: `${s.borderRadius || 4}px`,
    border: String(s.border || '1px solid #3c3c3c'),
    overflow: 'auto',
    fontFamily: String(s.fontFamily || 'Consolas, Monaco, "Courier New", monospace'),
  }
})
</script>

<template>
  <div :style="containerStyle">
    <div class="scripting-container">
      <div class="header">
        <span class="title">
          <el-icon><Document /></el-icon>
          脚本执行器
        </span>
        <el-button
          v-if="!comp?.props?.autoRun"
          type="primary"
          size="small"
          @click="executeScript"
          :icon="comp?.props?.showControls !== false ? 'CaretRight' : undefined"
        >
          <template v-if="comp?.props?.showControls !== false">执行</template>
        </el-button>
      </div>

      <div v-if="comp?.props?.showCode !== false" class="code-section">
        <div class="section-title">代码:</div>
        <pre class="code-block">{{ scriptCode }}</pre>
      </div>

      <div v-if="output || error" class="output-section">
        <div class="section-title">输出:</div>
        <div v-if="error" class="error-output">{{ error }}</div>
        <pre v-else class="output-block">{{ output }}</pre>
      </div>

      <div v-if="!output && !error && comp?.props?.showPlaceholder !== false" class="placeholder">
        <el-icon><VideoPlay /></el-icon>
        <span>{{ comp?.props?.placeholder || '点击执行按钮运行脚本' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scripting-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #3c3c3c;
}

.title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 16px;
}

.section-title {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.code-section {
  flex-shrink: 0;
}

.code-block {
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.output-block {
  flex: 1;
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #4ec9b0;
}

.error-output {
  flex: 1;
  padding: 12px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 4px;
  color: #f87171;
  overflow: auto;
}

.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 8px;
  opacity: 0.5;
}

.placeholder .el-icon {
  font-size: 32px;
}
</style>
