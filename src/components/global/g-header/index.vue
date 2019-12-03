<template>
  <div class="g-header">
    <div class="left">
      <img src="../../../../static/images/logo.png" class="img">
      <span class="logo">BOSS管理系统</span>
    </div>
    <div class="right">
      <img src="../../../../static/images/avatar.png" class="avatar"><span class="name">{{ username }} {{ nickname }}</span>
      <span class="logoutCon" @click="logout">
        <img src="../../../../static/images/logout.png" class="log">
        <span class="logout">退出</span>
      </span>
    </div>
  </div>
</template>

<script>
import Server from '../../../API/common'
export default {
  name: 'GHeader',
  data () {
    return {
      activeIndex: '1',
      username: '',
      nickname: ''
    }
  },
  created () {
    const user = this.$localstore.get('bossadmin_user')
    if (user.userName && user.nickName) {
      this.username = user.userName
      this.nickname = user.nickName
    }
  },
  methods: {
    logout () {
      this.$confirm('退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 注销
          Server.logout().then(res => {
            if (res.code === 0) {
              this.$message.success('退出' + res.msg)
              // 清空各种数据
              this.$localstore.set('bossadmin_login', false)
              this.$localstore.set('bossadmin_user', {})
              this.$localstore.set('bossadmin_menus', {})
              this.$localstore.set('new_bossadmin_menus', [])
              this.$store.commit('user/user_Mutations', {})
              this.$store.commit('menus/menus_Mutations', {})
              this.$store.commit('common/login_Mutations', false)
              this.$localstore.set('bossadmin_username', '')
              this.$localstore.set('bossadmin_password', '')
              this.$router.push('/login')
            }
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="less">
.g-header {
  position:fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background: #4C8CF8;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  color: #fff;
  font-size: 16px;
  .left {
    float: left;
    width: 200px;
    height: 50px;
    line-height: 50px;
    .img {
      margin-top: 9px;
      margin-left: 6px;
    }
    .logo {
      font-weight: 600;
      margin-left: 13px;
      vertical-align: top;
    }
  }
  .right {
    float: right;
    margin-right: 40px;
    height: 50px;
    line-height: 50px;
    .avatar {
      margin-top: 11px;
    }
    .name {
      vertical-align: top;
      padding-left: 16px;
    }
    .logoutCon {
      margin-left: 40px;
      cursor: pointer;
      padding-top: 15px;
      .log {
        vertical-align: top;
        margin-top: 16.5px;
      }
      .logout {
        vertical-align: top;
        padding-left: 12px;
      }
    }
  }
}
</style>
