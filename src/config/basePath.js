export default {
  /* 字典 */
  getDict: '/dict/getDictByType', // 获取设备类型
  findByParentId: '/dict/findByParentId', // 区域联动
  getStreet: '/estate/getStreetByArea', // 获取街道
  getEstate: '/estate/getEstateByStreet', // 查询小区
  findUser: '/sys/user/findUserByRole', // 角色用户
  /* 设备管理 */
  findDataDict: '/product/findDataDictByMarkId', // 型号参数
  findMarkList: '/product/findMarkList', // 设备型号
  equipGetList: '/product/getList', // 设备列表
  equipSave: '/product/save', // 编辑设备
  equipDelete: '/product/delById', // 删除设备
  equipGetDetail: '/product/getDetail', // 设备详情
  equipUpdateProduct: '/product/updateProduct', // 测试状态
  equipCheckDevicet: '/product/checkDevice', // 验证补币
  equipUpdateCoinNumById: '/product/updateCoinNumById', // 硬币充值
  equipOpen: '/product/open', // 开门
  equipAllList: '/productGroup/findAllList', // 设备组列表
  equipProduct: '/productGroup/findProductByGroup', // 获取关联设备
  equipProductMark: '/productGroup/findAllGroupMark', // 设备组型号
  equipGroupSave: '/productGroup/save', // 添加设备组
  equipGroupDel: '/productGroup/delById', // 删除设备组
  equipGroupBatch: '/productGroup/updateProductGroup', // 设备组批量操作
  equipGroupDetail: '/productGroup/getDetail', // 设备组详情
  equipProductList: '/productGroup/findProductByMark', // 获取型号设备
  equipImportProduct: '/product/importProduct' // 导入
}
