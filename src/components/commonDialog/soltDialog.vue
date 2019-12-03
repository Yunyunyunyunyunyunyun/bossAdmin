<template>
  <el-dialog
    :title="slotDialogObj.title"
    :visible.sync="slotDialogObj.dialogVisible"
    :width="width"
    class="slot-dialog"
  >
    <slot name="content"></slot>
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="isComfirm" type="primary" class="w90"
        @click="handleComfirm"
      >确定</el-button>
      <el-button class="w90" @click="slotDialogObj.dialogVisible = false">{{ cancelTxt }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    slotDialogObj: {
      type: Object,
      default: () => {
        return {
          title: '提示',
          dialogVisible: false
        }
      }
    },
    width: {
      type: String,
      default: '480px'
    },
    isComfirm: {
      type: Boolean,
      default: true
    },
    cancelTxt: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    handleComfirm () {
      this.$emit('confirm-click')
    }
  }
}
</script>

<style lang="stylus" scoped>
.slot-dialog
  /deep/.el-dialog__header
    background-color #F3F8FF
    padding 0
    text-indent 23px
  /deep/.el-dialog__title
    font-size 16px
    font-weight bold
    color #333333
    height 50px
    line-height 50px
  /deep/.el-button
    min-width 90px
    height 33px
    padding 0
    line-height 33px
  /deep/.el-dialog__footer
    text-align center
.w90
  width 90px
</style>
