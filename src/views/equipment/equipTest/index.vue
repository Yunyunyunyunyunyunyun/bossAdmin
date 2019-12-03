<template>
  <div class="container">
    <div class="main-container">
      <div class="card-container">
        <div class="title">
          筛选查询
        </div>
        <el-row class="term">
          <el-form :inline="true" :model="formData" label-width="120px">
            <el-col :span="6">
              <el-form-item label="设备组名称：">
                <el-input v-model="formData.groupName" placeholder="请输入设备组名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="MAC：">
                <el-input v-model="formData.mac" placeholder="请输入MAC地址" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型：">
                <el-select v-model="formData.scenario" placeholder="全部" clearable>
                  <el-option
                    v-for="(item, index) of equipTypeList" :key="index"
                    :label="item.label" :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="IP：">
                <el-input v-model="formData.ip" placeholder="请输入IP地址" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编号：">
                <el-input v-model="formData.productId" placeholder="请输入设备编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="btn-list">
              <el-form-item>
                <el-button
                  v-has="'equipTestSearch'"
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
          v-if="!showTable" border
          :loading="loading"
          :table-height="400"
          :data="[]"
          :columns="[]"
        />
        <tableVue
          v-if="showTable" border
          :loading="loading"
          :table-height="400"
          :data="dataSource"
          :columns="columns"
          :req-params="reqParams"
          :current-page="currentPage"
          :page-size="pageSize" :total-count="totalCount" :has-pagination="hasPagination"
          :set-page="queryData" @on-specific="clickRow" @update:data="tabChange"
          @testPass="testPass" @openDoor="openDoor" @addCoin="addCoin"
        />
      </div>
    </div>
    <viewHardsoftPop ref="hardsoftPop" :viewdialog-obj="viewdialogObj" />
    <comfirmDialog
      :comfirm-dialog-obj="comfirmDialogObj"
      :is-weight="isWeight"
      :loading="isLoading"
      @confirm-click="comfirmClick"
    >
    </comfirmDialog>
    <soltDialog
      :slot-dialog-obj="slotDialogObj"
      @confirm-click="comfirmAdd"
    >
      <div slot="content">
        <el-form
          ref="addForm" :rules="slotDialogObj.rules" :inline="true"
          :model="slotDialogObj" label-width="150px"
        >
          <el-form-item label="现有硬币数量：">
            <el-input v-model="slotDialogObj.coin" disabled></el-input>
          </el-form-item>
          <el-form-item label="新增硬币数量：" prop="coinNum">
            <el-input
              v-model="slotDialogObj.coinNum" placeholder="请冲入充值硬币数量"
              onkeyup="value=value.replace(/[^0-9]/g,'')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </soltDialog>
  </div>
</template>

<script>
import tableVue from '@/components/table/Table.vue'
import viewHardsoftPop from '../equipStorage/viewHardsoftPop.vue'
import comfirmDialog from '@/components/commonDialog/comfirmDialog.vue'
import soltDialog from '@/components/commonDialog/soltDialog.vue'
import { httpPost } from '@/API/request/index'
export default {
  components: {
    tableVue,
    viewHardsoftPop,
    comfirmDialog,
    soltDialog
  },
  data () {
    return {
      showTable: false,
      loading: false,
      groupMark: [],
      equipTypeList: [],
      formData: {
        scenario: '',
        productId: '',
        mac: '',
        ip: '',
        stockState: 1
      },
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
            minWidth: 160
          }
        },
        {
          label: '智能硬件',
          prop: 'hardwareNum',
          columnsProps: {
            minWidth: 150,
            type: 'alink'
          }
        },
        {
          label: '入库人员',
          prop: 'createUser',
          columnsProps: {
            minWidth: 150
          }
        },
        {
          label: '入库时间',
          prop: 'createTime',
          columnsProps: {
            minWidth: 200
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
          label: '操作',
          prop: 'productMark',
          fixed: 'right',
          columnsProps: {
            type: 'btnTest',
            minWidth: 200
          }
        }
      ],
      dataSource: [],
      viewdialogObj: {
        dialogVisible: false,
        id: [],
        formData: {}
      },
      comfirmDialogObj: {
        dialogVisible: false,
        title: '删除提示',
        dlTitle: '是否确定删除此设备',
        dlMain: '',
        src: require('static/images/qmark.png')
      },
      slotDialogObj: {
        title: '进行补币',
        dialogVisible: false,
        coin: 0,
        coinNum: '',
        rules: {
          coinNum: [
            { required: true, message: '请输入硬币数量', trigger: 'blur' }
          ]
        }
      },
      isWeight: false,
      isLoading: false,
      dialogParams: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getEquipType()
      this.getTableData()
    },
    getAllGroupMark () { // 获取设备组
      httpPost(this.$basePath.equipProductMark)
        .then(res => {
          this.groupMark = res.result
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
      this.viewdialogObj.dialogVisible = true
      this.viewdialogObj.id = row.id
      this.$refs.hardsoftPop.getDetail()
    },
    testPass (row) {
      this.comfirmDialogObj = {
        dialogVisible: false,
        title: '测试通过确认',
        dlTitle: '4G网络是否正常、投口开启是否正常、吐币机正常吐币、 广告屏幕正常、监控摄像头正常',
        dlMain: '',
        src: require('static/images/qmark_1.png')
      }
      this.isWeight = false
      this.comfirmDialogObj.dialogVisible = true
      this.dialogParams.type = '1'
      this.dialogParams.id = row.id
    },
    openDoor (row) {
      this.comfirmDialogObj = {
        dialogVisible: false,
        title: '开箱提示',
        dlTitle: '是否确定打开箱体门？',
        dlMain: '',
        src: require('static/images/qmark.png')
      }
      this.isWeight = true
      this.comfirmDialogObj.dialogVisible = true
      this.dialogParams.type = '2'
      this.dialogParams.id = row.id
    },
    comfirmClick () {
      if (this.dialogParams.type === '1') { // 测试通过
        httpPost(this.$basePath.equipUpdateProduct, {
          id: this.dialogParams.id,
          stockState: 2
        })
          .then(res => {
            this.comfirmDialogObj.dialogVisible = false
            this.getTableData()
          })
      }
      if (this.dialogParams.type === '2') { // 开门
        this.isLoading = true
        httpPost(this.$basePath.equipOpen, {
          id: this.dialogParams.id
        })
          .then(res => {
            this.isLoading = false
            this.comfirmDialogObj.dialogVisible = false
            this.getTableData()
          })
          .catch(() => {
            this.isLoading = false
            this.$message.warning('开门已超时...')
          })
      }
    },
    addCoin (row) {
      httpPost(this.$basePath.equipCheckDevicet, {
        id: row.id
      })
        .then(res => {
          this.slotDialogObj.dialogVisible = true
          this.slotDialogObj.coinNum = ''
          this.slotDialogObj.coin = res.result
          this.slotDialogObj.id = row.id
        })
    },
    comfirmAdd () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          httpPost(this.$basePath.equipUpdateCoinNumById, {
            id: this.slotDialogObj.id,
            coinNum: this.slotDialogObj.coinNum
          })
            .then(res => {
              this.$message({ type: 'success', message: res.msg })
              this.slotDialogObj.dialogVisible = false
              this.getTableData()
            })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  background-color #ffffff
  min-width 1350px
  .main-container
    padding 20px 20px 0 20px
    &.two
      margin-top 20px
    .card-container
      border 1px #E6E6E6 solid
      /deep/.el-input
        width 180px
      .title
        height 52px
        line-height 52px
        border-bottom 1px #E6E6E6 solid
        padding-left 22px
        font-size 16px
      .term
        padding 27px 18px 0 22px
        box-sizing border-box
        &.two
          padding 0
        .btn-list
          height 124px
          display flex
          justify-content flex-end
          align-items center
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
</style>
