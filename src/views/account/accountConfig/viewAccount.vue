<template>
  <div class="viewAccount">
    <div class="content">
      <span class="lt">账号查看</span>
    </div>
    <div class="mainAdd">
      <el-row>
        <el-col :span="12" class="pd20 br h100 pr60">
          <div>账号信息</div>
          <el-form :model="accountForm" label-width="160px" class="mt22">
            <el-form-item label="所属客户简称：" prop="abbreviation">
              <el-input v-model="accountForm.abbreviation" disabled />
            </el-form-item>
            <el-form-item label="用户名：" prop="userName">
              <el-input v-model="accountForm.userName" disabled />
            </el-form-item>
            <el-form-item label="昵称：" prop="nickName">
              <el-input v-model="accountForm.nickName" disabled />
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="accountForm.mobile" disabled />
            </el-form-item>
            <el-form-item label="头像：" prop="avatar">
              <img
                :src="accountForm.headPath" width="100" height="100"
                class="imgBorder"
              >
            </el-form-item>
            <el-form-item label="猫运维APP：" prop="isLogin">
              <div class="lineStyle">
                <span v-if="accountForm.isLogin===0">允许登录</span>
                <span v-else-if="accountForm.isLogin===1">禁止登录</span>
              </div>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="realName">
              <el-input v-model="accountForm.realName" disabled />
            </el-form-item>
            <el-form-item label="岗位：" prop="uPost">
              <el-input v-model="accountForm.uPost" disabled />
            </el-form-item>
            <el-form-item label="账号属性：" prop="userType">
              <div class="lineStyle">
                <span v-if="accountForm.userType===1">区域管理员</span>
                <span v-else-if="accountForm.userType===0">超级管理员</span>
              </div>
            </el-form-item>
            <el-form-item label="关联角色：">
              <div v-if="accountForm.template" class="lineStyle">
                {{ accountForm.template.roleList ? accountForm.template.roleList.name : '' }}
              </div>
            </el-form-item>
            <el-form-item label="启用状态：" prop="isEnable">
              <div class="lineStyle">
                <span v-if="accountForm.isEnable===0">启用</span>
                <span v-else-if="accountForm.isEnable===1">禁用</span>
              </div>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model="accountForm.remark" type="textarea" rows="3"
                disabled
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" class="pd20 h100">
          <div>管理区域</div>
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
      <el-button
        type="primary" plain class="w110"
        @click="back"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import Server from '../../../API/account'
export default {
  data () {
    return {
      accountForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedData: [],
      accountId: ''
    }
  },
  created () {
    this.accountId = this.$route.query.id
  },
  mounted () {
    const params = {
      id: this.accountId
    }
    this.getAccountInfo(params)
  },
  methods: {
    getAccountInfo (params) {
      Server.getAccountInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.accountForm = res.result.info
          this.selectedData = this.accountForm.areaList
        }
      })
    },
    back () {
      this.$router.push({
        path: '/account/accountConfig'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.viewAccount {
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
    .pr60 {
      padding-right: 60px;
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
    .lineStyle {
      color: #717276;
      background-color: #f7f9fb;
      border: 1px solid #e6e6e6;
      cursor: not-allowed;
      border-radius: 4px;
      height: 36px;
      line-height: 36px;
      padding: 0 15px;
      width: 320px;
    }
    .imgBorder {
      border: 1px solid #E4E7ED;
      border-radius: 4px;
    }
    .pr10 {
      padding-right: 10px;
    }
  }
  .footer {
    text-align: center;
    padding: 50px 0;
    .w110 {
      width: 110px;
    }
  }
}
</style>
<style lang="less">
.viewAccount {
  .mainAdd {
    .el-input, .el-textarea.is-disabled {
      width: 350px;
    }
    .el-checkbox:last-of-type {
      margin-right: 5px;
    }
    .el-tree {
      width: 250px;
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
