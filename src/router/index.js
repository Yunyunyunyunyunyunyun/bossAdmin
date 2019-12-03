import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/layout.vue'
import HomePageRouter from './homepage'
import customerRouter from './customer'
import authorityRouter from './authority'
import accountRouter from './account'
import addressRouter from './address'
import equipmentRouter from './equipment'
import systemRouter from './system'
import componentsAPI from './componentsAPI'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/homepage/homeIndex'
    },
    HomePageRouter,
    customerRouter,
    authorityRouter,
    accountRouter,
    addressRouter,
    equipmentRouter,
    systemRouter,
    componentsAPI,
    {
      path: '/login',
      name: 'login',
      meta: {
        requireAuth: true
      },
      component: () => import('../views/home/login.vue')
    },
    {
      path: '/redirect',
      component: Home,
      hidden: true,
      children: [
        {
          path: '/redirect/:path*',
          component: () => import('../views/home/redirect.vue')
        }
      ]
    },
    {
      path: '/401',
      name: '401',
      component: () => import('../views/error/401.vue')
    },
    { path: '*', component: () => import('../views/error/404.vue') }
  ]
})
