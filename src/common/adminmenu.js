export const adminmenu = [
  {
    label: '客户管理',
    value: 'customer',
    src: '../../../../static/images/customer.png',
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
    src: '../../../../static/images/authority.png',
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
  },
  {
    label: '设备管理',
    value: 'equipment',
    src: '../../../../static/images/equipment.png',
    children: [
      {
        label: '设备入库',
        value: '/equipment/equipStorage'
      },
      {
        label: '设备测试',
        value: '/equipment/equipTest'
      },
      {
        label: '设备安装',
        value: '/equipment/equipInstall'
      }
    ]
  },
  {
    label: '帐户管理',
    value: 'account',
    src: '../../../../static/images/account.png',
    children: [
      {
        label: '账号配置',
        value: '/account/accountConfig'
      },
      {
        label: '有效期配置',
        value: '/account/validityAllocation'
      }
    ]
  },
  {
    label: '系统管理',
    value: 'system',
    src: '../../../../static/images/system.png',
    children: [
      {
        label: '系统菜单模板',
        value: '/system/systemMenu'
      },
      {
        label: '系统角色配置',
        value: '/system/systemRole'
      },
      {
        label: '系统用户配置',
        value: '/system/systemUser'
      },
      {
        label: '系统消息配置',
        value: '/system/systemMsg'
      },
      {
        label: '系统操作',
        value: '/system/systemOperate'
      }
    ]
  }
]
