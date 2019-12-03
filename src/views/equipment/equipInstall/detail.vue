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
              ref="dataForm"
              label-width="150px" :rules="rules" :model="formData"
              :disabled="isview ? true : false"
            >
              <el-col :span="16">
                <el-col :span="12">
                  <el-form-item label="设备组名称：">
                    <el-input v-model="formData.groupName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="设备名称：">
                    <el-input v-model="formData.name" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="设备类型：">
                    <el-select
                      v-model="formData.scenario" placeholder="全部" clearable
                      disabled
                    >
                      <el-option
                        v-for="(item, index) of equipTypeList" :key="index"
                        :label="item.label" :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="设备型号：">
                    <el-input v-model="formData.productMark.key" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="绑定区域：" prop="region">
                    <el-cascader
                      v-if="formData.region.length"
                      ref="selectArea"
                      v-model="formData.region"
                      placeholder="请选择省市区及街道"
                      :props="props"
                      @change="changeArea"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="小区：" prop="estate">
                    <el-select
                      v-model="formData.estate" placeholder="请选择小区"
                      @change="changeEstate"
                    >
                      <el-option
                        v-for="(item, index) of estateList" :key="index"
                        :label="item.housingEstate" :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="详细地址：" prop="address"
                  >
                    <el-input v-model="formData.address" placeholder="请填写详细地址" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="设备坐标：" prop="pos">
                    <el-input
                      v-model="formData.pos" placeholder="请选择经纬度" readonly
                      @click.native="chooseSite"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <template v-if="type == 2">
                    <el-form-item label="默认工作时间：" required>
                      <el-radio-group v-model="time">
                        <el-radio :label="0">
                          全天
                        </el-radio>
                        <el-radio :label="1">
                          白天（6:00-20:00）
                        </el-radio>
                        <el-radio :label="2">
                          夜间（20：00-6：00）
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
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
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
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
                                onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,7})?).*$/g, '$1')"
                              ></el-input>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-form-item>
                  </template>
                </el-col>
              </el-col>
              <el-col :span="8">
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
                <el-form-item label="归属管理员：" required>
                  <el-select v-model="formData.operation" placeholder="全部">
                    <el-option
                      v-for="(item, index) of operateList" :key="index"
                      :label="item.nickName" :value="item.id"
                    ></el-option>
                  </el-select>
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
          <el-button type="primary" class="w90" @click="getParams">
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
    <siteChoose
      ref="map"
      :map-dialog-obj="mapDialogObj"
      @getPosition="getPosition"
    />
  </div>
</template>

<script>
import siteChoose from './siteChoose.vue'
import { httpPost } from '@/API/request/index'
export default {
  components: {
    siteChoose
  },
  data () {
    var self = this
    return {
      operateList: [],
      isPosition: false,
      regionLabel: [],
      time: 0,
      rules: {
        region: [
          { required: true, message: '区域不能为空', trigger: 'change' }
        ],
        estate: [
          { required: true, message: '小区不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        cardType: [
          { required: true, message: '运营商不能为空', trigger: 'change' }
        ],
        card: [
          { required: true, message: '卡号不能为空', trigger: 'blur' }
        ],
        pos: [
          { required: true, message: '坐标不能为空', trigger: 'blur' }
        ]
      },
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          if (level >= 3) {
            httpPost(self.$basePath.getStreet, { areaId: node.value })
              .then(res => {
                resolve(res.result.map(item => (
                  {
                    value: item.id,
                    label: item.street,
                    leaf: level >= 3
                  }
                )))
              })
          } else {
            httpPost(self.$basePath.findByParentId, { pId: node.value || '1' })
              .then(res => {
                resolve(res.result.map(item => (
                  {
                    value: item.id,
                    label: item.name,
                    leaf: level >= 3
                  }
                )))
              })
          }
        }
      },
      isview: false,
      type: 1,
      formData: {
        groupName: '',
        name: '',
        scenario: '',
        productMark: {
          key: ''
        },
        estateName: '',
        address: '',
        pos: '',
        operation: '',
        card: '',
        cardType: '',
        region: [],
        estate: ''
      },
      tableData: [],
      hardwareArray: [],
      dialogObj: {
        dialogVisible: false,
        radio: ''
      },
      mapDialogObj: {
        dialogVisible: false
      },
      center: { lng: 0, lat: 0 },
      zoom: 3,
      searchKeyword: '',
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
      },
      equipTypeList: [],
      estateList: [],
      selectedEstate: {
        id: '',
        housingEstate: ''
      },
      deviceRadioList: []
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.$route.query.view) {
        this.isview = true
      }
      if (this.$route.query.edit) {
        this.isview = false
      }
      // eslint-disable-next-line
      if (this.$route.query.type == 1) {
        this.type = 1
      }
      // eslint-disable-next-line
      if (this.$route.query.type == 2) {
        this.type = 2
      }
      this.getEquipType()
      this.getDetail()
      this.getOperate()
    },
    getEquipType () {
      httpPost(this.$basePath.getDict, {
        type: 'scenario_type'
      })
        .then(res => {
          this.equipTypeList = res.result
        })
    },
    getOperate () {
      httpPost(this.$basePath.findUser, {
        identify: 'operate',
        type: '1'
      })
        .then(res => {
          this.operateList = res.result
        })
    },
    getDetail () {
      const id = this.$route.query.view || this.$route.query.edit
      httpPost(this.$basePath.equipGetDetail, { id: id })
        .then(res => {
          if (res.result.scenario && res.result.scenario === '2') {
            this.isPosition = true
          } else {
            this.isPosition = false
          }
          this.fillHardware(res.result.deviceList)
          res.result.pos = res.result.lo + ',' + res.result.la
          this.formData = Object.assign(this.formData, res.result)
          if (this.formData.groupName || this.formData.groupName === '' || this.formData.groupName === undefined) {
            this.formData.groupName = '无'
          }
          if (res.result.productTime && res.result.productTime.workTime === '0-24') {
            this.time = 0
          }
          if (res.result.productTime && res.result.productTime.workTime === '6-20') {
            this.time = 1
          }
          if (res.result.productTime && res.result.productTime.workTime === '20-6') {
            this.time = 2
          }
          this.tableData = res.result.dictList

          let region = []
          region = res.result.areaIds.split(',')
          this.formData.region = region
          this.formData.estate = res.result.estateId
          this.selectedEstate.id = res.result.estateId
          this.selectedEstate.housingEstate = res.result.estateName
          this.productId = res.result.productId
          this.getEstate(this.formData.region[3])
        })
    },
    getDeviceList () {
      httpPost(this.$basePath.getDict, {
        type: 'device_type'
      })
        .then(res => {
          this.deviceRadioList = res.result
        })
    },
    addHardware () {
      this.dialogObj.dialogVisible = true
      this.getDeviceList()
    },
    getEstate (id) {
      if (!id || id === '' || id === undefined) return
      httpPost(this.$basePath.getEstate, { streetId: id })
        .then(res => {
          this.estateList = []
          res.result.forEach(item => {
            this.estateList.push(item)
          })
        })
    },
    changeArea (val) {
      this.getEstate(val[3])
      this.form.estate = ''
    },
    changeEstate (val) {
      var estateList = this.estateList
      this.selectedEstate = estateList.find(item => { return item.id === val })
    },
    getParams () {
      this.regionLabel = this.$refs.selectArea.getCheckedNodes()[0].pathLabels
      const params = {}
      const deviceList = JSON.parse(JSON.stringify(this.hardwareArray))
      const dictList = JSON.parse(JSON.stringify(this.tableData))
      deviceList.forEach(item => {
        delete item.inputArray
        delete item.icon
        delete item.title
      })
      if (this.type === 2) {
        var productTime = this.formData.productTime
        if (this.time === 0) {
          productTime.workTime = '0-24'
        }
        if (this.time === 1) {
          productTime.workTime = '6-20'
        }
        if (this.time === 2) {
          productTime.workTime = '20-6'
        }
        params.productTime = productTime
      }
      deviceList.forEach(item => {
        if (item.position === 'undefined') {
          delete item.position
        }
      })
      params.deviceList = deviceList
      params.dictList = dictList
      params.provinceId = this.formData.region[0]
      params.provinceName = this.regionLabel[0]
      params.cityId = this.formData.region[1]
      params.cityName = this.regionLabel[1]
      params.areaId = this.formData.region[2]
      params.areaName = this.regionLabel[2]
      params.estateId = this.selectedEstate.id
      params.estateName = this.selectedEstate.housingEstate
      params.address = this.formData.address
      params.lo = this.formData.pos.split(',')[0]
      params.la = this.formData.pos.split(',')[1]
      params.id = this.formData.id
      params.name = this.formData.name
      params.scenario = this.formData.scenario
      params.operation = this.formData.operation
      params.card = this.formData.card
      params.cardType = this.formData.cardType
      params.productId = this.productId
      console.log(params)
      this.submit(params)
    },
    submit (params) {
      this.$refs.dataForm.validate(vaild => {
        if (vaild) {
          httpPost(this.$basePath.equipSave, params)
            .then(res => {
              this.$router.push({
                path: '/equipment/equipInstall'
              })
              this.$message.success('操作成功！')
            })
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/equipment/equipInstall'
      })
    },
    chooseSite () {
      this.mapDialogObj.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.map.initMap()
      })
    },
    getPosition (pos) {
      this.position = pos
      if (pos !== '') {
        this.formData.pos = pos.lng + ',' + pos.lat
      } else {
        this.formData.pos = ''
      }
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
>>>.el-table .cell
  padding 0
  color #666666
>>>.el-table th
  background-color #F3F8FF
.empty-data
  line-height 60px
  text-align center
  color #909399
  border-bottom 1px #E6E6E6 solid
.table-input
  >>>.el-input__inner
    border none
    outline none
    text-align center
    color #666666
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
          width 240px
        &.two
          margin-top 0
          .title
           height 52px
           line-height 52px
           background-color #F3F8FF
           .close
            color #666666
            font-size 20px
            line-height 52px
          .content
            margin-top 0
            padding-top 18px
            border-bottom 1px #E6E6E6 solid
            >>>.el-input
              width 235px
</style>
