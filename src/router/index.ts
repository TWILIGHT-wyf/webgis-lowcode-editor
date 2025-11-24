import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/runtime',
      name: 'runtime',
      component: () => import('@/pages/runtimeView.vue'),
    },
  ],
})

export default router
