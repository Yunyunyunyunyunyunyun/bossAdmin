<template>
  <div class="g-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item>当前位置：</el-breadcrumb-item> -->
      <el-breadcrumb-item to="/" v-if="menuArray.length === 1">首页</el-breadcrumb-item>
      <template v-else-if="menuArray.length > 1">
        <el-breadcrumb-item
          v-for="(item, index) in menuArray"
          :key="index"
          :to="item.bpath"
          :class="index === menuArray.length - 1 ? 'highlight' : 'lowlight'"
        >{{item.bname | filterBname}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <slot></slot>
  </div>
</template>

<script>
import * as utils from '../../../utils/utils'

export default {
  name: 'g-breadcrumb',
  data () {
    return {
      menuArray: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      let temp = []
      let path = this.$route.path
      if (path === '/') {
        this.menuArray = [{ bname: '首页导航', bpath: '' }]
        return
      }
      let patharray = path.split('/')
      patharray.splice(0, 1)
      for (let i = 0; i < patharray.length; i++) {
        let obj = {}
        if (i === 0) {
          obj.bname = `/${patharray[i]}`
          obj.bpath = ''
          temp.push(obj)
        } else {
          let bname = ''
          let bpath = ''
          for (let k = 0; k <= i; k++) {
            bname += `/${patharray[k]}`
            bpath += `/${patharray[k]}`
            if (k === i) {
              obj.bname = bname
              obj.bpath = bpath
              temp.push(obj)
            }
          }
        }
      }
      // 如果有3条数据，第2条不可点击
      if (temp.length === 3) {
        temp[1].bpath = ''
      }
      //
      this.menuArray = temp
      // 修改样式
      this.$nextTick(() => {
        // 第一个分隔符隐藏
        // let arrow = document.querySelectorAll('.el-icon-arrow-right')
        // arrow[0].style.display = 'none'
        // 第一个文字margin-left为12px
        // let breadcrumb = document.querySelectorAll('.el-breadcrumb__item')
        // breadcrumb[0].style.marginLeft = '12px'
        // breadcrumb[0].style.marginRight = '0'
      })
    }
  },
  computed: {},
  filters: {
    filterBname (path) {
      return utils.findBreadcrumb(path)
    }
  },
  watch: {
    $route (to, from) {
      if (to.path) {
        this.initData()
      }
    }
  }
}
</script>

<style lang="less">
.g-breadcrumb {
  background: #f3f4f7;
  height: 46px;
  line-height: 46px;
  font-size: 14px;
  box-sizing: border-box;
  position: relative;
  margin: 0 16px;
  .el-breadcrumb {
    padding: 16px 0;
    .el-breadcrumb__inner.is-link {
      font-weight: normal;
    }
    .lowlight {
      .el-breadcrumb__inner, .el-breadcrumb__separator {
        color: #999;
      }
    }
    .highlight {
      .el-breadcrumb__inner {
        color: #4C8CF8;
      }
    }
  }
}
</style>
