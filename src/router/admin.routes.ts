import type { RouteRecordRaw } from 'vue-router'
import StatsView from '@/views/StatsView.vue'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/stats',
    name: 'admin-stats',
    component: StatsView,
    meta: { requiresAuth: true },
  },
]

export default adminRoutes
