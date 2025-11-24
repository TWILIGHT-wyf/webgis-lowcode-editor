import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/animations.css'
import './styles/theme.css'
import VueECharts from 'vue-echarts'

if (import.meta.env.DEV) {
  const { worker } = await import('./mock/browser')
  await worker.start({
    onUnhandledRequest: 'bypass', // 忽略未定义的请求，不拦截
  })
}

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.component('v-chart', VueECharts)
app.mount('#app')
