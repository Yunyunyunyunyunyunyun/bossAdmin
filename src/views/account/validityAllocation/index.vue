<template>
  <div class="validityAllocation">
    <div class="firstTitle">
      <span>筛选查询</span>
    </div>
    <div class="firstContent">
      <el-row>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">客户简称：</span><el-input
              v-model="ctName" placeholder="请输入客户简称"
              size="medium" clearable
            />
          </div>
          <span class="topTitle">手机号：</span><el-input
            v-model="phoneNum" placeholder="请输入手机号"
            size="medium" clearable
          />
        </el-col>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">用户名：</span><el-input
              v-model="userName" placeholder="请输入用户名"
              size="medium" clearable
            />
          </div>
          <span class="topTitle">角色：</span><el-input
            v-model="role" placeholder="请输入角色"
            size="medium" clearable
          />
        </el-col>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">昵称：</span><el-input
              v-model="nickname" placeholder="请输入昵称"
              size="medium" clearable
            />
          </div>
          <span class="topTitle">账号状态：</span>
          <el-select
            v-model="initiateMode" placeholder="请选择" size="medium"
            clearable
          >
            <el-option
              v-for="item in initiateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6" class="btnContain">
          <span class="fr">
            <span class="tsdBtn">
              <el-button
                v-has="'userFindList'" type="primary" icon="el-icon-search"
                size="medium" @click="queryList()"
              >查询</el-button>
            </span>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="secondTitle">
      <span>账号列表</span>
    </div>
    <div>
      <el-table
        v-loading="loading" :data="tableData.list" :header-cell-style="$tableHeaderColor"
        border :class="{'commonHeight':!tableData.totalCount||tableData.totalCount&&tableData.totalCount === 0}"
      >
        <el-table-column
          prop="name" label="客户名称" align="center"
          width="150"
        />
        <el-table-column prop="abbreviation" label="客户简称" align="center" />
        <el-table-column
          prop="templateName" label="绑定菜单模板" align="center"
          width="150"
        />
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="nickName" label="昵称" align="center" />
        <el-table-column
          prop="mobile" label="手机号" align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ formatPhone(scope.row.mobile) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleNames" label="角色" align="center"
          width="120"
        />
        <el-table-column label="当前使用中范围" align="center" width="200">
          <template v-if="scope.row.startTime&&scope.row.endTime" slot-scope="scope">
            {{ new Date(scope.row.startTime).Format("yyyy-MM-dd hh:mm:ss") }}~{{ new Date(scope.row.endTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="首次设置时间" width="180" align="center">
          <template v-if="scope.row.firstTime" slot-scope="scope">
            {{ new Date(scope.row.firstTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180" align="center">
          <template v-if="scope.row.lastTime" slot-scope="scope">
            {{ new Date(scope.row.lastTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="操作人" align="center" />
        <el-table-column label="账号当前状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isEnable == 1?"使用中":"" }}</span>
            <span>{{ scope.row.isEnable == 2?"禁用中":"" }}</span>
            <span>{{ scope.row.isEnable == 3?"已过期":"" }}</span>
            <span>{{ scope.row.isEnable == 4?"将到期":"" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" align="center" width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'findTimeList'" type="text" size="small"
              @click="setDate(scope.row)"
            >
              详情
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
  </div>
</template>

<script>
import Server from '../../../API/account'
export default {
  data () {
    return {
      ctName: '',
      phoneNum: '',
      userName: '',
      role: '',
      nickname: '',
      initiateOptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: '1',
        label: '使用中'
      }, {
        value: '2',
        label: '禁用中'
      }, {
        value: '3',
        label: '已过期'
      }, {
        value: '4',
        label: '将到期'
      }],
      initiateMode: '全部',
      tableData: {},
      currentPage: 1,
      pageSize: 10,
      loading: false
    }
  },
  created () {},
  mounted () {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    }
    this.getValidityList(params)
  },
  methods: {
    // 获取账户列表
    getValidityList (params) {
      this.loading = true
      Server.getValidityList(params).then((res) => {
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
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.ctName) {
        obj.abbreviation = this.ctName
      }
      if (this.phoneNum) {
        obj.mobile = this.phoneNum
      }
      if (this.userName) {
        obj.userName = this.userName
      }
      if (this.role) {
        obj.roleNames = this.role
      }
      if (this.nickname) {
        obj.nickName = this.nickname
      }
      if (this.initiateMode && this.initiateMode !== '全部') {
        obj.isEnable = Number(this.initiateMode)
      }
      this.getValidityList(obj)
    },
    setDate (val) {
      this.$router.push({
        path: '/account/validityAllocation/setValidity',
        query: { id: val.id }
      })
      this.$localstore.set('validityInfo', val)
    },
    formatPhone (val) {
      const reg = /(\d{3})\d{4}(\d{4})/
      return val && val.length === 11 ? val.replace(reg, '$1****$2') : val
    },
    handleSizeChange (val) {
      this.pageSize = val
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.ctName) {
        params.abbreviation = this.ctName
      }
      if (this.phoneNum) {
        params.mobile = this.phoneNum
      }
      if (this.userName) {
        params.userName = this.userName
      }
      if (this.role) {
        params.roleNames = this.role
      }
      if (this.nickname) {
        params.nickName = this.nickname
      }
      if (this.initiateMode && this.initiateMode !== '全部') {
        params.isEnable = Number(this.initiateMode)
      }
      this.getValidityList(params)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.ctName) {
        params.abbreviation = this.ctName
      }
      if (this.phoneNum) {
        params.mobile = this.phoneNum
      }
      if (this.userName) {
        params.userName = this.userName
      }
      if (this.role) {
        params.roleNames = this.role
      }
      if (this.nickname) {
        params.nickName = this.nickname
      }
      if (this.initiateMode && this.initiateMode !== '全部') {
        params.isEnable = Number(this.initiateMode)
      }
      this.getValidityList(params)
    }
  }
}
</script>

<style lang="less" scoped>
  .validityAllocation {
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
      height: 138px;
      padding: 0 20px;
      .topDiv {
        padding: 23px 10px 20px 0;
      }
      .topTitle {
        width: 80px;
        display: inline-block;
        text-align: right;
        padding-right: 5px;
        color: #333;
      }
      .btnContain {
        height: 138px;
        line-height: 138px;
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
.validityAllocation {
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
  .el-table__empty-text {
    line-height: normal;
  }
}
</style>
