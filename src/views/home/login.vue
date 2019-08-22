<template>
  <div class="loginpage">
    <el-row class="container">
      <el-col :span="12" class="leftArea">
        <img src="../../../static/images/loginimg.png"/>
      </el-col>
      <el-col :span="12" class="rightArea">
        <div class="loginformwrap">
          <div class="loginlogo">
            BOSS管理系统
          </div>
          <div class="loginform">
            <el-form ref="loginform" :model="loginform" :rules="rules">
              <el-form-item prop="account">
                <!-- <el-input v-model="loginform.account" placeholder="请输入用户名"></el-input> -->
                <el-input
                  placeholder="请输入您的账号"
                  v-model="loginform.account">
                  <img slot="prefix" src="../../../static/images/user.png"/>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <!-- <el-input v-model="loginform.password" type="password" placeholder="请输入密码"></el-input> -->
                <el-input
                  placeholder="请输入您的密码"
                  v-model="loginform.password"
                  type="password">
                  <img slot="prefix" src="../../../static/images/password.png"/>
                </el-input>
              </el-form-item>
              <div class="buttonwrap">
                <el-form-item>
                  <el-button type="primary" round @click="onSubmit('loginform')">登录</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <img src="../../../static/images/loginbt.png"/>
      <div class="ft">Copyright &copy; www.mymrmao.com, All Rights Reserved.</div>
    </div>
  </div>
</template>

<script>
//
export default {
  data () {
    return {
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
  created () {},
  methods: {
    onSubmit (formName) {
      if (!this.checkForm(formName)) return
      //
      this.$router.push({
        name: 'home'
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
    }
    .rightArea {
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
