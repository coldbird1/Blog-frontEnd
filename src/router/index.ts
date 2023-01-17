import { Router, RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import { useUserStoreHook } from "@/store/user";

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

function resetRouter() {
  const newRouter = router;
  (router as any).matcher = (newRouter as any).matcher // reset router
}

//全局路由守卫
router.beforeEach((to, _from, next) => {
  if (to.path !== '/login') {
    if (useUserStoreHook().token !== "") {
      next()
    } else {
      useUserStoreHook().logOut()
    }
  } else {
    next()
  }
})


export default router
export { router, routes, resetRouter }