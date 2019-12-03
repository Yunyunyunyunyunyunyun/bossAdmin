<template>
  <div class="accountConfig">
    <div class="firstTitle">
      <span>数据筛选</span>
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
          <span class="topTitle">启用状态：</span>
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
            <span class="tsdBtn mr16">
              <el-button
                v-has="'accountFind'" type="primary" icon="el-icon-search"
                size="medium" @click="queryList()"
              >查询</el-button>
            </span>
            <span class="seBtn">
              <el-button
                v-has="'accountAdd'" type="primary" icon="el-icon-plus"
                size="medium" plain @click="addAccount"
              >新建账户</el-button>
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
        <el-table-column prop="abbreviation" label="客户简称" align="center" />
        <el-table-column prop="templateName" label="绑定菜单模板" align="center" />
        <el-table-column prop="userName" label="用户名" align="center" />
        <el-table-column prop="nickName" label="昵称" align="center" />
        <el-table-column
          prop="mobile" label="手机号" align="center"
          width="200"
        />
        <el-table-column label="创建时间" width="200" align="center">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ new Date(scope.row.createTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column prop="roleNames" label="角色" align="center" />
        <el-table-column prop="sonSize" label="子账号" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.sonSize!==0" type="text"
              size="small" @click="viewSons(scope.row)"
            >
              {{ scope.row.sonSize }}
            </el-button>
            <span v-else>{{ scope.row.sonSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isEnable == 0?"启用":"" }}</span>
            <span>{{ scope.row.isEnable == 1?"禁用":"" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" align="center" width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'accountInfo'" type="text" size="small"
              @click="viewPage(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-has="'accountAdd'" type="text" size="small"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'accountDelete'" type="text" size="small"
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
      :class="{warnDialog: !showSure}"
    >
      <div class="dlContent">
        <img v-if="showSure" src="../../../../static/images/qmark.png">
        <img v-else src="../../../../static/images/warning.svg">
        <span class="dlTitle">
          {{ showSure ? '是否确定删除此账号' : '此账号含有相关子账号，不允许删除' }}
        </span>
        <div class="dlMain">
          <span v-if="showSure">将彻底删除此账号相关信息，请谨慎操作！</span>
          <span v-else>需将所有子账号的关联角色全部剔除后方可删除！</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="showSure" type="primary" class="w90"
          @click="del()"
        >确定</el-button>
        <el-button class="w90" :type="showSure?'default':'primary'" @click="dialogVisible = false">
          {{ showSure ? '取消' : '关闭' }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="子账号"
      :visible.sync="sonVisible"
      class="sonDialog"
      width="480px"
      top="20vh"
    >
      <el-table v-loading="sonLoading" :data="sonData" height="400">
        <el-table-column
          property="userName" label="用户名" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          property="nickName" label="昵称" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          property="mobile" label="手机号" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          property="roleNames" label="关联角色" align="center"
          :show-overflow-tooltip="true"
        />
      </el-table>
      <span slot="footer">
        <el-button
          type="primary" class="w90" size="medium"
          @click="sonVisible = false"
        >关闭</el-button>
      </span>
    </el-dialog>
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
        value: 0,
        label: '启用'
      }, {
        value: 1,
        label: '禁用'
      }],
      initiateMode: '全部',
      tableData: {},
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      routerName: '',
      accountId: '',
      loading: false,
      sonVisible: false,
      sonLoading: false,
      sonData: [],
      showSure: false
    }
  },
  created () {},
  mounted () {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    }
    this.getAccountList(params)
  },
  beforeRouteLeave (to, from, next) {
    to.meta.bname = this.routerName
    next()
  },
  methods: {
    // 获取账户列表
    getAccountList (params) {
      this.loading = true
      Server.getAccountList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.tableData = res.result
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
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
      if (this.initiateMode !== '全部') {
        obj.isEnable = this.initiateMode
      }
      this.getAccountList(obj)
    },
    viewSons (val) {
      this.sonData = []
      this.sonVisible = true
      this.sonLoading = true
      const params = {
        id: val.id
      }
      Server.queryChildAccount(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.sonData = res.result.list
          this.sonLoading = false
        }
      }).catch(() => {
        this.sonLoading = false
      })
    },
    viewPage (val) {
      this.$router.push({
        path: '/account/accountConfig/viewAccount',
        query: { id: val.id }
      })
    },
    edit (val) {
      this.routerName = '编辑账号'
      this.$router.push({
        path: '/account/accountConfig/accountOperate',
        query: { title: '编辑账号', id: val.id }
      })
    },
    deleted (val) {
      if (Number(val.sonSize) === 0) {
        this.accountId = val.id
        this.showSure = true
      } else {
        this.showSure = false
      }
      this.dialogVisible = true
    },
    del () {
      this.dialogVisible = false
      Server.deleteAccount({ id: this.accountId }).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          const params = {
            page: this.currentPage,
            pageSize: this.pageSize
          }
          this.getAccountList(params)
        }
      })
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
      if (this.initiateMode !== '全部') {
        params.isEnable = this.initiateMode
      }
      this.getAccountList(params)
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
      if (this.initiateMode !== '全部') {
        params.isEnable = this.initiateMode
      }
      this.getAccountList(params)
    },
    addAccount () {
      this.routerName = '新建账号'
      this.$router.push({
        path: '/account/accountConfig/accountOperate',
        query: { title: '新建账号' }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .accountConfig {
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
    .mr16 {
      margin-right: 16px;
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
.accountConfig {
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
  .seBtn {
    .el-button--medium {
      padding: 10px;
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
  .sonDialog {
    .el-dialog__body {
      padding: 0 0 30px 0;
    }
    .el-dialog__footer {
      padding:0 20px 30px;
      text-align: center;
    }
  }
  .warnDialog {
    .el-dialog__footer {
      text-align: center;
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

