import Home from '../views/home/layout.vue'

export default {
  path: '/authority',
  name: 'authority',
  bname: '权限管理',
  component: Home,
  children: [
    {
      path: '/authority/menuTemplate',
      name: 'menuTemplate',
      bname: '菜单模板',
      component: () =>
        import('../views/authority/menuTemplate/index.vue')
    },
    {
      path: '/authority/menuConfig',
      name: 'menuConfig',
      bname: '菜单配置',
      component: () =>
          import('../views/authority/menuConfig/index.vue')
    },
    {
      path: '/authority/roleConfig',
      name: 'roleConfig',
      bname: '角色配置',
      component: () =>
          import('../views/authority/roleConfig/index.vue')
    }
  ]
}
