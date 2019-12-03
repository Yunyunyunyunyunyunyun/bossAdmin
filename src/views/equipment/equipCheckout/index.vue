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
                  v-has="'equipOutSearch'"
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
          <el-col :span="12" align="right">
            <el-button
              v-has="'equipOutBatch'"
              type="primary" icon="el-icon-download" plain
              size="medium"
              @click="goOutBatch"
            >
              批量出库
            </el-button>
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
          v-if="showTable"
          border
          :loading="loading"
          :table-height="400"
          column-type="selection"
          :data="dataSource"
          :columns="columns"
          :req-params="reqParams"
          :current-page="currentPage"
          :page-size="pageSize" :total-count="totalCount" :has-pagination="hasPagination"
          :set-page="queryData" @selection-change="selectionChange" @on-specific="clickRow"
          @update:data="tabChange"
          @goOut="goOut" @openDoor="openDoor" @addCoin="addCoin" @toTest="toTest"
        />
      </div>
    </div>
    <viewHardsoftPop ref="hardsoftPop" :viewdialog-obj="viewdialogObj" />
    <comfirmDialog
      :comfirm-dialog-obj="comfirmDialogObj"
      :is-weight="false"
      @confirm-click="comfirmClick"
    >
    </comfirmDialog>
    <comfirmDialog
      :comfirm-dialog-obj="comfirmDialogObj"
      :is-weight="isWeight"
      @confirm-click="comfirmClick"
    >
    </comfirmDialog>
    <soltDialog
      :slot-dialog-obj="slotDialogObj"
      @confirm-click="comfirmAdd"
    >
      <div slot="content">
        <el-form
          ref="addForm" :inline="true" :rules="slotDialogObj.rules"
          :model="slotDialogObj" label-width="150px"
        >
          <el-form-item label="现有硬币数量：">
            <el-input v-model="slotDialogObj.coin" disabled></el-input>
          </el-form-item>
          <el-form-item label="新增硬币数量：" prop="coinNum">
            <el-input v-model="slotDialogObj.coinNum" placeholder="请冲入充值硬币数量"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </soltDialog>
    <soltDialog
      :slot-dialog-obj="outSlotDialogObj"
      @confirm-click="outComfirm"
    >
      <div slot="content">
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
          ref="outForm"
          :inline="true"
          :model="outSlotDialogObj.formData"
          label-width="150px"
        >
          <el-form-item
            label="安装人员：" :rules="[
              { required: true, message: '请选择安装人员', trigger: 'blur' }
            ]"
          >
            <el-select v-model="outSlotDialogObj.formData.createUser" placeholder="请选择">
              <el-option
                v-for="(item, index) of outSlotDialogObj.userList" :key="index"
                :label="item.nickName" :value="item.id"
              ></el-option>
            </el-select>
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
      equipTypeList: [],
      formData: {
        scenario: '',
        productId: '',
        mac: '',
        stockState: 2
      },
      hasPagination: true,
      currentPage: 1, // 默认当前第一页
      pageSize: 10, // 默认每页20条数据
      reqParams: { // 查询、分页条件
        url: '',
        params: {}
      },
      selectRows: [],
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
          label: '测试人员',
          prop: 'createUser',
          columnsProps: {
            minWidth: 150
          }
        },
        {
          label: '测试时间',
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
            type: 'btnOut',
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
            { required: true, message: '请输入硬币数量', trigger: 'change' }
          ]
        }
      },
      isWeight: false,
      outSlotDialogObj: {
        title: '出库确认',
        dialogVisible: false,
        formData: {
          createUser: ''
        },
        userList: []
      }
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
      this.dataSource = this.tableData = tmp.arr
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
    selectionChange (rows) {
      this.selectRows = rows
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
    },
    goOut (row) {
      this.outSlotDialogObj.title = '出库确认'
      this.outSlotDialogObj.dialogVisible = true
      this.outSlotDialogObj.id = row.id
      this.getUser()
    },
    goOutBatch () {
      if (this.selectRows.length === 0) {
        this.$message.warning('请勾选相关设备')
        return
      }
      this.outSlotDialogObj.title = '批量出库确认'
      this.outSlotDialogObj.dialogVisible = true
      var id = []
      this.selectRows.forEach(item => {
        id.push(item.id)
      })
      this.outSlotDialogObj.id = id.join(',')
      this.getUser()
    },
    getUser () { // 安装人员
      httpPost(this.$basePath.findUser, {
        identify: 'aftersale',
        type: '2'
      })
        .then(res => {
          this.outSlotDialogObj.userList = res.result
        })
    },
    outComfirm () { // 确认出库
      this.$refs['outForm'].validate(valid => {
        if (valid) {
          httpPost(this.$basePath.equipUpdateProduct, {
            id: this.outSlotDialogObj.id,
            createUser: this.outSlotDialogObj.formData.createUser,
            stockState: 3
          })
            .then(res => {
              this.outSlotDialogObj.dialogVisible = false
              this.$message({ type: 'success', message: '操作成功' })
              this.getTableData()
            })
        }
      })
    },
    toTest (row) {
      this.comfirmDialogObj = {
        dialogVisible: false,
        title: '测试通过确认',
        dlTitle: '是否确定将此设备返回测试',
        dlMain: '',
        src: require('static/images/qmark.png'),
        id: row.id,
        type: 1
      }
      this.isWeight = false
      this.comfirmDialogObj.dialogVisible = true
    },
    openDoor (row) {
      this.comfirmDialogObj = {
        dialogVisible: false,
        title: '开箱提示',
        dlTitle: '是否确定打开箱体门？',
        dlMain: '',
        src: require('static/images/qmark.png'),
        id: row.id,
        type: 2
      }
      this.isWeight = true
      this.comfirmDialogObj.dialogVisible = true
    },
    comfirmClick () {
      if (this.comfirmDialogObj.type === 1) {
        httpPost(this.$basePath.equipUpdateProduct, {
          id: this.comfirmDialogObj.id,
          stockState: 1
        })
          .then(res => {
            this.comfirmDialogObj.dialogVisible = false
            this.getTableData()
          })
      }
      if (this.comfirmDialogObj.type === 2) {
        httpPost(this.$basePath.equipOpen, {
          id: this.comfirmDialogObj.id
        })
          .then(res => {
            this.comfirmDialogObj.dialogVisible = false
            this.getTableData()
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  background-color #ffffff
  min-width 1330px
  >>>.el-table--border th:first-child .cell, >>>.el-table--border td:first-child .cell
    padding-left 14px
  .main-container
    padding 20px 20px 0 20px
    &.two
      margin-top 20px
    .btn-list
      height 124px
      display flex
      justify-content flex-end
      align-items center
    .card-container
      border 1px #E6E6E6 solid
      >>>.el-input
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
