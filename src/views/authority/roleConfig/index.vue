<template>
  <div class="roleConfig">
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
        <el-col :span="6">
          <div class="topDiv">
            <span class="topTitle">角色名称：</span>
            <el-input
              v-model="roleName" placeholder="请输入角色名称"
              size="medium" clearable
            />
          </div>
        </el-col>
        <el-col :span="7">
          <div class="topDiv">
            <span class="topTitle">创建时间：</span>
            <el-date-picker
              v-model="dateValue"
              class="queryDate"
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
        <el-col :span="5" class="btnContain">
          <span class="fr">
            <span class="tsdBtn mr16">
              <el-button
                v-has="'cloudSysRoleGet'" type="primary" icon="el-icon-search"
                size="medium" @click="queryList()"
              >查询</el-button>
            </span>
            <span class="newBtn">
              <el-button
                v-has="'cloudSysRoleEdit'" type="primary" icon="el-icon-plus"
                size="medium" plain @click="addRole"
              >新建角色</el-button>
            </span>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="secondTitle">
      <span>角色列表</span>
    </div>
    <div>
      <el-table
        v-loading="loading" :data="tableData.list" :header-cell-style="$tableHeaderColor"
        border :class="{'commonHeight':!tableData.list||tableData.list&&tableData.list.length === 0}"
        row-key="id" :tree-props="{children: 'son'}"
      >
        <el-table-column prop="temName" label="菜单模板名称" align="center" />
        <el-table-column prop="name" label="角色名称" align="center" />
        <el-table-column prop="createUser" label="创建人" align="center" />
        <el-table-column label="创建时间" width="200" align="center">
          <template v-if="scope.row.createTime" slot-scope="scope">
            {{ new Date(scope.row.createTime).Format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column prop="identify" label="标识" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isEnable == 0?"启用":"" }}</span>
            <span>{{ scope.row.isEnable == 1?"禁用":"" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subNum" label="子角色" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.subNum!==0" v-has="'cloudSysRoleGetSubList'"
              type="text" size="small" @click="viewChdRole(scope.row)"
            >
              {{ scope.row.subNum }}
            </el-button>
            <span v-else>{{ scope.row.subNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="users" label="关联用户数" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.users!==0" v-has="'cloudSysRoleUser'"
              type="text" size="small" @click="viewUsers(scope.row)"
            >
              {{ scope.row.users }}
            </el-button>
            <span v-else>{{ scope.row.users }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark" label="角色描述" align="center"
          :show-overflow-tooltip="true" width="250"
        />
        <el-table-column
          label="操作" align="center" width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'cloudSysRoleView'" type="text" size="small"
              @click="viewRole(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.identify!=='inspec'&&scope.row.identify!=='qick'" v-has="'cloudSysRoleEdit'" type="text"
              size="small" @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.identify!=='inspec'&&scope.row.identify!=='qick'" v-has="'cloudSysRoleDelete'" type="text" size="small"
              @click="removeRole(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.pId==='0'"
              type="text" size="small"
              @click="addChdRole(scope.row)"
            >
              +子角色
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
    </div>
    <el-dialog
      title="删除提示"
      :visible.sync="dialogVisible"
      top="40vh"
      width="510px"
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <div class="dlTitle">
          是否确定删除此角色
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="del()">确定</el-button>
        <el-button class="w90" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="warnVisible"
      class="warnDialog"
      top="40vh"
      width="510px"
    >
      <div class="dlContent">
        <img src="../../../../static/images/warning.svg">
        <div class="dlTitle">
          此角色含有相关用户，全部剔除后方可删除
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="warnVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关联子角色"
      :visible.sync="chdUserVisible"
      class="commonUserDialog"
      width="480px"
      top="20vh"
    >
      <el-table v-loading="chdUserLoading" :data="chdUserData" height="400">
        <el-table-column
          property="temName" label="菜单模板" align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          property="roleName" label="子角色名称" align="center"
          :show-overflow-tooltip="true"
        />
      </el-table>
      <span slot="footer">
        <el-button
          type="primary" class="w90" size="medium"
          @click="chdUserVisible = false"
        >关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色用户"
      :visible.sync="usersVisible"
      class="commonUserDialog"
      width="480px"
      top="20vh"
    >
      <el-table v-loading="usersLoading" :data="usersData" height="400">
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
      </el-table>
      <span slot="footer">
        <el-button
          type="primary" class="w90" size="medium"
          @click="usersVisible = false"
        >关闭</el-button>
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
      roleName: '',
      dateValue: '',
      tableData: {},
      routerName: '',
      dialogVisible: false,
      warnVisible: false,
      delRoleId: '',
      chdUserVisible: false,
      chdUserLoading: false,
      chdUserData: [],
      usersVisible: false,
      usersLoading: false,
      usersData: [],
      loading: false,
      screenWidth: window.innerWidth,
      dialogUsers: 0
    }
  },
  watch: {
    screenWidth: function (val) {
      if (val <= 1366) {
        document.getElementsByClassName('queryDate')[0].style.width = '216px'
        document.getElementsByClassName('el-range-editor')[0].style.padding = '0 10px'
      } else {
        document.getElementsByClassName('queryDate')[0].style.width = Math.floor((val - 296) * (7 / 24)) - 123 + 'px'
        document.getElementsByClassName('el-range-editor')[0].style.padding = '0 20px'
      }
    }
  },
  created () {},
  beforeRouteLeave (to, from, next) {
    to.meta.bname = this.routerName
    next()
  },
  mounted () {
    this.getRoleConfigList({})
    window.onresize = () => {
      return (() => {
        window.screenWidth = window.innerWidth
        this.screenWidth = window.screenWidth
      })()
    }
    if (this.screenWidth <= 1366) {
      document.getElementsByClassName('queryDate')[0].style.width = '216px'
      document.getElementsByClassName('el-range-editor')[0].style.padding = '0 10px'
    } else {
      document.getElementsByClassName('queryDate')[0].style.width = Math.floor((this.screenWidth - 296) * (7 / 24)) - 123 + 'px'
      document.getElementsByClassName('el-range-editor')[0].style.padding = '0 20px'
    }
  },
  methods: {
    // 获取角色配置列表
    getRoleConfigList (params) {
      this.loading = true
      Server.getRoleList(params).then((res) => {
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
      const obj = {}
      if (this.templateName) {
        obj.temName = this.templateName
      }
      if (this.roleName) {
        obj.name = this.roleName
      }
      if (this.dateValue) {
        obj.startTime = new Date(this.dateValue[0]).Format('yyyy-MM-dd hh:mm:ss')
        obj.endTime = new Date(this.dateValue[1]).Format('yyyy-MM-dd hh:mm:ss')
      }
      this.getRoleConfigList(obj)
    },
    viewRole (val) {
      this.$router.push({
        path: '/authority/roleConfig/viewRole',
        query: { id: val.id }
      })
    },
    removeRole (val) {
      this.dialogUsers = Number(val.users)
      if (Number(val.users) === 0) {
        this.delRoleId = val.id
        this.dialogVisible = true
      } else {
        this.warnVisible = true
      }
    },
    del () {
      Server.deleteRole({ id: this.delRoleId }).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getRoleConfigList({})
        }
      })
    },
    edit (val) {
      this.routerName = '编辑'
      this.$router.push({
        path: '/authority/roleConfig/roleOperate',
        query: { id: val.id, title: '编辑' }
      })
    },
    addChdRole (val) {
      this.routerName = '添加子角色'
      this.$router.push({
        path: '/authority/roleConfig/roleOperate',
        query: { id: val.id, title: '添加子角色' }
      })
    },
    viewChdRole (val) {
      this.chdUserData = []
      this.chdUserVisible = true
      this.chdUserLoading = true
      const params = {
        id: val.id
      }
      Server.getChildRoleList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.chdUserData = res.result.list
          this.chdUserLoading = false
        }
      }).catch(() => {
        this.chdUserLoading = false
      })
    },
    viewUsers (val) {
      this.usersData = []
      this.usersVisible = true
      this.usersLoading = true
      const params = {
        id: val.id
      }
      Server.getRoleUsersList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.usersData = res.result.list
          this.usersLoading = false
        }
      }).catch(() => {
        this.usersLoading = false
      })
    },
    addRole () {
      this.routerName = '新建角色'
      this.$router.push({
        path: '/authority/roleConfig/roleOperate',
        query: { title: '新建角色' }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .roleConfig {
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
    .empty {
      height: 103px;
      .efont {
        font-weight: 500;
        font-size: 14px;
        color: #a2a6ac;
        margin-top: 15px;
      }
    }
    .dlContent {
      padding-left: 15px;
      .dlTitle {
        position: absolute;
        top: 82px;
        left: 94px;
        width: 396px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
      }
    }
  }
</style>
<style lang="less">
.roleConfig {
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
  .commonUserDialog {
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
      padding:0 20px 30px;
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
