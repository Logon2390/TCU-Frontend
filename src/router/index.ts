import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginView from '../views/LoginView.vue'
import Page404NotFound from '@/views/NotFoundView.vue'

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
  ],
})

export default router
