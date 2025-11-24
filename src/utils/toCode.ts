import type { component } from '@/stores/component'

/**
 * 将componentStore转换为Vue代码
 */
export function generateVueCode(components: component[]): string {
  const topLevelComponents = components.filter((c) => !c.groupId)

  const template = generateTemplate(topLevelComponents, components)
  const script = generateScript(components)
  const style = generateStyle()

  return `<template>
  <div class="runtime-container">
${template}
  </div>
</template>

${script}

${style}
`
}

/**
 * 生成模板代码
 */
function generateTemplate(
  topLevelComponents: component[],
  allComponents: component[],
  indent = 4,
): string {
  let html = ''

  for (const comp of topLevelComponents) {
    html += generateComponentTemplate(comp, allComponents, indent)
  }

  return html
}

/**
 * 生成单个组件的模板
 */
function generateComponentTemplate(
  comp: component,
  allComponents: component[],
  indent: number,
): string {
  const indentStr = ' '.repeat(indent)
  const style = generateComponentStyle(comp)
  const props = generateComponentProps(comp)
  const events = generateComponentEvents(comp)
  const children = allComponents.filter((c) => c.groupId === comp.id)
  const animationInfo = generateAnimationInfo(comp)

  // 处理组件名称映射
  const tagName = getComponentTagName(comp.type)

  // 开始标签
  let html = `${indentStr}<${tagName}\n`
  html += `${indentStr}  :ref="el => componentRefs['${comp.id}'] = el"\n`

  // 添加动画相关class和事件
  if (animationInfo.class && 'trigger' in animationInfo) {
    const classes = ['animated', animationInfo.class]
    if (animationInfo.trigger === 'hover' || animationInfo.trigger === 'click') {
      classes.push('animation-paused')
    }
    const classStr = `['${classes.join("', '")}']`
    html += `${indentStr}  :class="${classStr}"\n`

    // 根据trigger添加动画触发事件
    if (animationInfo.trigger === 'hover') {
      html += `${indentStr}  @mouseenter="playAnimation_${comp.id}"\n`
      html += `${indentStr}  @mouseleave="resetAnimation_${comp.id}"\n`
    } else if (animationInfo.trigger === 'click') {
      html += `${indentStr}  @click.stop="playAnimation_${comp.id}"\n`
    }

    // 添加style属性(包含动画配置)
    html += `${indentStr}  :style="{...${style}, ...animationStyles_${comp.id}}"\n`
  } else {
    html += `${indentStr}  :style='${style}'\n`
  }

  // 添加props
  if (props) {
    html += props
  }

  // 添加业务事件
  if (events) {
    html += events
  }

  // Text组件特殊处理：需要渲染文本内容
  if (comp.type === 'Text' && comp.props?.text) {
    html += `${indentStr}>\n`
    html += `${indentStr}  {{ ${JSON.stringify(comp.props.text)} }}\n`
    html += `${indentStr}</${tagName}>\n`
  }
  // 如果有子组件，生成子组件
  else if (children.length > 0) {
    html += `${indentStr}>\n`
    for (const child of children) {
      html += generateComponentTemplate(child, allComponents, indent + 2)
    }
    html += `${indentStr}</${tagName}>\n`
  } else {
    html += `${indentStr}/>\n`
  }

  return html
}

/**
 * 生成动画信息
 */
function generateAnimationInfo(comp: component):
  | {
      class: string
      trigger: string
      duration: number
      delay: number
      iterationCount: number | string
      timingFunction: string
    }
  | { class: '' } {
  if (!comp.animation || !comp.animation.class) {
    return { class: '' }
  }
  return {
    class: comp.animation.class,
    trigger: comp.animation.trigger || 'load',
    duration: comp.animation.duration || 0.7,
    delay: comp.animation.delay || 0,
    iterationCount: comp.animation.iterationCount || 1,
    timingFunction: comp.animation.timingFunction || 'ease',
  }
}

/**
 * 获取组件标签名
 */
function getComponentTagName(type: string): string {
  // 特殊映射
  const mapping: Record<string, string> = {
    Text: 'div',
    lineChart: 'LineChart',
    'chart.bar': 'BarChart',
    'chart.stackedBar': 'StackedBarChart',
    pieChart: 'PieChart',
    doughnutChart: 'DoughnutChart',
    scatterChart: 'ScatterChart',
    radarChart: 'RadarChart',
    gaugeChart: 'GaugeChart',
    funnelChart: 'FunnelChart',
    sankeyChart: 'SankeyChart',
    box: 'Box',
    stat: 'Stat',
    countUp: 'CountUp',
    progress: 'Progress',
    badge: 'Badge',
    table: 'DataTable',
    list: 'DataList',
    timeline: 'Timeline',
    cardGrid: 'CardGrid',
    pivot: 'Pivot',
    select: 'Select',
    multiSelect: 'MultiSelect',
    dateRange: 'DateRange',
    searchBox: 'SearchBox',
    slider: 'Slider',
    switch: 'Switch',
    checkboxGroup: 'CheckboxGroup',
    buttonGroup: 'ButtonGroup',
    row: 'el-row',
    col: 'el-col',
    flex: 'Flex',
    grid: 'Grid',
    modal: 'Modal',
    panel: 'Panel',
    tabs: 'Tabs',
    image: 'el-image',
    video: 'video',
    markdown: 'Markdown',
    html: 'Html',
    iframe: 'Iframe',
    Group: 'Group',
  }

  return mapping[type] || type
}

/**
 * 生成组件样式对象字符串
 */
function generateComponentStyle(comp: component): string {
  const styleObj: Record<string, string | number> = {
    position: 'absolute',
    left: `${comp.position.x}px`,
    top: `${comp.position.y}px`,
    width: `${comp.size.width}px`,
    height: `${comp.size.height}px`,
    transform: `rotate(${comp.rotation || 0}deg)`,
    zIndex: comp.zindex || 0,
  }

  // Text组件特殊样式
  if (comp.type === 'Text' && comp.style) {
    if (comp.style.fontSize) styleObj.fontSize = `${comp.style.fontSize}px`
    if (comp.style.fontColor) styleObj.color = String(comp.style.fontColor)
    if (comp.style.fontWeight) styleObj.fontWeight = String(comp.style.fontWeight)
    if (comp.style.textAlign) styleObj.textAlign = String(comp.style.textAlign)
    if (comp.style.lineHeight) styleObj.lineHeight = String(comp.style.lineHeight)
    if (comp.style.letterSpacing) styleObj.letterSpacing = `${comp.style.letterSpacing}px`
  }

  // 添加样式属性
  if (comp.style) {
    if (comp.style.opacity !== undefined) {
      styleObj.opacity = Number(comp.style.opacity) / 100
    }
    if (comp.style.visible === false) {
      styleObj.display = 'none'
    }
    if (comp.style.backgroundColor) {
      styleObj.backgroundColor = String(comp.style.backgroundColor)
    }
    if (comp.style.borderRadius) {
      styleObj.borderRadius = `${comp.style.borderRadius}px`
    }
    if (comp.style.border) {
      styleObj.border = String(comp.style.border)
    }
    if (comp.style.boxShadow) {
      styleObj.boxShadow = String(comp.style.boxShadow)
    }
    if (comp.style.padding) {
      styleObj.padding = `${comp.style.padding}px`
    }
  }

  return JSON.stringify(styleObj)
}

/**
 * 生成组件Props
 */
function generateComponentProps(comp: component): string {
  let propsStr = ''
  const indentStr = ' '.repeat(6)

  if (comp.props) {
    for (const [key, value] of Object.entries(comp.props)) {
      if (comp.type === 'Text' && key === 'text') continue

      if (value !== undefined && value !== null) {
        const propValue = typeof value === 'string' ? `"${value}"` : JSON.stringify(value)
        propsStr += `${indentStr}:${key}="${propValue}"\n`
      }
    }
  }

  return propsStr
}

/**
 * 生成组件事件绑定
 */
function generateComponentEvents(comp: component): string {
  let eventsStr = ''
  const indentStr = ' '.repeat(6)

  if (comp.events) {
    if (comp.events.click && comp.events.click.length > 0) {
      eventsStr += `${indentStr}@click="handleEvent_${comp.id}_click"\n`
    }
    if (comp.events.hover && comp.events.hover.length > 0) {
      eventsStr += `${indentStr}@mouseenter="handleEvent_${comp.id}_hover"\n`
    }
    if (comp.events.doubleClick && comp.events.doubleClick.length > 0) {
      eventsStr += `${indentStr}@dblclick="handleEvent_${comp.id}_doubleclick"\n`
    }
  }

  return eventsStr
}

/**
 * 生成Script代码
 */
function generateScript(components: component[]): string {
  const imports = generateImports(components)
  const animationHandlers = generateAnimationHandlers(components)
  const eventHandlers = generateEventHandlers(components)

  return `<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
${imports}

// 组件ref引用
const componentRefs = ref<Record<string, any>>({})

// 组件数据
${generateComponentData(components)}

// 动画样式对象
${generateAnimationStyles(components)}

// 动画处理函数
${animationHandlers}

// 页面加载时触发的动画
onMounted(() => {
  nextTick(() => {
${generateOnMountAnimations(components)}
  })
})

// 事件处理函数
${eventHandlers}
</script>`
}

/**
 * 生成导入语句
 */
function generateImports(components: component[]): string {
  const types = new Set(components.map((c) => c.type))
  let imports = ''

  // 根据组件类型生成导入
  if (types.has('lineChart'))
    imports += "import LineChart from '@/customComponents/chart/lineChart/lineChart.vue'\n"
  if (types.has('chart.bar'))
    imports += "import BarChart from '@/customComponents/chart/barChart/barChart.vue'\n"
  if (types.has('pieChart'))
    imports += "import PieChart from '@/customComponents/chart/pieChart/pieChart.vue'\n"
  // ... 更多导入

  return imports
}

/**
 * 生成组件数据
 */
function generateComponentData(components: component[]): string {
  let dataStr = ''

  for (const comp of components) {
    if (comp.dataSource?.enabled) {
      dataStr += `const data_${comp.id} = ref(null)\n`
    }
  }

  return dataStr
}

/**
 * 生成动画样式对象
 */
function generateAnimationStyles(components: component[]): string {
  let stylesStr = ''

  for (const comp of components) {
    if (comp.animation && comp.animation.class) {
      const duration = comp.animation.duration || 0.7
      const delay = comp.animation.delay || 0
      const iterationCount = comp.animation.iterationCount || 1
      const timingFunction = comp.animation.timingFunction || 'ease'

      stylesStr += `const animationStyles_${comp.id} = ref({
  animationDuration: '${duration}s',
  animationDelay: '${delay}s',
  animationIterationCount: '${iterationCount}',
  animationTimingFunction: '${timingFunction}',
})\n`
    }
  }

  return stylesStr
}

/**
 * 生成动画处理函数
 */
function generateAnimationHandlers(components: component[]): string {
  let handlersStr = ''

  for (const comp of components) {
    if (comp.animation && comp.animation.class) {
      const trigger = comp.animation.trigger || 'load'
      const tagName = getComponentTagName(comp.type)
      const needsEl = !['div', 'span', 'button', 'input', 'video', 'img'].includes(tagName)

      if (trigger === 'hover') {
        handlersStr += `
function playAnimation_${comp.id}() {
  const ref = componentRefs.value['${comp.id}']
  if (ref) {
    const el = ${needsEl ? 'ref.$el || ref' : 'ref'}
    el.style.animationPlayState = 'running'
  }
}

function resetAnimation_${comp.id}() {
  const ref = componentRefs.value['${comp.id}']
  if (ref) {
    const el = ${needsEl ? 'ref.$el || ref' : 'ref'}
    el.style.animationPlayState = 'paused'
    el.style.animation = 'none'
    setTimeout(() => {
      el.style.animation = ''
    }, 10)
  }
}
`
      } else if (trigger === 'click') {
        handlersStr += `
function playAnimation_${comp.id}() {
  const ref = componentRefs.value['${comp.id}']
  if (ref) {
    const el = ${needsEl ? 'ref.$el || ref' : 'ref'}
    el.classList.remove('animation-paused')
    el.style.animation = 'none'
    setTimeout(() => {
      el.style.animation = ''
    }, 10)
  }
}
`
      }
    }
  }

  return handlersStr
}

/**
 * 生成onMounted中的动画触发
 */
function generateOnMountAnimations(components: component[]): string {
  let animStr = ''

  for (const comp of components) {
    if (comp.animation && comp.animation.trigger === 'load') {
      animStr += `    // 触发组件 ${comp.id} 的动画\n`
    }
  }

  return animStr || '    // 没有需要在页面加载时触发的动画'
}

/**
 * 生成事件处理函数
 */
function generateEventHandlers(components: component[]): string {
  let handlersStr = ''

  for (const comp of components) {
    if (comp.events) {
      // Click事件
      if (comp.events.click && comp.events.click.length > 0) {
        handlersStr += `\nfunction handleEvent_${comp.id}_click() {\n`
        for (const action of comp.events.click) {
          handlersStr += `  // ${action.type}\n`
          handlersStr += generateEventActionCode(action, 2)
        }
        handlersStr += `}\n`
      }

      // Hover事件
      if (comp.events.hover && comp.events.hover.length > 0) {
        handlersStr += `\nfunction handleEvent_${comp.id}_hover() {\n`
        for (const action of comp.events.hover) {
          handlersStr += `  // ${action.type}\n`
          handlersStr += generateEventActionCode(action, 2)
        }
        handlersStr += `}\n`
      }

      // DoubleClick事件
      if (comp.events.doubleClick && comp.events.doubleClick.length > 0) {
        handlersStr += `\nfunction handleEvent_${comp.id}_doubleclick() {\n`
        for (const action of comp.events.doubleClick) {
          handlersStr += `  // ${action.type}\n`
          handlersStr += generateEventActionCode(action, 2)
        }
        handlersStr += `}\n`
      }
    }
  }

  return handlersStr
}

/**
 * 生成事件动作代码
 */
function generateEventActionCode(
  action: {
    type: string
    targetId?: string
    content?: string
    eventName?: string
    eventParams?: string
  },
  indent: number,
): string {
  const indentStr = ' '.repeat(indent)
  let code = ''

  switch (action.type) {
    case 'navigate':
      code += `${indentStr}window.location.href = '${action.content}'\n`
      break

    case 'toggle-visibility':
      if (action.targetId) {
        code += `${indentStr}const target_${action.targetId} = componentRefs.value['${action.targetId}']\n`
        code += `${indentStr}if (target_${action.targetId}) {\n`
        code += `${indentStr}  const el = target_${action.targetId}.$el || target_${action.targetId}\n`
        code += `${indentStr}  el.style.display = el.style.display === 'none' ? '' : 'none'\n`
        code += `${indentStr}}\n`
      }
      break

    case 'scroll-to':
      if (action.targetId) {
        code += `${indentStr}const scrollTarget_${action.targetId} = componentRefs.value['${action.targetId}']\n`
        code += `${indentStr}if (scrollTarget_${action.targetId}) {\n`
        code += `${indentStr}  const el = scrollTarget_${action.targetId}.$el || scrollTarget_${action.targetId}\n`
        code += `${indentStr}  el.scrollIntoView({ behavior: 'smooth', block: 'center' })\n`
        code += `${indentStr}}\n`
      }
      break

    case 'refresh-data':
      code += `${indentStr}// TODO: 实现数据刷新逻辑\n`
      code += `${indentStr}console.log('刷新数据')\n`
      break

    case 'play-animation':
      if (action.targetId) {
        code += `${indentStr}const animTarget_${action.targetId} = componentRefs.value['${action.targetId}']\n`
        code += `${indentStr}if (animTarget_${action.targetId}) {\n`
        code += `${indentStr}  const el = animTarget_${action.targetId}.$el || animTarget_${action.targetId}\n`
        code += `${indentStr}  el.style.animation = 'none'\n`
        code += `${indentStr}  setTimeout(() => { el.style.animation = '' }, 10)\n`
        code += `${indentStr}}\n`
      }
      break

    case 'open-modal':
      if (action.targetId) {
        code += `${indentStr}const modal_${action.targetId} = componentRefs.value['${action.targetId}']\n`
        code += `${indentStr}if (modal_${action.targetId}) {\n`
        code += `${indentStr}  const el = modal_${action.targetId}.$el || modal_${action.targetId}\n`
        code += `${indentStr}  el.style.display = 'block'\n`
        code += `${indentStr}  el.style.visibility = 'visible'\n`
        code += `${indentStr}}\n`
      }
      break

    case 'show-tooltip':
      code += `${indentStr}console.log('${action.content || '提示信息'}')\n`
      code += `${indentStr}// TODO: 实现tooltip显示逻辑\n`
      break

    case 'highlight':
      if (action.targetId) {
        code += `${indentStr}const hlTarget_${action.targetId} = componentRefs.value['${action.targetId}']\n`
        code += `${indentStr}if (hlTarget_${action.targetId}) {\n`
        code += `${indentStr}  const el = hlTarget_${action.targetId}.$el || hlTarget_${action.targetId}\n`
        code += `${indentStr}  el.classList.add('highlight-effect')\n`
        code += `${indentStr}  setTimeout(() => el.classList.remove('highlight-effect'), 2000)\n`
        code += `${indentStr}}\n`
      }
      break

    case 'show-detail':
    case 'preview':
      code += `${indentStr}// TODO: 实现${action.type}逻辑\n`
      code += `${indentStr}console.log('${action.type}: ${action.targetId}')\n`
      break

    case 'fullscreen':
      code += `${indentStr}if (document.fullscreenElement) {\n`
      code += `${indentStr}  document.exitFullscreen()\n`
      code += `${indentStr}} else {\n`
      code += `${indentStr}  document.documentElement.requestFullscreen()\n`
      code += `${indentStr}}\n`
      break

    case 'edit-mode':
      code += `${indentStr}// TODO: 实现编辑模式切换\n`
      code += `${indentStr}console.log('切换编辑模式')\n`
      break

    case 'expand-detail':
      if (action.targetId) {
        code += `${indentStr}const expandTarget_${action.targetId} = componentRefs.value['${action.targetId}']\n`
        code += `${indentStr}if (expandTarget_${action.targetId}) {\n`
        code += `${indentStr}  const el = expandTarget_${action.targetId}.$el || expandTarget_${action.targetId}\n`
        code += `${indentStr}  el.classList.toggle('expanded')\n`
        code += `${indentStr}}\n`
      }
      break

    case 'custom-event':
      if (action.eventName) {
        code += `${indentStr}// 自定义事件: ${action.eventName}\n`
        if (action.eventParams) {
          code += `${indentStr}const params = ${action.eventParams}\n`
          code += `${indentStr}console.log('触发自定义事件', params)\n`
        } else {
          code += `${indentStr}console.log('触发自定义事件: ${action.eventName}')\n`
        }
      }
      break

    case 'custom-script':
      if (action.content) {
        code += `${indentStr}${action.content}\n`
      }
      break

    default:
      code += `${indentStr}// TODO: 实现${action.type}逻辑\n`
      code += `${indentStr}console.log('未实现的动作类型: ${action.type}')\n`
  }

  return code
}

/**
 * 生成样式代码
 */
function generateStyle(): string {
  return `<style scoped>
.runtime-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.anim-fade {
  animation: fadeIn 0.8s ease both;
}

@keyframes zoomIn {
  0% { transform: scale(0.3); opacity: 0; }
  60% { opacity: 1; }
  100% { transform: scale(1); }
}
.anim-zoom {
  animation: zoomIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slideLeft {
  0% { transform: translateX(40px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
.anim-slide-left {
  animation: slideLeft 0.6s ease-out both;
}

@keyframes slideUp {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.anim-slide-up {
  animation: slideUp 0.6s ease-out both;
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.anim-bounce {
  animation: bounceIn 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55) both;
}

@keyframes rotateIn {
  0% { transform: rotate(-180deg); opacity: 0; }
  100% { transform: rotate(0deg); opacity: 1; }
}
.anim-rotate {
  animation: rotateIn 0.7s ease-out both;
}

/* 动画触发类 */
.animation-trigger-hover:hover .animated,
.animation-trigger-click.clicked .animated {
  animation-play-state: running;
}

.animation-paused {
  animation-play-state: paused !important;
}

.animated {
  animation-fill-mode: both;
}

/* 高亮效果 */
.highlight-effect {
  outline: 3px solid #409eff;
  outline-offset: 2px;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
  transition: all 0.3s ease;
}

/* 展开效果 */
.expanded {
  transform: scale(1.1);
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
</style>`
}

/**
 * 将组件数据转换为JSON字符串
 */
export function componentsToJSON(components: component[]): string {
  return JSON.stringify(components, null, 2)
}

/**
 * 从JSON字符串恢复组件数据
 */
export function JSONToComponents(json: string): component[] {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return []
  }
}
