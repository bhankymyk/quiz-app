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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MathsView.vue'),
    },
    {
      path: '/success',
      name: 'success',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SuccessView.vue'),
    },
  ],
})

export default router
