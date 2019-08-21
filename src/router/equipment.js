import Home from '../views/home/layout.vue'

export default {
  path: '/equipment',
  name: 'equipment',
  bname: '设备管理',
  component: Home,
  children: [
    {
      path: '/equipment/equipStorage',
      name: 'equipStorage',
      bname: '设备入库',
      component: () =>
        import('../views/equipment/equipStorage/index.vue')
    },
    {
      path: '/equipment/equipTest',
      name: 'equipTest',
      bname: '设备测试',
      component: () =>
          import('../views/equipment/equipTest/index.vue')
    },
    {
      path: '/equipment/equipInstall',
      name: 'equipInstall',
      bname: '设备安装',
      component: () =>
          import('../views/equipment/equipInstall/index.vue')
    }
  ]
}
