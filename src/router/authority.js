import Home from '../views/home/layout.vue'

export default {
  path: '/authority',
  name: 'authority',
  bname: '权限管理',
  component: Home,
  children: [
    {
      path: '/authority/menuConfig',
      name: 'menuConfig',
      bname: '菜单配置',
      component: () =>
          import('../views/authority/menuConfig/index.vue')
    },
    {
      path: '/authority/menuConfig/newCatalog',
      name: 'newCatalog',
      bname: '新建目录',
      component: () =>
          import('../views/authority/menuConfig/newCatalog.vue')
    },
    {
      path: '/authority/menuConfig/editMenu',
      name: 'editMenu',
      bname: '编辑',
      component: () =>
          import('../views/authority/menuConfig/editMenu.vue')
    },
    {
      path: '/authority/menuConfig/addEquMenu',
      name: 'addEquMenu',
      bname: '添加同级菜单',
      component: () =>
          import('../views/authority/menuConfig/addEquMenu.vue')
    },
    {
      path: '/authority/menuConfig/addChdMenu',
      name: 'addChdMenu',
      bname: '添加子级菜单',
      component: () =>
          import('../views/authority/menuConfig/addChdMenu.vue')
    },
    {
      path: '/authority/menuTemplate',
      name: 'menuTemplate',
      bname: '菜单模板',
      component: () =>
        import('../views/authority/menuTemplate/index.vue')
    },
    {
      path: '/authority/menuTemplate/templateOperate',
      name: 'templateOperate',
      meta: {
        bname: '新建菜单模板'
      },
      component: () =>
        import('../views/authority/menuTemplate/templateOperate.vue')
    },
    {
      path: '/authority/roleConfig',
      name: 'roleConfig',
      bname: '角色配置',
      component: () =>
          import('../views/authority/roleConfig/index.vue')
    },
    {
      path: '/authority/roleConfig/roleOperate',
      name: 'roleOperate',
      meta: {
        bname: '新建角色'
      },
      component: () =>
          import('../views/authority/roleConfig/roleOperate.vue')
    },
    {
      path: '/authority/roleConfig/viewRole',
      name: 'viewRole',
      bname: '查看角色',
      component: () =>
          import('../views/authority/roleConfig/viewRole.vue')
    }
  ]
}
