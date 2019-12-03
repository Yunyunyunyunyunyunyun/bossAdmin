<template>
  <div class="add-msg">
    <div v-show="isShowEdit&&!isShowDetail" class="user-edit">
      <div class="mian">
        <div class="m-header">
          <span>新建消息</span>
          <div>
            <span style="color:#E02020;">*</span>
            <span>为必填项</span>
          </div>
        </div>
        <div v-loading="loading" class="m-content">
          <el-form
            ref="msgFrom" :model="msgFrom" :rules="rules"
            label-width="100px"
          >
            <div class="info">
              <div class="info-l">
                <el-form-item label="消息标题：" prop="title">
                  <el-input v-model="msgFrom.title" placeholder="请填写消息标题" />
                </el-form-item>
                <div style="height:20px" />
                <el-form-item label="标题图片：" prop="imageUrl">
                  <el-upload
                    class="image-uploader"
                    :action="serveUrl"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleImageSuccess"
                    :on-error="handleImageFail"
                    :before-upload="beforeImageUpload"
                  >
                    <el-image v-if="msgFrom.imageUrl" :src="msgFrom.imageUrl"></el-image>
                    <div v-else v-loading="imageLoading" class="image-uploader_c">
                      <i class="el-icon-plus image-uploader-icon" />
                      <div class="image-contain">
                        上传图片
                      </div>
                    </div>
                    <div slot="tip" class="image-tip">
                      只能上传jpg/png格式文件，建议上传200px*px
                    </div>
                  </el-upload>
                </el-form-item>
                <div style="height:20px" />
                <el-form-item label="接收对象：" prop="receiveObjVal">
                  <el-select v-model="msgFrom.receiveObjVal" placeholder="请选择">
                    <el-option
                      v-for="item in receiveObjList"
                      :key="item.code"
                      :label="item.desc"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="info-r">
                <div style="color:#606266;">
                  <span class="color-red">*</span> 消息接受账户：
                </div>
                <div style="height:22px;" />
                <el-transfer
                  ref="transfer"
                  v-model="receiveAccount"
                  style="text-align: left; display: inline-block"
                  filterable
                  :render-content="renderFunc"
                  :titles="['全部账户列表', '已选择账户列表']"
                  :data="receiveAccountList"
                >
                  <el-button
                    slot="left-footer"
                    class="transfer-footer"
                    type="text"
                    size="small"
                    @click="resetData()"
                  >
                    <i class="el-icon-refresh-left" />
                    恢复
                  </el-button>
                  <el-button
                    slot="right-footer"
                    class="transfer-footer"
                    type="text"
                    size="small"
                    @click="resetData('right')"
                  >
                    <i class="el-icon-refresh-left" />
                    恢复
                  </el-button>
                </el-transfer>
              </div>
            </div>
            <div class="edit">
              <div class="edit-title">
                <span class="color-red">*</span>消息内容：
              </div>
              <div class="edit-content">
                <div id="wangEditor" />
              </div>
            </div>
            <div style="height:20px;" />
            <el-form-item label="提醒方式：">
              <el-radio-group v-model="msgFrom.radio">
                <el-radio :label="0">
                  站内信
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btn-list">
        <el-button type="primary" size="small" @click="submit(0)">
          保存
        </el-button>
        <el-button type="success" size="small" @click="submit(1)">
          发布
        </el-button>
        <el-button
          style="background:#F7B500;" type="warning" size="small"
          @click="preview"
        >
          预览
        </el-button>
        <el-button
          type="primary" size="small" plain
          @click="cancel"
        >
          取消
        </el-button>
      </div>
    </div>
    <div v-show="!isShowEdit&&!isShowDetail" class="msg-preview">
      <div class="preview-box">
        <div class="msg-preview_h">
          <span>消息预览</span>
        </div>
        <div class="msg-preview_c">
          <p v-if="msgFrom.title" class="title">
            {{ msgFrom.title }}
          </p>
          <p class="date">
            {{ new Date().Format("yyyy-MM-dd hh:mm:ss") }}
          </p>
          <!-- eslint-disable-next-line -->
          <div class="edit-dom" v-html="editDOM"></div>
        </div>
      </div>
      <div class="btn-list">
        <el-button type="primary" size="small" @click="isShowEdit=true">
          返回
        </el-button>
      </div>
    </div>
    <!-- 查看系统消息 -->
    <div v-show="isShowDetail" class="msg-detail">
      <div class="msg-detail_box">
        <div class="msg-detail_h">
          <span>查看系统消息</span>
        </div>
        <div class="msg-detail_c">
          <div class="msg-detail_list">
            <div class="list-l">
              <div class="list-item">
                <div class="item-l">
                  <label for>*</label>
                  <span>消息标题：</span>
                </div>
                <div class="item-r">
                  <el-input v-model="msgFrom.title " :disabled="true"></el-input>
                </div>
              </div>
              <div style="height:60px" />
              <div class="list-item" style="align-items: stretch;">
                <div class="item-l">
                  <label for>*</label>
                  <span>标题图片：</span>
                </div>
                <div class="item-r">
                  <el-image class="item-image" :src="msgFrom.imageUrl" fit="cover"></el-image>
                </div>
              </div>
              <div style="height:60px" />
              <div class="list-item">
                <div class="item-l">
                  <label for>*</label>
                  <span>接收对象：</span>
                </div>
                <div class="item-r">
                  <el-input :disabled="true" placeholder="猫先生云服务平台"></el-input>
                </div>
              </div>
            </div>
            <div class="list-r">
              <div class="list-item">
                <div class="item-l">
                  <label for>*</label>
                  <span>消息接收账户：</span>
                </div>
                <div class="item-r">
                  <div class="item-r_text">
                    已选择账户列表（总计{{ receiveAccountList.length }}，已选{{ receiveAccount.length }}）
                    <div class="text-box">
                      <p v-for="(item, index) in selectedAccountList" :key="index">
                        {{ item.label }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="height:45px;" />
          <div class="list-item" style="align-items: stretch;">
            <div class="item-l">
              <label for>*</label>
              <span>消息内容：</span>
            </div>
            <!-- eslint-disable-next-line -->
            <div class="msg-content" v-html="msgFrom.content"></div>
          </div>
          <div style="height:50px;" />
          <div class="list-item">
            <div class="item-l">
              <label for>*</label>
              <span>提醒方式：</span>
            </div>
            <div class="item-r">
              <el-input :disabled="true" placeholder="站内信"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div style="height:56px;" />
      <div class="btn-list">
        <el-button type="primary" size="small" @click="cancel">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Host from '../../../config/apiHost'
import Server from '../../../API/system'
export default {
  data () {
    return {
      editDOM: '',
      msgId: '',
      type: '',
      serveUrl: `${Host.uploadImgHost}/boss/message/upload`,
      loading: false,
      imageLoading: false,
      isShowEdit: true,
      isShowDetail: true,
      receiveObjList: [],
      receiveAccountList: [],
      receiveAccount: [],
      selectedAccountList: [],
      rules: {
        title: [{ required: true, message: '请填写消息标题', trigger: 'blur' }],
        receiveObjVal: [
          { required: true, message: '请选接受对象', trigger: 'change' }
        ],
        imageUrl: [
          { required: true, message: '请上传标题图片', trigger: 'change' }
        ]
      },
      headers: {
        token: localStorage.bossadmin_user
          ? JSON.parse(localStorage.bossadmin_user).token || ''
          : ''
      },
      msgFrom: {
        title: '',
        imageUrl: '',
        receiveObjVal: '',
        content: '',
        radio: 0
      },
      renderFunc (h, option) {
        return <span>{option.label}</span>
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    const query = to.query
    let _str = ''
    switch (parseInt(query.type)) {
      case 1:
        _str = '新建'
        break
      case 2:
        _str = '查看'
        break
      case 3:
        _str = '编辑'
        break
    }
    to.meta.bname = `${_str}系统消息`
    next()
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.handleQuery()
      this.initWangEditor()
      this.getReceiveObj()
      this.getMessageAccountList()
    },
    submit (status = 0, formName = 'msgFrom') {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const msg = this.checkMsg()
          if (msg) {
            this.$message.error(msg)
            return false
          }
          this.addSystemMsg(status)
        } else {
          return false
        }
      })
    },
    // 新增系统消息通知
    addSystemMsg (status) {
      const receiveAccountType =
        this.receiveAccountList.length === this.receiveAccount.length
          ? '0'
          : '1'
      const _str = this.type === 3 ? 'editMessage' : 'createMessage'
      const data = {
        title: this.msgFrom.title,
        titlePath: this.msgFrom.imageUrl,
        receiveType: this.msgFrom.receiveObjVal,
        receiveAccount:
          receiveAccountType === '0' ? '' : this.receiveAccount.toString(),
        content: this.wangEditor.txt.html(),
        reminder: this.msgFrom.radio,
        receiveAccountType,
        status
      }
      if (this.type === 3) {
        Object.assign(data, {
          id: this.msgId
        })
      }
      Server[_str](data).then(res => {
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'success'
        })
        this.$router.push({
          path: '/system/systemMsg'
        })
      })
    },
    getMsgDetail () {
      Server.msgDetail(this.msgId).then(res => {
        const data = res.result
        this.msgFrom.title = data.title
        this.msgFrom.imageUrl = data.titlePath
        this.msgFrom.receiveObjVal = data.receiveType
        this.msgFrom.content = data.content
        this.receiveAccount = this.handleAccountList(data.receiveAccount)
        for (let i = 0; i < this.receiveAccountList.length; i++) {
          if (this.receiveAccount.includes(this.receiveAccountList[i].key)) {
            this.selectedAccountList.push(this.receiveAccountList[i])
          }
        }
        if (!this.isShowDetail) this.wangEditor.txt.html(data.content)
      })
    },
    // 获取消息接收账户
    getMessageAccountList () {
      this.loading = true
      Server.accountList().then(res => {
        this.loading = false
        const list = res.result
        for (let i = 0; i < list.length; i++) {
          const obj = {
            key: list[i].id,
            label: `${list[i].userName}(${list[i].nickName})`,
            disabled: false
          }
          this.receiveAccountList.push(obj)
        }
        if (this.msgId) {
          this.getMsgDetail()
        }
      })
    },
    // 获取接收对象
    getReceiveObj () {
      Server.receiveObj().then(res => {
        const list = res.result
        for (let i = 0; i < list.length; i++) {
          this.receiveObjList.push(list[i])
        }
      })
    },
    // 处理选中的账户列表
    handleAccountList (list) {
      let newArr = []
      if (list) {
        newArr = list.split(',')
      } else {
        for (let i = 0; i < this.receiveAccountList.length; i++) {
          newArr.push(this.receiveAccountList[i].key)
        }
      }
      return newArr
    },
    checkMsg () {
      let msg = ''
      if (!this.wangEditor.txt.html()) msg = '请填写消息内容'
      if (!this.msgFrom.imageUrl) msg = '请上传标题图片'
      if (!this.msgFrom.title) msg = '请填消息标题'
      if (!this.receiveAccount.length) msg = '请添加接收账户'
      return msg
    },
    handleQuery () {
      const { type, id } = this.$route.query
      this.msgId = id
      this.type = parseInt(type)
      this.isShowDetail = parseInt(type) === 2
    },
    handleImageSuccess (res, file) {
      this.msgFrom.imageUrl = res.result
      this.imageLoading = false
    },
    handleImageFail (err) {
      this.$message({
        showClose: true,
        message: '图片上传失败请重新上传',
        type: 'error'
      })
      this.msgFrom.imageUrl = ''
      console.log(err)
    },
    beforeImageUpload (file) {
      const isTYPE = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isTYPE) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      } else {
        this.imageLoading = true
      }
      return isTYPE
    },
    initWangEditor () {
      const E = window.wangEditor
      this.wangEditor = new E('#wangEditor')
      this.wangEditor.create()
    },
    resetData (source = 'left') {
      this.$refs.transfer.$refs[`${source}Panel`].checked = []
      this.$refs.transfer.clearQuery(source)
    },
    cancel () {
      this.$router.push({
        path: '/system/systemMsg'
      })
    },
    preview () {
      const msg = this.checkMsg()
      if (msg) {
        this.$message.error(msg)
        return false
      }
      this.editDOM = this.wangEditor.txt.html()
      this.isShowEdit = false
    }
  }
}
</script>
<style lang="less" scoped>
.add-msg {
  width: 100%;
  background-color: #fff;
  padding: 25px 20px;
  box-sizing: border-box;
  .mian {
    width: 100%;
    border: 1px solid #e6e6e6;
  }
  .m-header {
    display: flex;
    height: 52px;
    padding: 0 22px;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #333;
    background-color: #f3f8ff;
    border-bottom: 1px solid #e6e6e6;
  }
  .m-content {
    width: 100%;
    max-width: 1050px;
    padding: 30px 20px;
    padding-bottom: 10px;
    box-sizing: border-box;
    .image-uploader {
      .image-uploader_c {
        border: 1px dashed #ccc;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 104px;
        height: 104px;
        margin-top: 10px;
      }
      .image-uploader-icon {
        font-size: 22px;
        color: #999;
        text-align: center;
        margin-top: 20px;
      }
      .image-contain {
        font-size: 14px;
        color: #999;
      }
      img {
        width: 104px;
        height: 104px;
        display: block;
        margin-top: 10px;
      }
      .image-tip {
        margin-top: 8px;
        font-size: 12px;
        color: #999;
      }
    }
    .el-select {
      width: 100%;
    }
    .transfer-footer {
      right: 10px;
      position: absolute;
      top: 4px;
    }
    .info {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .edit {
      width: 100%;
      display: flex;
      margin-top: 40px;
      .edit-title {
        color: #606266;
        width: 100px;
        padding-left: 6px;
        box-sizing: border-box;
      }
      .edit-content {
        width: 100%;
        height: 334px;
      }
    }
  }
  .btn-list {
    width: 35%;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 90px;
    }
  }
  .color-red {
    color: #e02020;
  }
  .msg-preview {
    .preview-box {
      width: 100%;
      border: 1px solid #e6e6e6;
    }
    .msg-preview_h {
      display: flex;
      height: 52px;
      padding: 0 22px;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #333;
      background-color: #f3f8ff;
      border-bottom: 1px solid #e6e6e6;
    }
    .msg-preview_c {
      padding: 50px 79px;
      box-sizing: border-box;
      .title {
        width: 100%;
        font-size: 24px;
        color: #333;
        text-align: center;
        font-weight: bold;
      }
      .date {
        width: 100%;
        text-align: center;
        color: #999999;
        font-size: 16px;
      }
    }
    .btn-list {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .msg-detail {
    .msg-detail_box {
      width: 100%;
      border: 1px solid #e6e6e6;
    }
    .msg-detail_h {
      display: flex;
      height: 52px;
      padding: 0 22px;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #333;
      background-color: #f3f8ff;
      border-bottom: 1px solid #e6e6e6;
    }
    .msg-detail_c {
      width: 100%;
      max-width: 1050px;
      padding: 30px 20px;
      padding-bottom: 10px;
      box-sizing: border-box;
      .msg-detail_list {
        display: flex;
        justify-content: space-between;
      }
      .list-item {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
        .item-r {
          .el-input {
            font-size: 12px;
            width: 210px;
          }
          .item-r_text {
            width: 300px;
            height: 32px;
            display: flex;
            align-items: center;
            background-color: #f3f8ff;
            padding: 0 20px;
            box-sizing: border-box;
            border: 1px solid #dedede;
            font-size: 12px;
            color: #333;
            border-radius: 2px;
            position: relative;
            .text-box {
              width: 300px;
              height: 267px;
              position: absolute;
              left: -1px;
              top: 30px;
              padding: 10px 20px;
              box-sizing: border-box;
              overflow-y: auto;
              box-sizing: border-box;
              border: 1px solid #dedede;
              border-top: none;
              border-radius: 2px;
            }
          }
        }
        .msg-content {
          flex: 1;
          border: 1px solid #e6e8ee;
          padding: 10px 20px;
          box-sizing: border-box;
          height: 324px;
          overflow-y: auto;
        }
        label {
          color: #e02020;
        }
        .item-image {
          width: 104px;
          height: 104px;
          border-radius: 2px;
          border: 1px dashed #ccc;
          overflow: hidden;
          box-sizing: border-box;
        }
      }
    }
    .btn-list {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .el-image{
    width: 104px;
    height: 104px;
  }
}
</style>
