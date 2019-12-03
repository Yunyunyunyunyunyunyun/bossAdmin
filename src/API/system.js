import { httpPost, httpGet } from './request/index'

class Services {
  /**
   * 系统菜单配置
   * 查询
   * @returns Promise
   * @memberof Services
   */
  systemMenu (data) {
    return httpPost('/bossSysMenu/find', data)
  }

  /**
   * 系统菜单配置
   * 新建/增加同级/增加子级目录
   * @returns Promise
   * @memberof Services
   */
  addSystemMenu (data) {
    return httpPost('/bossSysMenu/save', data)
  }

  /**
   * 系统菜单配置
   * 编辑系统菜单
   * @returns Promise
   * @memberof Services
   */
  editSystemMenu (data) {
    return httpPost('/bossSysMenu/update', data)
  }

  /**
   * 系统菜单配置
   * 删除系统菜单
   * @returns Promise
   * @memberof Services
   */
  delSystemMenu (id) {
    const data = {
      id
    }
    return httpPost('/bossSysMenu/delete', data)
  }

  /**
   * 系统角色配置
   * 查询
   * @returns Promise
   * @memberof Services
   */
  systemRole (data) {
    return httpPost('/bossSysRole/find', data)
  }

  /**
   * 系统角色配置
   * 查看关联用户
   * @returns Promise
   * @memberof Services
   */
  associatedUser (id) {
    const data = {
      id
    }
    return httpPost('/bossSysRole/findUser', data)
  }

  /**
   * 系统角色配置
   * 新建系统角色
   * @returns Promise
   * @memberof Services
   */
  addSystemRole (data) {
    return httpPost('/bossSysRole/save', data)
  }

  /**
   * 系统角色配置
   * 删除角色
   * @returns Promise
   * @memberof Services
   */
  delSystemRole (data) {
    return httpPost('/bossSysRole/delete', data)
  }

  /**
   * 系统角色配置
   * 新建系统角色
   * @returns Promise
   * @memberof Services
   */
  editSystemRole (data) {
    return httpPost('/bossSysRole/update', data)
  }

  /**
   * 系统角色配置
   * 查询角色菜单列表
   * @returns Promise
   * @memberof Services
   */
  findMenuList (id = '') {
    const data = {
      id
    }
    return httpPost('/bossSysRole/findMenuList', data)
  }

  /**
   * 系统消息配置
   * 获取消息列表
   * @returns Promise
   * @memberof Services
   */
  messageList (data) {
    return httpPost('/boss/message/getMessageList', data)
  }

  /**
   * 系统消息配置
   * 获取接收对象
   * @returns Promise
   * @memberof Services
   */
  receiveObj () {
    return httpGet('/boss/message/getReceiveObj')
  }

  /**
   * 系统消息配置
   * 获取消息接收账户
   * @returns Promise
   * @memberof Services
   */
  accountList () {
    return httpPost('/boss/message/getMessageAccountList')
  }

  /**
   * 系统消息配置
   * 保存和发布消息
   * @returns Promise
   * @memberof Services
   */
  createMessage (data) {
    return httpPost('/boss/message/createMessage', data)
  }

  /**
   * 系统消息配置
   * 保存和发布消息
   * @returns Promise
   * @memberof Services
   */
  editMessage (data) {
    return httpPost('/boss/message/updateMessage', data)
  }
  /**
   * 系统消息配置
   * 获取消息详情
   * @returns Promise
   * @memberof Services
   */
  msgDetail (id) {
    return httpGet(`/boss/message/getInfo/${id}`)
  }

  /**
   * 系统消息配置
   * 清除消息
   * @returns Promise
   * @memberof Services
   */
  delMsg (ids) {
    const data = {
      ids
    }
    return httpPost('/boss/message/cleanMessage', data)
  }

  /**
   * 系统用户配置
   * 查询
   * @returns Promise
   * @memberof Services
   */
  systemUser (data) {
    return httpPost('/sys/user/list', data)
  }

  /**
   * 系统用户配置
   * 查询所有系统角色
   * @returns Promise
   * @memberof Services
   */
  systemRoleAll () {
    return httpPost('/bossSysRole/selAllRole')
  }

  /**
   * 系统用户配置
   * 查询所有系统角色
   * @returns Promise
   * @memberof Services
   */
  addSystemUser (data) {
    return httpPost('/sys/user/addEditUser', data)
  }

  /**
   * 系统用户配置
   * 删除用户
   * @returns Promise
   * @memberof Services
   */
  delSystemUser (id) {
    const data = {
      id
    }
    return httpPost('/sys/user/delUser', data)
  }

  /**
   * 操作日志
   * @returns Promise
   * @memberof Services
   */
  log (data) {
    return httpPost('/sys/log/list', data)
  }
}

export default new Services()
