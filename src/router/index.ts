import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginView from '../views/user/LoginView.vue'

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
      path: '/admin',
      name: 'admin',
      component: UserLoginView,
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UserLoginView,
    },
    {
      path: '/modulos',
      name: 'modulos',
      component: UserLoginView,
    },
    {
      path: '/visitas',
      name: 'visitas',
      component: UserLoginView,
    },
  ],
})

export default router
