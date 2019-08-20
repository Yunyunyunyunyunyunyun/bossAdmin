import Home from '../views/home/layout.vue'

export default {
  path: '/customer',
  name: 'customer',
  bname: '客户管理',
  component: Home,
  children: [
    {
      path: '/customer/customerInfo',
      name: 'customerInfo',
      bname: '客户信息配置',
      component: () =>
        import('../views/customer/customerInfo/index.vue')
    }
  ]
}
