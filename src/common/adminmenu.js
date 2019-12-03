export const adminmenu = [
  {
    label: '客户管理',
    value: 'customer',
    src: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20190924/1569292645980b75e4110e6f946a28f344b9e2496d5a8.png',
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
    src: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20190924/15692926990972a578f4b23b241ae9b28f71cd708926d.png',
    children: [
      {
        label: '菜单配置',
        value: '/authority/menuConfig'
      },
      {
        label: '菜单模板',
        value: '/authority/menuTemplate'
      },
      {
        label: '角色配置',
        value: '/authority/roleConfig'
      }
    ]
  },
  {
    label: '帐户管理',
    value: 'account',
    src: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20190924/156929276351884f874a5b8d940949436d3c128143d21.png',
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
    label: '地址管理',
    value: 'address',
    src: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20190924/1569292803090ad7118d4519849f9ae783ccf82c30d37.png',
    children: [
      {
        label: '街道配置',
        value: '/address/streetConfig'
      },
      {
        label: '小区配置',
        value: '/address/cellAddress'
      }
    ]
  },
  {
    label: '设备管理',
    value: 'equipment',
    src: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20190924/1569292851678cb842e2991174d2d8d7061ef9f78daa4.png',
    children: [
      {
        label: '设备入库',
        value: '/equipment/equipStorage'
      },
      {
        label: '设备组配置',
        value: '/equipment/equipGroup'
      },
      {
        label: '设备测试',
        value: '/equipment/equipTest'
      },
      {
        label: '设备出库',
        value: '/equipment/equipCheckout'
      },
      {
        label: '设备安装',
        value: '/equipment/equipInstall'
      }
    ]
  },
  {
    label: '系统管理',
    value: 'system',
    src: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20190924/15692928877815bc8faa888a540cf8016638bfbbbbd0f.png',
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
        label: '操作日志',
        value: '/system/systemOperate'
      }
    ]
  }
]
