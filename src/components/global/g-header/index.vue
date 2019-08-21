<template>
  <div class="g-header">
    <div class="left">
      <img src="../../../../static/images/logo.png" class="img"/>
      <span class="logo">BOSS管理系统</span>
    </div>
    <div class="right">
      <el-avatar class="avatar" size="small" :src="squareUrl"></el-avatar><span class="name">{{username}}</span>
      <span @click="logout" class="logoutCon">
        <img src="../../../../static/images/logout.png" class="log"/>
        <span class="logout">退出</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'g-header',
  data () {
    return {
      activeIndex: '1',
      username: 'admin',
      squareUrl:
        '../../../../static/images/avatar.png'
    }
  },
  created () {
    let user = this.$store.state.user.user
    if (user.name) {
      this.username = user.name
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
          // 清空各种数据
          // this.$localstore.set("wzyadmin_login", false);
          // this.$localstore.set("wzyadmin_user", {});
          // this.$store.commit("user/user_Mutations", {});
          // this.$store.commit("common/login_Mutations", false);
          // this.$localstore.set("wzyadmin_username", "");
          // this.$localstore.set("wzyadmin_password", "");
          this.$router.push({ name: 'login' })
        })
        .catch(() => {
          //
        })
    }
  }
}
</script>

<style lang="less">
.g-header {
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
    width: 205px;
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
