<template>
  <div class="add-system-role">
    <div class="content">
      <span class="lt">角色配置</span>
      <span v-if="operationType!='detail'" class="fr">
        <span class="red">*</span>为必填项
      </span>
    </div>
    <div v-loading="loading" class="mainAdd">
      <el-row>
        <el-col :span="9" class="pd20 br h100" style="padding-right: 40px;">
          <div>角色信息</div>
          <el-form
            ref="roleForm" :model="roleForm" :rules="rules"
            label-width="121px" class="mt22"
          >
            <el-form-item label="角色名称：" prop="roleName">
              <el-input
                v-model="roleForm.roleName" maxlength="10" :disabled="isDisabled"
                placeholder="请输入角色名称，最长10字符"
              />
            </el-form-item>
            <el-form-item label="角色标识：" prop="roleSign">
              <el-input
                v-model="roleForm.roleSign" :disabled="isDisabled" placeholder="只支持小写英文，最长10字符"
                maxlength="10"
              />
            </el-form-item>
            <el-form-item label="状态：" prop="roleStatus">
              <div v-if="isDisabled">
                <el-input v-model="roleForm.roleStatusVal" :disabled="isDisabled"></el-input>
              </div>
              <div v-else>
                <el-radio-group v-model="roleForm.roleStatus">
                  <el-radio :label="0">
                    启用
                  </el-radio>
                  <el-radio :label="1">
                    禁用
                  </el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="角色描述：" prop="remark">
              <el-input
                v-model="roleForm.remark"
                :disabled="isDisabled"
                type="textarea"
                rows="3"
                placeholder="请输入角色描述，最长50字符"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="15" class="br h100">
          <p class="tips">
            菜单权限
          </p>
          <div>
            <el-tree
              ref="menuListTree"
              :data="roleData"
              show-checkbox
              node-key="id"
              default-expand-all
              :props="defaultProps"
              @check="handleCheckChange"
            />
          </div>
        </el-col>
        <!-- <el-col :span="8" class="pd20 br h100">
          <p style="position: absolute;">
            已选权限
          </p>
          <div>
            <el-tree
              :data="selectedTreeData"
              :expand-on-click-node="false"
              :props="defaultProps"
              default-expand-all
            />
          </div>
        </el-col>-->
      </el-row>
    </div>
    <div class="footer">
      <el-button
        v-if="!isDisabled" type="primary" class="w90"
        @click="submit('roleForm')"
      >
        提交
      </el-button>
      <el-button
        type="primary" plain class="w90"
        @click="cancel"
      >
        {{ isDisabled?'返回':'取消' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import Server from '../../../API/system'
const validateRoleSign = (rule, value, callback) => {
  const reg = /^[a-z\.-]*$/g
  if (
    value.trim() === '' ||
    value.trim() === null ||
    value.trim() === undefined
  ) {
    return callback(new Error('请输入角色标识'))
  } else if (!reg.test(value)) {
    return callback(new Error('抱歉只支持小写英文'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      operationType: 'add',
      roleId: '',
      loading: false,
      isDisabled: false,
      menuAddList: [],
      selectedMenuList: [],
      dataSource: [],
      roleData: [],
      selectedTreeData: [],
      roleForm: {
        parentName: '',
        roleName: '',
        roleSign: '',
        roleStatus: 0,
        roleStatusVal: '启用', // / 0 启用 1 禁用
        remark: ''
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
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    const query = to.query
    if (query.type) {
      to.meta.bname = parseInt(query.type) === 1 ? '查看系统角色' : '编辑'
    } else {
      to.meta.bname = '新建角色'
    }
    next()
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.handleQuery()
      this.getMenuList()
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addSystemRole()
        } else {
          return false
        }
      })
    },
    handleQuery () {
      const { type, detail } = this.$route.query
      if (type && detail) {
        this.operationType =
          parseInt(type) === 0
            ? 'add'
            : parseInt(type) === 1
              ? 'detail'
              : 'edit'
        if (this.operationType === 'add') {
          console.log(this.operationType)
        } else if (this.operationType === 'detail') {
          this.isDisabled = true
          this.handleDetail(detail)
        } else {
          this.handleDetail(detail)
        }
      }
    },
    // 处理查看系统角色
    handleDetail (item) {
      const data = JSON.parse(decodeURI(item))
      this.roleId = data.id
      this.roleForm.roleName = data.name
      this.roleForm.roleSign = data.identify
      this.roleForm.roleStatus = data.isEnable
      this.roleForm.roleStatusVal = data.isEnable ? '禁用' : '启用'
      this.roleForm.remark = data.remark
    },
    addSystemRole () {
      if (!this.menuAddList.length) {
        this.$message.error('抱歉菜单权限没有选择')
        return false
      }
      const _str = this.operationType === 'add' ? 'createUser' : 'updateUser'
      const data = {
        name: this.roleForm.roleName,
        identify: this.roleForm.roleSign,
        isEnable: this.roleForm.roleStatus,
        remark: this.roleForm.remark,
        menuAddList: this.menuAddList,
        [_str]:
          JSON.parse(localStorage.getItem('bossadmin_user') || '{}').id || ''
      }
      if (this.operationType === 'edit') {
        Object.assign(data, {
          id: this.roleId
        })
      }
      Server[`${this.operationType}SystemRole`](data).then(res => {
        this.$message({
          showClose: true,
          message: this.operationType === 'edit' ? '角色信息修改成功' : '角色配置成功',
          type: 'success'
        })
        this.$router.push({
          path: '/system/systemRole'
        })
      })
    },
    getMenuList () {
      this.loading = true
      Server.findMenuList(this.roleId).then(res => {
        this.loading = false
        const items = res.result.list
        this.dataSource = this.handleDataSource(items)
        this.menuAddList = [...this.dataSource]
        const selectedResult = this.handleFilterData(items, this.isDisabled)
        this.selectedMenuList = selectedResult
        this.$refs.menuListTree.setCheckedKeys(selectedResult)
        this.roleData = res.result.list
      })
    },
    handleFilterData (items, isDisabled) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (!list[i].children.length && list[i].isSelect) result.push(list[i].id)
          if (list[i].children.length) {
            filter(list[i].children)
          }
          if (isDisabled) {
            list[i].disabled = true
            if (list[i].children.length) {
              filter(list[i].children)
            }
          }
        }
      }
      filter(items)
      return result
    },
    handleDataSource (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].isSelect) result.push(list[i].id)
          if (list[i].children.length) {
            filter(list[i].children)
          }
        }
      }
      filter(items)
      return result
    },
    handleCheckChange (data, item) {
      this.menuAddList = [...item.checkedKeys, ...item.halfCheckedKeys]
    },
    cancel () {
      this.$router.push({
        path: '/system/systemRole'
      })
    }
  }
}
</script>

<style lang="less">
.add-system-role {
  .mainAdd {
    .el-checkbox:last-of-type {
      margin-right: 5px;
    }
    .el-tree {
      width: 180px;
      margin: 0 auto;
      padding-top: 68px;
      box-sizing: border-box;
    }
  }
}
</style>

<style lang="less" scoped>
.add-system-role {
  padding: 20px 20px 0;
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
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
        color: #e02020;
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
    .mt22 {
      margin-top: 22px;
    }
    .br {
      border-right: 1px solid #e6e6e6;
    }
    .h100 {
      height: 65vh;
      overflow: auto;
    }
  }
  .footer {
    text-align: center;
    padding: 50px 0;
    box-sizing: border-box;
    .w90 {
      width: 90px;
    }
  }
  .tips {
    width: 100%;
    position: absolute;
    padding: 20px;
    box-sizing: border-box;
    z-index: 9;
    background-color: #fff;
  }
}
</style>
