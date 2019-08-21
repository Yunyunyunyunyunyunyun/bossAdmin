import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/layout.vue'
import customerRouter from './customer'
import authorityRouter from './authority'
import equipmentRouter from './equipment'
import accountRouter from './account'
import systemRouter from './system'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    customerRouter,
    authorityRouter,
    equipmentRouter,
    accountRouter,
    systemRouter,
    {
      path: '/login',
      name: 'login',
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
