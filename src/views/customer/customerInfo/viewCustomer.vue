<template>
  <div class="viewCustomer">
    <div class="content">
      <span class="lt">客户信息</span>
    </div>
    <div class="mainView">
      <el-form :model="customerForm" label-width="150px" class="formStyle">
        <el-form-item label="客户名称：" prop="name">
          <el-input v-model="customerForm.name" disabled />
        </el-form-item>
        <el-form-item label="客户简称：" prop="abbr">
          <el-input v-model="customerForm.abbr" disabled />
        </el-form-item>
        <el-form-item label="公司邮箱：" prop="email">
          <el-input v-model="customerForm.email" disabled />
        </el-form-item>
        <el-form-item label="公司地址：" prop="address">
          <el-input v-model="customerForm.address" disabled />
        </el-form-item>
        <el-form-item label="固定电话：" prop="phone">
          <el-input v-model="customerForm.phone" disabled />
        </el-form-item>
        <el-form-item label="业务联系人：" prop="linkman">
          <el-input v-model="customerForm.linkman" disabled />
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-input v-model="customerForm.sex" disabled />
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNum">
          <el-input v-model="customerForm.phoneNum" disabled :class="{'pnStyle': showpn}">
            <template v-if="showpn" slot="append">
              <span class="mainColor" @click="showAllPhoneNum(customerForm)">完整展示</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户类型：" prop="customType">
          <el-input v-model="customerForm.customType" disabled />
        </el-form-item>
        <el-form-item label="接洽人：" prop="intermediary">
          <el-input v-model="customerForm.intermediary" disabled />
        </el-form-item>
        <el-form-item label="备注：" prop="desc">
          <el-input
            v-model="customerForm.desc" type="textarea" rows="3"
            disabled
          />
        </el-form-item>
      </el-form>
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
export default {
  data () {
    return {
      customerForm: {
        name: '',
        abbr: '',
        email: '',
        address: '',
        phone: '',
        linkman: '',
        sex: '',
        phoneNum: '',
        trueNum: '',
        customType: '',
        intermediary: '',
        desc: ''
      },
      showpn: true
    }
  },
  created () {
  },
  mounted () {
    const allInfo = this.$localstore.get('customerInfo')
    this.customerForm.name = allInfo.name
    this.customerForm.abbr = allInfo.abbreviation
    this.customerForm.email = allInfo.mailbox
    this.customerForm.address = allInfo.address
    this.customerForm.phone = allInfo.fixedPhone
    this.customerForm.linkman = allInfo.person
    this.customerForm.sex = allInfo.sex === 0 ? '保密' : allInfo.sex === 1 ? '男' : allInfo.sex === 2 ? '女' : ''
    this.customerForm.phoneNum = this.formatPhone(allInfo.phone)
    this.customerForm.trueNum = allInfo.phone
    this.customerForm.customType = allInfo.cType === 1 ? '自营' : allInfo.cType === 2 ? '代理商' : allInfo.cType === 3 ? '个体' : allInfo.cType === 4 ? '政府机构' : allInfo.cType === 5 ? '体验用户' : ''
    this.customerForm.intermediary = allInfo.contacter
    this.customerForm.desc = allInfo.remark
  },
  methods: {
    back () {
      this.$router.push({
        path: '/customer/customerInfo'
      })
    },
    formatPhone (val) {
      const reg = /(\d{3})\d{4}(\d{4})/
      return val && val.length === 11 ? val.replace(reg, '$1****$2') : val
    },
    showAllPhoneNum (val) {
      this.customerForm.phoneNum = val.trueNum
      this.showpn = false
    }
  }
}
</script>

<style lang="less" scoped>
  .viewCustomer {
    padding: 20px;
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
    }
    .mainView {
      border: 1px solid #e6e6e6;
      border-top: none;
      .formStyle {
        width: 550px;
        margin: 0 auto;
        padding:40px 0 18px 0;
        .mainColor {
          color: #4C8CF8;
          cursor: pointer;
        }
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
.viewCustomer {
  .mainView {
    .el-input, .el-textarea {
      width: 380px;
    }
    .el-form-item__label {
      padding-right: 20px;
    }
    .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner  {
      color: #717276;
      background-color: #f7f9fb;
      border-color: #e6e6e6;
    }
    .formStyle {
      .pnStyle {
        .el-input__inner {
          border-right: none;
        }
      }
      .el-input-group__append, .el-input-group__prepend {
        border-color: #e6e6e6;
        background-color: #f7f9fb;
      }
    }
  }
}
</style>
