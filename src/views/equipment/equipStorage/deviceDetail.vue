<template>
  <div class="container">
    <div class="main-container">
      <div class="card-container">
        <div class="title">
          <el-row>
            <el-col :span="12">
              设备信息
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <el-row>
            <el-form
              ref="formDataTop" :rules="rules" label-width="150px"
              :model="formData"
              :disabled="isview ? true : false"
            >
              <el-col :span="9">
                <el-form-item v-if="showGroup" label="设备组名称：">
                  <el-input v-model="formData.groupName" disabled></el-input>
                </el-form-item>
                <el-form-item label="设备名称：" prop="name">
                  <el-input v-model="formData.name" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="流量卡号：" prop="card">
                  <el-input v-model="formData.card" placeholder="请填写流量卡号" clearable></el-input>
                </el-form-item>
                <el-form-item label="运营商：" prop="cardType">
                  <el-select
                    v-model="formData.cardType"
                    placeholder="请选择运营"
                    clearable
                  >
                    <el-option label="电信" value="0"></el-option>
                    <el-option label="移动" value="1"></el-option>
                    <el-option label="联通" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备类型：" prop="scenario">
                  <el-select
                    v-model="formData.scenario"
                    placeholder="全部"
                    clearable
                    @change="changeType"
                  >
                    <el-option
                      v-for="(item, index) of equipTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备型号：" prop="categoryNum">
                  <el-select
                    v-model="formData.categoryNum"
                    placeholder="全部"
                    clearable
                    @change="getTableData"
                  >
                    <el-option
                      v-for="(item, index) of markList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item label="默认回收价格：" required>
                  <el-col :span="20">
                    <el-table
                      style="width: 100%"
                      :data="tableData"
                      border
                    >
                      <el-table-column
                        prop="dataValue"
                        label="回收分类"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="ruleValue"
                        label="默认产生金额单价（元/千克）"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <div v-if="isview" class="table-input">
                            {{ scope.row.ruleValue }}
                          </div>
                          <el-input
                            v-if="!isview" v-model="scope.row.ruleValue" class="table-input"
                            onkeyup="value=value==''?0:value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="ruleKey"
                        label="产生金额起始重量（千克）"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <div v-if="isview" class="table-input">
                            {{ scope.row.ruleKey }}
                          </div>
                          <el-input
                            v-if="!isview" v-model="scope.row.ruleKey" class="table-input"
                            onkeyup="value=value==''?0:value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                          ></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
      </div>
      <div class="card-container two">
        <div class="title">
          <el-row>
            <el-col :span="12">
              智能硬件
            </el-col>
            <el-col v-if="!isview" :span="12" align="right">
              <el-button
                type="primary" icon="el-icon-plus" plain
                size="medium"
                @click="addHardware"
              >
                智能硬件
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div v-for="(item, index) in hardwareArray" :key="index" class="content two">
          <div class="card-item">
            <div class="title">
              <el-row>
                <el-col :span="12">
                  <!-- eslint-disable-next-line -->
                  <i class="iconfont icon" v-html="item.icon"></i>
                  {{ item.title }}
                </el-col>
                <el-col v-if="!isview" :span="12" align="right">
                  <a class="el-icon-close close" href="javascript:;" @click="deleteCard(index)"></a>
                </el-col>
              </el-row>
            </div>
            <div class="content">
              <el-row>
                <el-form
                  :inline="true"
                  label-width="120px"
                  :model="hardwareArray[index]"
                  :disabled="isview ? true : false"
                >
                  <el-col v-for="(content, num) in item.inputArray" :key="num" :span="8">
                    <template v-if="content.type === 'text'">
                      <el-form-item
                        :label="content.label"
                        :required="content.label=='备注：'?false:true"
                      >
                        <el-input
                          v-model="hardwareArray[index][content.prop]"
                          :placeholder="content.placeHolder"
                          clearable
                        ></el-input>
                      </el-form-item>
                    </template>
                    <template v-if="content.type === 'select'">
                      <el-form-item v-if="isPosition" :label="content.label" required>
                        <el-select
                          v-model="hardwareArray[index][content.prop]"
                          clearable
                        >
                          <el-option label="主控" value="0"></el-option>
                          <el-option label="左" value="1"></el-option>
                          <el-option label="右" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-col>
                </el-form>
              </el-row>
            </div>
          </div>
        </div>
        <div
          v-if="hardwareArray.length === 0"
          class="empty-data"
          align="center"
        >
          暂无智能硬件
        </div>
      </div>
      <div class="footer">
        <template v-if="isview">
          <el-button
            type="primary" class="w90" @click="cancel"
          >
            返回
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" class="w90" @click="submit">
            提交
          </el-button>
          <el-button
            class="w90" @click="cancel"
          >
            取消
          </el-button>
        </template>
      </div>
    </div>
    <el-dialog
      title="选择绑定智能硬件类型"
      :visible.sync="dialogObj.dialogVisible"
      width="510px"
    >
      <el-radio-group v-model="dialogObj.radio">
        <el-radio v-for="(item, index) in deviceRadioList" :key="index" :label="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer footer">
        <el-button type="primary" @click="chooseConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { httpPost } from '@/API/request/index'
export default {
  components: {
  },
  data () {
    return {
      showGroup: false,
      isview: false,
      isPosition: false, // 只有回收站智能硬件有主板位置
      formData: {
        name: '',
        card: '',
        cardType: '',
        scenario: '',
        categoryNum: ''
      },
      rules: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        scenario: [
          { required: true, message: '设备类型不能为空', trigger: 'change' }
        ],
        categoryNum: [
          { required: true, message: '设备型号不能为空', trigger: 'change' }
        ],
        cardType: [
          { required: true, message: '运营商不能为空', trigger: 'change' }
        ],
        card: [
          { required: true, message: '流量卡号不能为空', trigger: 'blur' }
        ]
      },
      equipTypeList: [], // 设备类型
      markList: [], // 设备型号
      tableData: [],
      hardwareArray: [],
      deviceRadioList: [],
      dialogObj: {
        dialogVisible: false,
        radio: ''
      },
      hardsoftType: {
        mainboard: {
          type: '3',
          title: '智能主板RECOS',
          icon: '&#xe606;',
          inputArray: [
            {
              type: 'text',
              label: '硬件名称：',
              placeHolder: '请输入硬件名称',
              prop: 'name'
            },
            {
              type: 'text',
              label: 'MAC地址：',
              placeHolder: '请输入设备mac地址',
              prop: 'mac'
            },
            {
              type: 'select',
              label: '位置：',
              placeHolder: '',
              prop: 'position'
            },
            {
              type: 'text',
              label: '备注：',
              placeHolder: '请填写备注',
              prop: 'remark'
            }
          ]
        },
        code: {
          type: '5',
          title: '二维码',
          icon: '&#xe607;',
          inputArray: [
            {
              type: 'text',
              label: '硬件名称：',
              placeHolder: '请输入硬件名称',
              prop: 'name'
            },
            {
              type: 'text',
              label: 'MAC地址：',
              placeHolder: '请输入设备mac地址',
              prop: 'mac'
            },
            {
              type: 'text',
              label: '备注：',
              placeHolder: '请填写备注',
              prop: 'remark'
            }
          ]
        },
        camera: {
          type: '0',
          title: '海康摄像头',
          icon: '&#xe604;',
          inputArray: [
            {
              type: 'text',
              label: '设备名称：',
              placeHolder: '请输入设备名称',
              prop: 'name'
            },
            {
              type: 'text',
              label: 'IP地址：',
              placeHolder: '请输入设备ip地址',
              prop: 'ip'
            },
            {
              type: 'text',
              label: '密码：',
              placeHolder: '请输入密码，默认hz128128',
              prop: 'password'
            },
            {
              type: 'text',
              label: '备注：',
              placeHolder: '请填写备注',
              prop: 'remark'
            }
          ]
        },
        coin: {
          type: '4',
          title: '吐币机',
          icon: '&#xe605;',
          inputArray: [
            {
              type: 'text',
              label: '硬件名称：',
              placeHolder: '请输入硬件名称',
              prop: 'name'
            },
            {
              type: 'text',
              label: '硬币数：',
              placeHolder: '请输入硬币数',
              prop: 'coinNum'
            },
            {
              type: 'text',
              label: '备注：',
              placeHolder: '请填写备注',
              prop: 'remark'
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.$route.query.view) {
        this.isview = true
        this.showGroup = true
        this.getDetail(this.$route.query.view)
      }
      if (this.$route.query.edit) {
        this.isview = false
        this.showGroup = true
        this.getDetail(this.$route.query.edit)
      }
      this.getEquipType()
    },
    getDeviceList () {
      httpPost(this.$basePath.getDict, {
        type: 'device_type'
      })
        .then(res => {
          this.deviceRadioList = res.result
        })
    },
    getEquipType () {
      httpPost(this.$basePath.getDict, {
        type: 'scenario_type'
      })
        .then(res => {
          this.equipTypeList = res.result
        })
    },
    getDetail (id) {
      httpPost(this.$basePath.equipGetDetail, {
        id: id
      })
        .then(res => {
          if (res.result.scenario && res.result.scenario === '2') {
            this.isPosition = true
          } else {
            this.isPosition = false
          }
          this.formData = Object.assign(this.formData, res.result)
          if (this.formData.groupName || this.formData.groupName === '' || this.formData.groupName === undefined) {
            this.formData.groupName = '无'
          }
          this.tableData = res.result.dictList
          this.fillHardware(res.result.deviceList)
          this.findMarkList(res.result.scenario)
        })
    },
    fillHardware (hardsoftList) { // 智能硬件列表
      hardsoftList.forEach((item, index) => {
        switch (item.type) {
          case '0':
            Object.assign(item, this.hardsoftType.camera)
            break
          case '3':
            item.position = item.position + ''
            Object.assign(item, this.hardsoftType.mainboard)
            break
          case '4':
            Object.assign(item, this.hardsoftType.coin)
            break
          case '5':
            Object.assign(item, this.hardsoftType.code)
            break
        }
      })
      this.hardwareArray = hardsoftList
    },
    chooseConfirm () {
      this.dialogObj.dialogVisible = false
      const type = this.dialogObj.radio
      switch (type) {
        case '5':
          this.hardwareArray.push(this.hardsoftType.code)
          break
        case '3':
          this.hardwareArray.push(this.hardsoftType.mainboard)
          break
        case '0':
          this.hardwareArray.push(this.hardsoftType.camera)
          break
        case '4':
          this.hardwareArray.push(this.hardsoftType.coin)
          break
      }
    },
    findMarkList (type) {
      httpPost(this.$basePath.findMarkList, {
        markType: type
      })
        .then(res => {
          this.markList = res.result
        })
    },
    findDataDict (id) {
      httpPost(this.$basePath.findDataDict, {
        markId: id
      })
        .then(res => {
          this.tableData = res.result
        })
    },
    changeType (val) {
      if (val === '2') {
        this.isPosition = true
      } else {
        this.isPosition = false
      }
      this.formData.categoryNum = ''
      this.markList = []
      this.tableData = []
      this.findMarkList(val)
    },
    getTableData (id) {
      this.tableData = []
      this.findDataDict(id)
    },
    addHardware () {
      this.dialogObj.dialogVisible = true
      this.getDeviceList()
    },
    submit () {
      const params = JSON.parse(JSON.stringify(this.formData))
      const deviceList = JSON.parse(JSON.stringify(this.hardwareArray))
      const dictList = JSON.parse(JSON.stringify(this.tableData))
      deviceList.forEach(item => {
        delete item.inputArray
        delete item.icon
        delete item.title
      })
      delete params.groupName
      params.deviceList = deviceList
      params.dictList = dictList
      this.$refs.formDataTop.validate(vaild => {
        if (vaild) {
          httpPost(this.$basePath.equipSave, params)
            .then(res => {
              this.$message({ type: 'success', message: res.msg })
              this.$router.push({
                path: '/equipment/equipStorage'
              })
            })
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/equipment/equipStorage'
      })
    },
    deleteCard (index) {
      this.$confirm('是否确认删除整个编辑卡片？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.hardwareArray.splice(index, 1)
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/varibles.styl'
@import '~@/assets/style/dialog-common.styl'
>>>.el-table tbody tr:hover>td
  background-color #ffffff
>>>.el-form-item
  margin-bottom 17px
>>>.el-table th, >>>.el-table td
  padding 0
  height 33px
  line-height 33px
  color #333333
  font-weight 500
  font-size 12px
>>>.el-table th
  background-color #F3F8FF
>>>.el-table .cell
  padding 0
.table-input >>>.el-input__inner
  border none
  outline none
  text-align center
  height 28px
.empty-data
  line-height 60px
  text-align center
  color #909399
  border-bottom 1px #E6E6E6 solid
.container
  background-color #ffffff
  .main-container
    padding 20px 20px 0 20px
    .footer
      text-align center
      padding 50px 0
      .w90
        width 90px
    .card-container
      border 1px #E6E6E6 solid
      &.two
        margin-top 19px
        border-bottom none
      .title
        height 52px
        line-height 52px
        padding-left 22px
        padding-right 18px
        font-size 16px
        border-bottom 1px #E6E6E6 solid
        font-weight 600
        .icon
          color #4C8CF8
          font-weight normal
          margin-right 10px
      .content
        margin-top 26px
        >>>.el-input
          width 210px
        &.two
          margin-top 0
          .title
            height 52px
            line-height 52px
            background-color #F3F8FF
            font-size 14px
           .close
            color #666666
            font-size 20px
            line-height 52px
          .content
            margin-top 0
            padding-top 18px
            border-bottom 1px #E6E6E6 solid
            >>>.el-form-item__content
              width 230px
</style>
