import { Router, RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

let routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/dashboard.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard/article'
      },
      {
        path: 'category',
        component: () => import('@/views/category/index.vue'),
      },
      {
        path: 'article',
        component: () => import('@/views/article/index.vue'),
      },
      {
        path: 'users',
        component: () => import('@/views/users/index.vue'),
      },
    ]
  }


]

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
})





export default router




export { router, routes }