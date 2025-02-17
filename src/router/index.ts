import { createRouter, createWebHistory } from 'vue-router'
import QuizView from '@/views/QuizView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: QuizView,
    },
    {
      path: '/maths',
      name: 'maths',
      component: () => import('../views/MathsView.vue'),
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('../views/SuccessView.vue'),
    },
  ],
})

export default router
