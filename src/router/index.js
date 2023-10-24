import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login', // 登入頁面
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: 'products', // 產品頁面
        component: () => import('../views/Products.vue')
      },
      {
        path: 'orders', // 訂單頁面
        component: () => import('../views/Orders.vue')
      },
      {
        path: 'coupons', // 優惠券頁面
        component: () => import('../views/Coupons.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('../views/Userboard.vue'),
    children: [
      {
        path: 'cart', // 購物車頁面
        component: () => import('../views/UserCart.vue')
      },
      {
        path: 'product/:productId', // 某一產品頁面
        component: () => import('../views/UserProduct.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
