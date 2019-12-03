<template>
  <el-dialog
    title="智能硬件"
    width="70%"
    :visible.sync="viewdialogObj.dialogVisible"
  >
    <div class="view-container">
      <template v-for="(item, index) in deviceList">
        <div :key="index" class="card-item">
          <div class="title">
            <el-row>
              <!-- eslint-disable-next-line -->
            <i class="iconfont icon" v-html="item.icon"></i>
              {{ item.title }}
            </el-row>
          </div>
          <div class="content">
            <el-form
              :inline="true" label-width="150px" :model="viewdialogObj.formData"
              :rules="rules"
              disabled
            >
              <el-row>
                <el-col v-for="(content, num) in item.inputArray" :key="num" :span="8">
                  <template v-if="content.type === 'text'">
                    <el-form-item :label="content.label" :required="content.label !== '备注：' ? true : false">
                      <el-input v-model="content.value"></el-input>
                    </el-form-item>
                  </template>
                  <template v-if="content.type === 'select'">
                    <el-form-item v-if="isPosition" :label="content.label" required>
                      <el-select v-model="content.value">
                        <el-option label="主控" value="0"></el-option>
                        <el-option label="左" value="1"></el-option>
                        <el-option label="右" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </template>
      <div
        v-if="deviceList.length === 0"
        class="empty-data"
        align="center"
      >
        暂无智能硬件
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="viewdialogObj.dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { httpPost } from '@/API/request/index'
export default {
  props: {
    viewdialogObj: {
      type: Object,
      default: () => {
        return {
          dialogVisible: false,
          id: '',
          formData: {}
        }
      }
    }
  },
  data () {
    return {
      rules: {},
      isPosition: false, // 只有回收站智能硬件有主板位置
      deviceList: []
    }
  },
  methods: {
    getDetail () {
      httpPost(this.$basePath.equipGetDetail, {
        id: this.viewdialogObj.id
      })
        .then(res => {
          if (res.result.scenario && res.result.scenario === '2') {
            this.isPosition = true
          } else {
            this.isPosition = false
          }
          res.result.deviceList.forEach(item => {
            switch (item.type) {
              case '0':
                item = Object.assign(item, {
                  title: '海康摄像头',
                  icon: '&#xe604;',
                  inputArray: [
                    {
                      type: 'text',
                      label: '设备名称：',
                      placeHolder: '请输入设备名称',
                      value: item.name
                    },
                    {
                      type: 'text',
                      label: 'IP地址：',
                      placeHolder: '请输入设备ip地址',
                      value: item.ip
                    },
                    {
                      type: 'text',
                      label: '密码：',
                      placeHolder: '请输入密码，默认hz128128',
                      value: item.password
                    },
                    {
                      type: 'text',
                      label: '备注：',
                      placeHolder: '请填写备注',
                      value: item.remark
                    }
                  ]
                })
                break
              case '2':
                item = Object.assign(item, {
                  title: '智能主板RECOS',
                  icon: '&#xe606;',
                  inputArray: [
                    {
                      type: 'text',
                      label: '硬件名称：',
                      placeHolder: '请输入硬件名称',
                      value: item.name
                    },
                    {
                      type: 'text',
                      label: 'MAC地址：',
                      placeHolder: '请输入设备mac地址',
                      value: item.mac
                    },
                    {
                      type: 'select',
                      label: '位置：',
                      placeHolder: '',
                      value: item.position + ''
                    },
                    {
                      type: 'text',
                      label: '备注：',
                      placeHolder: '请填写备注',
                      value: item.remark
                    }
                  ]
                })
                break
              case '3':
                item = Object.assign(item, {
                  title: '智能主板RECOS',
                  icon: '&#xe606;',
                  inputArray: [
                    {
                      type: 'text',
                      label: '硬件名称：',
                      placeHolder: '请输入硬件名称',
                      value: item.name
                    },
                    {
                      type: 'text',
                      label: 'MAC地址：',
                      placeHolder: '请输入设备mac地址',
                      value: item.mac
                    },
                    {
                      type: 'select',
                      label: '位置：',
                      placeHolder: '',
                      value: item.position + ''
                    },
                    {
                      type: 'text',
                      label: '备注：',
                      placeHolder: '请填写备注',
                      value: item.remark
                    }
                  ]
                })
                break
              case '4':
                item = Object.assign(item, {
                  title: '吐币机',
                  icon: '&#xe605;',
                  inputArray: [
                    {
                      type: 'text',
                      label: '硬件名称：',
                      placeHolder: '请输入硬件名称',
                      value: item.name
                    },
                    {
                      type: 'text',
                      label: '硬币数：',
                      placeHolder: '请输入硬币数',
                      value: item.coinNum
                    },
                    {
                      type: 'text',
                      label: '备注：',
                      placeHolder: '请填写备注',
                      value: item.remark
                    }
                  ]
                })
                break
              case '5':
                item = Object.assign(item, {
                  title: '二维码',
                  icon: '&#xe607;',
                  inputArray: [
                    {
                      type: 'text',
                      label: '硬件名称：',
                      placeHolder: '请输入硬件名称',
                      value: item.name
                    },
                    {
                      type: 'text',
                      label: 'MAC地址：',
                      placeHolder: '请输入设备mac地址',
                      value: item.mac
                    },
                    {
                      type: 'text',
                      label: '备注：',
                      placeHolder: '请填写备注',
                      value: item.remark
                    }
                  ]
                })
                break
            }
          })
          this.deviceList = res.result.deviceList
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/varibles.styl'
@import '~@/assets/style/dialog-common.styl'
/deep/.el-dialog__body
  padding 30px 0
.empty-data
  line-height 60px
  text-align center
  color #909399
  border-bottom 1px #E6E6E6 solid
.view-container
  border-top 1px #E6E6E6 solid
  /deep/.el-input
    width 200px
.card-item
  border-bottom 1px #E6E6E6 solid
  .content
    margin-top 22px
  .title
    height 40px
    line-height 40px
    background-color #F3F8FF
    border-bottom 1px #E6E6E6 solid
    font-size 14px
    font-weight 700
    padding-left 17px
    .icon
      color #4C8CF8
      font-weight normal
      margin-right 10px
</style>
