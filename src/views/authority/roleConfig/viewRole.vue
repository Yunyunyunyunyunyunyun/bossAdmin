<template>
  <div class="viewRole">
    <div class="content">
      <span class="lt">角色配置</span>
    </div>
    <div class="mainAdd">
      <el-row>
        <el-col :span="12" class="pd20 br h100 pr60">
          <div>角色信息</div>
          <el-form
            ref="roleForm" :model="roleForm"
            label-width="160px" class="mt22"
          >
            <el-form-item label="上级角色名称：" prop="parentName">
              <el-input v-model="roleForm.pName" disabled />
            </el-form-item>
            <el-form-item label="角色名称：" prop="roleName">
              <el-input v-model="roleForm.name" disabled />
            </el-form-item>
            <el-form-item label="角色标识：" prop="roleSign">
              <el-input v-model="roleForm.identify" disabled />
            </el-form-item>
            <el-form-item label="状态：" prop="roleStatus">
              <el-input v-model="roleForm.isEnable" disabled />
            </el-form-item>
            <el-form-item label="角色描述：" prop="desc">
              <el-input
                v-model="roleForm.remark" type="textarea" rows="3"
                disabled
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" class="pd20 h100">
          <div>已选权限</div>
          <el-tree
            :data="selectedData"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
          />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button
        type="primary" plain class="w110"
        @click="back"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import Server from '../../../API/authority'
export default {
  data () {
    return {
      roleForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedData: [],
      roleId: ''
    }
  },
  created () {
    this.roleId = this.$route.query.id
    const obj = {
      id: this.roleId
    }
    this.getRoleInfo(obj)
  },
  methods: {
    getRoleInfo (params) {
      Server.viewRoleInfo(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.roleForm = res.result.list[0]
          this.roleForm.isEnable = this.roleForm.isEnable === 0 ? '启用' : this.roleForm.isEnable === 1 ? '禁用' : ''
          this.selectedData = res.result.list[0].menuAddList
          if (res.result.list[0].pName) {
            this.roleForm.pName = res.result.list[0].pName
          } else {
            this.roleForm.pName = '无'
          }
        }
      })
    },
    back () {
      this.$router.push({
        path: '/authority/roleConfig'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.viewRole {
  padding:20px 20px 0;
  background-color: #fff;
  .content {
    height: 52px;
    line-height: 52px;
    background: #f3f8ff;
    border: 1px solid #e6e6e6;
    padding: 0 20px;
    .lt {
      color: #333;
      font-size: 16px;
    }
    .fr {
      float: right;
      color: #666;
      font-size: 16px;
      .red {
        color: #E02020;
      }
    }
  }
  .mainAdd {
    border: 1px solid #e6e6e6;
    border-top: none;
    .pd20 {
      padding: 20px;
    }
    .pr60 {
      padding-right: 60px;
    }
    .mt22 {
      margin-top: 22px;
    }
    .br {
      border-right: 1px solid #e6e6e6;
    }
    .h100 {
      height: 500px;
      overflow: auto;
    }
  }
  .footer {
    text-align: center;
    padding: 50px 0;
    .w110 {
      width: 110px;
    }
  }
}
</style>
<style lang="less">
.viewRole {
  .mainAdd {
    .el-input, .el-textarea.is-disabled {
      width: 350px;
    }
    .el-checkbox:last-of-type {
      margin-right: 5px;
    }
    .el-tree {
      width: 180px;
      margin: 0 auto;
      padding-top: 22px;
      .el-tree-node__content {
        height: 30px;
        line-height: 30px;
        cursor: default;
      }
    }
    .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
      color: #717276;
      background-color: #f7f9fb;
      border-color: #e6e6e6;
    }
  }
}
</style>
