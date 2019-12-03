<template>
  <div class="cellAddress">
    <div class="firstTitle">
      <span>数据筛选</span>
    </div>
    <div class="firstContent">
      <el-row>
        <el-col :span="9">
          <div class="topDiv firstMain">
            <span class="topTitle">区域：</span>
            <el-cascader
              v-model="selectedArea"
              size="medium"
              :clearable="true"
              :filterable="true"
              placeholder="请选择省市区"
              :props="props"
            ></el-cascader>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="topDiv">
            <span class="topTitle">街道：</span>
            <el-input
              v-model="streetValue" placeholder="请输入街道名称" clearable
              size="medium"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="6" class="btnContain">
          <span class="fr tsdBtn">
            <el-button
              v-has="'EstateGetList'" type="primary" icon="el-icon-search"
              size="medium" class="mr6" @click="queryList()"
            >查询</el-button>
            <el-button
              v-has="'EstateSave'" type="primary" icon="el-icon-plus"
              size="medium" plain @click="addAddress"
            >添加</el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="secondTitle">
      <span>地址列表</span>
    </div>
    <div>
      <el-table
        v-loading="loading" :data="tableData.data" :header-cell-style="$tableHeaderColor"
        border :class="{'commonHeight':!tableData.totalCount||tableData.totalCount&&tableData.totalCount === 0}"
      >
        <el-table-column label="省" align="center">
          <template v-if="scope.row.areas" slot-scope="scope">
            {{ scope.row.areas.split(',')[1] }}
          </template>
        </el-table-column>
        <el-table-column label="市" align="center">
          <template v-if="scope.row.areas" slot-scope="scope">
            {{ scope.row.areas.split(',')[2] }}
          </template>
        </el-table-column>
        <el-table-column label="区县" align="center">
          <template v-if="scope.row.areas" slot-scope="scope">
            {{ scope.row.areas.split(',')[3] }}
          </template>
        </el-table-column>
        <el-table-column prop="street" label="街道" align="center" />
        <el-table-column prop="num" label="小区数" align="center" />
        <el-table-column label="创建时间" width="200" align="center">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ new Date(scope.row.createTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作" align="center" width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'EstateGetDetail'" type="text" size="small"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'EstateDelete'" type="text" size="small"
              @click="deleted(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <img src="../../../../static/images/noData.png">
            <div class="efont">
              暂时没有数据
            </div>
          </div>
        </template>
      </el-table>
      <el-pagination
        v-if="tableData.totalCount&&tableData.totalCount !== 0"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogVisible"
      top="40vh"
      width="480px"
      :class="{'warnDialog': cellNum!==0}"
    >
      <div class="dlContent">
        <img v-if="cellNum===0" src="../../../../static/images/qmark.png">
        <img v-else-if="cellNum!==0" src="../../../../static/images/warning.svg">
        <span class="dlTitle">{{ cellNum===0?'是否确定删除此街道':'此街道含有已配置的小区，暂不允许删除，请将此街道所有小区全部删除后方可进行此操作' }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="cellNum===0" type="primary" class="w90"
          @click="del()"
        >确定</el-button>
        <el-button class="w90" :type="cellNum===0?'default':'primary'" @click="dialogVisible = false">{{ cellNum===0?'取消':'关闭' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="addressTitle"
      :visible.sync="addressVisible"
      top="20vh"
      width="480px"
      class="addrDialog"
      @close="cancelAddress('addressForm')"
    >
      <div class="addressDialog">
        <el-form
          ref="addressForm" :model="addressForm" :rules="addressRules"
          label-width="120px"
        >
          <el-form-item label="区域：" prop="area">
            <el-cascader
              v-if="showAddress"
              v-model="addressForm.area"
              size="medium"
              :clearable="true"
              :filterable="true"
              placeholder="请选择省市区"
              :props="AddEditProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="街道：" prop="street">
            <el-input v-model="addressForm.street" placeholder="请输入街道名称，最长20字符" maxlength="20"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="addressSure('addressForm')">确定</el-button>
        <el-button class="w90" @click="cancelAddress('addressForm')">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../../../API/address'
export default {
  data () {
    return {
      streetValue: '',
      tableData: {},
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      addressTitle: '',
      addressVisible: false,
      addressForm: {
        area: [],
        street: ''
      },
      addressRules: {
        area: [
          { required: true, message: '请选择省市区', trigger: 'change' }
        ],
        street: [
          { required: true, message: '请输入街道', trigger: 'blur' }
        ]
      },
      showAddress: false,
      selectedArea: '',
      addressDetail: [],
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          node.value = node.value ? node.value : '1'
          const { level } = node
          Server.getLinkAge({ pId: node.value }).then(res => {
            if (res.code === 0) {
              const nodes = res.result
                .map(item => ({
                  value: item.id,
                  label: item.name,
                  leaf: level >= 2
                }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            }
          })
        }
      },
      AddEditProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          node.value = node.value ? node.value : '1'
          const { level } = node
          Server.getLinkAge({ pId: node.value }).then(res => {
            if (res.code === 0) {
              const nodes = res.result
                .map(item => ({
                  value: item.id,
                  label: item.name,
                  leaf: level >= 2
                }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            }
          })
        }
      },
      editAddressId: '',
      deleteAddressId: '',
      loading: false,
      cellNum: 0
    }
  },
  created () {},
  mounted () {
    const params = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      queryParams: { 'type': '1' }
    }
    this.getAddressList(params)
  },
  methods: {
    // 获取地址列表
    getAddressList (params) {
      this.loading = true
      Server.getCommunityList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.tableData = res.result
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 根据条件查询列表
    queryList () {
      this.currentPage = 1
      const obj = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        queryParams: { 'type': '1' }
      }
      if (this.selectedArea) {
        obj.queryParams['areaId'] = this.selectedArea.join(',')
      }
      if (this.streetValue) {
        obj.queryParams['street'] = this.streetValue
      }
      this.getAddressList(obj)
    },
    addAddress () {
      this.editAddressId = ''
      this.addressTitle = '添加地址'
      this.addressVisible = true
      this.showAddress = false
      this.addressForm = {}
      setTimeout(() => {
        this.showAddress = true
      }, 100)
    },
    getAreaDetail (params) {
      Server.getAreaDetail(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.addressDetail = res.result
          const newArray = []
          this.addressDetail.areaList.forEach((item) => {
            newArray.push(item.id)
          })
          this.addressForm.area = newArray
          this.addressForm.street = this.addressDetail.street
        }
      })
    },
    edit (val) {
      const obj = {
        id: val.id
      }
      this.editAddressId = val.id
      this.addressTitle = '编辑地址'
      this.addressVisible = true
      this.showAddress = false
      this.getAreaDetail(obj)
      setTimeout(() => {
        this.showAddress = true
      }, 100)
    },
    deleted (val) {
      this.deleteAddressId = val.id
      this.cellNum = val.num
      this.dialogVisible = true
    },
    del () {
      const params = {
        id: this.deleteAddressId
      }
      Server.deleteArea(params).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          const par = {
            pageIndex: this.currentPage,
            pageSize: this.pageSize,
            queryParams: { 'type': '1' }
          }
          this.getAddressList(par)
        }
      })
    },
    addressSure (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            areaId: this.addressForm.area.join(','),
            street: this.addressForm.street,
            pid: this.addressForm.area[2],
            type: '1'
          }
          if (this.editAddressId && this.editAddressId !== '') {
            params.id = this.editAddressId
          }
          Server.saveArea(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.addressVisible = false
              const par = {
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                queryParams: { 'type': '1' }
              }
              this.getAddressList(par)
            }
          })
        } else {
          return false
        }
      })
    },
    cancelAddress (formRule) {
      this.$refs[formRule].clearValidate()
      this.addressVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        queryParams: { 'type': '1' }
      }
      if (this.selectedArea) {
        params.queryParams['areaId'] = this.selectedArea.join(',')
      }
      if (this.streetValue) {
        params.queryParams['street'] = this.streetValue
      }
      this.getAddressList(params)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        queryParams: { 'type': '1' }
      }
      if (this.selectedArea) {
        params.queryParams['areaId'] = this.selectedArea.join(',')
      }
      if (this.streetValue) {
        params.queryParams['street'] = this.streetValue
      }
      this.getAddressList(params)
    }
  }
}
</script>

<style lang="less" scoped>
  .cellAddress {
    background-color: #fff;
    padding: 20px;
    .firstTitle {
      border: 1px solid #f0f0f0;
      height: 52px;
      line-height: 52px;
      span {
        padding-left: 20px;
        font-size: 16px;
        color: #333;
      }
    }
    .firstContent {
      border: 1px solid #e6e6e6;
      border-top: none;
      height: 90px;
      padding: 0 20px;
      .firstMain {
        .topTitle {
          padding-top: 9px;
        }
      }
      .topDiv {
        padding: 27px 10px 27px 0;
      }
      .topTitle {
        width: 80px;
        display: inline-block;
        text-align: right;
        padding-right: 5px;
        color: #333;
      }
      .btnContain {
        height: 90px;
        line-height: 90px;
      }
    }
    .secondTitle {
      border: 1px solid #e6e6e6;
      border-bottom: none;
      height: 52px;
      line-height: 52px;
      margin-top: 20px;
      padding: 0 20px;
      span {
        font-size: 16px;
        color: #333;
      }
    }
    .fr {
      float: right;
    }
    .mr6 {
      margin-right: 6px;
    }
    .w90 {
      width: 90px;
    }
    .dlContent {
      padding-left: 15px;
      .dlTitle {
        position: absolute;
        top: 82px;
        left: 94px;
        width: 346px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
    }
    .empty {
      height: 103px;
      .efont {
        font-weight: 500;
        font-size: 14px;
        color: #a2a6ac;
        margin-top: 15px;
      }
    }
  }
</style>
<style lang="less">
.cellAddress {
  .firstContent {
    .el-input, .el-select {
      width: 172px;
    }
    .firstMain {
      .area-select {
        height: 34px;
      }
    }
  }
  .el-table th, .el-table td {
    padding: 8px 0;
  }
  .el-pagination {
    text-align: center;
    padding: 20px 5px;
  }
  .el-button--medium {
    width: 100px;
  }
  .tsdBtn {
    .el-button [class*="el-icon-"] + span {
      margin-left: 15px;
    }
  }
  .el-dialog__header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    border: 1px solid #e6e6e6;
    background-color: #f3f8ff;
    font-size: 16px;
    color: #333;
    font-weight: 500;
    .el-dialog__headerbtn {
      top: 17px;
    }
  }
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /* IE10+ CSS styles go here */
    .el-dialog__header {
      .el-dialog__headerbtn {
        top: 0px;
      }
    }
  }
  .el-dialog__footer {
    padding: 30px 20px;
  }
  .el-table__empty-text {
    line-height: normal;
  }
  .addrDialog {
    .el-dialog__footer {
      padding: 0 20px 30px;
    }
    .addressDialog {
      .el-input {
        width: 255px;
      }
      .area-cascader-wrap {
        position: absolute;
        top: 3px;
        left: 0;
        line-height: normal;
        .area-select {
          width: 255px;
          height: 34px;
        }
      }
    }
  }
  .warnDialog {
    .el-dialog__footer {
      padding:20px 30px;
      text-align: center;
    }
  }
}
</style>
