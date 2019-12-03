<template>
  <div class="system-user">
    <pubFilters
      :title="filterConfig.title"
      :btn-val="filterConfig.btnVal"
      :has-value="filterConfig.hasValue"
      :inputs="filterConfig.inputs"
      @search="search"
      @btnEvent="handleAdd(1)"
    />
    <div class="secondTitle">
      <span>系统用户列表</span>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="result.list"
        :header-cell-style="$tableHeaderColor"
        border
      >
        >
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="nickName" label="昵称" align="center" />
        <el-table-column prop="mobile" label="手机号" align="center" />
        <el-table-column
          prop="roleNames" label="关联角色" align="center"
          width="250"
        />
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span class="status-text">{{ scope.row.isEnable?'禁用':'启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          :show-overflow-tooltip="true"
          width="250"
        />
        <el-table-column
          label="操作" align="center" fixed="right"
          width="250"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleAdd(3,scope.row)">
              查看
            </el-button>
            <el-button
              v-has="'sysUserEdit'" type="text" size="small"
              @click="handleAdd(2,scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'sysUserDel'" type="text" size="small"
              @click="deleted(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <img src="../../../../static/images/noData.png">
            <div class="efont">
              暂时没有数据
            </div>
          </div>
        </template>
      </el-table>
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="result.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="删除提示" :visible.sync="dialogVisible" top="40vh"
      width="480px"
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <span class="dlTitle">是否确定删除此用户</span>
        <div class="dlMain">
          删除后此用户将失去相关权限并清空用户信息，请谨慎操作！
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="fixedDelete">确定</el-button>
        <el-button class="w90" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`${typeVal}系统用户`"
      :visible.sync="deatilDialogVisible"
      custom-class="deatil-dialog"
      center
    >
      <el-form
        ref="deatilFrom" :model="deatilFrom" label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input
            v-model="deatilFrom.userName" maxlength="30" :disabled="isDisable"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input
            v-model="deatilFrom.password"
            type="password"
            :disabled="isDisable"
            placeholder="请填写密码，不填则默认为123456"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="昵称：" prop="nickName">
          <el-input v-model="deatilFrom.nickName" :disabled="isDisable" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="deatilFrom.mobile" :disabled="isDisable" />
        </el-form-item>
        <el-form-item label="关联角色：" prop="roleIds">
          <div v-if="isDisable">
            <el-input v-model="rolesVal" :disabled="isDisable" />
          </div>
          <div v-else>
            <el-select
              v-model="deatilFrom.roleIds"
              multiple
              :multiple-limit="3"
              style="width:100%;"
              placeholder="请选择关联角色"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="启用状态：">
          <div v-if="isDisable">
            <el-input v-model="statusVal" :disabled="isDisable" />
          </div>
          <div v-else>
            <el-select v-model="deatilFrom.isEnable" style="width:100%;" placeholder="请选择状态">
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input v-model="deatilFrom.realName" :disabled="isDisable" />
        </el-form-item>
        <el-form-item label="岗位：">
          <el-input v-model="deatilFrom.uPost" :disabled="isDisable" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="deatilFrom.remark" :disabled="isDisable" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div v-if="isDisable">
          <el-button
            class="w90" size="small" type="primary"
            @click="deatilDialogVisible = false"
          >关 闭</el-button>
        </div>
        <div v-else>
          <el-button class="w90" size="small" @click="deatilDialogVisible = false">取 消</el-button>
          <el-button
            class="w90" size="small" type="primary"
            @click="submit('deatilFrom')"
          >提 交</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import Server from '../../../API/system'
import pubFilters from '../../../components/pub-filters'
const validatePhoneNum = (rule, value, callback) => {
  const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
  if (
    value.trim() === '' ||
    value.trim() === null ||
    value.trim() === undefined
  ) {
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
export default {
  components: {
    pubFilters
  },
  data () {
    return {
      currentId: '',
      rolesVal: '',
      statusVal: '',
      typeVal: '新建',
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      deatilDialogVisible: false,
      loading: false,
      isDisable: false,
      result: {
        list: [],
        totalCount: 0
      },
      deatilFrom: {
        userName: '',
        password: '',
        nickName: '',
        mobile: '',
        roleIds: [],
        realName: '',
        uPost: '',
        remark: '',
        isEnable: ''
      },
      roleList: [],
      statusList: [
        {
          value: 0,
          label: '启用'
        },
        {
          value: 1,
          label: '禁用'
        }
      ],
      rules: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhoneNum, trigger: 'blur' }
        ],
        roleIds: [
          { required: true, message: '请选择关联角色', trigger: 'blur' }
        ]
      },
      filterConfig: {
        title: '筛选查询',
        btnVal: '新建用户',
        hasValue: [
          'sysUserFind',
          'sysUserAdd'
        ],
        inputs: [
          {
            title: '角色名称',
            inputValue: ''
          },
          {
            title: '用户名称',
            inputValue: ''
          },
          {
            title: '手机号',
            inputValue: ''
          }
        ]
      }
    }
  },
  created: function () {
    this.load()
  },
  methods: {
    load () {
      this.getSystemUser()
      this.getSystemRoleAll()
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addSystemUser()
        } else {
          return false
        }
      })
    },
    getSystemUser () {
      this.loading = true
      const data = {
        roleNames: this.filterConfig.inputs[0].inputValue,
        userName: this.filterConfig.inputs[1].inputValue,
        mobile: this.filterConfig.inputs[2].inputValue,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      Server.systemUser(data).then(res => {
        this.loading = false
        const result = res.result
        this.result = result
      })
    },
    getSystemRoleAll () {
      Server.systemRoleAll().then(res => {
        const list = res.result.list
        for (let i = 0; i < list.length; i++) {
          const obj = {
            value: list[i].id,
            label: list[i].name
          }
          this.roleList.push(obj)
        }
      })
    },
    addSystemUser () {
      const info = this.deatilFrom
      const data = {
        id: this.currentId,
        userName: info.userName,
        nickName: info.nickName,
        mobile: info.mobile,
        roleIds: info.roleIds.toString(),
        realName: info.realName,
        uPost: info.uPost,
        remark: info.remark,
        isEnable: info.isEnable
      }
      if (info.password) {
        Object.assign(data, {
          password: md5(info.password || '123456')
        })
      }
      Server.addSystemUser(data).then(res => {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
        this.deatilDialogVisible = false
        this.getSystemUser()
      })
    },
    search () {
      this.currentPage = 1
      this.getSystemUser()
    },
    handleAdd (type = 1, item) {
      // type 1 新建 2编辑 3查看
      if (type === 1) this.resetData()
      this.typeVal = type === 1 ? '新建' : type === 2 ? '编辑' : '查看'
      this.isDisable = type === 3
      if (item) {
        this.currentId = item.id
        this.deatilFrom.userName = item.userName
        // this.deatilFrom.password = item.password
        this.deatilFrom.mobile = item.mobile
        this.deatilFrom.nickName = item.nickName
        this.deatilFrom.uPost = item.uPost
        this.deatilFrom.realName = item.realName
        this.deatilFrom.remark = item.remark
        this.rolesVal = item.roleNames
        this.statusVal = item.isEnable ? '禁用' : '启用'
        this.deatilFrom.isEnable = item.isEnable
        if (type === 2) this.handleEditData()
      }
      this.deatilDialogVisible = true
    },
    handleEditData () {
      this.deatilFrom.roleIds = []
      const result = this.rolesVal.split(',')
      for (let i = 0; i < this.roleList.length; i++) {
        if (result.includes(this.roleList[i].label)) {
          this.deatilFrom.roleIds.push(this.roleList[i].value)
        }
      }
    },
    fixedDelete () {
      this.dialogVisible = false
      Server.delSystemUser(this.currentId).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getSystemUser()
      })
    },
    deleted (item) {
      this.currentId = item.id
      this.dialogVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getSystemUser()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSystemUser()
    },
    resetData () {
      this.deatilFrom.userName = ''
      this.deatilFrom.password = ''
      this.deatilFrom.nickName = ''
      this.deatilFrom.mobile = ''
      this.deatilFrom.roleIds = []
      this.deatilFrom.realName = ''
      this.deatilFrom.uPost = ''
      this.deatilFrom.isEnable = 0
      this.deatilFrom.remark = ''
    }
  }
}
</script>

<style lang="less">
.system-user {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  .secondTitle {
    border: 1px solid #e6e6e6;
    border-bottom: none;
    height: 52px;
    line-height: 52px;
    margin-top: 20px;
    padding: 0 20px;
    span {
      font-size: 16px;
      color: #333;
    }
  }
  .dlContent {
    padding-left: 15px;
    .dlTitle {
      vertical-align: top;
      padding-left: 10px;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .dlMain {
      position: absolute;
      top: 114px;
      left: 94px;
      width: 346px;
      height: 44px;
      font-size: 16px;
      font-weight: 400;
      color: #666;
    }
  }
  .el-dialog__header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    border: 1px solid #e6e6e6;
    background-color: #f3f8ff;
    font-size: 16px;
    color: #333;
    font-weight: 500;
    .el-dialog__headerbtn {
      top: 17px;
    }
  }
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    /* IE10+ CSS styles go here */
    .el-dialog__header {
      .el-dialog__headerbtn {
        top: 0px;
      }
    }
  }
  .el-dialog__footer {
    padding: 20px;
    box-sizing: border-box;
  }
  .el-table__empty-text {
    line-height: normal;
  }
  .el-pagination {
    text-align: center;
    padding: 20px 5px;
  }
  .empty {
    height: 103px;
    margin: 20px 0;
    .efont {
      font-weight: 500;
      font-size: 14px;
      color: #a2a6ac;
      margin-top: 15px;
    }
  }
  .deatil-dialog {
    width: 40%;
    .el-dialog__header {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      border: 1px solid #e6e6e6;
      background-color: #f3f8ff;
      font-size: 16px;
      color: #333;
      font-weight: 500;
      text-align: left;
    }
    .el-dialog__body {
      padding-left: 10%;
      padding-right: 12%;
      border-bottom: 1px solid #dcdccc;
    }
  }
  .w90{
    width: 90px;
  }
}
</style>
