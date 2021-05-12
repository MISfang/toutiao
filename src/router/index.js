import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 配置自己的路由表
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 这个是默认的子路由
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'qa', // 这个是默认的子路由
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: 'video', // 这个是默认的子路由
        name: 'viedo',
        component: () => import('@/views/video')
      },
      {
        path: 'my', // 这个是默认的子路由
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
