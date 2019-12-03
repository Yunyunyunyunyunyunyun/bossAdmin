<template>
  <div class="system-msg">
    <pubFilters
      :title="filterConfig.title"
      :btn-val="filterConfig.btnVal"
      :has-value="filterConfig.hasValue"
      :inputs="filterConfig.inputs"
      :select="filterConfig.select"
      :date="filterConfig.date"
      @search="search"
      @btnEvent="linkDetail({},1)"
    />
    <div class="secondTitle">
      <span>系统用户列表</span>
      <el-button
        v-has="'sysMessageDel'"
        type="primary" plain size="small"
        class="def-btn"
        @click="deleted(2)"
      >
        批量删除
      </el-button>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="result.list"
        :header-cell-style="$tableHeaderColor"
        border
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column
          type="selection"
          align="center"
          width="60"
        />
        <el-table-column
          prop="id" label="编号" align="center"
          width="120"
        />
        <el-table-column prop="publisher" label="发布者" align="center" />
        <el-table-column prop="status" label="发布状态" align="center" />
        <el-table-column prop="publishTime" label="发布时间" align="center" />
        <el-table-column prop="receiveAccount" label="接收账户" align="center" />
        <el-table-column
          prop="title"
          label="标题"
          align="center"
          :show-overflow-tooltip="true"
          width="250"
        />
        <el-table-column
          label="操作" align="center" fixed="right"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'sysMessageDetail'" type="text" size="small"
              @click="linkDetail(scope.row,2)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.status!=='已发布'" v-has="'sysMessageEdit'" type="text" size="small"
              @click="linkDetail(scope.row,3)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'sysMessageDel'" type="text" size="small"
              @click="deleted(1,scope.row)"
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
          是否确定删除消息
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="fixedDelete">确定</el-button>
        <el-button class="w90" @click="dialogVisible = false">取消</el-button>
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
      currentId: '',
      currentPage: 1,
      delType: 1,
      pageSize: 10,
      loading: false,
      dialogVisible: false,
      idList: [],
      filterConfig: {
        title: '筛选查询',
        btnVal: '新建',
        hasValue: [
          'sysMessageFind',
          'sysMessageAdd'
        ],
        select: [
          {
            title: '接收账户',
            selectedVal: '',
            options: [
              {
                value: '0',
                label: '全部'
              },
              {
                value: '1',
                label: '指定'
              }
            ]
          }
        ],
        inputs: [
          {
            title: '标题关键字',
            inputValue: ''
          }
        ],
        date: [
          {
            title: '发布时间',
            type: 'daterange'
          }
        ]
      },
      result: {
        list: [],
        totalCount: 0
      }
    }
  },
  created () {
    this.getMessageList()
  },
  methods: {
    getMessageList () {
      this.loading = true
      let startTime = ''
      let endTime = ''
      const title = this.filterConfig.inputs[0].inputValue
      const date = this.filterConfig.date[0].dateVale
      const receiveAccount = this.filterConfig.select[0].selectedVal
      if (date) {
        startTime = new Date(date[0]).Format('yyyy-MM-dd hh:mm:ss')
        endTime = new Date(date[1]).Format('yyyy-MM-dd hh:mm:ss')
      }
      const data = {
        title,
        receiveAccount,
        startTime,
        endTime,
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }
      Server.messageList(data).then(res => {
        this.loading = false
        const { list, totalCount } = res.result
        this.result = {
          list,
          totalCount
        }
      })
    },
    search () {
      this.currentPage = 1
      this.getMessageList()
    },
    linkDetail (item, type) {
      // type 1 新建 2 查看 3 编辑
      const id = item && item.id || ''
      this.$router.push({
        path: '/system/systemMsg/addSystemMsg',
        query: {
          type,
          id
        }
      })
    },
    fixedDelete () {
      this.dialogVisible = false
      const id = this.delType === 1 ? this.currentId.toString() : this.idList.toString()
      Server.delMsg(id).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getMessageList()
      })
    },
    deleted (type, item) {
      // type 1 单个删除 2批量删除
      this.delType = type
      this.currentId = item && item.id || ''
      if (this.delType === 2) {
        if (this.idList.length) {
          this.dialogVisible = true
        } else {
          this.$message.error('抱歉没有选择批量删除的项')
        }
      } else {
        this.dialogVisible = true
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getMessageList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getMessageList()
    },
    handleSelectionChange (items) {
      this.idList = []
      for (let i = 0; i < items.length; i++) {
        this.idList.push(items[i].id)
      }
    }
  }
}
</script>

<style lang="less">
.system-msg {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  .secondTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e6e6e6;
    border-bottom: none;
    height: 52px;
    margin-top: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    >span{
      font-size: 16px;
      color: #333;
    }
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
  .deatil-dialog {
    width: 40%;
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
    .el-dialog__body {
      padding-left: 10%;
      padding-right: 12%;
      border-bottom: 1px solid #dcdccc;
    }
  }
}
</style>
