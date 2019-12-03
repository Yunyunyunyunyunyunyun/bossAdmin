<template>
  <div class="system-menu">
    <pubFilters
      :title="filterConfig.title"
      :has-value="filterConfig.hasValue"
      :inputs="filterConfig.inputs"
      :select="filterConfig.select"
      @search="search"
    />
    <div class="secondTitle">
      <span>系统菜单列表</span>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="result.list"
        :header-cell-style="$tableHeaderColor"
        row-key="id"
        border
        :tree-props="{children: 'children'}"
      >
        >
        <el-table-column
          prop="name" label="菜单名称" align="center"
          width="200"
        />
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.mType==0" class="type-btn">
              目录
            </div>
            <div v-if="scope.row.mType==1" class="type-btn" style="backgroundColor:#63C100;">
              页面
            </div>
            <div v-if="scope.row.mType==2" class="type-btn" style="backgroundColor:#F7B500;">
              按钮
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="mUrl" label="请求地址" width="260"
          align="center"
        />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div class="status">
              <div
                class="status-icon"
                :style="{'backgroundColor':scope.row.isEnable?'#CCCCCC':'#63C100'}"
              />
              <span class="status-text">{{ scope.row.isEnable?'隐藏':'显示' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          :show-overflow-tooltip="true"
          width="250"
        />
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              v-has="'menuEdit'" type="text" size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'menuDel'" type="text" size="small"
              @click="deleted(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.mType==0||scope.row.mType==1"
              v-has="'menuSameLevel'"
              type="text"
              size="small"
              @click="addSystemMenu(scope.row,1)"
            >
              +同级菜单
            </el-button>
            <el-button
              v-if="scope.row.mType==0||scope.row.mType==1"
              v-has="'menuChild'"
              type="text"
              size="small"
              @click="addSystemMenu(scope.row,2)"
            >
              +子级菜单
            </el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div style="margin: 20px 0;" class="empty">
            <img src="../../../../static/images/noData.png">
            <div class="efont">
              暂时没有数据
            </div>
          </div>
        </template>
      </el-table>
    </div>
    <el-dialog
      title="删除提示" :visible.sync="dialogVisible" top="40vh"
      width="480px"
    >
      <div class="dlContent">
        <img src="../../../../static/images/qmark.png">
        <span class="dlTitle">是否确定删除菜单</span>
        <div class="dlMain">
          删除后相关联的角色将失去此权限，请谨慎操作！
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="w90" @click="fixedDelete()">确定</el-button>
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
      loading: false,
      currentId: '', // 当前操作的菜单ID
      currentParentMenuId: '',
      filterConfig: {
        title: '筛选查询',
        hasValue: ['menuFind'],
        inputs: [
          {
            title: '菜单名称',
            inputValue: '',
            placeholder: '请填写菜单名称'
          }
        ],
        select: [
          {
            title: '类型',
            selectedVal: '',
            options: [
              {
                value: '',
                label: '全部'
              },
              {
                value: '0',
                label: '目录'
              },
              {
                value: '1',
                label: '页面'
              },
              {
                value: '2',
                label: '按钮'
              }
            ]
          }
        ]
      },
      result: {
        list: [],
        totalCount: 0
      },
      dialogVisible: false
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.getSystemMenuList()
    },
    getSystemMenuList () {
      const name = this.filterConfig.inputs[0].inputValue
      const mType = this.filterConfig.select[0].selectedVal
      const query = {
        name,
        mType,
        page: 1,
        pageSize: 100
      }
      this.loading = true
      Server.systemMenu(query)
        .then(res => {
          const { result } = res
          this.loading = false
          this.result = result
        })
        .catch(() => {
          this.loading = false
        })
    },
    search () {
      this.getSystemMenuList()
    },
    deleted (item) {
      this.dialogVisible = true
      this.currentId = item.id
      this.currentParentMenuId = item.pId
    },
    fixedDelete () {
      this.dialogVisible = false
      Server.delSystemMenu(this.currentId).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getSystemMenuList()
      })
    },
    addSystemMenu (item = {}, level = 1) {
      const menuName = item.name
      const menuType = item.mType
      const reqAddress = item.mUrl
      const parentMenuId = item.pId
      const id = item.id
      this.$router.push({
        path: '/system/systemMenu/addSystemMenu',
        query: {
          menuName,
          menuType,
          parentMenuId,
          id,
          level,
          reqAddress
        }
      })
    },
    handleEdit (item) {
      this.$router.push({
        path: '/system/systemMenu/addSystemMenu',
        query: {
          detail: encodeURI(JSON.stringify(item))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.system-menu {
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
  }
  .type-btn {
    width: 50px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 2px;
    color: #fff;
    font-size: 12px;
    background-color: #4c8cf8;
    margin: 0 auto;
  }
  .status {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666666;
    .status-icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
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
  .el-button--text{
    padding: 0;
  }
}
</style>
