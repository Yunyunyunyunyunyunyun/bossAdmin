<template>
  <div class="g-aside">
    <el-menu
      ref="elmenu"
      :default-active="menuActive"
      :router="true"
      :unique-opened="true"
    >
      <el-submenu v-for="(item, index) in menuList" :key="index" :index="item.id">
        <!-- 一级菜单 -->
        <template slot="title">
          <img :src="item.mIcon">
          <span class="titCont">{{ item.name }}</span>
        </template>
        <template v-for="subitem in item.children">
          <!-- 二级菜单--无子菜单 -->
          <template>
            <el-menu-item
              v-if="subitem.mType==1&&subitem.mUrl"
              :key="subitem.id"
              :index="subitem.mUrl"
              :route="subitem.mUrl"
            >
              {{ subitem.name }}
            </el-menu-item>
          </template>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'GAside',
  data () {
    return {
      menuActive: '',
      menuList: []
    }
  },
  created: function () {
    const menuList = JSON.parse(
      localStorage.getItem('bossadmin_menus') || '[]'
    )
    this.menuList = menuList
    this.handleQuery()
  },
  methods: {
    handleQuery () {
      const route = this.$route.path
      // 后台首页不高亮菜单
      if (route === '/') {
        this.menuActive = ''
      } else {
        this.menuActive = route
      }
    }
  }
}
</script>

<style lang="less">
.g-aside {
  height: calc(100% - 50px);
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  position: fixed;
  top: 50px;
  left: 0;
  z-index: 100;
  .el-menu {
    border-right: none;
  }
  .el-menu:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-submenu__title {
    font-size: 16px;
    color: #333;
  }
  .el-menu-item {
    padding-left: 55px !important;
    font-size: 14px;
    color: #666;
  }
  .el-menu-item.is-active,
  .el-submenu__title:hover,
  .el-menu-item:hover {
    background: #fff;
  }
  .el-menu-item.is-active,
  .el-submenu.is-active .el-submenu__title {
    color: #4c8cf8;
  }
  .titCont {
    padding-left: 13px;
  }
  .el-submenu__icon-arrow {
    margin-top: -3px;
  }
}
</style>
