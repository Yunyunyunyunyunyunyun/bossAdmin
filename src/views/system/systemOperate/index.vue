<template>
  <div class="system-user">
    <pubFilters
      :title="filterConfig.title"
      :inputs="filterConfig.inputs"
      :has-value="filterConfig.hasValue"
      :date="filterConfig.date"
      @search="search"
    />
    <div class="secondTitle">
      <span>操作日志列表</span>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="result.list"
        :header-cell-style="$tableHeaderColor"
        border
      >
        >
        <el-table-column prop="id" label="编号" align="center" />
        <el-table-column prop="userName" label="操作人员" align="center" />
        <el-table-column prop="createDate" label="操作日期" align="center" />
        <el-table-column prop="userIp" label="IP地址" align="center" />
        <el-table-column
          prop="content"
          label="操作记录"
          align="center"
          :show-overflow-tooltip="true"
          width="250"
        />
        <template slot="empty">
          <div class="empty">
            <img src="../../../../static/images/noData.png">
            <div class="efont">
              暂时没有数据
            </div>
          </div>
        </template>
      </el-table>
      <div v-if="result.totalCount>10">
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
    </div>
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
      filterConfig: {
        title: '筛选查询',
        hasValue: [
          'logFind'
        ],
        inputs: [
          {
            title: '操作人员',
            inputValue: ''
          }
        ],
        date: [
          {
            title: '操作日期',
            type: 'month',
            dateVale: new Date().setDate(1)
          }
        ]
      },
      result: {
        list: [],
        totalCount: 0
      }
    }
  },
  created: function () {
    this.getLog()
  },
  methods: {
    getLog () {
      let startDate = ''
      let endDate = ''
      const userName = this.filterConfig.inputs[0].inputValue
      const date = this.filterConfig.date[0].dateVale
      const curDate = new Date(date).getTime()
      if (date) {
        startDate = new Date(date).Format('yyyy-MM-dd')
        endDate = new Date(curDate + 86400000 * 30).Format('yyyy-MM-dd')
      } else {
        startDate = new Date().Format('yyyy-MM-dd')
        endDate = new Date().Format('yyyy-MM-dd')
      }
      const data = {
        userName,
        startDate,
        endDate,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      this.loading = true
      Server.log(data).then(res => {
        this.loading = false
        const result = res.result
        this.result = result
      })
    },
    search () {
      this.currentPage = 1
      this.getLog()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getLog()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getLog()
    }
  }
}
</script>

<style lang="less">
.system-user {
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
}
</style>
