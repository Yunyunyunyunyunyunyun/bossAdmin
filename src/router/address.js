import Home from '../views/home/layout.vue'

export default {
  path: '/address',
  name: 'address',
  bname: '地址管理',
  component: Home,
  children: [
    {
      path: '/address/streetConfig',
      name: 'streetConfig',
      bname: '街道配置',
      component: () =>
        import('../views/address/streetConfig/index.vue')
    },
    {
      path: '/address/cellAddress',
      name: 'cellAddress',
      bname: '小区配置',
      component: () =>
        import('../views/address/cellAddress/index.vue')
    }
  ]
}
