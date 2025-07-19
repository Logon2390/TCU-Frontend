import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginView from '../views/admins/LoginView.vue'
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
      path: '/user/Login',
      name: 'user',
      component: UserLoginView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound404',
      component: Page404NotFound,
    },
    {
      path: '/user/forgot',
      name: 'forgot',
      component: Forgot,
    },
    {
      path: '/user/reset/:token',
      name: 'reset',
      component: Reset,
    },
    {
      path: '/user/reset',
      name: 'reset',
      component: Reset,
    },
  ],
})

export default router