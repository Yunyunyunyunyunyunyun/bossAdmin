<template>
  <div class="roleOperate">
    <div class="content">
      <span class="lt">角色配置</span>
      <span class="fr"><span class="red">* </span>为必填项</span>
    </div>
    <div class="mainAdd">
      <el-row>
        <el-col :span="8" class="pd20 br h100 pr40">
          <div class="roleTitle">
            角色信息
          </div>
          <el-form
            ref="roleForm" :model="roleForm" :rules="rules"
            label-width="150px" class="mt22"
          >
            <el-form-item label="上级角色名称：" prop="parentName">
              <el-input v-model="roleForm.parentName" placeholder="请输入上级角色名称" disabled />
            </el-form-item>
            <el-form-item label="角色名称：" prop="roleName">
              <el-input v-model="roleForm.roleName" placeholder="请输入角色名称，最长30字符" maxlength="30" />
            </el-form-item>
            <el-form-item label="角色标识：" prop="roleSign">
              <el-input v-model="roleForm.roleSign" placeholder="只支持大小写英文，最长30字符" maxlength="30" />
            </el-form-item>
            <el-form-item label="状态：" prop="roleStatus">
              <el-radio-group v-model="roleForm.roleStatus">
                <el-radio :label="0">
                  启用
                </el-radio>
                <el-radio :label="1">
                  禁用
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色描述：" prop="desc">
              <el-input
                v-model="roleForm.desc" type="textarea" rows="3"
                placeholder="请输入角色描述，最长50字符" maxlength="50" show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="pd20 br h100">
          <div>
            <span class="pr10">菜单模板</span>
            <el-select
              v-model="menuTemplate" placeholder="请选择菜单模板" :disabled="this.$route.query.title === '添加子角色'||this.$route.query.title === '编辑'"
              @change="menuTemplateChange"
            >
              <el-option
                v-for="item in menuOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-tree
              ref="tree"
              :data="roleData"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="defaultProps"
              @check="handleCheck"
            />
          </div>
        </el-col>
        <el-col :span="8" class="pd20 h100">
          <div class="roleTitle">
            已选权限
          </div>
          <el-tree
            :data="selectedData"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
          />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" class="w90" @click="submit('roleForm')">
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
import Server from '../../../API/authority'
export default {
  data () {
    const validateRoleSign = (rule, value, callback) => {
      const myreg = /^[A-Za-z]+$/
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        return callback(new Error('请输入角色标识'))
      } else if (!myreg.test(value)) {
        return callback(new Error('抱歉只支持大小写英文'))
      } else {
        callback()
      }
    }
    return {
      roleForm: {
        parentName: '',
        roleName: '',
        roleSign: '',
        roleStatus: 0,
        desc: ''
      },
      rules: {
        parentName: [
          { required: true, message: '请输入上级角色名称', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleSign: [
          { required: true, validator: validateRoleSign, trigger: 'blur' }
        ]
      },
      menuOptions: [],
      menuTemplate: '',
      roleData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedData: [],
      roleId: '',
      templateIds: '',
      editPid: ''
    }
  },
  created () {
    this.roleId = this.$route.query.id
  },
  mounted () {
    const params = {}
    if (this.$route.query.title === '添加子角色') {
      params.pid = this.roleId
    }
    if (this.$route.query.title === '新建角色' || this.$route.query.title === '编辑') {
      params.pid = 0
    }
    if (this.$route.query.title === '新建角色') {
      this.roleForm.parentName = '无'
    }
    this.getTemplateOptions(params)
    const obj = {
      id: this.roleId
    }
    this.getRoleInfo(obj)
  },
  methods: {
    getRoleInfo (params) {
      Server.viewRoleInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          if (this.$route.query.title === '编辑') {
            this.roleForm.parentName = res.result.list[0].pName ? res.result.list[0].pName : '无'
            this.roleForm.roleName = res.result.list[0].name
            this.roleForm.roleSign = res.result.list[0].identify
            this.roleForm.roleStatus = res.result.list[0].isEnable
            this.roleForm.desc = res.result.list[0].remark
            this.selectedData = res.result.list[0].menuAddList
            this.templateIds = res.result.list[0].templateId
            this.menuTemplate = res.result.list[0].templateId
            this.editPid = res.result.list[0].pId
            const params = {
              id: this.templateIds,
              roleId: this.roleId
            }
            this.getTemplateInfo(params)
          }
          if (this.$route.query.title === '添加子角色') {
            this.roleForm.parentName = res.result.list[0].name
            this.menuTemplate = res.result.list[0].templateId
            this.menuTemplateChange(this.menuTemplate)
          }
        }
      })
    },
    // 获取菜单模板下拉项
    getTemplateOptions (params) {
      Server.getTemplateOptions(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.menuOptions = res.result
        }
      })
    },
    menuTemplateChange (val) {
      const params = {
        id: val,
        roleId: this.roleId
      }
      if (this.$route.query.title === '新建角色') {
        this.getTemplateInfos(params)
      } else if (this.$route.query.title === '添加子角色') {
        this.selectMenuById(params)
      }
    },
    selectMenuById (params) {
      Server.selectMenuById(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.roleData = res.result
        }
      })
    },
    getTemplateInfos (params) {
      Server.getTemplateInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.roleData = res.result
        }
      })
    },
    getTemplateInfo (params) {
      Server.findMenuById(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.roleData = res.result
          if (this.$route.query.title === '编辑') {
            const items = res.result
            const selectedResult = this.handleFilterData(items)
            this.$refs.tree.setCheckedKeys(selectedResult)
          }
        }
      })
    },
    handleCheck () {
      const menuList = JSON.parse(JSON.stringify(this.roleData))
      const checkedKeys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      function filters (list) {
        for (let i = 0; i < list.length; i++) {
          if (checkedKeys.includes(list[i].id)) {
            list[i].isChecked = 1
            if (list[i].children && list[i].children.length) {
              filters(list[i].children)
            }
          } else {
            list[i].isChecked = 0
          }
        }
      }
      filters(menuList)
      const newArr = []
      if (menuList && menuList.length) {
        menuList.forEach(item => {
          if (item.isChecked === 1) {
            newArr.push(this.handleTreeData(item))
          }
        })
      }
      this.selectedData = newArr
    },
    handleTreeData (item) {
      const childrenNode = {
        id: item.id,
        name: item.name
      }
      if (item.children && item.children.length) {
        childrenNode.children = []
        item.children.forEach(subItem => {
          if (subItem.isChecked === 1) {
            childrenNode.children.push(this.handleTreeData(subItem))
          }
        })
      }
      return childrenNode
    },
    handleFilterData (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (!list[i].children || list[i].children.length === 0) {
            if (list[i].isSelect) {
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
    handleSelectedData (val) {
      const newArray = []
      function handleData (list) {
        for (let i = 0; i < list.length; i++) {
          newArray.push({ menuId: list[i].id, aliasName: list[i].name })
          if (list[i].children) {
            handleData(list[i].children)
          }
        }
      }
      handleData(val)
      return newArray
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.handleSelectedData(this.selectedData).length !== 0) {
            const userId = this.$localstore.get('bossadmin_user').id
            const params = {
              menuAddList: this.handleSelectedData(this.selectedData),
              pName: this.roleForm.parentName,
              name: this.roleForm.roleName,
              identify: this.roleForm.roleSign,
              isEnable: this.roleForm.roleStatus,
              templateId: this.menuTemplate,
              remark: this.roleForm.desc,
              updateUser: userId,
              createUser: userId
            }
            if (this.$route.query.title === '添加子角色') {
              params.pid = this.roleId
            }
            if (this.$route.query.title === '新建角色') {
              params.pid = 0
            }
            if (this.$route.query.title === '编辑') {
              params.id = this.roleId
              params.pid = this.editPid
            }
            Server.changeRole(params).then((res) => {
              if (res.code === 0) {
                if (this.$route.query.title === '新建角色' || this.$route.query.title === '添加子角色') {
                  this.$message.success('角色配置成功')
                }
                if (this.$route.query.title === '编辑') {
                  this.$message.success('角色信息修改成功')
                }
                this.$router.push({
                  path: '/authority/roleConfig'
                })
              }
            })
          } else {
            this.$message.warning('请勾选至少一项权限后再进行提交操作！')
          }
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/authority/roleConfig'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.roleOperate {
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
    .pr10 {
      padding-right: 10px;
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
      height: 500px;
      overflow: auto;
    }
    .roleTitle {
      height: 36px;
      line-height: 36px;
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
.roleOperate {
  .mainAdd {
    .el-checkbox:last-of-type {
      margin-right: 5px;
    }
    .el-tree {
      width: 180px;
      margin: 0 auto;
      padding-top: 22px;
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
  }
}
</style>
