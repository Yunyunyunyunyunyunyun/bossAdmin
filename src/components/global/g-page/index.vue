<template>
  <div class="mainContain">
    <div class="g-page">
      <div class="header">
        <g-header></g-header>
      </div>
      <div class="contentwrap sidebar">
        <!-- 左侧菜单 -->
        <div class="aside">
          <g-aside></g-aside>
        </div>
        <!-- 右侧 -->
        <div class="content">
          <!-- 面包屑 -->
          <div class="breadcrumb">
            <g-breadcrumb></g-breadcrumb>
          </div>
          <!-- 路由内容 -->
          <div class="main">
            <transition name="fade-transform" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GPage',
  computed: {}
}
</script>

<style scoped lang="less">
.mainContain {
  display: flex;
  .g-page {
    min-width: 1366px;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    .header {
      height: 50px;
    }
    .contentwrap {
      flex-grow: 1;
      min-width: 1366px;
      display: flex;
      height: 100%;
      position: relative;
      .aside {
        max-width: 200px;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: #fff;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    .sidebar {
      .content {
        background-color: #f3f4f7;
        min-width: 1166px;
        padding-left: 200px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        .breadcrumb {
          height: 46px;
        }
        .main {
          flex-grow: 1;
          margin-left: 16px;
        }
      }
    }
  }
}
</style>
