<template>
  <div class="templateOperate">
    <div class="content">
      <span class="lt">菜单模板配置</span>
      <span class="fr"><span class="red">* </span>为必填项</span>
    </div>
    <div class="mainAdd">
      <el-row>
        <el-col :span="8" class="pd20 br h100 pr40">
          <div>模板信息</div>
          <el-form
            ref="templateForm" :model="templateForm" :rules="rules"
            label-width="150px" class="mt22"
          >
            <el-form-item label="菜单模板名称：" prop="templateName">
              <el-input v-model="templateForm.templateName" placeholder="请输入菜单模板名称，最长30字符" maxlength="30" />
            </el-form-item>
            <el-form-item label="菜单模板标识：" prop="templateSign">
              <el-input v-model="templateForm.templateSign" placeholder="只支持小写英文，最长10字符" maxlength="10" />
            </el-form-item>
            <el-form-item label="模板描述：" prop="desc">
              <el-input
                v-model="templateForm.desc" type="textarea" rows="3"
                placeholder="请输入模板描述，最长50字符" maxlength="50" show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="pd20 br h100">
          <div>
            <div>菜单选择</div>
            <el-tree
              ref="tree"
              :data="templateData"
              show-checkbox
              node-key="id"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              :props="defaultProps"
              @check="handleCheck"
            />
          </div>
        </el-col>
        <el-col :span="8" class="pd20 h100">
          <div>已选菜单重命名</div>
          <el-tree
            class="expand-tree"
            :data="selectedData"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button type="primary" class="w90" @click="submit('templateForm')">
        提交
      </el-button>
      <el-button
        type="primary" plain class="w90"
        @click="cancel"
      >
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
import TreeRender from './tree_render'
import Server from '../../../API/authority'
export default {
  data () {
    const validateTemplateSign = (rule, value, callback) => {
      const myreg = /^[a-z]+$/
      if (value.trim() === '' || value.trim() === null || value.trim() === undefined) {
        return callback(new Error('请输入菜单模板标识'))
      } else if (!myreg.test(value)) {
        return callback(new Error('抱歉只支持小写英文'))
      } else {
        callback()
      }
    }
    return {
      templateForm: {
        templateName: '',
        templateSign: '',
        desc: ''
      },
      rules: {
        templateName: [
          { required: true, message: '请输入菜单模板名称', trigger: 'blur' }
        ],
        templateSign: [
          { required: true, validator: validateTemplateSign, trigger: 'blur' }
        ]
      },
      templateData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedData: [],
      showSelectdeData: [],
      templateId: '',
      templateInfo: {}
    }
  },
  created () {
    if (this.$route.query.title === '编辑') {
      this.templateId = this.$route.query.id
    }
  },
  mounted () {
    if (this.$route.query.title === '编辑') {
      this.getEditTemplate({ id: this.templateId })
      this.getSelectTemplate({ templateId: this.templateId, type: 1 })
    }
    if (this.$route.query.title === '新建') {
      this.getMenuList({ type: 1 })
    }
  },
  methods: {
    // 获取菜单模板
    getEditTemplate (params) {
      Server.showEditTemplate(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          if (res.result.length !== 0) {
            this.templateInfo = res.result[0]
            this.showSelectdeData = this.templateInfo.cloudSysMenu
            this.selectedData = this.templateInfo.cloudSysMenu
            this.templateForm.templateName = this.templateInfo.name
            this.templateForm.templateSign = this.templateInfo.identify
            this.templateForm.desc = this.templateInfo.remark
          }
        }
      })
    },
    // 获取菜单列表(编辑)
    getSelectTemplate (params) {
      Server.showSelectTemplate(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.templateData = res.result
          const items = res.result
          const selectedResult = this.handleFilterData(items)
          this.$refs.tree.setCheckedKeys(selectedResult)
        }
      })
    },
    // 获取菜单列表（新建）
    getMenuList (params) {
      Server.getMenuList(params).then((res) => {
        if (res.code === 0) {
          // this.$message.success(res.msg)
          this.templateData = res.result
        }
      })
    },
    handleFilterData (items) {
      const result = []
      function filter (list) {
        for (let i = 0; i < list.length; i++) {
          if (!list[i].children || list[i].children.length === 0) {
            if (list[i].isSelect) {
              result.push(list[i].id)
            }
          } else {
            filter(list[i].children)
          }
        }
      }
      filter(items)
      return result
    },
    handleNodeClick (d, n, s) { // 点击节点
      d.isEdit = false// 放弃编辑状态
    },
    renderContent (h, { node, data, store }) { // 加载节点
      const that = this
      return h(TreeRender, {
        props: {
          dATA: data,
          nODE: node,
          sTORE: store
        },
        on: {
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n)
        }
      })
    },
    handleEdit (s, d, n) { // 编辑节点
      // console.log(s, d, n)
    },
    handleCheck () {
      const menuList = JSON.parse(JSON.stringify(this.templateData))
      const checkedKeys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      function filters (list) {
        for (let i = 0; i < list.length; i++) {
          if (checkedKeys.includes(list[i].id)) {
            list[i].isChecked = 1
            if (list[i].children && list[i].children.length) {
              filters(list[i].children)
            }
          } else {
            list[i].isChecked = 0
          }
        }
      }
      filters(menuList)
      const newArr = []
      if (menuList && menuList.length) {
        menuList.forEach(item => {
          if (item.isChecked === 1) {
            newArr.push(this.handleTreeData(item))
          }
        })
      }
      this.selectedData = newArr
    },
    handleTreeData (item) {
      const childrenNode = {
        id: item.id,
        name: item.name,
        isEdit: false,
        oldName: item.name
      }
      if (item.children && item.children.length) {
        childrenNode.children = []
        item.children.forEach(subItem => {
          if (subItem.isChecked === 1) {
            childrenNode.children.push(this.handleTreeData(subItem))
          }
        })
      }
      return childrenNode
    },
    handleSelectedData (val) {
      const newArray = []
      function handleData (list) {
        for (let i = 0; i < list.length; i++) {
          newArray.push({ id: list[i].id, name: list[i].name })
          if (list[i].children) {
            handleData(list[i].children)
          }
        }
      }
      handleData(val)
      return newArray
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.handleSelectedData(this.selectedData).length !== 0) {
            const userId = this.$localstore.get('bossadmin_user').id
            const params = {
              menuAddList: this.handleSelectedData(this.selectedData),
              name: this.templateForm.templateName,
              identify: this.templateForm.templateSign,
              remark: this.templateForm.desc,
              createUser: userId
            }
            if (this.templateId && this.templateId !== '') {
              params.id = this.templateId
            }
            Server.changeTemplate(params).then((res) => {
              if (res.code === 0) {
                if (this.$route.query.title === '新建') {
                  this.$message.success('菜单模板配置成功')
                }
                if (this.$route.query.title === '编辑') {
                  this.$message.success('菜单模板信息修改成功')
                }
                this.$router.push({
                  path: '/authority/menuTemplate'
                })
              }
            })
          } else {
            this.$message.warning('请勾选至少一项菜单后再进行提交操作！')
          }
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/authority/menuTemplate'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.templateOperate {
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
    .pr40 {
      padding-right: 40px;
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
    .w90 {
      width: 90px;
    }
  }
}
</style>
<style lang="less">
.templateOperate {
  .mainAdd {
    .el-checkbox:last-of-type {
      margin-right: 5px;
    }
    .el-tree {
      width: 250px;
      margin: 0 auto;
      padding-top: 22px;
      .el-tree-node__content {
        height: 30px;
        line-height: 30px;
        cursor: default;
      }
    }
    .expand-tree {
      .is-current>.el-tree-node__content, .el-tree-node__content:hover {
        color: #4C8CF8;
        .tree-btn {
          display:inline-block;
        }
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

