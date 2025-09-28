import type { RouteRecordRaw } from 'vue-router'
import StatsView from '@/views/StatsView.vue'
import ModulesView from '@/views/ModulesView.vue'
import ModuleView from '@/views/ModuleView.vue'
import UsersView from '@/views/UsersView.vue'
import UserView from '@/views/UserView.vue'
import AdminView from '@/views/AdminView.vue'

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
  {
    path: '/admin/modules/:id',
    name: 'admin-module-profile',
    component: ModuleView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UsersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users/:id',
    name: 'admin-user-profile',
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/management',
    name: 'admin-management',
    component: AdminView,
    meta: { requiresAuth: true },
  },
]

export default adminRoutes
