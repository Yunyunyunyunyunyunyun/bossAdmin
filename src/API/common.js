import { httpPost } from './request/index'
class Services {
  /**
   *登录
   * @param {*} data
   * @returns
   * @memberof Services
   */
  login (data) {
    return httpPost('/sys/user/login', data)
  }
  /**
   *登出
   * @returns
   * @memberof Services
   */
  logout () {
    return httpPost('/sys/user/loginOut')
  }
  /**
   *省市
   * @param {*} data
   * @returns
   * @memberof Services
   */
  getProvinces (data) {
    return httpPost('/dict/findList', data)
  }
}

export default new Services()
