import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UserFormView from '@/views/UserFormView.vue'
import Page404NotFound from '@/views/NotFoundView.vue'
import Forgot from '@/views/ForgotView.vue'
import Reset from '@/views/ResetView.vue'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/registro',
    name: 'registro',
    component: UserFormView,
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: Forgot,
  },
  {
    path: '/reset',
    name: 'reset',
    component: Reset,
  },
  {
    path: '/reset/:token',
    name: 'reset',
    component: Reset,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound404',
    component: Page404NotFound,
  },
]

export default publicRoutes
