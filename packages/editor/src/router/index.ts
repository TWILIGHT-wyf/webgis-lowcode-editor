import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载，优化首屏性能
const Dashboard = () => import('@/views/Dashboard.vue')
const Editor = () => import('@/views/Editor.vue')
const RuntimeView = () => import('@/views/RuntimeView.vue')
const Preview = () => import('@/views/Preview.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { title: '项目工作台' },
    },
    {
      // 旧版编辑器
      path: '/editor/:id',
      name: 'Editor',
      component: Editor,
      meta: { title: '编辑器' },
    },
    {
      // V1.5 新版编辑器（重构后的布局）
      path: '/editor-v2',
      name: 'EditorV2',
      component: Editor,
      meta: { title: 'Vela Engine' },
    },
    {
      // 旧版预览页 - 支持 query 参数
      path: '/runtime',
      name: 'Runtime',
      component: RuntimeView,
      meta: { title: '预览' },
    },
    {
      // 旧版预览页 - 支持 path 参数 (兼容旧链接)
      path: '/preview/:id',
      name: 'PreviewOld',
      component: RuntimeView,
      meta: { title: '预览' },
    },
    {
      // V1.5 新版预览页
      path: '/preview',
      name: 'Preview',
      component: Preview,
      meta: { title: '预览 V1.5' },
    },
  ],
})

export default router
