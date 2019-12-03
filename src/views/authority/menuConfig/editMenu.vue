<template>
  <div class="editMenu">
    <div class="content">
      <span class="lt">菜单配置</span>
      <span class="fr"><span class="red">* </span>为必填项</span>
    </div>
    <div class="mainAdd">
      <el-form
        ref="menuForm" :model="menuForm" :rules="rules"
        label-width="150px" class="formStyle"
      >
        <el-form-item label="父级菜单：" prop="parentMenu">
          <el-input v-model="menuForm.parentMenu" disabled />
        </el-form-item>
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="填写菜单名称，最长15字符" maxlength="15" />
        </el-form-item>
        <el-form-item label="菜单类型：" prop="menuType">
          <el-input v-model="menuForm.menuType" disabled />
        </el-form-item>
        <el-form-item label="请求地址：" prop="address">
          <el-input v-model="menuForm.address" placeholder="填写请求地址" />
        </el-form-item>
        <el-form-item label="页面路由：" prop="routeUrl">
          <el-input v-model="menuForm.routeUrl" placeholder="填写页面路由" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType==='按钮'" label="按钮标识：" prop="identifier">
          <el-input v-model="menuForm.identifier" placeholder="只支持小写英文和数字，最长15字符" maxlength="15" />
        </el-form-item>
        <el-form-item label="适用类型：" prop="useType">
          <el-select v-model="menuForm.useType" placeholder="选择适用类型">
            <el-option
              v-for="item in useOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="menuForm.sort" placeholder="填写排序" />
        </el-form-item>
        <el-form-item label="显示状态：" prop="showStatus">
          <el-radio-group v-model="menuForm.showStatus">
            <el-radio :label="0">
              显示
            </el-radio>
            <el-radio :label="1">
              隐藏
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标：">
          <span v-if="faName"><i class="fa" :class="'fa-' + faName"></i><span class="faNameTitle">{{ faName }}</span></span>
          <el-button
            size="small" class="uploadContent"
            @click="faIcon()"
          >
            <img src="../../../../static/images/uploadIcon.svg" class="uploadImg">请选择图标
          </el-button>
        </el-form-item>
        <el-form-item label="备注：" prop="desc">
          <el-input
            v-model="menuForm.desc" type="textarea" rows="3"
            placeholder="填写备注，最长50字符" maxlength="50" show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" class="w90" @click="submit('menuForm')">
        提交
      </el-button>
      <el-button
        type="primary" plain class="w90"
        @click="cancel"
      >
        取消
      </el-button>
    </div>
    <el-dialog
      title="图标选择"
      :visible.sync="faDialog"
      top="10vh"
      width="950px"
    >
      <div class="dlContent">
        <el-row>
          <el-col
            v-for="(item, index) in faNameItems" :key="index" class="commonFa" :class="index===selectedIndex ? 'selectedIndex' : ''"
            :span="8" @click.native="changeFaCss(item, index)"
          >
            <i class="fa" :class="'fa-' + item"></i> {{ item }}
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button type="primary" class="w90" @click="faSure()">确定</el-button>
        <el-button class="w90" @click="faDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import fontAwesome from '@/common/fontAwesomeIcons.js'
import Server from '../../../API/authority'
const validateIdentifier = (rule, value, callback) => {
  const reg = /^[a-z0-9_\-]*$/g
  if (
    value.trim() === '' ||
    value.trim() === null ||
    value.trim() === undefined
  ) {
    return callback(new Error('请输入按钮标识'))
  } else if (!reg.test(value)) {
    return callback(new Error('抱歉只支持小写英文和数字'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      menuForm: {
        parentMenu: '',
        parentId: '',
        menuName: '',
        menuType: '',
        mType: '',
        address: '',
        routeUrl: '',
        identifier: '',
        useType: '',
        sort: '',
        showStatus: '',
        desc: ''
      },
      useOptions: [{
        value: 1,
        label: '云平台'
      }, {
        value: 2,
        label: '猫运维APP'
      }, {
        value: 3,
        label: '猫先生APP'
      }],
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        showStatus: [
          { required: true, message: '请选择显示状态', trigger: 'change' }
        ],
        identifier: [
          { required: true, validator: validateIdentifier, trigger: 'blur' }
        ]
      },
      faName: '',
      faDialog: false,
      faNameItems: fontAwesome.fontAwesomeJosn,
      selectedIndex: '',
      selectedItem: '',
      menuId: '',
      menuInfoList: {}
    }
  },
  created () {
    this.menuId = this.$route.query.id
    const obj = {
      id: this.menuId
    }
    this.getMenuInfoList(obj)
  },
  methods: {
    getMenuInfoList (params) {
      Server.showEditMenu(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.menuInfoList = res.result
          this.menuForm.parentMenu = this.menuInfoList.pname ? this.menuInfoList.pname : '无'
          this.menuForm.parentId = this.menuInfoList.pId
          this.menuForm.menuName = this.menuInfoList.name
          this.menuForm.menuType = this.menuInfoList.mType === 0 ? '目录' : this.menuInfoList.mType === 1 ? '页面' : this.menuInfoList.mType === 2 ? '按钮' : ''
          this.menuForm.mType = this.menuInfoList.mType
          this.menuForm.address = this.menuInfoList.mUrl
          this.menuForm.routeUrl = this.menuInfoList.routeUrl
          this.menuForm.identifier = this.menuInfoList.identifier
          this.menuForm.sort = this.menuInfoList.sort
          this.menuForm.desc = this.menuInfoList.remark
          this.menuForm.showStatus = this.menuInfoList.isEnable
          this.menuForm.useType = this.menuInfoList.useType
          this.faName = this.menuInfoList.mIcon
        }
      })
    },
    faIcon () {
      this.faDialog = true
      this.selectedIndex = ''
    },
    faSure () {
      this.faName = this.selectedItem
      this.faDialog = false
    },
    changeFaCss (item, index) {
      this.selectedItem = item
      this.selectedIndex = index
    },
    submit (formName) {
      const userId = this.$store.state.user.user.id
      const params = {
        pId: this.menuForm.parentId,
        name: this.menuForm.menuName,
        mType: this.menuForm.mType,
        mUrl: this.menuForm.address,
        routeUrl: this.menuForm.routeUrl,
        identifier: this.menuForm.identifier,
        sort: Number(this.menuForm.sort),
        isEnable: this.menuForm.showStatus,
        mIcon: this.faName,
        remark: this.menuForm.desc,
        useType: this.menuForm.useType,
        id: this.menuId,
        updateUser: userId
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Server.editMenu(params).then((res) => {
            if (res.code === 0) {
              this.$message.success('菜单信息修改成功')
              this.$router.push({
                path: '/authority/menuConfig'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/authority/menuConfig'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .editMenu {
    padding:20px 20px 0;
    background-color: #fff;
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
    .mainAdd {
      border: 1px solid #e6e6e6;
      border-top: none;
      .formStyle {
        width: 550px;
        margin: 0 auto;
        padding:40px 0 18px 0;
        .uploadContent {
          font-size: 14px;
          color: #999;
          .uploadImg {
            vertical-align: middle;
            padding-right: 10px;
          }
        }
        .faNameTitle {
          padding: 0 10px;
        }
      }
    }
    .footer {
      text-align: center;
      padding: 50px 0;
    }
    .w90 {
      width: 90px;
    }
    .dlContent {
      height: 600px;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;
      .selectedIndex {
        background-color: #4C8CF8;
        color: #fff;
      }
      .commonFa {
        padding: 0 5px 2px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="less">
.editMenu {
  .mainAdd {
    .el-input, .el-select, .el-textarea {
      width: 380px;
    }
    .el-form-item__label {
      padding-right: 20px;
    }
    .el-dialog__body {
      padding: 10px 20px;
    }
    .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
      color: #717276;
      background-color: #f7f9fb;
      border-color: #e6e6e6;
    }
  }
}
</style>
