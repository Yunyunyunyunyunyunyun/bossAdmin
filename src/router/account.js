import Home from '../views/home/layout.vue'

export default {
  path: '/account',
  name: 'account',
  bname: '账户管理',
  component: Home,
  children: [
    {
      path: '/account/accountConfig',
      name: 'accountConfig',
      bname: '账号配置',
      component: () =>
        import('../views/account/accountConfig/index.vue')
    },
    {
      path: '/account/validityAllocation',
      name: 'validityAllocation',
      bname: '有效期配置',
      component: () =>
          import('../views/account/validityAllocation/index.vue')
    }
  ]
}
