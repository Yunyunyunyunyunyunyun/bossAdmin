<template>
  <div class="accountOperate">
    <div class="content">
      <span class="lt">{{ accountTitle }}</span>
      <span class="fr"><span class="red">* </span>为必填项</span>
    </div>
    <div class="mainAdd">
      <el-row>
        <el-col :span="12" class="pd20 br h100 pr40">
          <div>账号信息</div>
          <el-form
            ref="accountForm" :model="accountForm" :rules="rules"
            label-width="150px" class="mt22"
          >
            <el-form-item label="所属客户简称：" prop="customerBelong">
              <el-select
                v-if="accountTitle === '新建账号'" v-model="accountForm.customerBelong"
                value-key="id" placeholder="请选择所属客户简称"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.id"
                  :label="item.abbreviation"
                  :value="item"
                />
              </el-select>
              <el-input v-else-if="accountTitle === '编辑账号'" v-model="accountForm.customerBelong" disabled />
            </el-form-item>
            <el-form-item label="用户名：" prop="userName">
              <el-input v-model="accountForm.userName" placeholder="支持英文、英文数字组合或手机号，最长30字符" maxlength="30" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input
                v-if="accountTitle === '编辑账号'" v-model="accountForm.password" class="newAccountPassword"
                placeholder="请填写密码，不填则默认为123456"
              />
              <span v-else-if="accountTitle === '新建账号'" class="newAccountPassword">
                <el-input
                  v-if="showpw" v-model="accountForm.password" type="password"
                  class="newAccountStyle" placeholder="请填写密码，不填则默认为123456"
                >
                  <template slot="append">
                    <i class="fa fa-eye-slash commonColor" title="隐藏" @click="showpw=false"></i>
                  </template>
                </el-input>
                <el-input
                  v-else v-model="accountForm.password"
                  class="newAccountStyle" placeholder="请填写密码，不填则默认为123456"
                >
                  <template slot="append">
                    <i class="fa fa-eye commonColor" title="显示" @click="showpw=true"></i>
                  </template>
                </el-input>
              </span>
            </el-form-item>
            <el-form-item label="昵称：" prop="nickname">
              <el-input v-model="accountForm.nickname" placeholder="请填写昵称，建议填写中文姓名，最长30字符" maxlength="30" />
            </el-form-item>
            <el-form-item label="手机号：" prop="phoneNumber">
              <el-input v-model="accountForm.phoneNumber" placeholder="请填写手机号" />
            </el-form-item>
            <el-form-item label="头像：" prop="avatar">
              <el-upload
                class="avatar-uploader"
                :action="serveUrl"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <div v-else v-loading="imageLoading">
                  <i class="el-icon-plus avatar-uploader-icon" />
                  <div class="avatar-contain">
                    上传图片
                  </div>
                </div>
                <div slot="tip" class="avatar-tip">
                  只能上传jpg/png格式文件，建议上传200px*px
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="猫运维APP：" prop="loginStatus">
              <el-radio-group v-model="accountForm.loginStatus">
                <el-row>
                  <el-col :span="8">
                    <el-radio :label="0">
                      允许登录
                    </el-radio>
                  </el-col>
                  <el-col :span="8">
                    <el-radio :label="1">
                      禁止登录
                    </el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="trueName">
              <el-input v-model="accountForm.trueName" placeholder="请填写真实姓名" />
            </el-form-item>
            <el-form-item label="岗位：" prop="aPosition">
              <el-input v-model="accountForm.aPosition" placeholder="请填写岗位" />
            </el-form-item>
            <el-form-item label="账号类型：" prop="userType">
              <el-radio-group v-model="accountForm.userType" :disabled="accountTitle === '编辑账号'" @change="typeChange">
                <el-row>
                  <el-col :span="8">
                    <el-radio :label="1">
                      区域管理员
                    </el-radio>
                  </el-col>
                  <el-col :span="8">
                    <el-radio :label="0">
                      超级管理员
                    </el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="关联角色：" prop="assRole">
              <el-cascader
                v-model="accountForm.assRole"
                :disabled="accountTitle === '编辑账号'"
                size="medium"
                :clearable="true"
                :filterable="true"
                :show-all-levels="false"
                class="roleCascader"
                placeholder="请选择角色，只可选一个角色"
                :props="roleProps"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="启用状态：" prop="useStatus">
              <el-radio-group v-model="accountForm.useStatus">
                <el-row>
                  <el-col :span="8">
                    <el-radio :label="0">
                      启用
                    </el-radio>
                  </el-col>
                  <el-col :span="8">
                    <el-radio :label="1">
                      禁用
                    </el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：" prop="desc">
              <el-input
                v-model="accountForm.desc" type="textarea" rows="3"
                placeholder="请填写备注，最长50字符" maxlength="50" show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" class="pd20 br h100 centerContain pr40">
          <div v-if="shoWOprate" class="contianOprate"></div>
          <div>管理区域</div>
          <el-form
            ref="areaForm" :model="accountForm" :rules="accountForm.userType===1?areaRules:{}"
            label-width="150px" class="mt22"
          >
            <el-form-item label="区域：" prop="selectedArea">
              <el-cascader
                v-model="accountForm.selectedArea"
                size="medium"
                :clearable="true"
                :filterable="true"
                placeholder="请选择省市"
                :options="areaOptions"
                :props="areaProps"
                @change="areaChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps"
            @check="handleCheck"
          />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" class="w90" @click="submit('accountForm', 'areaForm')">
        提交
      </el-button>
      <el-button
        type="primary" plain class="w90"
        @click="cancel"
      >
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
import Host from '../../../config/apiHost'
import md5 from 'js-md5'
import Server from '../../../API/account'
import commonServer from '../../../API/common'
export default {
  data () {
    const _that = this
    const validatePhoneNum = (rule, value, callback) => {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        return callback(new Error('请输入手机号'))
      } else if (!myreg.test(value)) {
        return callback(new Error('请输入正确的手机号格式'))
      } else {
        callback()
      }
    }
    const validateUserName = (rule, value, callback) => {
      const myreg1 = /^[A-Za-z]+$/
      const myreg2 = /^(?!\d+$)[\da-zA-Z]+$/
      const myreg3 = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        return callback(new Error('请输入用户名'))
      } else if (!myreg1.test(value) && !myreg2.test(value) && !myreg3.test(value)) {
        return callback(new Error('请输入正确的用户名格式'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const myreg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        callback()
      } else if (myreg.test(value)) {
        return callback(new Error('请输入非中文的密码格式'))
      } else {
        callback()
      }
    }
    return {
      accountTitle: '新建账号',
      imageLoading: false,
      accountForm: {
        customerBelong: '',
        userName: '',
        password: '',
        nickname: '',
        phoneNumber: '',
        loginStatus: 0,
        trueName: '',
        aPosition: '',
        userType: 1,
        assRole: [],
        useStatus: 0,
        desc: '',
        cusId: '',
        selectedArea: []
      },
      accountFormInfo: {},
      rules: {
        customerBelong: [
          { required: true, message: '请输入所属客户简称', trigger: 'blur' }
        ],
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, validator: validatePhoneNum, trigger: 'blur' }
        ],
        assRole: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        password: [
          { required: false, validator: validatePassword, trigger: 'blur' }
        ]
      },
      areaRules: {
        selectedArea: [
          { required: true, message: '请选择省市', trigger: 'change' }
        ]
      },
      headers: {
        token: localStorage.bossadmin_user
          ? (JSON.parse(localStorage.bossadmin_user).token || '')
          : ''
      },
      serveUrl: `${Host.uploadImgHost}/boss/message/upload`,
      customerOptions: [],
      imageUrl: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      accountId: '',
      areaProps: {
        multiple: true,
        children: 'children',
        label: 'name',
        value: 'id'
      },
      areaOptions: [],
      selectedTreeData: [],
      roleProps: {
        lazy: true,
        async lazyLoad (node, resolve) {
          node.value = node.value ? node.value : ''
          const { level } = node
          // 规避不能正常回显的bug
          if (!_that.accountForm.assRole.length) {
            // 模拟获取回显
            _that.value = await _that.getInfo()
          }
          Server.getTempletaRole({ id: node.value }).then(res => {
            if (res.code === 0) {
              const nodes = res.result.list
                .map(item => ({
                  value: item.id,
                  label: item.name,
                  leaf: level >= 1
                }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            }
          })
        }
      },
      shoWOprate: false,
      showpw: true
    }
  },
  created () {
    this.accountTitle = this.$route.query.title
    this.accountId = this.$route.query.id
  },
  mounted () {
    this.getProvincesList({})
    if (this.accountTitle === '新建账号') {
      this.getAllCustomerList({})
    }
    if (this.accountTitle === '编辑账号') {
      const params = {
        id: this.accountId
      }
      this.getAccountInfo(params)
    }
  },
  methods: {
    getProvincesList (params) {
      commonServer.getProvinces(params).then((res) => {
        if (res.code === 0) {
          this.areaOptions = res.result
        }
      })
    },
    getInfo () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.accountForm.assRole)
        }, 500)
      })
    },
    getAccountInfo (params) {
      Server.getAccountInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.accountFormInfo = res.result.info
          this.accountForm.customerBelong = this.accountFormInfo.abbreviation
          this.accountForm.cusId = this.accountFormInfo.cusId
          this.accountForm.phoneNumber = this.accountFormInfo.mobile
          this.accountForm.loginStatus = this.accountFormInfo.isLogin
          this.accountForm.trueName = this.accountFormInfo.realName
          this.accountForm.nickname = this.accountFormInfo.nickName
          this.accountForm.userName = this.accountFormInfo.userName
          this.accountForm.useStatus = this.accountFormInfo.isEnable
          this.imageUrl = this.accountFormInfo.headPath
          this.accountForm.aPosition = this.accountFormInfo.uPost
          this.accountForm.desc = this.accountFormInfo.remark
          this.accountForm.userType = this.accountFormInfo.userType
          if (this.accountForm.userType === 1) {
            this.shoWOprate = false
          } else {
            this.shoWOprate = true
            this.accountForm.selectedArea = []
          }
          if (this.accountFormInfo.template) {
            this.accountForm.assRole = [this.accountFormInfo.templateId, this.accountFormInfo.template.roleList.id]
          }
          this.treeData = this.accountFormInfo.areaList
          if (this.accountFormInfo.areaList && this.accountFormInfo.areaList.length !== 0) {
            this.selectedTreeData = this.accountFormInfo.areaList
            const selectedResult = this.handleFilterData(this.accountFormInfo.areaList)
            this.$refs.tree.setCheckedKeys(selectedResult)
            const newArray = []
            this.accountFormInfo.areaList.forEach((item) => {
              if ((item.pid === '0' || item.pid === 0) && item.children) {
                item.children.forEach((i) => {
                  newArray.push([i.pid, i.id])
                })
              }
            })
            this.accountForm.selectedArea = newArray
          }
        }
      })
    },
    handleFilterData (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (!list[i].children || (list[i].children && list[i].children.length === 0)) {
            if (list[i].isSelected) {
              result.push(list[i].id)
            }
          } else {
            filter(list[i].children)
          }
        }
      }
      filter(items)
      return result
    },
    getAllCustomerList (params) {
      Server.getAllCustomer(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.customerOptions = res.result.list
        }
      })
    },
    typeChange (val) {
      this.treeData = []
      if (val === 1) {
        this.shoWOprate = false
      } else {
        this.shoWOprate = true
        this.accountForm.selectedArea = []
        this.$refs['areaForm'].clearValidate()
      }
    },
    areaChange (val) {
      const newArr = []
      if (val && val.length !== 0) {
        val.forEach((item) => {
          newArr.push({ id: item[0], children: [{ id: item[1] }] })
        })
      }
      const params = {
        areaList: newArr
      }
      if (this.accountId) {
        params.id = this.accountId
      }
      Server.getUserAreaInfo(params).then((res) => {
        if (res.code === 0) {
          this.treeData = res.result.areaList
        }
      })
    },
    handleCheck () {
      const selectnode = this.$refs.tree.getCheckedNodes(false, true)
      let newArr = []
      newArr = JSON.parse(
        JSON.stringify(selectnode.filter(item => item.pid === 0 || item.pid === '0'))
      )
      const lastData = []
      const lastId = []
      const lastItem = []
      for (const item of newArr) {
        if (item.children && item.children.length > 0) {
          for (const itemtwo of item.children) {
            if (selectnode.find(element => element.id === itemtwo.id)) {
              if (itemtwo.children && itemtwo.children.length > 0) {
                for (const itemthree of itemtwo.children) {
                  if (selectnode.find(element => element.id === itemthree.id)) {
                    Object.keys(item).forEach(function (key) {
                      for (let x = 0; x < item[key].length; x++) {
                        if (key === 'children') {
                          if (itemthree.pid === item[key][x].id) {
                            item[key][x].children = []
                            lastData.push(itemthree)
                          }
                        }
                      }
                    })
                  }
                }
              }
            }
          }
        }
        Object.keys(item).forEach(function (key) {
          Object.keys(lastData).forEach(function (j) {
            if (key === 'children') {
              for (let x = 0; x < item[key].length; x++) {
                if (lastData[j].pid === item[key][x].id) {
                  item[key][x].children.push(lastData[j])
                  lastId.push(item[key][x].id)
                  Array.from(new Set([...lastId])).forEach(function (z) {
                    if (z === item[key][x].id) {
                      lastItem.push(item[key][x])
                    }
                  })
                }
              }
            }
          })
          if (key === 'children') {
            item[key] = []
          }
          Array.from(new Set([...lastItem])).forEach(function (t) {
            if (item.id === t.pid) {
              item.children.push(t)
            }
          })
          item.children = Array.from(new Set([...item.children]))
        })
      }
      this.selectedTreeData = []
      this.selectedTreeData = newArr
    },
    submit (formName1, formName2) {
      this.$refs[formName1].validate((valid1) => {
        this.$refs[formName2].validate((valid2) => {
          if (valid1 && valid2) {
            const params = {
              mobile: this.accountForm.phoneNumber,
              isLogin: this.accountForm.loginStatus,
              realName: this.accountForm.trueName,
              nickName: this.accountForm.nickname,
              userName: this.accountForm.userName,
              isEnable: Number(this.accountForm.useStatus),
              headPath: this.imageUrl,
              uPost: this.accountForm.aPosition,
              remark: this.accountForm.desc,
              templateId: this.accountForm.assRole[0],
              roleId: this.accountForm.assRole[1],
              userType: Number(this.accountForm.userType)
            }
            if (Number(this.accountForm.userType) === 1 && this.selectedTreeData) {
              params.areaList = this.selectedTreeData
            }
            if (this.accountTitle === '新建账号') {
              params.cusId = this.accountForm.customerBelong.id
              params.password = this.accountForm.password ? md5(this.accountForm.password) : md5('123456')
            }
            if (this.accountTitle === '编辑账号') {
              params.cusId = this.accountForm.cusId
              if (this.accountForm.password) {
                params.password = md5(this.accountForm.password)
              }
            }
            if (this.accountId) {
              params.id = this.accountId
            }
            Server.addEditAccount(params).then((res) => {
              if (res.code === 0) {
                this.$message.success(res.msg)
                this.$router.push({
                  path: '/account/accountConfig'
                })
              }
            })
          } else {
            return false
          }
        })
      })
    },
    cancel () {
      this.$router.push({
        path: '/account/accountConfig'
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = res.result
      this.imageLoading = false
    },
    beforeAvatarUpload (file) {
      const isTYPE = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isTYPE) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      } else {
        this.imageLoading = true
      }
      return isTYPE
    }
  }
}
</script>

<style lang="less" scoped>
.accountOperate {
  padding:20px 20px 0;
  background-color: #fff;
  .content {
    height: 52px;
    line-height: 52px;
    background: #f3f8ff;
    border: 1px solid #e6e6e6;
    padding: 0 20px;
    .lt {
      color: #333;
      font-size: 16px;
    }
    .fr {
      float: right;
      color: #666;
      font-size: 16px;
      .red {
        color: #E02020;
      }
    }
  }
  .mainAdd {
    border: 1px solid #e6e6e6;
    border-top: none;
    .pd20 {
      padding: 20px;
    }
    .pr40 {
      padding-right: 40px;
    }
    .mt22 {
      margin-top: 22px;
    }
    .br {
      border-right: 1px solid #e6e6e6;
    }
    .h100 {
      height: 100vh;
      overflow: auto;
    }
    .centerContain {
      position: relative;
      .contianOprate {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        background-color: #fff;
        width: 100vw;
        z-index: 1000;
        opacity: 0;
      }
    }
    .commonColor {
      color: #999;
      cursor: pointer;
    }
  }
  .footer {
    text-align: center;
    padding: 50px 0;
    .w90 {
      width: 90px;
    }
  }
}
</style>
<style lang="less">
.accountOperate {
  .mainAdd {
    .el-select, .el-cascader, .el-input, .el-textarea {
      width: 350px;
      .el-cascader__search-input {
        display: none;
      }
    }
    .avatar-uploader {
      .el-upload {
        border: 1px dashed #ccc;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 104px;
        height: 104px;
      }
      .avatar-uploader-icon {
        font-size: 22px;
        color: #999;
        text-align: center;
        margin-top: 20px;
      }
      .avatar-contain {
        font-size: 14px;
        color: #999;
      }
      .avatar {
        width: 104px;
        height: 104px;
        display: block;
      }
      .avatar-tip {
        font-size: 12px;
        color: #999;
      }
    }
    .el-button {
      height: 36px;
      width: 100%;
      padding: 0 20px;
    }
    .el-tree {
      width: 250px;
      margin: 0 auto;
      padding-top: 25px;
      .el-tree-node__content {
        height: 30px;
        line-height: 30px;
        cursor: default;
      }
    }
    .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
      color: #717276;
      background-color: #f7f9fb;
      border-color: #e6e6e6;
    }
    .el-radio__label {
      padding-left: 0;
    }
    .el-radio-group {
      width: 100%;
    }
    .newAccountStyle {
      .el-input__inner {
        border-right: none;
      }
      .el-input__inner:focus-within {
        border-right: 1px solid #4C8CF8;
      }
    }
    .el-form-item.is-error .newAccountPassword .el-input__inner, .el-form-item.is-error .newAccountPassword .el-input__inner:focus-within {
      border-right: 1px solid #F56C6C!important;
    }
  }
}
</style>
