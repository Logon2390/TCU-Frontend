import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './admin.routes'
import publicRoutes from './public.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...adminRoutes],
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
  const isAuthenticated = Boolean(localStorage.getItem('user'))

  if (requiresAuth && !isAuthenticated) {
    const redirect = encodeURIComponent(to.fullPath)
    next({ name: 'login', query: { redirect } })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ path: '/admin/stats' })
  } else {
    next()
  }
})

export default router
