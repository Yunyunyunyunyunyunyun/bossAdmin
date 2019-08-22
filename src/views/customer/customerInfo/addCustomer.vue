<template>
  <div class="addCustomer">
    <div class="content">
      <span class="lt">客户信息</span>
      <span class="fr"><span class="red">* </span>为必填项</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
  .addCustomer {
    padding: 20px;
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
  }
</style>
