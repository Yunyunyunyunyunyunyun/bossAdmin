<template>
  <div class="loginpage">
    <el-row class="container">
      <el-col :span="12" class="leftArea">
        <img src="../../../static/images/loginimg.png">
      </el-col>
      <el-col :span="12" class="rightArea">
        <div class="loginformwrap">
          <div class="loginlogo">
            BOSS管理系统
          </div>
          <div class="loginform">
            <el-form
              ref="loginform" :model="loginform" :rules="rules"
              @submit.native.prevent
            >
              <el-form-item prop="account">
                <!-- <el-input v-model="loginform.account" placeholder="请输入用户名"></el-input> -->
                <el-input
                  v-model="loginform.account"
                  placeholder="请输入您的账号"
                >
                  <img slot="prefix" src="../../../static/images/user.png">
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <!-- <el-input v-model="loginform.password" type="password" placeholder="请输入密码"></el-input> -->
                <el-input
                  v-model="loginform.password"
                  placeholder="请输入您的密码"
                  type="password"
                  @keyup.enter.native.prevent="onSubmit"
                >
                  <img slot="prefix" src="../../../static/images/password.png">
                </el-input>
              </el-form-item>
              <div class="buttonwrap">
                <el-form-item>
                  <el-button
                    type="primary" round class="lgBtn"
                    @click="onSubmit"
                  >
                    登录
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <img src="../../../static/images/loginbt.png">
      <div class="ft">
        Copyright &copy; www.mymrmao.com, All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import Server from '../../API/common'
import Vue from 'vue'
export default {
  data () {
    return {
      toPath: '', // 未登录从需要登录页面进来的页面url
      loginform: {
        account: '',
        password: ''
      },
      rules: {
        account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created () {
    // 获取后缀参数
    this.toPath = this.$route.query.redirect
  },
  methods: {
    onSubmit () {
      this.$refs['loginform'].validate((valid) => {
        if (valid) {
          const obj = {}
          obj.userName = this.loginform.account
          obj.password = md5(this.loginform.password)
          Server.login(obj).then((data) => {
            if (data.code === 0) {
              // 登录成功
              this.$message.success('登录' + data.msg)
              const user = data.result.user
              const menus = data.result.menus
              const newMenus = this.handlerArray(menus)
              this.handlerDirective(newMenus)
              this.$store.commit('user/user_Mutations', user)
              this.$store.commit('menus/menus_Mutations', menus)
              this.$store.commit('common/login_Mutations', true)
              this.$localstore.set('bossadmin_login', true)
              this.$localstore.set('bossadmin_user', user)
              this.$localstore.set('bossadmin_menus', menus)
              this.$localstore.set('new_bossadmin_menus', newMenus)

              // 保存用户名和密码
              this.$localstore.set('bossadmin_username', this.loginform.account)
              this.$localstore.set('bossadmin_password', md5(this.loginform.password))
              // 跳转页面
              if (this.toPath) {
                this.$router.push(this.toPath)
              } else {
                this.$router.push({
                  name: 'homeIndex'
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    handlerArray (arr) {
      const newArr = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].children && list[i].children.length) {
            filter(list[i].children)
          } else {
            newArr.push(list[i])
          }
        }
      }
      filter(arr)
      return newArr
    },
    handlerDirective (menus) {
      // const menus = localstore.get('new_bossadmin_menus') || []
      const btnList = []
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].mType === 2) {
          btnList.push(menus[i])
        }
      }
      // 权限指令
      Vue.directive('has', {
        inserted: function (el, binding) {
          if (!_has(binding.value)) {
            el.parentNode.removeChild(el)
          }

          function _has (value) {
            let isExist = false
            for (let i = 0; i < btnList.length; i++) {
              if (btnList[i].identifier && btnList[i].identifier === value) {
                isExist = true
              }
            }
            return isExist
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.loginpage {
  min-width: 1366px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: url("../../../static/images/loginbg.png") center center no-repeat;
  .el-button--primary {
    width: 100%;
  }
  background-size: cover;
  display:flex;
  align-items:center;
  .container {
    width: 100%;
    display:flex;
    align-items:center;
    .leftArea {
      text-align: center;
      margin-left: 100px;
    }
    .rightArea {
      margin-right: 100px;
      .loginformwrap {
        width: 500px;
        height: 515px;
        margin: 0 auto;
        background: url("../../../static/images/loginip.png") center center no-repeat;
        background-size: cover;
        .loginlogo {
          height: 200px;
          line-height: 200px;
          text-align: center;
          color: #000;
          font-size: 28px;
        }
        .loginform {
          margin: 0 70px;
          .el-input--prefix .el-input__inner, .el-form-item__error {
            padding-left: 79px;
          }
          .el-input__prefix {
            left: 21px;
            top: 2px;
          }
          input.el-input__inner {
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #dcdcdc;
          }
        }
        .buttonwrap {
          margin-top: 75px;
          .lgBtn {
            height: 50px;
            font-size: 18px;
          }
          .el-button.is-round {
            border-radius: 50px;
          }
        }
      }
    }
  }
  input::-webkit-input-placeholder{
    font-size: 18px;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    font-size: 18px;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    font-size: 18px;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    font-size: 18px;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 100%;
    text-align: center;
    .ft {
      font-size: 18px;
      color: #fff;
      margin-top: 10px;
    }
  }
}
</style>
