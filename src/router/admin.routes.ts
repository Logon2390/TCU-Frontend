import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/overview',
    name: 'admin-overview',
    component: () => import('@/views/UsersView.vue'),
    meta: { requiresAuth: true },
  },
]

export default adminRoutes
