import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import UserFormView from '../views/UserFormView.vue'
import Forgot from '../views/ForgotView.vue'
import Reset from '../views/ResetView.vue'
import Page404NotFound from '@/views/NotFoundView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/admin/Login',
      name: 'login',
      component: Login,
    },
    {
      path: '/registro',
      name: 'registro',
      component: UserFormView,
    },
    {
      path: '/registro',
      name: 'registro',
      component: UserFormView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound404',
      component: Page404NotFound,
    },
    {
      path: '/admin/forgot',
      name: 'forgot',
      component: Forgot,
    },
    {
      path: '/admin/reset/:token',
      name: 'reset',
      component: Reset,
    },
    {
      path: '/admin/reset',
      name: 'reset',
      component: Reset,
    },
  ],
})

export default router
