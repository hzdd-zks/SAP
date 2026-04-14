import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/bom',
      name: 'bom',
      component: () => import('../views/BOMList.vue'),
    },
    {
      path: '/purchase',
      name: 'purchase',
      component: () => import('../views/PurchaseList.vue'),
    },
    {
      path: '/bom-summary',
      name: 'bom-summary',
      component: () => import('../views/BOMSummary.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserList.vue'),
    },
  ],
})

// 路由守卫，检查登录状态
router.beforeEach((to, from, next) => {
  // 登录和注册页面不需要检查
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  // 检查是否已登录
  const token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    // 未登录，重定向到登录页面
    next('/login')
  }
})

export default router
