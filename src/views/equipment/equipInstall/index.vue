<template>
  <div class="container">
    <div class="main-container">
      <div class="search-container">
        <div class="title">
          筛选查询
        </div>
        <el-row class="term">
          <el-form :inline="true" :model="formData" label-width="100px">
            <el-col :span="6">
              <el-form-item label="设备编号：">
                <el-input v-model="formData.productId" placeholder="请输入设备编号" clearable></el-input>
              </el-form-item>
              <el-form-item label="设备组名称：">
                <el-input v-model="formData.groupName" placeholder="请输入设备组名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="安装人员：">
                <el-input v-model="formData.createUser" placeholder="请输入安装人员名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="MAC：">
                <el-input v-model="formData.mac" placeholder="请输入MAC地址" clearable></el-input>
              </el-form-item>
              <el-form-item label="设备类型：">
                <el-select v-model="formData.scenario" placeholder="全部" clearable>
                  <el-option
                    v-for="(item, index) of equipTypeList" :key="index"
                    :label="item.label" :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="安装时间：">
                <el-date-picker
                  v-model="dataTime"
                  type="daterange"
                  size="medium"
                  clearable
                  range-separator="~"
                  unlink-panels
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item> -->
            </el-col>
            <el-col :span="6">
              <el-form-item label="IP：">
                <el-input v-model="formData.ip" placeholder="请输入IP地址" clearable></el-input>
              </el-form-item>
              <el-form-item label="安装状态：">
                <el-select v-model="formData.stockState" placeholder="全部" clearable>
                  <el-option label="待安装" value="3"></el-option>
                  <el-option label="安装完成" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="btn-list">
              <el-form-item>
                <el-button
                  v-has="'equipInstallSearch'"
                  type="primary" icon="el-icon-search" size="medium" @click="handleSearch"
                >
                  查询
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
    <div class="table-container">
      <div class="title">
        <el-row>
          <el-col :span="12">
            设备列表
          </el-col>
        </el-row>
      </div>
      <div class="table-content">
        <tableVue
          v-if="!showTable"
          :loading="loading"
          :table-height="400" border
          :data="[]"
          :columns="[]"
        />
        <tableVue
          v-if="showTable"
          :loading="loading"
          :table-height="400" border
          :data="dataSource"
          :columns="columns"
          :req-params="reqParams"
          :current-page="currentPage"
          :page-size="pageSize" :total-count="totalCount" :has-pagination="hasPagination"
          :set-page="queryData" @on-specific="clickRow" @update:data="tabChange"
          @view="view" @edit="edit" @complete="complete" @reInstall="reInstall"
        />
      </div>
    </div>
    <viewHardsoftPop ref="hardsoftPop" :viewdialog-obj="viewdialogObj" />
    <soltDialog
      :slot-dialog-obj="slotDialogObj"
      class="slot-dialog"
      @confirm-click="comfirmClick"
    >
      <span slot="content">
        <ul class="form-tip">
          <li class="tip-item">
            <span class="tip-txt">4G网络、摄像头、吐币机、广告画面是否正常</span>
          </li>
          <li class="tip-item">
            <span class="tip-txt">投口开启与关闭、收运人员开箱取货是否正常</span>
          </li>
          <li class="tip-item">
            <span class="tip-txt">各类投递数据是否有检测</span>
          </li>
        </ul>
        <el-form
          ref="completeForm" :rules="slotDialogObj.rules" :inline="true"
          :model="slotDialogObj.formData" label-width="150px"
        >
          <el-form-item label="绑定区域：" prop="region">
            <el-cascader
              ref="selectArea"
              v-model="slotDialogObj.formData.region"
              placeholder="请选择省市区及街道"
              :props="slotDialogObj.props"
              clearable
              @change="changeRegion"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="小区：" prop="estateId">
            <el-select
              v-model="slotDialogObj.formData.estateId" placeholder="请选择小区"
              @change="changeEatste"
            >
              <el-option
                v-for="(item, index) of estateList" :key="index"
                :label="item.housingEstate" :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="slotDialogObj.formData.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="设备坐标：" prop="pos">
            <el-input
              v-model="slotDialogObj.formData.pos" placeholder="请选择设备坐标" readonly
              @click.native="chooseSite"
            ></el-input>
          </el-form-item>
          <el-form-item label="归属管理员：" prop="operation">
            <el-select v-model="slotDialogObj.formData.operation" placeholder="全部">
              <el-option
                v-for="(item, index) of operateList" :key="index"
                :label="item.nickName" :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
    </soltDialog>
    <comfirmDialog
      :comfirm-dialog-obj="comfirmDialogObj"
      :is-weight="true"
      @confirm-click="recomfirmClick"
    >
    </comfirmDialog>
    <siteChoose
      ref="map"
      :map-dialog-obj="mapDialogObj"
      @getPosition="getPosition"
    />
  </div>
</template>

<script>
import tableVue from '@/components/table/Table.vue'
import viewHardsoftPop from '../equipStorage/viewHardsoftPop.vue'
import comfirmDialog from '@/components/commonDialog/comfirmDialog.vue'
import soltDialog from '@/components/commonDialog/soltDialog.vue'
import { httpPost } from '@/API/request/index'
import siteChoose from './siteChoose.vue'
export default {
  components: {
    tableVue,
    viewHardsoftPop,
    comfirmDialog,
    soltDialog,
    siteChoose
  },
  data () {
    const self = this
    return {
      showTable: false,
      regionLabel: [],
      dataTime: '',
      equipTypeList: [],
      memberList: [],
      operateList: [],
      formData: {
        productId: '',
        mac: '',
        ip: '',
        groupName: '',
        scenario: '',
        startTime: '',
        endTime: '',
        stockState: ''
      },
      loading: false,
      hasPagination: true,
      currentPage: 1, // 默认当前第一页
      pageSize: 10, // 默认每页20条数据
      reqParams: { // 查询、分页条件
        url: '',
        params: {}
      },
      totalCount: 0, // 表格总记录数
      columns: [
        {
          label: '设备名称',
          prop: 'name',
          columnsProps: {
            minWidth: 200
          }
        },
        {
          label: '设备类型',
          prop: 'scenarioName',
          columnsProps: {
            minWidth: 150
          }
        },
        {
          label: '设备型号',
          prop: 'productMark',
          columnsProps: {
            minWidth: 200
          },
          formatter (col, row, val) {
            if (val) {
              return val.name
            } else {
              return ''
            }
          }
        },
        {
          label: '设备编号',
          prop: 'productId',
          columnsProps: {
            minWidth: 200
          }
        },
        {
          label: '智能硬件',
          prop: 'hardwareNum',
          columnsProps: {
            type: 'alink',
            minWidth: 150
          }
        },
        {
          label: '设备组名称',
          prop: 'groupName',
          columnsProps: {
            minWidth: 200
          }
        },
        {
          label: '安装人员',
          prop: 'createUser',
          columnsProps: {
            minWidth: 150
          }
        },
        {
          label: '安装状态',
          prop: 'stockState',
          columnsProps: {
            minWidth: 150
          },
          formatter (col, row, val) {
            if (val === 3) {
              return '待安装'
            }
            if (val === 4) {
              return '安装完成'
            }
          }
        },
        {
          label: '绑定区域',
          prop: 'address',
          columnsProps: {
            type: 'popover',
            minWidth: 180
          }
        },
        {
          label: '运营人员',
          prop: 'operation',
          columnsProps: {
            minWidth: 150
          }
        },
        {
          label: '操作',
          prop: 'operation',
          fixed: 'right',
          columnsProps: {
            type: 'install',
            minWidth: 200
          }
        }
      ],
      dataSource: [],
      estateList: [],
      viewdialogObj: {
        dialogVisible: false,
        id: [],
        formData: {}
      },
      slotDialogObj: {
        dialogVisible: false,
        id: '',
        title: '安装确认',
        props: {
          lazy: true,
          lazyLoad (node, resolve) {
            node.value = node.value ? node.value : '1'
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
              httpPost(self.$basePath.findByParentId, { pId: node.value })
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
        formData: {
          areas: '',
          estateId: '',
          address: '',
          pos: '',
          operation: '',
          region: []
        },
        rules: {
          region: [
            { required: true, message: '区域不能为空', trigger: 'change' }
          ],
          estateId: [
            { required: true, message: '小区不能为空', trigger: 'change' }
          ],
          address: [
            { required: true, message: '地址不能为空', trigger: 'blur' }
          ],
          pos: [
            { required: true, message: '坐标不能为空', trigger: 'change' }
          ],
          operation: [
            { required: true, message: '人员不能为空', trigger: 'change' }
          ]
        }
      },
      comfirmDialogObj: {
        dialogVisible: false,
        title: '重装提示'
      },
      mapDialogObj: {
        dialogVisible: false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // this.getMember()
      this.getEquipType()
      this.getTableData()
    },
    getMember () {
      httpPost(this.$basePath.findUser, {
        identify: 'aftersale',
        type: '2'
      })
        .then(res => {
          this.memberList = res.result
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
    getTableData () {
      this.loading = true
      const params = {
        pageIndex: 1,
        pageSize: this.pageSize,
        queryParams: this.formData
      }
      this.reqParams.url = this.$basePath.equipGetList
      this.reqParams.params = params
      httpPost(this.$basePath.equipGetList, params)
        .then(res => {
          this.loading = false
          this.showTable = true
          this.dataSource = res.result.data
          this.totalCount = res.result.totalCount
          this.currentPage = 1
        })
        .catch(() => {
          this.loading = false
          this.showTable = true
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
    queryData (page, size) { // 前端查询
      this.dataSource = this.data.filter((u, index) => index < size * page && index >= size * (page - 1))
    },
    tabChange (msg) {
      const tmp = JSON.parse(msg)
      this.currentPage = tmp.currentPage
      this.dataSource = tmp.arr
      this.totalCount = tmp.totalCount
    },
    handleSearch () {
      this.getTableData()
    },
    clickRow (row) {
      this.viewdialogObj.dialogVisible = true
      this.viewdialogObj.id = row.id
      this.$refs.hardsoftPop.getDetail()
    },
    view (row) {
      if (row.scenario === '1') { // 智能垃圾箱
        this.$router.push({
          path: '/equipment/equipInstall/detail',
          query: {
            view: row.id,
            type: 1
          }
        })
      }
      if (row.scenario === '2') { // 垃圾回收站
        this.$router.push({
          path: '/equipment/equipInstall/detail',
          query: {
            view: row.id,
            type: 2
          }
        })
      }
    },
    edit (row) {
      if (row.scenario === '1') { // 垃圾箱
        this.$router.push({
          path: '/equipment/equipInstall/detail',
          query: {
            edit: row.id,
            type: 1
          }
        })
      }
      if (row.scenario === '2') { // 回收站
        this.$router.push({
          path: '/equipment/equipInstall/detail',
          query: {
            edit: row.id,
            type: 2
          }
        })
      }
    },
    reInstall (row) {
      this.comfirmDialogObj = {
        dialogVisible: false,
        title: '重装提示',
        dlTitle: '是否确定将此设备重装',
        dlMain: '确定后此设备将返回设备出库变为待出库状态！',
        src: require('static/images/qmark.png'),
        id: row.id
      }
      this.comfirmDialogObj.dialogVisible = true
    },
    recomfirmClick () { // 重装
      httpPost(this.$basePath.equipUpdateProduct, {
        id: this.comfirmDialogObj.id,
        stockState: 3
      })
        .then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.comfirmDialogObj.dialogVisible = false
          this.getTableData()
        })
    },
    complete (row) {
      this.slotDialogObj.dialogVisible = true
      this.slotDialogObj.id = row.id
      this.getOperate()
      this.$nextTick(() => {
        this.$refs.completeForm.resetFields()
      })
      this.slotDialogObj.formData = {
        areas: '',
        estateId: '',
        address: '',
        pos: '',
        operation: '',
        region: []
      }
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
    changeRegion (val) {
      this.getEstate(val[3])
      this.slotDialogObj.formData.estateId = ''
    },
    changeEatste (val) {
      this.selectedEstate = this.estateList.find(item => {
        return item.id === val
      })
    },
    comfirmClick () { // 安装完成
      this.$refs.completeForm.validate(valid => {
        if (valid) {
          const params = {}
          this.regionLabel = this.$refs.selectArea.getCheckedNodes()[0].pathLabels
          params.id = this.slotDialogObj.id
          params.provinceId = this.slotDialogObj.formData.region[0]
          params.provinceName = this.regionLabel[0]
          params.cityId = this.slotDialogObj.formData.region[1]
          params.cityName = this.regionLabel[1]
          params.areaId = this.slotDialogObj.formData.region[2]
          params.areaName = this.regionLabel[2]
          params.estateId = this.selectedEstate.id
          params.estateName = this.selectedEstate.housingEstate
          params.address = this.slotDialogObj.formData.address
          params.operation = this.slotDialogObj.formData.operation
          params.lo = this.position.lng
          params.la = this.position.lat
          params.stockState = 4
          httpPost(this.$basePath.equipUpdateProduct, params)
            .then(res => {
              this.slotDialogObj.dialogVisible = false
              this.$message.success('操作成功！')
              this.getTableData()
            })
        }
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
        this.slotDialogObj.formData.pos = pos.lng + ',' + pos.lat
      } else {
        this.slotDialogObj.formData.pos = ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.slot-dialog
  /deep/.el-input
    width 220px
.search-container
  /deep/.el-input
    width 180px
.container
  background-color #ffffff
  min-width 1350px
  .main-container
    padding 20px 20px 0 20px
    .search-container
      border 1px #E6E6E6 solid
      .title
        height 52px
        line-height 52px
        border-bottom 1px #E6E6E6 solid
        padding-left 22px
        font-size 16px
      .term
        padding 27px 18px 0 22px
        box-sizing border-box
        .btn-list
          height 186px
          display flex
          align-items center
          justify-content flex-end
  .table-container
    padding 20px 20px 0 20px
    .title
      height 52px
      line-height 52px
      border-top 1px #E6E6E6 solid
      border-right 1px #E6E6E6 solid
      border-left 1px #E6E6E6 solid
      padding-left 22px
      padding-right 18px
      font-size 16px
  .form-tip
    width 80%
    margin 0 auto
    height 94px
    background-color #FDF6F6
    border 1px solid #E02020
    margin-bottom 25px
    display flex
    flex-direction column
    align-items left
    justify-content center
    .tip-item
      margin-bottom 6px
      color #E02020
      .tip-txt
        color #666666
</style>
