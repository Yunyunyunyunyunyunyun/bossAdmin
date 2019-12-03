<template>
  <div class="system-role">
    <pubFilters
      :title="filterConfig.title"
      :btn-val="filterConfig.btnVal"
      :has-value="filterConfig.hasValue"
      :inputs="filterConfig.inputs"
      :date="filterConfig.date"
      @search="search"
      @btnEvent="linkDetail"
    />
    <div class="secondTitle">
      <span>系统角色列表</span>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="result.list"
        :header-cell-style="$tableHeaderColor"
        border
      >
        >
        <el-table-column
          prop="name" label="角色名称" align="center"
          width="120"
        />
        <el-table-column prop="createUserName" label="创建人" align="center" />
        <el-table-column
          prop="createTime" label="创建时间" align="center"
          width="200"
        />
        <el-table-column
          prop="identify" label="标识" align="center"
          width="120"
        />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span class="status-text">{{ scope.row.isEnable?'禁用':'启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联用户数" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="getAssociatedUser(scope.row)">
              {{ scope.row.userNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="角色描述"
          align="center"
          :show-overflow-tooltip="true"
          width="250"
        />
        <el-table-column
          label="操作" align="center" fixed="right"
          width="250"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="linkDetail(1,scope.row)">
              查看
            </el-button>
            <el-button
              v-has="'sysRoleEdit'" type="text" size="small"
              @click="linkDetail(2,scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'sysRoleDel'" type="text" size="small"
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
        background
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="result.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="删除提示" :visible.sync="dialogVisible" top="40vh"
      width="480px"
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <div class="dlTitle">
          {{ isDel?'此角色含有相关用户，全部剔除用户后方可删除':'是否确定删除此角色' }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div v-if="isDel">
          <el-button class="w90" @click="dialogVisible = false">关闭</el-button>
        </div>
        <div v-else>
          <el-button type="primary" class="w90" @click="fixedDelete">确定</el-button>
          <el-button class="w90" @click="dialogVisible = false">取消</el-button>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      title="角色用户" :visible.sync="dialogTableVisible" class="table-dialog"
      center
    >
      <el-table :data="userResult.list">
        <el-table-column property="username" label="用户名" align="center"></el-table-column>
        <el-table-column property="nickname" label="昵称" align="center"></el-table-column>
        <el-table-column property="phone" label="手机号" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../../../API/system'
import pubFilters from '../../../components/pub-filters'
export default {
  components: {
    pubFilters
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      loading: false,
      dialogVisible: false,
      dialogTableVisible: false,
      isDel: false,
      filterConfig: {
        title: '筛选查询',
        btnVal: '新建角色',
        hasValue: [
          'sysRoleFind',
          'sysRoleAdd'
        ],
        inputs: [
          {
            title: '角色',
            inputValue: '',
            placeholder: '请输入角色名称'
          },
          {
            title: '标识',
            inputValue: '',
            placeholder: '请输入标识'
          }
        ],
        date: [
          {
            title: '创建时间',
            type: 'daterange',
            dateVale: ''
          }
        ]
      },
      result: {
        list: [],
        totalCount: 0
      },
      userResult: {
        list: [],
        totalCount: 0
      }
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getSystemRole()
    },
    getSystemRole () {
      let startTime = 0
      let endTime = 0
      const name = this.filterConfig.inputs[0].inputValue
      const identify = this.filterConfig.inputs[1].inputValue
      const date = this.filterConfig.date[0].dateVale
      if (date) {
        startTime = new Date(date[0]).getTime()
        endTime = new Date(date[1]).getTime()
      }
      const data = {
        name,
        identify,
        startTime,
        endTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      this.loading = true
      Server.systemRole(data)
        .then(res => {
          const { result } = res
          this.loading = false
          this.result = result
        })
        .catch(() => {
          this.loading = false
        })
    },
    getAssociatedUser (item) {
      const userNum = item.userNum
      if (!userNum) return false
      const id = item.id
      Server.associatedUser(id).then(res => {
        this.dialogTableVisible = true
        this.userResult = res.result
      })
    },
    fixedDelete () {
      this.dialogVisible = false
      const data = {
        id: this.currentId,
        updateUser:
          JSON.parse(localStorage.getItem('bossadmin_user') || '{}').id || ''
      }
      Server.delSystemRole(data).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getSystemRole()
      })
    },
    search () {
      this.currentPage = 1
      this.getSystemRole()
    },
    linkDetail (type, item) {
      this.$router.push({
        path: '/system/systemRole/addSystemRole',
        query: {
          type,
          detail: encodeURI(JSON.stringify(item))
        }
      })
    },
    deleted (item) {
      // if (item.userNum) {
      //   this.$message.error('此角色含有相关用户，全部剔除用户后方可删除')
      //   return false
      // }
      this.currentId = item.id
      this.isDel = item.userNum
      this.dialogVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getSystemRole()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getSystemRole()
    }
  }
}
</script>
// 全局样式
<style lang="less">
.system-role {
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
  .el-pagination {
    text-align: center;
    padding: 20px 5px;
  }
  .table-dialog {
    .el-dialog__body {
      padding: 0;
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
      text-align: left;
    }
  }
}
</style>

<style lang="less" scoped>
.system-role {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
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
  .empty {
    height: 103px;
    margin: 20px 0;
    .efont {
      font-weight: 500;
      font-size: 14px;
      color: #a2a6ac;
      margin-top: 15px;
    }
  }
  .el-button--text {
    padding: 0;
  }
}
</style>
