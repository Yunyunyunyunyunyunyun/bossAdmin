export const adminmenu = [
  {
    label: '客户管理',
    value: 'customer',
    icon: 'el-icon-suitcase',
    children: [
      {
        label: '客户信息配置',
        value: '/customer/customerInfo'
      }
    ]
  },
  {
    label: '权限管理',
    value: 'authority',
    icon: 'el-icon-c-scale-to-original',
    children: [
      {
        label: '菜单模板',
        value: '/authority/menuTemplate'
      },
      {
        label: '菜单配置',
        value: '/authority/menuConfig'
      },
      {
        label: '角色配置',
        value: '/authority/roleConfig'
      }
    ]
  }
]
