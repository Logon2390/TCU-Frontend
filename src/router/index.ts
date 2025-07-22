import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/admins/Login.vue'
import Forgot from  '../views/admins/Forgot.vue'
import Reset from '../views/admins/Reset.vue'
import Page404NotFound from '@/views/errors/Page404NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin/Login',
      name: 'login',
      component: Login,
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