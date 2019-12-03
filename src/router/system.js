import Home from '../views/home/layout.vue'

export default {
  path: '/system',
  name: 'system',
  bname: '系统管理',
  component: Home,
  children: [
    {
      path: '/system/systemMenu',
      name: 'systemMenu',
      bname: '系统菜单模板',
      component: () => import('../views/system/systemMenu/index.vue')
    },
    {
      path: '/system/systemMenu/addSystemMenu',
      name: 'addSystemMenu',
      meta: {
        bname: '新建目录'
      },
      component: () => import('../views/system/systemMenu/addSystemMenu.vue')
    },
    {
      path: '/system/systemRole',
      name: 'systemRole',
      bname: '系统角色配置',
      component: () => import('../views/system/systemRole/index.vue')
    },
    {
      path: '/system/systemRole/addSystemRole',
      name: 'addSystemRole',
      meta: {
        bname: '新建系统角色'
      },
      component: () => import('../views/system/systemRole/addSystemRole.vue')
    },
    {
      path: '/system/systemUser',
      name: 'systemUser',
      bname: '系统用户配置',
      component: () => import('../views/system/systemUser/index.vue')
    },
    {
      path: '/system/systemMsg',
      name: 'systemMsg',
      bname: '系统消息配置',
      component: () => import('../views/system/systemMsg/index.vue')
    },
    {
      path: '/system/systemMsg/addSystemMsg',
      name: 'addSystemMsg',
      meta: {
        bname: '新增系统消息'
      },
      component: () => import('../views/system/systemMsg/addSystemMsg.vue')
    },
    {
      path: '/system/systemOperate',
      name: 'systemOperate',
      bname: '操作日志',
      component: () => import('../views/system/systemOperate/index.vue')
    }
  ]
}
