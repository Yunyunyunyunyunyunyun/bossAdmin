<template>
  <div class="addCustomer">
    <div class="content">
      <span class="lt">客户信息</span>
      <span class="fr"><span class="red">* </span>为必填项</span>
    </div>
    <div class="mainAdd">
      <el-form
        ref="customerForm" :model="customerForm" :rules="rules"
        label-width="150px" class="formStyle"
      >
        <el-form-item label="客户名称：" prop="name">
          <el-input v-model="customerForm.name" placeholder="填写客户名称，最长30字符" maxlength="30" />
        </el-form-item>
        <el-form-item label="客户简称：" prop="abbr">
          <el-input v-model="customerForm.abbr" placeholder="填写客户简称，最长20字符" maxlength="20" />
        </el-form-item>
        <el-form-item label="公司邮箱：" prop="email">
          <el-input v-model="customerForm.email" placeholder="填写公司邮箱" />
        </el-form-item>
        <el-form-item label="公司地址：" prop="address">
          <el-input v-model="customerForm.address" placeholder="填写公司详细地址" />
        </el-form-item>
        <el-form-item label="固定电话：" prop="phone">
          <el-input v-model="customerForm.phone" placeholder="填写固定电话" />
        </el-form-item>
        <el-form-item label="业务联系人：" prop="linkman">
          <el-input v-model="customerForm.linkman" placeholder="填写业务联系人" />
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="customerForm.sex">
            <el-radio :label="0">
              保密
            </el-radio>
            <el-radio :label="1">
              男
            </el-radio>
            <el-radio :label="2">
              女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNum">
          <el-input v-model="customerForm.phoneNum" placeholder="填写手机号" />
        </el-form-item>
        <el-form-item label="客户类型：" prop="customType">
          <el-select v-model="customerForm.customType" placeholder="请选择客户类型">
            <el-option
              v-for="item in customerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接洽人：" prop="intermediary">
          <el-input v-model="customerForm.intermediary" placeholder="填写接洽人" />
        </el-form-item>
        <el-form-item label="备注：" prop="desc">
          <el-input
            v-model="customerForm.desc" type="textarea" rows="3"
            placeholder="填写备注，最长50字符" maxlength="50" show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" class="w90" @click="submit('customerForm')">
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
import Server from '../../../API/customer'
export default {
  data () {
    const validateAbbr = (rule, value, callback) => {
      const patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        return callback(new Error('请输入客户简称'))
      } else if (patrn.test(value)) {
        return callback(new Error('不支持特殊符号，请重新输入'))
      } else {
        callback()
      }
    }
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
    const validateEmail = (rule, value, callback) => {
      const emailreg = /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/i
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        callback()
      } else if (!emailreg.test(value)) {
        return callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    return {
      customerForm: {
        name: '',
        abbr: '',
        email: '',
        address: '',
        phone: '',
        linkman: '',
        sex: 0,
        phoneNum: '',
        customType: '1',
        intermediary: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        abbr: [
          { required: true, validator: validateAbbr, trigger: 'blur' }
        ],
        email: [
          { required: false, validator: validateEmail, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入公司详细地址', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '请输入业务联系人', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, validator: validatePhoneNum, trigger: 'blur' }
        ]
      },
      customerOptions: [{
        value: '1',
        label: '自营'
      }, {
        value: '2',
        label: '代理商'
      }, {
        value: '3',
        label: '个体'
      }, {
        value: '4',
        label: '政府机构'
      }, {
        value: '5',
        label: '体验用户'
      }]
    }
  },
  created () {},
  methods: {
    submit (formName) {
      const userId = this.$localstore.get('bossadmin_user').id
      const params = {
        name: this.customerForm.name,
        abbreviation: this.customerForm.abbr,
        mailbox: this.customerForm.email,
        address: this.customerForm.address,
        fixedPhone: this.customerForm.phone,
        person: this.customerForm.linkman,
        sex: Number(this.customerForm.sex),
        phone: this.customerForm.phoneNum,
        cType: Number(this.customerForm.customType),
        contacter: this.customerForm.intermediary,
        remark: this.customerForm.desc,
        createUser: userId
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Server.addCustomer(params).then((res) => {
            if (res.code === 0) {
              this.$message.success('客户' + res.msg)
              this.$router.push({
                path: '/customer/customerInfo'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/customer/customerInfo'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .addCustomer {
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
      .formStyle {
        width: 550px;
        margin: 0 auto;
        padding:40px 0 18px 0;
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
.addCustomer {
  .mainAdd {
    .el-input, .el-select, .el-textarea {
      width: 380px;
    }
    .el-form-item__label {
      padding-right: 20px;
    }
    .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
      color: #717276;
      background-color: #f7f9fb;
      border-color: #e6e6e6;
    }
  }
}
</style>
