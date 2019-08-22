<template>
  <div class="customerInfo">
    <div class="firstTitle"><span>数据筛选</span></div>
    <div class="firstContent">
      客户名称：<el-input v-model="customerName" placeholder="请输入客户名称" class="mr30" size="medium"></el-input>
      手机号：<el-input v-model="phoneNum" placeholder="请输入手机号" class="mr30" size="medium"></el-input>
      客户类型：
      <el-select v-model="customerType" placeholder="请选择" size="medium">
        <el-option
          v-for="item in customerOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="fr">
        <el-button type="primary" icon="el-icon-search" size="medium">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" size="medium" plain>新建</el-button>
      </span>
    </div>
    <div class="secondTitle">
      <span>客户列表</span>
      <span class="fr">
        <el-button type="primary" size="medium" icon="el-icon-upload2" plain>批量导出</el-button>
      </span>
    </div>
    <div>
      <el-table :data="tableData.list" :header-cell-style="$tableHeaderColor" border height="542">
        <el-table-column prop="ctName" label="客户名称" width="200" align="center">
        </el-table-column>
        <el-table-column prop="ct" label="客户简称" align="center">
        </el-table-column>
        <el-table-column prop="cn" label="业务联系人" align="center">
        </el-table-column>
        <el-table-column prop="pn" label="手机号" align="center">
        </el-table-column>
        <el-table-column label="客户类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ctType == 10?"自营":""}}</span>
            <span>{{scope.row.ctType == 20?"国企":""}}</span>
            <span>{{scope.row.ctType == 30?"私企":""}}</span>
          </template>
        </el-table-column>
        <el-table-column label="归属战区" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.addr == 10?"总部":""}}</span>
            <span>{{scope.row.addr == 20?"西部战区":""}}</span>
            <span>{{scope.row.addr == 30?"南部战区":""}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200" align="center">
          <template slot-scope="scope">
            {{new Date(scope.row.createdAt).Format("yyyy-MM-dd hh:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewPage(scope.row)">
              查看
            </el-button>
            <el-button type="text" size="small" @click="edit(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="deleted(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      customerName: '',
      phoneNum: '',
      customerOptions: [{
        value: '选项1',
        label: '全部'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      customerType: '选项1',
      tableData: {
        list: [
          {
            ctName: '猫先生环保科技有限公司',
            ct: '公司总部',
            cn: '顾泽坤',
            pn: '150****2123',
            ctType: 10,
            addr: 10,
            createdAt: '2019-07'
          }, {
            ctName: '猫先生环保科技有限公司',
            ct: '公司总部',
            cn: '顾泽坤',
            pn: '150****2123',
            ctType: 10,
            addr: 10,
            createdAt: '2019-07'
          }
        ],
        total: 32
      },
      currentPage: 1,
      pageSize: 10
    }
  },
  created () {},
  methods: {
    viewPage () {},
    edit () {},
    deleted () {},
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    }
  }
}
</script>

<style lang="less" scoped>
  .customerInfo {
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
      line-height: 90px;
      padding: 0 20px;
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
    .mr30 {
      margin-right: 30px;
    }
  }
</style>
<style lang="less">
.customerInfo {
  .firstContent {
    .el-input, .el-select {
      width: 200px;
    }
  }
  .el-table th, .el-table td {
    padding: 8px 0;
  }
  .el-pagination {
    text-align: center;
    padding: 20px 5px;
  }
}
</style>
