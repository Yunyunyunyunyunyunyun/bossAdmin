<template>
  <div class="menuTemplate">
    <div class="firstTitle">
      <span>筛选查询</span>
    </div>
    <div class="firstContent">
      <el-row>
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">模板名称：</span>
            <el-input
              v-model="templateName" placeholder="请输入模板名称"
              size="medium" clearable
            />
          </div>
        </el-col>
        <el-col :span="10">
          <div class="topDiv">
            <span class="topTitle">创建时间：</span>
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              size="medium"
              clearable
              range-separator="~"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </div>
        </el-col>
        <el-col :span="8" class="btnContain">
          <span class="fr">
            <span class="tsdBtn mr16">
              <el-button
                v-has="'cloudSysTemplateGet'" type="primary" icon="el-icon-search"
                size="medium" @click="queryList()"
              >查询</el-button>
            </span>
            <span class="newBtn">
              <el-button
                v-has="'cloudSysTemplateAdd'" type="primary" icon="el-icon-plus"
                size="medium" plain @click="addTemplate"
              >新建模板</el-button>
            </span>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="secondTitle">
      <span>菜单模板列表</span>
    </div>
    <div>
      <el-table
        v-loading="loading" :data="tableData.list" :header-cell-style="$tableHeaderColor"
        border :class="{'commonHeight':!tableData.totalCount||tableData.totalCount&&tableData.totalCount === 0}"
      >
        <el-table-column prop="name" label="菜单模板名称" align="center" />
        <el-table-column prop="createUser" label="创建者" align="center" />
        <el-table-column label="创建时间" width="200" align="center">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ new Date(scope.row.createTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200" align="center">
          <template v-if="scope.row.updateTime" slot-scope="scope">
            {{ new Date(scope.row.updateTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark" label="备注" align="center"
          :show-overflow-tooltip="true" width="250"
        />
        <el-table-column
          label="操作" align="center" width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'cloudSysTemplateMenu'" type="text" size="small"
              @click="menuDetail(scope.row)"
            >
              菜单详情
            </el-button>
            <el-button
              v-has="'cloudSysTemplateUser'" type="text" size="small"
              @click="userDetail(scope.row)"
            >
              用户详情
            </el-button>
            <el-button
              v-has="'cloudSysTemplateFind'" type="text" size="small"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'cloudSysTemplateDelete'" type="text" size="small"
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
      title="用户详情"
      :visible.sync="userVisible"
      class="userDialog"
      width="480px"
      top="20vh"
    >
      <el-table :data="userData" height="400">
        <el-table-column
          property="name" label="客户名称" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          property="abbreviation" label="客户简称" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column property="userName" label="账号" align="center" />
      </el-table>
      <span slot="footer">
        <el-button
          type="primary" class="w90" size="medium"
          @click="userVisible = false"
        >关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="菜单详情"
      :visible.sync="menuVisible"
      class="menuDialog"
      width="480px"
      top="30vh"
    >
      <div class="treeContent">
        <el-tree :data="treeDataList" :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <span slot="footer">
        <el-button
          type="primary" class="w90" size="medium"
          @click="menuVisible = false"
        >关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="menuDelVisible"
      top="40vh"
      width="480px"
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <span class="dlTitle">是否确定删除菜单模板</span>
        <div class="dlMain">
          将删除此菜单模板所有信息，删除后无法恢复，请谨慎操作！
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="del()">确定</el-button>
        <el-button class="w90" @click="menuDelVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../../../API/authority'
export default {
  data () {
    return {
      templateName: '',
      dateValue: '',
      tableData: {},
      currentPage: 1,
      pageSize: 10,
      menuVisible: false,
      userVisible: false,
      userData: [],
      treeDataList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      routerName: '',
      loading: false,
      menuDelVisible: false,
      delMenuId: ''
    }
  },
  created () {},
  beforeRouteLeave (to, from, next) {
    to.meta.bname = this.routerName
    next()
  },
  mounted () {
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize
    }
    this.getTemplateList(params)
  },
  methods: {
    // 获取菜单模板列表
    getTemplateList (params) {
      this.loading = true
      Server.getTemplateList(params).then((res) => {
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
      if (this.templateName) {
        obj.name = this.templateName
      }
      if (this.dateValue) {
        obj.startTime = new Date(this.dateValue[0]).Format('yyyy-MM-dd hh:mm:ss')
        obj.endTime = new Date(this.dateValue[1]).Format('yyyy-MM-dd hh:mm:ss')
      }
      this.getTemplateList(obj)
    },
    menuDetail (val) {
      this.menuVisible = true
      const params = {
        id: val.id
      }
      Server.getTemplateInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.treeDataList = res.result
        }
      })
    },
    userDetail (val) {
      this.userVisible = true
      const params = {
        id: val.id
      }
      Server.templateUserInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.userData = res.result
        }
      })
    },
    edit (val) {
      this.routerName = '编辑'
      this.$router.push({
        path: '/authority/menuTemplate/templateOperate',
        query: { id: val.id, title: '编辑' }
      })
    },
    addTemplate () {
      this.routerName = '新建菜单模板'
      this.$router.push({
        path: '/authority/menuTemplate/templateOperate',
        query: { title: '新建' }
      })
    },
    deleted (val) {
      this.menuDelVisible = true
      this.delMenuId = val.id
    },
    del () {
      Server.cloudSysTemplateDel({ id: this.delMenuId }).then((res) => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.menuDelVisible = false
          const params = {
            page: this.currentPage,
            pageSize: this.pageSize
          }
          this.getTemplateList(params)
        }
      })
    },
    handleNodeClick (data) {
      console.log(data)
    },
    handleSizeChange (val) {
      this.pageSize = val
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.templateName) {
        params.name = this.templateName
      }
      if (this.dateValue) {
        params.startTime = new Date(this.dateValue[0]).Format('yyyy-MM-dd hh:mm:ss')
        params.endTime = new Date(this.dateValue[1]).Format('yyyy-MM-dd hh:mm:ss')
      }
      this.getTemplateList(params)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.templateName) {
        params.name = this.templateName
      }
      if (this.dateValue) {
        params.startTime = new Date(this.dateValue[0]).Format('yyyy-MM-dd hh:mm:ss')
        params.endTime = new Date(this.dateValue[1]).Format('yyyy-MM-dd hh:mm:ss')
      }
      this.getTemplateList(params)
    }
  }
}
</script>

<style lang="less" scoped>
  .menuTemplate {
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
    .mr16 {
      margin-right: 16px;
    }
    .w90 {
      width: 90px;
    }
    .w300 {
      width: 300px;
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
    .menuDialog {
      .treeContent {
        height: 350px;
        overflow: auto;
        margin: 0 auto;
      }
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
  }
</style>
<style lang="less">
.menuTemplate {
  .firstContent {
    .el-input {
      width: 172px;
    }
    .el-range-editor.el-input__inner {
      padding: 0 20px;
      .el-input__icon, .el-range-separator {
        line-height: 34px;
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
  .newBtn {
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
  .el-table__empty-text {
    line-height: normal;
  }
  .userDialog {
    .el-dialog__body {
      padding: 0 0 30px 0;
    }
    .el-dialog__footer {
      padding:0 20px 30px;
      text-align: center;
    }
  }
  .menuDialog {
    .el-tree .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    .el-tree .el-icon-caret-right:before {
        background: url("../../../../static/images/unfolder.png") no-repeat 0 0;
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        font-size: 16px;
        background-size: 16px;
    }
    .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        background: url(../../../../static/images/folder.png) no-repeat 0 0;
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        font-size: 16px;
        background-size: 16px;
    }
    .el-tree-node__expand-icon.is-leaf::before {
        display: none;
    }
    .el-tree-node__label {
      font-size: 12px;
      color: #333;
    }
    .el-dialog__body {
      padding: 30px 0px 30px 160px;
      border-bottom: 1px solid #dcdccc;
    }
    .el-dialog__footer {
      padding:30px 20px;
      text-align: center;
    }
  }
}
</style>
