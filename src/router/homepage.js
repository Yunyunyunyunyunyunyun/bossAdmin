import Home from '../views/home/layout.vue'

export default {
  path: '/homepage',
  name: 'homepage',
  bname: '首页',
  component: Home,
  children: [
    {
      path: '/homepage/homeIndex',
      name: 'homeIndex',
      bname: '首页',
      component: () =>
        import('../views/homepage/homeIndex/index.vue')
    }
  ]
}
