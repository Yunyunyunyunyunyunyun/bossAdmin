<template>
  <div class="add-system">
    <div class="content">
      <span class="lt">菜单配置</span>
      <span class="fr">
        <span class="red">*</span>为必填项
      </span>
    </div>
    <div class="mainAdd">
      <el-form
        ref="form" :model="form" :rules="rules"
        label-width="150px" class="formStyle"
      >
        <el-form-item label="父级菜单：" prop="parentMenu">
          <el-input v-model="form.parentMenu" placeholder="填写父级菜单" :disabled="isDisabled" />
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="form.name" placeholder="填写菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型：" prop="type">
          <div v-if="isShowRadio">
            <el-radio-group v-model="form.type">
              <el-radio :label="0">
                目录
              </el-radio>
              <el-radio :label="1">
                页面
              </el-radio>
              <el-radio :label="2">
                按钮
              </el-radio>
            </el-radio-group>
          </div>
          <el-input v-else v-model="typeVal" disabled />
        </el-form-item>
        <el-form-item v-if="form.type==2" label="按钮标识：" prop="btnMark">
          <el-input
            v-model="form.btnMark" :disabled="operationType=='edit'&&form.btnMark" placeholder="只支持大小写英文和数字，最长10字符"
            maxlength="10"
          />
        </el-form-item>
        <el-form-item label="请求地址：" prop="reqAddress">
          <el-input v-model="form.reqAddress" placeholder="填写请求地址" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="form.sort" placeholder="填写排序" />
        </el-form-item>
        <el-form-item label="显示状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">
              显示
            </el-radio>
            <el-radio :label="1">
              隐藏
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标：">
          <el-upload
            class="image-uploader"
            :action="serveUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :on-error="handleImageFail"
            :before-upload="beforeImageUpload"
          >
            <el-image v-if="form.imageUrl" class="form-image" :src="form.imageUrl"></el-image>
            <el-button v-else size="small" icon="el-icon-upload">
              请选择图标
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            rows="3"
            placeholder="填写备注，最长50字符"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" class="w90" @click="submit('form')">
        提交
      </el-button>
      <el-button
        type="primary" plain class="w90"
        @click="cancel"
      >
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
import Host from '../../../config/apiHost'
import Server from '../../../API/system'
const validateBtnMark = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9_\-]*$/g
  if (
    value.trim() === '' ||
    value.trim() === null ||
    value.trim() === undefined
  ) {
    return callback(new Error('请输入按钮标识'))
  } else if (!reg.test(value)) {
    return callback(new Error('抱歉只支持大小写英文和数字'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      serveUrl: `${Host.uploadImgHost}/boss/message/upload`,
      operationType: 'add', // add 为新增系统菜单 edit 为修改系统菜单
      typeVal: '',
      menuId: '',
      isDisabled: false,
      isShowRadio: false,
      form: {
        parentMenu: '',
        name: '',
        type: 1,
        reqAddress: '',
        sort: 1,
        status: 0,
        imageUrl: '',
        remarks: '',
        btnMark: '' // 按钮的唯一标识
      },
      parentMenuId: '',
      rules: {
        parentMenu: [
          { required: true, message: '请输入父级菜单', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        btnMark: [
          { required: true, validator: validateBtnMark, trigger: 'blur' }
        ]
      },
      headers: {
        token: localStorage.bossadmin_user
          ? JSON.parse(localStorage.bossadmin_user).token || ''
          : ''
      }
    }
  },
  created: function () {
    this.handleQuery()
  },
  beforeRouteEnter (to, from, next) {
    const query = to.query
    if (query.detail) {
      to.meta.bname = '编辑'
    } else {
      to.meta.bname =
        parseInt(query.level) === 1 ? '新增同级菜单' : '新增子级菜单'
    }
    next()
  },
  methods: {
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addSystemMenu()
        } else {
          return false
        }
      })
    },
    addSystemMenu () {
      const _str = this.operationType === 'add' ? 'createUser' : 'updateUser'
      const data = {
        pId: this.parentMenuId,
        name: this.form.name,
        mType: this.form.type,
        mUrl: this.form.reqAddress,
        sort: this.form.sort,
        isEnable: this.form.status,
        mIcon: this.form.imageUrl,
        remark: this.form.remarks,
        [_str]:
          JSON.parse(localStorage.getItem('bossadmin_user') || '{}').id || ''
      }
      if (this.operationType === 'edit' && this.menuId) {
        Object.assign(data, {
          id: this.menuId
        })
      }
      if (data.mType === 2) {
        Object.assign(data, {
          identifier: this.form.btnMark
        })
      }
      Server[`${this.operationType}SystemMenu`](data).then(res => {
        const msg = this.operationType === 'edit' ? '系统菜单信息修改成功' : '系统新建成功'
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
        this.cancel()
      })
    },
    menuTypeFl (type) {
      let value = ''
      switch (parseInt(type)) {
        case 0:
          value = '目录'
          break
        case 1:
          value = '页面'
          break
        default:
          value = '按钮'
          break
      }
      return value
    },
    cancel () {
      this.$router.push({
        path: '/system/systemMenu'
      })
    },
    // 处理新增系统菜单
    handleAdd () {
      const {
        menuName,
        menuType,
        level,
        reqAddress,
        parentMenuId,
        id
      } = this.$route.query
      this.menuLevel = level // 1 同级菜单 2 子级菜单
      this.parentMenuId = parseInt(level) === 1 ? parentMenuId : id
      this.isDisabled = true
      this.form.parentMenu = parseInt(level) === 1 ? '无' : menuName
      this.form.type = menuType
      this.form.reqAddress = reqAddress
      this.isShowRadio = !!(parseInt(level) === 2 && parseInt(menuType) === 0)
      if (parseInt(level) === 2) this.form.type = menuType === 0 ? 1 : 2
      this.typeVal = this.menuTypeFl(this.form.type)
    },
    // 处理编辑系统菜单
    handleEdit (item) {
      const data = JSON.parse(decodeURI(item))
      this.parentMenuId = data.pId
      this.menuId = data.id
      this.isDisabled = true
      this.form.parentMenu = data.pName ? data.pName : '无'
      this.form.name = data.name
      this.form.type = data.mType
      this.form.sort = data.sort
      this.form.status = data.isEnable
      this.form.reqAddress = data.mUrl
      this.form.remarks = data.remark
      this.form.imageUrl = data.mIcon
      this.form.btnMark = data.identifier || ''
      this.typeVal = this.menuTypeFl(data.mType)
    },
    handleQuery () {
      const detail = this.$route.query.detail || ''
      if (detail) {
        this.operationType = 'edit'
        this.handleEdit(detail)
      } else {
        this.handleAdd()
      }
    },
    handleImageSuccess (res, file) {
      this.form.imageUrl = res.result
    },
    handleImageFail (err) {
      this.$message({
        showClose: true,
        message: '图片上传失败请重新上传',
        type: 'error'
      })
      this.form.imageUrl = ''
      console.log(err)
    },
    beforeImageUpload (file) {
      const isTYPE = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10k = file.size / 1024 < 10
      if (!isTYPE) {
        this.$message.error('上传图片格式只能为JPG或PNG格式')
      } else if (!isLt10k) {
        this.$message.error('上传头像图片大小不能超过 10k')
      } else {
        this.imageLoading = true
      }
      return isTYPE && isLt10k
    }
  }
}
</script>

<style lang="less" scoped>
.add-system {
  height: 100%;
  padding: 20px;
  background-color: #fff;
  box-sizing: border-box;
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
        color: #e02020;
      }
    }
  }
  .mainAdd {
    border: 1px solid #e6e6e6;
    border-top: none;
    .formStyle {
      width: 550px;
      margin: 0 auto;
      padding: 40px 0 18px 0;
    }
  }
  .footer {
    text-align: center;
    padding: 50px 0;
    .w90 {
      width: 90px;
    }
  }
}
</style>
<style lang="less">
.add-system {
  .mainAdd {
    .el-input,
    .el-select,
    .el-textarea {
      width: 380px;
    }
    .el-form-item__label {
      padding-right: 20px;
    }
  }
}
.image-uploader {
  line-height: 10px;
}
.form-image {
  padding-top: 12px;
  img {
    max-width: 16px;
    max-height: 16px;
  }
}
</style>
