<template>
  <div class="g-header">
    <el-row>
      <el-col :span="20"><span class="logo">BOSS管理系统</span></el-col>
      <el-col :span="4" class="contain">
        <el-avatar class="avatar" size="small" :src="squareUrl"></el-avatar><span class="name">{{username}}</span>
        <span @click="logout" class="logout">退出</span></el-col>
    </el-row>
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
        'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
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
  padding: 0 10px;
  color: #fff;
  .logo {
    font-size: 8px;
    font-weight: 600;
    margin-left: 8px;
  }
  .avatar {
    margin-top: 11px;
  }
  .logout {
    vertical-align: top;
    padding-left: 16px;
  }
  .name {
    vertical-align: top;
    padding-left: 8px;
  }
  .contain {
    width: 200px;
  }
}
</style>
