import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import 'leaflet/dist/leaflet.css'

if (import.meta.env.DEV) {
  const { worker } = await import('./mock/browser')
  await worker.start()
}


const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

const auth = useAuthStore()
await auth.init()

app.mount('#app')


