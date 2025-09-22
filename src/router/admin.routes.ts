import type { RouteRecordRaw } from 'vue-router'
import StatsView from '@/views/StatsView.vue'
import ModulesView from '@/views/ModulesView.vue'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/stats',
    name: 'admin-stats',
    component: StatsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/modules',
    name: 'admin-modules',
    component: ModulesView,
    meta: { requiresAuth: true },
  },
]

export default adminRoutes
