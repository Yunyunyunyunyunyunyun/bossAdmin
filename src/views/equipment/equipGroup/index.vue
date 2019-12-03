<template>
  <div class="container">
    <div class="main-container">
      <div class="card-container">
        <div class="title">
          筛选查询
        </div>
        <el-row class="term">
          <el-form :inline="true" :model="formData">
            <el-col :span="6">
              <el-form-item label="设备组名称：">
                <el-input v-model="formData.name" placeholder="请输入设备组名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备组型号：">
                <el-select v-model="formData.markId" placeholder="全部" clearable>
                  <el-option
                    v-for="(item, index) of groupMark" :key="index"
                    :label="item.name + '(' + item.key + ')'" :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" align="right">
              <el-form-item>
                <el-button
                  v-has="'equipGroupSearch'"
                  type="primary" icon="el-icon-search" size="medium" @click="handleSearch"
                >
                  查询
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  v-has="'equipGroupAdd'"
                  type="primary" icon="el-icon-plus" plain
                  size="medium"
                  @click="addDeviceGroup"
                >
                  添加设备组
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
          :set-page="queryData" @on-specific="clickRow"
          @update:data="tabChange"
          @equipConfig="equipConfig" @equipDel="equipDel" @outBatch="outBatch" @installBatch="installBatch" @testBatch="testBatch"
        />
      </div>
    </div>
    <comfirmDialog :comfirm-dialog-obj="deleteDialogObj" @confirm-click="comfirmDelete" />
    <soltDialog
      :slot-dialog-obj="testSlotDialogObj"
      @confirm-click="testComfirm"
    >
      <div slot="content">
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
          :inline="true" :rules="outSlotDialogObj.rules" :model="outSlotDialogObj.formData" label-width="150px"
        >
          <el-form-item label="安装人员：" prop="createUser">
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
    <soltDialog
      :slot-dialog-obj="installDialogObj"
      class="slot-dialog"
      @confirm-click="installComfirm"
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
          ref="completeForm"
          :inline="true" :rules="installDialogObj.rules" :model="installDialogObj.formData"
          label-width="150px"
        >
          <el-form-item label="绑定区域：" prop="region">
            <el-cascader
              ref="selectArea"
              v-model="installDialogObj.formData.region"
              placeholder="请选择省市区及街道"
              :props="installDialogObj.props"
              @change="changeRegion"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="小区：" prop="estateId">
            <el-select
              v-model="installDialogObj.formData.estateId" placeholder="请选择小区"
              @change="changeEatste"
            >
              <el-option
                v-for="(item, index) of estateList" :key="index"
                :label="item.housingEstate" :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="installDialogObj.formData.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="设备坐标：" prop="pos">
            <el-input
              v-model="installDialogObj.formData.pos" placeholder="请选择设备坐标" readonly
              @click.native="chooseSite"
            ></el-input>
          </el-form-item>
          <el-form-item label="归属管理员：" prop="operation">
            <el-select v-model="installDialogObj.formData.operation" placeholder="全部">
              <el-option
                v-for="(item, index) of operateList" :key="index"
                :label="item.nickName" :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
    </soltDialog>
    <soltDialog
      :slot-dialog-obj="addDialogObj"
      class="slot-dialog"
      @confirm-click="addComfirm"
    >
      <span slot="content">
        <el-form
          ref="addGroup" :rules="addDialogObj.rules" :inline="true" :model="addDialogObj.formData"
          label-width="150px"
        >
          <el-form-item label="设备组名称：" prop="name">
            <el-input v-model="addDialogObj.formData.name" placeholder="请设备组名称"></el-input>
          </el-form-item>
          <el-form-item label="设备组型号：" prop="id">
            <el-select v-model="addDialogObj.formData.id" placeholder="请选择设备组型号">
              <el-option
                v-for="(item, index) of groupMark" :key="index"
                :label="item.name" :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
    </soltDialog>
    <soltDialog
      :slot-dialog-obj="viewdialogObj"
      width="800px"
      class="solt-table"
      :is-comfirm="false"
      :cancel-txt="cancelTxt"
    >
      <span slot="content">
        <el-table
          :data="viewdialogObj.tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="设备名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="scenarioName"
            label="设备类型"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="设备型号"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.productMark.key }}
            </template>
          </el-table-column>
          <el-table-column
            prop="productId"
            label="设备编号"
            width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="stockState"
            label="设备状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.stockState == '1' ? '待测试' : (scope.row.stockState == '2' ? '待出库' : (scope.row.stockState == '3' ? '待安装' : '')) }}
            </template>
          </el-table-column>
        </el-table>
      </span>
    </soltDialog>
    <siteChoose
      ref="map"
      :map-dialog-obj="mapDialogObj"
      @getPosition="getPosition"
    />
  </div>
</template>

<script>
import tableVue from '@/components/table/Table.vue'
import comfirmDialog from '@/components/commonDialog/comfirmDialog.vue'
import soltDialog from '@/components/commonDialog/soltDialog.vue'
import { httpPost } from '@/API/request/index'
import siteChoose from '../equipInstall/siteChoose.vue'
export default {
  components: {
    tableVue,
    comfirmDialog,
    soltDialog,
    siteChoose
  },
  data () {
    const self = this
    return {
      estateList: [],
      operateList: [],
      regionLabel: [],
      showTable: false,
      loading: false,
      equipTypeList: [],
      formData: {
        name: '',
        markId: ''
      },
      groupMark: [],
      cancelTxt: '关闭',
      hasPagination: true,
      currentPage: 1, // 默认当前第一页
      pageSize: 10, // 默认每页10条数据
      reqParams: { // 查询、分页条件
        url: '',
        params: {}
      },
      dataSource: [],
      totalCount: 0, // 表格总记录数
      columns: [
        {
          label: '设备组名称',
          prop: 'name',
          columnsProps: {
            minWidth: 200
          }
        },
        {
          label: '设备组型号',
          prop: 'mark',
          columnsProps: {
            minWidth: 200
          },
          formatter (col, row, val) {
            if (val) {
              return val.name + '(' + val.key + ')'
            }
          }
        },
        {
          label: '关联设备',
          prop: 'num',
          columnsProps: {
            type: 'relative',
            minWidth: 150
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          columnsProps: {
            minWidth: 200
          }
        },
        {
          label: '创建人',
          prop: 'user',
          columnsProps: {
            minWidth: 150
          },
          formatter (col, row, val) {
            if (val) {
              return val.userName
            }
          }
        },
        {
          label: '设备组状态',
          prop: 'state',
          columnsProps: {
            minWidth: 150
          },
          formatter (col, row, val) {
            switch (val) {
              case 1:
                return '已入库待测试'
              case 2:
                return '已测试待出库'
              case 3:
                return '已出库待安装'
              case 4:
                return '安装完成'
            }
          }
        },
        {
          label: '操作',
          prop: 'productMark',
          fixed: 'right',
          columnsProps: {
            type: 'btnGroup',
            minWidth: 200
          }
        }
      ],
      viewdialogObj: {
        title: '关联设备',
        dialogVisible: false,
        id: '',
        tableData: []
      },
      deleteDialogObj: {
        dialogVisible: false,
        title: '删除提示',
        dlTitle: '是否确定删除此设备组',
        dlMain: '删除此设备组将解除关联设备不会删除设备！',
        isWeight: true,
        src: require('static/images/qmark.png')
      },
      outSlotDialogObj: {
        title: '批量出库确认',
        dialogVisible: false,
        formData: {
          createUser: ''
        },
        rules: {
          createUser: [
            { required: true, message: '请选择安装人员', trigger: 'change' }
          ]
        },
        userList: []
      },
      installDialogObj: {
        dialogVisible: false,
        title: '批量安装确认',
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
        },
        formData: {
          areas: '',
          estateId: '',
          address: '',
          pos: '',
          operation: '',
          region: []
        }
      },
      testSlotDialogObj: {
        dialogVisible: false,
        title: '批量测试'
      },
      addDialogObj: {
        title: '添加设备组',
        dialogVisible: false,
        groupMark: [],
        rules: {
          name: [
            { required: true, message: '请输入设备组名称', trigger: 'blur' }
          ],
          id: [
            { required: true, message: '请选择设备组型号', trigger: 'change' }
          ]
        },
        formData: {
          name: '',
          id: ''
        }
      },
      mapDialogObj: {
        dialogVisible: false
      },
      position: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getTableData()
      this.getAllGroupMark()
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
      this.reqParams.url = this.$basePath.equipAllList
      this.reqParams.params = params
      httpPost(this.$basePath.equipAllList, params)
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
      this.getProductDetail(row.id)
    },
    getProductDetail (id) {
      httpPost(this.$basePath.equipProduct, {
        groupId: id
      })
        .then(res => {
          this.viewdialogObj.tableData = res.result
        })
    },
    getAllGroupMark () { // 获取设备组
      httpPost(this.$basePath.equipProductMark)
        .then(res => {
          this.groupMark = res.result
        })
    },
    addDeviceGroup () {
      this.addDialogObj.dialogVisible = true
      this.$refs.addGroup.resetFields()
      this.getAllGroupMark()
    },
    addComfirm () {
      this.$refs.addGroup.validate(vaild => {
        if (vaild) {
          httpPost(this.$basePath.equipGroupSave, {
            name: this.addDialogObj.formData.name,
            mark: {
              id: this.addDialogObj.formData.id
            }
          })
            .then(res => {
              this.$message({ type: 'success', message: res.msg })
              this.getTableData()
              this.addDialogObj.dialogVisible = false
            })
        }
      })
    },
    equipConfig (row) {
      this.$router.push({
        path: '/equipment/equipGroup/configDetail',
        query: {
          id: row.id
        }
      })
    },
    equipDel (row) {
      this.deleteDialogObj.dialogVisible = true
      this.deleteDialogObj.id = row.id
    },
    comfirmDelete () {
      httpPost(this.$basePath.equipGroupDel, {
        id: this.deleteDialogObj.id
      })
        .then(res => {
          this.deleteDialogObj.dialogVisible = false
          this.$message({ type: 'success', message: res.msg })
          this.getTableData()
        })
    },
    testBatch (row) {
      this.testSlotDialogObj.dialogVisible = true
    },
    testComfirm () {
      this.testSlotDialogObj.dialogVisible = false
    },
    chooseSite () {
      this.mapDialogObj.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.map.initMap()
      })
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
      this.installDialogObj.formData.estateId = ''
    },
    changeEatste (val) {
      this.selectedEstate = this.estateList.find(item => {
        return item.id === val
      })
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
    outBatch (row) {
      this.outSlotDialogObj.dialogVisible = true
      this.outSlotDialogObj.groupId = row.id
      this.getUser()
    },
    outComfirm () {
      this.$refs.outForm.validate(valid => {
        if (valid) {
          const params = {}
          params.groupId = this.outSlotDialogObj.groupId
          params.stockState = 3
          params.createUser = this.outSlotDialogObj.formData.createUser
          httpPost(this.$basePath.equipGroupBatch, params)
            .then(res => {
              this.outSlotDialogObj.dialogVisible = false
              this.$message.success('操作成功！')
              this.getTableData()
              this.$refs.outForm.resetField()
            })
        }
      })
    },
    installBatch (row) {
      this.installDialogObj.dialogVisible = true
      this.installDialogObj.groupId = row.id
      this.getOperate()
      this.$nextTick(() => {
        this.$refs.completeForm.resetFields()
      })
      this.installDialogObj.formData = {
        areas: '',
        estateId: '',
        address: '',
        pos: '',
        operation: '',
        region: []
      }
    },
    installComfirm () {
      this.$refs.completeForm.validate(valid => {
        if (valid) {
          const params = {}
          this.regionLabel = this.$refs.selectArea.getCheckedNodes()[0].pathLabels
          params.groupId = this.installDialogObj.groupId
          params.provinceId = this.installDialogObj.formData.region[0]
          params.provinceName = this.regionLabel[0]
          params.cityId = this.installDialogObj.formData.region[1]
          params.cityName = this.regionLabel[1]
          params.areaId = this.installDialogObj.formData.region[2]
          params.areaName = this.regionLabel[2]
          params.estateId = this.selectedEstate.id
          params.estateName = this.selectedEstate.housingEstate
          params.address = this.installDialogObj.formData.address
          params.operation = this.installDialogObj.formData.operation
          params.lo = this.position.lng
          params.la = this.position.lat
          params.stockState = 4
          httpPost(this.$basePath.equipGroupBatch, params)
            .then(res => {
              this.installDialogObj.dialogVisible = false
              this.$message.success('操作成功！')
              this.getTableData()
            })
        }
      })
    },
    getPosition (pos) {
      this.position = pos
      if (pos !== '') {
        this.installDialogObj.formData.pos = pos.lng + ',' + pos.lat
      } else {
        this.installDialogObj.formData.pos = ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.slot-dialog
  >>>.el-input
    width 220px
.solt-table
  >>>.el-dialog__body
    padding 0 0 30px 0
  >>>.el-table th > .cell
    color #333333
.container
  background-color #ffffff
  min-width 1350px
  .main-container
    padding 20px 20px 0 20px
    &.two
      margin-top 20px
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
