<template>
  <div class="menuConfig">
    <div class="firstTitle">
      <span>筛选查询</span>
    </div>
    <div class="firstContent">
      <el-row>
        <el-col :span="8">
          <div class="topDiv">
            <span class="topTitle">菜单名称：</span>
            <el-input
              v-model="menuName" placeholder="请输入菜单名称"
              size="medium" clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="topDiv">
            <span class="topTitle">菜单类型：</span>
            <el-select
              v-model="menuType" placeholder="请选择" size="medium"
              clearable
            >
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" class="btnContain">
          <span class="fr">
            <span class="tsdBtn mr16">
              <el-button
                v-has="'cloudSysMenuFind'" type="primary" icon="el-icon-search"
                size="medium" @click="queryList()"
              >查询</el-button>
            </span>
            <span class="newBtn">
              <el-button
                v-has="'cloudSysMenuAdd'" type="primary" icon="el-icon-plus"
                size="medium" plain @click="addCatalog"
              >新建目录</el-button>
            </span>
          </span>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="mt20">
      <el-table
        ref="multipleTable" v-loading="loading" :data="tableSource"
        :header-cell-style="$tableHeaderColor" border row-key="id" :tree-props="{children: 'children'}"
        :class="{'commonHeight':!tableSource||tableSource&&tableSource.length === 0}"
      >
        <el-table-column prop="name" label="菜单名称" align="center" />
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column prop="mType" label="类型" align="center">
          <template slot-scope="scope">
            <div :class="{'firstColor': scope.row.mType === 0, 'secondColor': scope.row.mType === 1, 'thirdColor': scope.row.mType === 2}">
              {{ scope.row.mType | typeFilter }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mUrl" label="请求地址" align="center" />
        <el-table-column prop="isEnable" label="状态" align="center">
          <template slot-scope="scope">
            <span :class="{'showStyle': scope.row.isEnable === 0, 'hiddenStyle': scope.row.isEnable === 1}" />
            <span>{{ scope.row.isEnable | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark" label="备注" align="center"
          :show-overflow-tooltip="true" width="250"
        />
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
              v-has="'cloudSysMenuEdit'" type="text" size="small"
              @click="editCat(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'cloudSysMenuDelete'" type="text" size="small"
              @click="removeCat(scope.row)"
            >
              删除
            </el-button>
            <el-button
              type="text" size="small"
              @click="addEquCat(scope.row)"
            >
              +同级菜单
            </el-button>
            <el-button
              v-if="scope.row.mType !== 2" type="text" size="small"
              @click="addChdCat(scope.row)"
            >
              +子级菜单
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
        <el-button type="primary" class="w90" @click="del()">确定</el-button>
        <el-button class="w90" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Server from '../../../API/authority'
export default {
  filters: {
    typeFilter: function (value) {
      switch (value) {
        case 0:
          return '目录'
        case 1:
          return '页面'
        case 2:
          return '按钮'
        default:
          return '字段值异常，请检查后台数据'
      }
    },
    statusFilter: function (value) {
      switch (value) {
        case 0:
          return '显示'
        case 1:
          return '隐藏'
        default:
          return '字段值异常，请检查后台数据'
      }
    }
  },
  data () {
    return {
      tableSource: [],
      menuName: '',
      menuOptions: [{
        value: '全部',
        label: '全部'
      }, {
        value: 0,
        label: '目录'
      }, {
        value: 1,
        label: '页面'
      }, {
        value: 2,
        label: '按钮'
      }],
      menuType: '全部',
      dialogVisible: false,
      menuId: '',
      loading: false
    }
  },
  created () {},
  mounted () {
    this.getMenuConfigList({})
  },
  methods: {
    // 获取菜单配置列表
    getMenuConfigList (params) {
      this.loading = true
      Server.getMenuList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.tableSource = res.result
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 新建目录
    addCatalog () {
      this.$router.push({
        path: '/authority/menuConfig/newCatalog'
      })
    },
    // 编辑
    editCat (obj) {
      this.$router.push({
        path: '/authority/menuConfig/editMenu',
        query: { id: obj.id }
      })
    },
    // 删除
    removeCat (obj) {
      this.dialogVisible = true
      this.menuId = obj.id
    },
    del () {
      Server.deleteMenu({ id: this.menuId }).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getMenuConfigList({})
        }
      })
    },
    // 添加同级菜单
    addEquCat (obj) {
      this.$router.push({
        path: '/authority/menuConfig/addEquMenu',
        query: { id: obj.id }
      })
    },
    // 添加子级菜单
    addChdCat (obj) {
      this.$router.push({
        path: '/authority/menuConfig/addChdMenu',
        query: { id: obj.id }
      })
    },
    // 根据条件查询列表
    queryList () {
      this.currentPage = 1
      const obj = {}
      if (this.menuName) {
        obj.name = this.menuName
      }
      if (this.menuType !== '全部') {
        obj.mType = this.menuType
      }
      this.getMenuConfigList(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.menuConfig {
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
  .fr {
    float: right;
  }
  .mr16 {
    margin-right: 16px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .w90 {
    width: 90px;
  }
  .firstColor {
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
  .secondColor {
    background-color: #63c100;
    width: 50px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 2px;
    color: #fff;
    font-size: 12px;
    margin: 0 auto;
  }
  .thirdColor {
    background-color: #f7b500;
    width: 50px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 2px;
    color: #fff;
    font-size: 12px;
    margin: 0 auto;
  }
  .showStyle {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #63c100;
    border-radius: 50%;
    margin-right: 5px;
  }
  .hiddenStyle {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #ccc;
    border-radius: 50%;
    margin-right: 5px;
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
.menuConfig {
  .firstContent {
    .el-select, .el-input {
      width: 172px;
    }
  }
  .el-table th, .el-table td {
    padding: 8px 0;
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
  .el-dialog__footer {
    padding: 30px 20px;
  }
}
</style>
