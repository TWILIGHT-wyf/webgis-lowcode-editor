import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: () => import('@/pages/dashboardView.vue'),
      meta: { requiresAuth:true,title:'仪表盘',roles:['admin','user']}
    },
    {
      path: '/login',
      component: () => import('@/pages/loginView.vue'),
      meta: { title:'登录' }
    },
    {
      path: '/map',
      component: () => import('@/pages/mapView.vue'),
      meta: { requiresAuth: true, title: '地图', roles:['admin','user']}
    },
    {
      path: '/report',
      component: () => import('@/pages/reportView.vue'),
      meta: { requiresAuth: true, title: '报表', roles:['admin','user']}
    },
    {
      path: '/workorders',
      component: () => import('@/pages/workordersView.vue'),
      meta: { requiresAuth: true, title: '设施管理', roles:['admin','user']}
    },
    {
      path: '/config',
      component: () => import('@/pages/configView.vue'),
      meta: { requiresAuth: true, title: '用户管理', roles: ['admin', 'user'] }
    }
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!auth.isAuth && to.meta.requiresAuth) {
    return { path: '/login'}
  }
  if (auth.isAuth && to.path === '/login') {
    return '/dashboard'
  }
})


export default router
