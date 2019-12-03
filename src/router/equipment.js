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
      path: '/equipment/equipStorage/addDevice',
      name: 'addDevice',
      bname: '添加设备',
      component: () =>
        import('../views/equipment/equipStorage/deviceDetail.vue')
    },
    {
      path: '/equipment/equipStorage/viewDevice',
      name: 'viewDevice',
      bname: '查看设备',
      component: () =>
        import('../views/equipment/equipStorage/deviceDetail.vue')
    },
    {
      path: '/equipment/equipStorage/editDevice',
      name: 'editDevice',
      bname: '编辑设备',
      component: () =>
        import('../views/equipment/equipStorage/deviceDetail.vue')
    },
    {
      path: '/equipment/equipGroup',
      name: 'equipGroup',
      bname: '设备组配置',
      component: () =>
        import('../views/equipment/equipGroup/index.vue')
    },
    {
      path: '/equipment/equipGroup/configDetail',
      name: 'configDetail',
      bname: '设备配置',
      component: () =>
        import('../views/equipment/equipGroup/configDetail.vue')
    },
    {
      path: '/equipment/equipTest',
      name: 'equipTest',
      bname: '设备测试',
      component: () =>
        import('../views/equipment/equipTest/index.vue')
    },
    {
      path: '/equipment/equipCheckout',
      name: 'equipCheckout',
      bname: '设备出库',
      component: () =>
        import('../views/equipment/equipCheckout/index.vue')
    },
    {
      path: '/equipment/equipInstall',
      name: 'equipInstall',
      bname: '设备安装',
      component: () =>
        import('../views/equipment/equipInstall/index.vue')
    },
    {
      path: '/equipment/equipInstall/detail',
      name: 'detail',
      bname: '详情',
      component: () =>
        import('../views/equipment/equipInstall/detail.vue')
    }
  ]
}
