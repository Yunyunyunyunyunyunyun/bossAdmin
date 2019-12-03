<template>
  <el-dialog
    title="批量入库"
    width="40%"
    :visible.sync="batchdialogObj.dialogVisible"
  >
    <div class="batch-container">
      <div class="batch-item">
        <div class="icon">
          <i class="iconfont">&#xe609;</i>
        </div>
        <div class="button-container">
          <div class="batch-tip">
            请按照数据模板的格式准备导入数据，请勿更改模板中字段！
          </div>
          <div class="batch-button">
            <a href="http://h5.mymrmao.com/硬件信息.xlsx">下载模版</a>
          </div>
        </div>
      </div>
      <div class="batch-item">
        <div class="icon">
          <i class="iconfont">&#xe608;</i>
        </div>
        <div class="button-container">
          <div class="batch-tip">
            文件后缀必须为xls或xlsx（即Excel格式），文件大小不得大于10M
          </div>
          <div class="batch-button">
            <el-upload
              ref="upload"
              :action="serveUrl"
              :headers="headers"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :file-list="fileList"
              :auto-upload="false"
            >
              <a slot="trigger" href="javascript:;">
                选择文件
              </a>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleUpload">上 传</el-button>
      <el-button @click="batchdialogObj.dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Host from '../../../config/apiHost'
export default {
  props: {
    batchdialogObj: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      serveUrl: `${Host.uploadExcelHost}/product/importProduct`,
      headers: {
        token: localStorage.bossadmin_user
          ? (JSON.parse(localStorage.bossadmin_user).token || '')
          : ''
      },
      fileList: []
    }
  },
  mounted () {
    this.fileList = []
  },
  methods: {
    beforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (isText || isTextComputer) {
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过 10MB!')
        }
      } else {
        this.$message.error('请选择Excel文件上传!')
      }
    },
    handleUpload () {
      this.$refs.upload.submit()
    },
    uploadSuccess (res, file, fileList) {
      if (res.result === '' && res.code === 0) {
        this.$message({ type: 'success', message: res.msg })
      } else {
        this.$message({ type: 'error', message: res.result })
      }
      this.fileList = []
      this.batchdialogObj.dialogVisible = false
      this.$emit('refresh')
    },
    uploadError (err, file, fileList) {
      console.log(err)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/varibles.styl'
@import '~@/assets/style/dialog-common.styl'
.batch-container
  padding 0 20px
  .batch-item
    min-height 72px
    border 1px #E6E8EE solid
    margin-top 10px
    margin-bottom 20px
    display flex
    .icon
      width 72px
      min-height 72px
      line-height 72px
      text-align center
      border-right 1px #E6E8EE solid
      .iconfont
        font-size 30px
        color #4C8CF8
    .button-container
      padding-left 13px
      padding-top 12px
      .batch-tip
        font-size 14px
        color #666666
        margin-bottom 11px
</style>
