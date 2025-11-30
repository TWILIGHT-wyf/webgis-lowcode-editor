import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载，优化首屏性能
const Dashboard = () => import('@/views/dashboard.vue')
const Editor = () => import('@/views/editor.vue')
const RuntimeView = () => import('@/views/runtimeView.vue') 

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
      // 增加 :id 参数，用于区分不同项目
      path: '/editor/:id',
      name: 'Editor',
      component: Editor,
      meta: { title: '编辑器' },
    },
    {
      // 预览页也需要 id
      path: '/preview/:id',
      name: 'Preview',
      component: RuntimeView,
      meta: { title: '预览' },
    },
  ],
})

export default router
