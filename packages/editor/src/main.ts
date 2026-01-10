import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 按需导入 Element Plus 样式（配合 unplugin-vue-components 自动导入组件）
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/loading/style/css'
import App from './App.vue'
import router from './router'
import './styles/animations.css'
import './styles/theme.css'

// 异步加载非关键 Icons，减少首屏体积
const loadIcons = async () => {
  const ElementPlusIconsVue = await import('@element-plus/icons-vue')
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    if (key !== 'default') {
      app.component(key, component as Parameters<typeof app.component>[1])
    }
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 延迟加载图标，不阻塞首屏渲染
loadIcons()

app.mount('#app')
