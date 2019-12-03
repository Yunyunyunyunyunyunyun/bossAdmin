<template>
  <el-dialog
    :title="comfirmDialogObj.title"
    :visible.sync="comfirmDialogObj.dialogVisible"
    width="480px"
    class="dialog-pop"
  >
    <div class="dlContent" :class="comfirmDialogObj.dlMain === '' ? 'dl' : ''">
      <img :src="comfirmDialogObj.src">
      <span class="dlTitle" :class="isWeight?'':'not-weight'">{{ comfirmDialogObj.dlTitle }}</span>
      <div v-if="comfirmDialogObj.dlMain || comfirmDialogObj.dlMain !== ''" class="dlMain">
        {{ comfirmDialogObj.dlMain }}
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary" class="w90" :loading="loading"
        @click="handleComfirm"
      >
        {{ loading?'开门中':'确定' }}
      </el-button>
      <el-button class="w90" @click="comfirmDialogObj.dialogVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    comfirmDialogObj: {
      type: Object,
      default: () => {
        return {
          title: '提示',
          dialogVisible: false,
          dlTitle: '确认删除',
          dlMain: '',
          src: require('static/images/qmark.png')
        }
      }
    },
    isWeight: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formInline: {}
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
.dialog-pop
  >>>.el-dialog__header
    background-color #F3F8FF
    padding 0
    text-indent 23px
  >>>.el-dialog__title
    font-size 16px
    font-weight bold
    color #333333
    height 50px
    line-height 50px
  >>>.el-button
    min-width 90px
    height 33px
    padding 0
    line-height 33px
  >>>.el-input
    width 220px
.w90
  width 90px
.dlContent
  padding-left 15px
  &.dl
    display flex
    align-items center
  .dlTitle
    vertical-align top
    padding-left 10px
    font-size 16px
    color #333333
    font-weight 600
    &.not-weight
      font-weight normal
  .dlMain
    position absolute
    top 114px
    left 90px
    width 346px
    height 44px
    font-size 16px
    font-weight 400
    color #666
</style>
