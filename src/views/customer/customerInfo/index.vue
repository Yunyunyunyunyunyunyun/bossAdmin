<template>
  <div class="customerInfo">
    <div class="firstTitle">
      <span>数据筛选</span>
    </div>
    <div class="firstContent">
      <el-row>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">客户名称：</span><el-input
              v-model="customerName" placeholder="请输入客户名称"
              size="medium" clearable
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">手机号：</span><el-input
              v-model="phoneNum" placeholder="请输入手机号"
              size="medium" clearable
            />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">客户类型：</span>
            <el-select
              v-model="customerType" placeholder="请选择" size="medium"
              clearable
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="6" class="btnContain">
          <span class="fr tsdBtn">
            <el-button
              v-has="'customerFind'" type="primary" icon="el-icon-search"
              size="medium" class="mr6" @click="queryList()"
            >查询</el-button>
            <el-button
              v-has="'customerAdd'" type="primary" icon="el-icon-plus"
              size="medium" plain @click="addCustom"
            >新建</el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="secondTitle">
      <span>客户列表</span>
    </div>
    <div>
      <el-table
        v-loading="loading" :data="tableData.list" :header-cell-style="$tableHeaderColor"
        border :class="{'commonHeight':!tableData.totalCount||tableData.totalCount&&tableData.totalCount === 0}"
      >
        <el-table-column
          prop="name" label="客户名称" width="200"
          align="center"
        />
        <el-table-column prop="abbreviation" label="客户简称" align="center" />
        <el-table-column prop="person" label="业务联系人" align="center" />
        <el-table-column
          prop="phone" label="手机号" align="center"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ formatPhone(scope.row.phone) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cType == 1?"自营":"" }}</span>
            <span>{{ scope.row.cType == 2?"代理商":"" }}</span>
            <span>{{ scope.row.cType == 3?"个体":"" }}</span>
            <span>{{ scope.row.cType == 4?"政府机构":"" }}</span>
            <span>{{ scope.row.cType == 5?"体验用户":"" }}</span>
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" @click="viewPage(scope.row)">
              查看
            </el-button>
            <el-button
              v-has="'customerChange'" type="text" size="small"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'customerDelete'" type="text" size="small"
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
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <span class="dlTitle">是否确定删除商户</span>
        <div class="dlMain">
          将删除此客户所有信息及注销相关账户，删除后无法恢复，请谨慎操作！
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="del()">确定</el-button>
        <el-button class="w90" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../../../API/customer'
export default {
  data () {
    return {
      customerName: '',
      phoneNum: '',
      customerOptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: '1',
        label: '自营'
      }, {
        value: '2',
        label: '代理商'
      }, {
        value: '3',
        label: '个体'
      }, {
        value: '4',
        label: '政府机构'
      }, {
        value: '5',
        label: '体验用户'
      }],
      customerType: '全部',
      tableData: {},
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      delCustomId: '',
      loading: false
    }
  },
  created () {},
  mounted () {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    }
    this.getCustomerList(params)
  },
  methods: {
    // 获取客户列表
    getCustomerList (params) {
      this.loading = true
      Server.getCustomerList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.tableData = res.result
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    formatPhone (val) {
      const reg = /(\d{3})\d{4}(\d{4})/
      return val && val.length === 11 ? val.replace(reg, '$1****$2') : val
    },
    // 根据条件查询列表
    queryList () {
      this.currentPage = 1
      const obj = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.customerName) {
        obj.name = this.customerName
      }
      if (this.phoneNum) {
        obj.phone = this.phoneNum
      }
      if (this.customerType !== '全部') {
        obj.cType = this.customerType
      }
      this.getCustomerList(obj)
    },
    viewPage (val) {
      this.$router.push({
        path: '/customer/customerInfo/viewCustomer'
      })
      this.$localstore.set('customerInfo', val)
    },
    edit (val) {
      this.$router.push({
        path: '/customer/customerInfo/editCustomer',
        query: { id: val.id }
      })
      this.$localstore.set('customerInfo', val)
    },
    deleted (val) {
      this.dialogVisible = true
      this.delCustomId = val.id
    },
    del () {
      Server.deleteCustomer({ id: this.delCustomId }).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          const params = {
            page: this.currentPage,
            pageSize: this.pageSize
          }
          this.getCustomerList(params)
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.customerName) {
        params.name = this.customerName
      }
      if (this.phoneNum) {
        params.phone = this.phoneNum
      }
      if (this.customerType !== '全部') {
        params.cType = this.customerType
      }
      this.getCustomerList(params)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.customerName) {
        params.name = this.customerName
      }
      if (this.phoneNum) {
        params.phone = this.phoneNum
      }
      if (this.customerType !== '全部') {
        params.cType = this.customerType
      }
      this.getCustomerList(params)
    },
    addCustom () {
      this.$router.push({
        path: '/customer/customerInfo/addCustomer'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .customerInfo {
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
        vertical-align: top;
        padding-left: 10px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
      .dlMain {
        position: absolute;
        top: 114px;
        left: 94px;
        width: 346px;
        height: 44px;
        font-size: 16px;
        font-weight: 400;
        color: #666;
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
.customerInfo {
  .firstContent {
    .el-input, .el-select {
      width: 172px;
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
}
</style>
