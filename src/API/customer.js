import { httpPost } from './request/index'
class Services {
  /**
   *客户信息配置
   *查询
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getCustomerList (data) {
    return httpPost('/customerInfo/find', data)
  }
  /**
   *客户信息配置
   *新增
   * @param {*} data
   * @returns
   * @memberof Services
   */
  addCustomer (data) {
    return httpPost('/customerInfo/save', data)
  }
  /**
   *客户信息配置
   *修改
   * @param {*} data
   * @returns
   * @memberof Services
   */
  changeCustomer (data) {
    return httpPost('/customerInfo/update', data)
  }
  /**
   *客户信息配置
   *删除
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteCustomer (data) {
    return httpPost('/customerInfo/delete', data)
  }
}

export default new Services()
