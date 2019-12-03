import { httpPost } from './request/index'
class Services {
  /**
   *账户管理
   *账号配置查询
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getAccountList (data) {
    return httpPost('/cus/user/list', data)
  }
  /**
   *账户管理
   *获取账号信息
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getAccountInfo (data) {
    return httpPost('/cus/user/getUser', data)
  }
  /**
   *账户管理
   *账号配置删除
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteAccount (data) {
    return httpPost('/cus/user/delUser', data)
  }
  /**
   *账户管理
   *账号配置新增/编辑提交
   * @param {*} data
   * @returns
   * @memberof Services
   */
  addEditAccount (data) {
    return httpPost('/cus/user/addEditUser', data)
  }
  /**
   *账户管理
   *获取用户多个省市区查询
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getUserAreaInfo (data) {
    return httpPost('/cus/user/getUserArea', data)
  }
  /**
   *账户管理
   *获取模板角色信息
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getTempletaRole (data) {
    return httpPost('/cloudSysTemplate/selTemRole', data)
  }
  /**
   *账户管理
   *获取全部客户
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getAllCustomer (data) {
    return httpPost('/customerInfo/listAll', data)
  }
  /**
   *账户管理
   *查询子账号
   * @param {*} data
   * @returns
   * @memberof Services
   */
  queryChildAccount (data) {
    return httpPost('/cus/user/sonList', data)
  }
  /**
   *账户管理
   *有效期配置查询
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getValidityList (data) {
    return httpPost('/cus/user/findList', data)
  }
  /**
   *账户管理
   *有效期记录查询
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getDateRecord (data) {
    return httpPost('/cus/user/findTimeList', data)
  }
  /**
   *账户管理
   *有效期配置新增
   * @param {*} data
   * @returns
   * @memberof Services
   */
  addValidity (data) {
    return httpPost('/cus/user/saveTime', data)
  }
  /**
   *账户管理
   *有效期配置删除
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteValidity (data) {
    return httpPost('/cus/user/deleteTime', data)
  }
}

export default new Services()
