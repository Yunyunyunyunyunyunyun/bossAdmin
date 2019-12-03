<template>
  <div class="container">
    <div class="main-container">
      <div class="search-container">
        <div class="title">
          筛选查询
        </div>
        <div class="term">
          <el-row>
            <el-form :inline="true" :model="formData" label-width="120px">
              <el-col :span="6">
                <el-form-item label="设备编号：">
                  <el-input v-model="formData.productId" placeholder="请输入设备编号" clearable></el-input>
                </el-form-item>
                <el-form-item label="设备组名称：">
                  <el-input v-model="formData.groupName" placeholder="请输入设备组名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="入库人员：">
                  <el-input v-model="formData.createUser" placeholder="请输入入库人员" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
                <el-form-item label="入库时间：">
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
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="IP：">
                  <el-input v-model="formData.ip" placeholder="请输入IP地址" clearable></el-input>
                </el-form-item>
                <el-form-item label="绑定硬件状态：">
                  <el-select v-model="formData.isBind" placeholder="全部" clearable>
                    <el-option label="已绑定" value="1"></el-option>
                    <el-option label="未绑定" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" align="right">
                <div class="btn-list">
                  <el-form-item>
                    <el-button
                      v-has="'equipRukuGetlist'"
                      type="primary" icon="el-icon-search" size="medium" @click="handleSearch"
                    >
                      查询
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      v-has="'equipAdd'"
                      type="primary" icon="el-icon-plus" plain
                      size="medium"
                      @click="addDevice"
                    >
                      添加设备
                    </el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-form>
          </el-row>
        </div>
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
              v-has="'equipRukuBatch'"
              type="primary" icon="el-icon-download" plain
              size="medium"
              @click="inBatch"
            >
              批量入库
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
          v-if="showTable" border
          :loading="loading"
          :table-height="400"
          :data="dataSource"
          :columns="columns"
          :req-params="reqParams"
          :current-page="currentPage"
          :page-size="pageSize" :total-count="totalCount" :has-pagination="hasPagination"
          :set-page="queryData" @on-specific="clickRow" @update:data="tabChange"
          @view="view" @edit="edit" @del="del"
        />
      </div>
    </div>
    <viewHardsoftPop ref="hardsoftPop" :viewdialog-obj="viewdialogObj" />
    <inBatchPop :batchdialog-obj="batchdialogObj" @refresh="getTableData" />
    <comfirmDialog :comfirm-dialog-obj="comfirmDialogObj" @confirm-click="comfirmDelete" />
  </div>
</template>

<script>
import tableVue from '@/components/table/Table.vue'
import viewHardsoftPop from './viewHardsoftPop.vue'
import inBatchPop from './inBatchPop.vue'
import comfirmDialog from '@/components/commonDialog/comfirmDialog.vue'
import { httpPost } from '@/API/request/index'
export default {
  components: {
    tableVue,
    viewHardsoftPop,
    inBatchPop,
    comfirmDialog
  },
  data () {
    return {
      showTable: false,
      loading: false,
      dataTime: '',
      formData: {
        productId: '',
        mac: '',
        ip: '',
        isBind: '',
        scenario: '',
        createUser: '',
        startTime: '',
        endTime: '',
        stockState: 1
      },
      equipTypeList: [],
      hasPagination: true,
      currentPage: 1, // 默认当前第一页
      pageSize: 10, // 默认每页20条数据
      reqParams: { // 查询、分页条件
        url: '',
        params: {
          pageIndex: 1,
          pageSize: 10,
          queryParams: {}
        }
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
          label: '绑定智能硬件状态',
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
            minWidth: 150
          }
        },
        {
          label: '操作',
          prop: 'operation',
          fixed: 'right',
          columnsProps: {
            type: 'btnIn',
            minWidth: 180
          }
        }
      ],
      dataSource: [],
      viewdialogObj: {
        dialogVisible: false,
        id: [],
        formData: {}
      },
      batchdialogObj: {
        dialogVisible: false
      },
      comfirmDialogObj: {
        dialogVisible: false,
        title: '删除提示',
        dlTitle: '是否确定删除此设备',
        dlMain: '',
        src: require('static/images/qmark.png')
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
    getAllGroupMark () { // 获取设备组
      httpPost(this.$basePath.equipProductMark)
        .then(res => {
          this.groupMark = res.result
        })
    },
    handleSearch () {
      this.getTableData()
    },
    getTableData () {
      this.loading = true
      if (this.dataTime) {
        this.formData.startTime = this.dataTime[0] || ''
        this.formData.endTime = this.dataTime[1] || ''
      } else {
        this.formData.startTime = ''
        this.formData.endTime = ''
      }
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
    queryData (page, size) {
      this.dataSource = this.data.filter((u, index) => index < size * page && index >= size * (page - 1))
    },
    tabChange (msg) {
      const tmp = JSON.parse(msg)
      this.currentPage = tmp.currentPage
      this.dataSource = tmp.arr
      this.totalCount = tmp.totalCount
    },
    view (row) {
      this.$router.push({
        path: '/equipment/equipStorage/viewDevice',
        query: {
          view: row.id
        }
      })
    },
    edit (row) {
      this.$router.push({
        path: '/equipment/equipStorage/editDevice',
        query: {
          edit: row.id
        }
      })
    },
    del (row) {
      this.comfirmDialogObj.dialogVisible = true
      this.comfirmDialogObj.id = row.id
    },
    comfirmDelete () {
      this.comfirmDialogObj.dialogVisible = false
      httpPost(this.$basePath.equipDelete, {
        id: this.comfirmDialogObj.id
      })
        .then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getTableData()
        })
    },
    clickRow (row) {
      this.viewdialogObj.dialogVisible = true
      this.viewdialogObj.id = row.id
      this.$refs.hardsoftPop.getDetail()
    },
    addDevice () {
      this.$router.push({
        path: '/equipment/equipStorage/addDevice'
      })
    },
    inBatch () {
      this.batchdialogObj.dialogVisible = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  background-color #ffffff
  min-width 1540px
  .main-container
    padding 20px 20px 0 20px
    .search-container
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
</style>
