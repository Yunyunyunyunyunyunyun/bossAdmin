<template>
  <div class="setValidity">
    <div class="validityTitle">
      <span>有效期设置记录</span>
      <span class="fr">
        <el-button
          type="primary" size="medium"
          plain @click="addValidity"
        >+&nbsp;&nbsp;配置有效期</el-button>
      </span>
    </div>
    <el-table
      v-if="tableData.list" v-loading="loading" :data="tableData.list"
      :header-cell-style="$tableHeaderColor" border
      :class="{'commonHeight':!tableData.list||tableData.list&&tableData.list.length === 0}"
    >
      <el-table-column
        type="index" label="序号" width="50"
        align="center"
      ></el-table-column>
      <el-table-column label="设置时间" width="180" align="center">
        <template v-if="scope.row.createTime" slot-scope="scope">
          {{ new Date(scope.row.createTime).Format("yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center">
        <template v-if="scope.row.startTime&&scope.row.endTime" slot-scope="scope">
          {{ new Date(scope.row.startTime).Format("yyyy-MM-dd hh:mm:ss") }}~{{ new Date(scope.row.endTime).Format("yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="操作人" align="center" />
      <el-table-column label="操作类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0?"新增有效期":"" }}</span>
          <span>{{ scope.row.status == 1?"删除有效期":"" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark" label="备注" align="center"
        :show-overflow-tooltip="true" width="250"
      />
      <el-table-column
        label="操作" align="center" width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.showDel" type="text" size="small"
            @click="del(scope.row)"
          >
            删除
          </el-button>
          <span v-else>-</span>
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
    <div class="footer">
      <el-button
        type="primary" plain class="w90"
        @click="cancel"
      >
        返回
      </el-button>
    </div>
    <el-dialog
      title="有效期配置"
      :visible.sync="validityVisible"
      top="20vh"
      width="540px"
      class="validityDialog"
    >
      <div>
        <el-form
          ref="validityForm" :model="validityForm" :rules="rules"
          label-width="150px" class="formStyle"
        >
          <el-form-item label="用户名：" prop="userName">
            <el-input v-model="validityForm.userName" disabled />
          </el-form-item>
          <el-form-item label="账号当前状态：" prop="nowStatus">
            <el-input v-model="validityForm.nowStatus" disabled />
          </el-form-item>
          <el-form-item label="账号有效期：" prop="accountValidity">
            <el-date-picker
              v-if="validityVisible"
              v-model="validityForm.accountValidity"
              type="daterange"
              size="medium"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="~"
              unlink-panels
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-form-item label="备注：" prop="desc">
            <el-input
              v-model="validityForm.desc" placeholder="请填写备注，最长50字符" type="textarea"
              rows="3" maxlength="50" show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button class="w90" @click="cancelValidity()">取消</el-button>
        <el-button type="primary" class="w90" @click="validitySure('validityForm')">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除有效期提示"
      :visible.sync="dialogVisible"
      width="480px"
      top="30vh"
      class="delValidityDialog"
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <span class="dlTitle">是否确定删除有效期</span>
        <div class="dlMain">
          警告：若有效期正在生效中，删除后此账号将长期有效直到设置或进入新的有效期范围，请谨慎操作！
        </div>
        <div class="dlSecond">
          <el-form
            ref="delValidityForm" :model="delValidityForm" :rules="delrRules"
            label-width="80px"
          >
            <el-form-item label="备注：" prop="delDesc">
              <el-input
                v-model="delValidityForm.delDesc" placeholder="请填写备注信息，最长50字符" type="textarea"
                rows="3" maxlength="50" show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="delValidity('delValidityForm')">确定</el-button>
        <el-button class="w90" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../../../API/account'
export default {
  data () {
    return {
      validityForm: {
        userName: '',
        nowStatus: '',
        accountValidity: [],
        desc: ''
      },
      rules: {
        accountValidity: [
          { required: true, message: '请输入账号有效期', trigger: 'blur' }
        ]
      },
      delValidityForm: {
        delDesc: ''
      },
      delrRules: {
        delDesc: [
          { required: true, message: '请输入备注信息', trigger: 'blur' }
        ]
      },
      tableData: {},
      validityVisible: false,
      validityId: '',
      dialogVisible: false,
      delValidityId: '',
      validityDesc: '',
      loading: false,
      pickerOptions: this.limitDate(),
      newEndTime: ''
    }
  },
  computed: {
    list () {
      return this.tableData.list
    }
  },
  watch: {
    list: function (val) {
      const newList = []
      val.forEach((item) => {
        if (item.status === 0) {
          newList.push(item)
        }
      })
      if (newList[0]) {
        this.newEndTime = newList[0].endTime
        val.forEach((item) => {
          if (newList[0].id === item.id) {
            item.showDel = true
          } else {
            item.showDel = false
          }
        })
      } else {
        this.newEndTime = null
        val.forEach((item) => {
          item.showDel = false
        })
      }
    }
  },
  created () {
    this.validityId = this.$route.query.id
  },
  mounted () {
    const allInfo = this.$localstore.get('validityInfo')
    this.validityForm.userName = allInfo.userName
    this.validityForm.nowStatus = allInfo.isEnable === 1 ? '使用中' : allInfo.isEnable === 2 ? '禁用中' : allInfo.isEnable === 3 ? '已过期' : allInfo.isEnable === 4 ? '将到期' : ''
    const params = {
      id: this.validityId
    }
    this.getDateRecord(params)
  },
  methods: {
    // 获取账户列表
    getDateRecord (params) {
      this.loading = true
      Server.getDateRecord(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.tableData = res.result
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    limitDate () {
      const self = this
      return {
        disabledDate (time) {
          const curDate = (new Date()).getTime()
          const day = 1 * 24 * 3600 * 1000
          if (time) {
            if (self.newEndTime > curDate) {
              return time.getTime() < self.newEndTime - day
            } else {
              return time.getTime() < curDate - day
            }
          }
        }
      }
    },
    validitySure (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userId = this.$localstore.get('bossadmin_user').id
          const params = {
            cusUserId: this.validityId,
            createUser: userId
          }
          if (this.validityForm.accountValidity) {
            params.startTime = new Date(this.validityForm.accountValidity[0]).getTime()
            params.endTime = new Date(this.validityForm.accountValidity[1]).getTime()
          }
          if (this.validityForm.desc) {
            params.remark = this.validityForm.desc
          }
          Server.addValidity(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.validityVisible = false
              const params = {
                id: this.validityId
              }
              this.getDateRecord(params)
            }
          })
        } else {
          return false
        }
      })
    },
    cancelValidity () {
      this.validityVisible = false
    },
    addValidity () {
      const curDate = (new Date()).getTime()
      if (this.newEndTime > curDate) {
        this.validityForm.accountValidity = [new Date(this.newEndTime), '']
      } else {
        this.validityForm.accountValidity = [new Date(), '']
      }
      this.validityVisible = true
    },
    cancel () {
      this.$router.push({
        path: '/account/validityAllocation'
      })
    },
    del (val) {
      this.dialogVisible = true
      this.delValidityId = val.id
    },
    delValidity (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const userId = this.$localstore.get('bossadmin_user').id
          const params = {
            id: this.delValidityId,
            createUser: userId
          }
          if (this.delValidityForm.delDesc) {
            params.remark = this.delValidityForm.delDesc
          }
          Server.deleteValidity(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.dialogVisible = false
              const params = {
                id: this.validityId
              }
              this.getDateRecord(params)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.setValidity {
  padding:20px 20px 0;
  background-color: #fff;
  .validityTitle {
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
      .fr {
        float: right;
      }
    }

  .empty {
    height: 103px;
    .efont {
      font-weight: 500;
      font-size: 14px;
      color: #a2a6ac;
      margin-top: 15px;
    }
  }
  .footer {
    text-align: center;
    padding: 25px 0;
  }
  .w90 {
    width: 90px;
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
      height: 66px;
      font-size: 16px;
      font-weight: 400;
      color: #666;
    }
    .dlSecond {
      position: absolute;
      padding-top: 10px;
      top: 184px;
      left: 30px;
    }
  }
}
</style>
<style lang="less">
.setValidity {
  .formStyle {
    .el-input {
      width: 350px;
    }
  }
  .validityDialog {
    .el-dialog__footer {
      text-align: center;
    }
    .el-range-editor.el-input__inner {
      padding: 0 20px;
      .el-input__icon, .el-range-separator {
        line-height: 34px;
      }
    }
  }
  .el-table th, .el-table td {
    padding: 8px 0;
  }
  .el-pagination {
    text-align: center;
    padding: 20px 5px;
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
    padding: 30px 20px 25px;
  }
  .el-table__empty-text {
    line-height: normal;
  }
  .delValidityDialog {
    .el-dialog__body {
      height: 150px;
    }
    .el-textarea__inner {
      width: 325px;
    }
  }
  .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
    color: #717276;
    background-color: #f7f9fb;
    border-color: #e6e6e6;
  }
}
</style>
