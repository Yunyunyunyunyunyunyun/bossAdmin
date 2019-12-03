import { httpPost } from './request/index'
class Services {
  /**
   *地址管理
   *小区、街道列表
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getCommunityList (data) {
    return httpPost('/estate/getList', data)
  }
  /**
   *地址管理
   *小区、街道详情
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getCommunityInfo (data) {
    return httpPost('/estate/getDetail', data)
  }
  /**
   *地址管理
   *删除小区
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteCommunity (data) {
    return httpPost('/estate/delById', data)
  }
  /**
   *地址管理
   *区域联动
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getLinkAge (data) {
    return httpPost('/dict/findByParentId', data)
  }
  /**
   *地址管理
   *区域街道
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getStreet (data) {
    return httpPost('/estate/getStreetByArea', data)
  }
  /**
   *地址管理
   *地址添加
   * @param {*} data
   * @returns
   * @memberof Services
   */
  saveArea (data) {
    return httpPost('/estate/save', data)
  }
  /**
   *地址管理
   *小区、街道详情
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getAreaDetail (data) {
    return httpPost('/estate/getDetail', data)
  }
  /**
   *地址管理
   *删除小区、街道
   * @param {*} data
   * @returns
   * @memberof Services
   */
  deleteArea (data) {
    return httpPost('/estate/delById', data)
  }
}

export default new Services()
