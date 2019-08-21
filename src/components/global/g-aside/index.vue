<template>
  <div class="g-aside">
    <el-menu
      ref="elmenu"
      :default-active="menuactive"
      :active="menuactive"
      @select="handleOpen"
      :router="false"
      :unique-opened="true"
    >
      <el-submenu :index="item.value" v-for="(item, index) in menudata" :key="index">
        <!-- 一级菜单 -->
        <template slot="title">
          <!-- <i :class="item.icon"></i> -->
          <img :src="item.src"/>
          <span class="titCont">{{item.label}}</span>
        </template>
        <template v-for="subitem in item.children">
          <!-- 二级菜单--有菜单 -->
          <template v-if="subitem.children && subitem.children.length">
            <el-submenu :index="subitem.value" :key="subitem.value">
              <template slot="title">{{subitem.label}}</template>
              <!-- 三级菜单 -->
              <el-menu-item
                :index="item.value"
                v-for="item in subitem.children"
                :key="item.value"
                @click="gotopage(item.value)"
              >{{item.label}}</el-menu-item>
            </el-submenu>
          </template>
          <!-- 二级菜单--无子菜单 -->
          <template v-if="!subitem.children">
            <el-menu-item
              :index="subitem.value"
              :key="subitem.value"
              @click="gotopage(subitem.value)"
            >{{subitem.label}}</el-menu-item>
          </template>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import * as common from '../../../common/adminmenu.js'
import * as utils from '../../../utils/utils.js'

export default {
  name: 'g-aside',
  data () {
    return {
      menuactive: '',
      menudata: common.adminmenu
    }
  },
  created () {
    let route = this.$route.path
    // 后台首页不高亮菜单
    if (route === '/') {
      this.menuactive = ''
    } else {
      let patharray = route.split('/')
      patharray.splice(0, 1)
      // if (patharray.length > 2) {
      //   patharray.splice(patharray.length - 1, 1);
      //   let str = "";
      //   for (let i = 0; i < patharray.length; i++) {
      //     str += `/${patharray[i]}`;
      //   }
      //   this.menuactive = str;
      // } else {
      //   this.menuactive = route;
      // }
      this.menuactive = route
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      // 如果点击二级菜单，于此同时同级下有三级菜单，三级菜单收缩
      // TODO 待测试
      let threeLevelData = utils.findThreeLevelMenu(key, common.adminmenu)
      if (threeLevelData.length) {
        for (var value of threeLevelData) {
          this.$refs.elmenu.close(value)
        }
      }
      this.menuactive = key
    },
    gotopage (val) {
      // 直接跳转
      this.$router.push({
        path: val
      })
    }
  },
  computed: {}
}
</script>

<style lang="less">
.g-aside {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
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
    font-size: 12px;
    color: #666;
  }
  .el-menu-item.is-active, .el-submenu__title:hover, .el-menu-item:hover {
    background: #fff;
  }
  .el-menu-item.is-active, .el-submenu.is-active .el-submenu__title {
    color: #4c8cf8;
  }
  .titCont {
    padding-left: 13px;
  }
}
</style>
