import { httpPost } from './request/index'
class Services {
  /**
   *菜单配置
   *新增/增加同级/增加子级目录
   * @param {*} data
   * @returns
   * @memberof Services
   */
  addMenu (data) {
    return httpPost('/cloudSysMenu/save', data)
  }
  /**
   *菜单配置
   *编辑目录
   * @param {*} data
   * @returns
   * @memberof Services
   */
  editMenu (data) {
    return httpPost('/cloudSysMenu/update', data)
  }
  /**
   *菜单配置
   *删除目录
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteMenu (data) {
    return httpPost('/cloudSysMenu/delete', data)
  }
  /**
   *菜单配置/菜单模板
   *获取菜单配置列表/编辑新增处菜单列表
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getMenuList (data) {
    return httpPost('/cloudSysMenu/find', data)
  }
  /**
   *菜单配置
   *编辑回显
   * @param {*} data
   * @returns
   * @memberof Services
   */
  showEditMenu (data) {
    return httpPost('/cloudSysMenu/getById', data)
  }
  /**
   *菜单模板
   *新建/修改模板
   * @param {*} data
   * @returns
   * @memberof Services
   */
  changeTemplate (data) {
    return httpPost('/cloudSysTemplate/edit', data)
  }
  /**
   *菜单模板
   *获取菜单模板列表
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getTemplateList (data) {
    return httpPost('/cloudSysTemplate/getList', data)
  }
  /**
   *菜单模板
   *菜单详情
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getTemplateInfo (data) {
    return httpPost('/cloudSysTemplate/getMenuById', data)
  }
  /**
   *菜单模板
   *编辑回显
   * @param {*} data
   * @returns
   * @memberof Services
   */
  showEditTemplate (data) {
    return httpPost('/cloudSysTemplate/getTemplateById', data)
  }
  /**
   *菜单模板
   *编辑选中菜单
   * @param {*} data
   * @returns
   * @memberof Services
   */
  showSelectTemplate (data) {
    return httpPost('/cloudSysTemplate/find', data)
  }
  /**
   *菜单模板
   *用户详情
   * @param {*} data
   * @returns
   * @memberof Services
   */
  templateUserInfo (data) {
    return httpPost('/cloudSysTemplate/getUsersDetails', data)
  }
  /**
   *菜单模板
   *删除
   * @param {*} data
   * @returns
   * @memberof Services
   */
  cloudSysTemplateDel (data) {
    return httpPost('cloudSysTemplate/delete', data)
  }
  /**
   *角色配置
   *新增/修改/子角色添加
   * @param {*} data
   * @returns
   * @memberof Services
   */
  changeRole (data) {
    return httpPost('/cloudSysRole/edit', data)
  }
  /**
   *角色配置
   *获取角色配置列表
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getRoleList (data) {
    return httpPost('/cloudSysRole/getList', data)
  }
  /**
   *角色配置
   *查看子角色
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getChildRoleList (data) {
    return httpPost('/cloudSysRole/getSubList', data)
  }
  /**
   *角色配置
   *查看关联用户
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getRoleUsersList (data) {
    return httpPost('/cloudSysRole/getUsersList', data)
  }
  /**
   *角色配置
   *查看
   * @param {*} data
   * @returns
   * @memberof Services
   */
  viewRoleInfo (data) {
    return httpPost('/cloudSysRole/getRoleDetails', data)
  }
  /**
   *角色配置
   *删除
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteRole (data) {
    return httpPost('/cloudSysRole/delete', data)
  }
  /**
   *角色配置
   *下拉框菜单模板option
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getTemplateOptions (data) {
    return httpPost('/cloudSysTemplate/getTemplateAll', data)
  }
  /**
   *角色配置-编辑
   *模板菜单详情
   * @param {*} data
   * @returns
   * @memberof Services
   */
  findMenuById (data) {
    return httpPost('/cloudSysTemplate/findMenuById', data)
  }
  /**
   *角色配置-添加子角色
   *模板菜单详情
   * @param {*} data
   * @returns
   * @memberof Services
   */
  selectMenuById (data) {
    return httpPost('/cloudSysTemplate/selectMenuById', data)
  }
}

export default new Services()
