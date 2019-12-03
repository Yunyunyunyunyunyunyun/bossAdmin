<template>
  <div class="container">
    <div class="main-container">
      <div class="card-container">
        <div class="title">
          设备组设备配置
        </div>
        <el-row class="term">
          <el-form
            ref="form" :rules="rules" :model="formData"
            label-width="150px"
          >
            <el-col :span="8" class="txt-input">
              <el-form-item label="设备组名称：" required>
                <el-input v-model="formData.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="设备组型号：" required>
                <el-input v-model="formData.key" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="txt-textarea">
              <el-form-item label="备注：" label-width="80px" prop="remark">
                <el-input
                  v-model="formData.remark" rows="4" type="textarea" maxlength="50" placeholder="请填写备注信息，最长50字符"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="关联设备：">
                <div class="choose-item">
                  <div class="serch-item">
                    <div class="search-input">
                      <el-input
                        v-model="name"
                        type="text"
                        placeholder="请输入设备名称搜索"
                      >
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                      </el-input>
                    </div>
                    <div class="selected-list">
                      <div class="list-label">
                        已选设备：
                      </div>
                      <div class="list-container">
                        <div
                          v-for="(item, index) of selectedList"
                          :key="item.id + index"
                          class="list-item"
                          @click="delPruduct(item.id)"
                        >
                          {{ item.name }}
                          <i class="el-icon-circle-close"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="result-item">
                    <el-collapse v-model="activeNames">
                      <el-collapse-item
                        v-for="(item, index) of equipList" :key="item.key+index"
                        :title="item.key"
                        :name="index"
                      >
                        <div class="equip-container">
                          <div v-if="item.productList.length === 0" class="data-empty">
                            暂无设备
                          </div>
                          <a
                            v-for="(value, key) of item.productList" :key="key"
                            href="javascript:;" class="equip-item"
                            :class="value.groupId && value.groupId !== '' ? 'slected' : ''"
                            @click="clickProduct(item.key, value.id)"
                          >
                            {{ value.name + '（' + (value.stockState == '1' ? '待测试' : (value.stockState == '2' ? '待出库' : (value.stockState == '3' ? '待安装' : ''))) + '）' }}
                          </a>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div class="btn-footer">
        <el-button
          v-has="'equipGroupAddSubmit'"
          type="primary" size="medium"
          @click="submit"
        >
          提交
        </el-button>
        <el-button
          type="primary" plain size="medium"
          @click="cancel"
        >
          取消
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { httpPost } from '@/API/request/index'
export default {
  data () {
    return {
      formData: {
        name: '',
        key: '',
        remark: ''
      },
      rules: {
        remark: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      },
      equipList: [],
      selectedList: [],
      markProductMap: {},
      activeNames: [],
      name: '',
      id: ''
    }
  },
  watch: {
    equipList (equipList) {
      var arr = []
      equipList.forEach(item => {
        if (item.productList.length > 0) {
          item.productList.forEach(value => {
            if (value.groupId && value.groupId !== '') {
              arr.push(Object.assign(value, { key: item.key }))
            }
          })
        }
      })
      this.selectedList = arr
    }
  },
  mounted () {
    this.getGroupDetail()
  },
  methods: {
    getGroupDetail () {
      httpPost(this.$basePath.equipGroupDetail, {
        id: this.$route.query.id
      })
        .then(res => {
          this.formData.name = res.result.name
          this.formData.key = res.result.mark.key
          this.id = res.result.mark.id
          this.formData.remark = res.result.remark
          this.getProductList()
        })
    },
    getProductList () {
      httpPost(this.$basePath.equipProductList, {
        groupId: this.$route.query.id,
        name: this.name
      })
        .then(res => {
          res.result.forEach((item, index) => {
            this.activeNames.push(index)
          })
          this.equipList = res.result
        })
    },
    delPruduct (id) {
      this.equipList.forEach((item, index) => {
        var obj = item
        obj.productList.forEach((val, key) => {
          if (val.id === id) {
            Object.assign(val, {
              groupId: ''
            })
          }
        })
        this.$set(this.equipList, index, obj)
      })
    },
    clickProduct (key, id) {
      this.equipList.forEach((item, index) => {
        if (item.key === key) {
          var obj = item
          obj.productList.forEach((val, key) => {
            if (val.id === id) {
              Object.assign(val, {
                groupId: val.id
              })
            } else {
              Object.assign(val, {
                groupId: ''
              })
            }
          })
          this.$set(this.equipList, index, obj)
        }
      })
    },
    search () {
      this.getProductList()
    },
    submit () {
      if (this.selectedList.length <= 0) {
        this.$message({ type: 'warning', message: '请选择关联设备' })
        return
      }
      this.selectedList.forEach(item => {
        this.markProductMap[item.key] = [{ id: item.id, stockState: item.stockState }]
      })
      this.$refs['form'].validate(valid => {
        if (valid) {
          httpPost(this.$basePath.equipGroupSave, {
            id: this.$route.query.id,
            name: this.formData.name,
            mark: {
              id: this.id
            },
            markProductMap: this.markProductMap,
            remark: this.formData.remark
          })
            .then(res => {
              this.$message({ type: 'success', message: res.msg })
              this.$router.push({
                path: '/equipment/equipGroup'
              })
            })
        }
      })
    },
    cancel () {
      this.$router.push({
        path: '/equipment/equipGroup'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  background-color #ffffff
  min-width 1300px
  .main-container
    padding 20px 20px 0 20px
    .card-container
      border 1px #E6E6E6 solid
      .title
        height 52px
        line-height 52px
        border-bottom 1px #E6E6E6 solid
        padding-left 22px
        font-size 16px
        color #333333
        background-color #F3F8FF
      .term
        padding 27px 18px 40px 22px
        box-sizing border-box
        .txt-input
          >>>.el-input
            width 180px
        .txt-textarea
          >>>.el-textarea
            width 100%
        .choose-item
          width 100%
          border 1px solid #E6E8EE
          .serch-item
            min-height 64px
            border-bottom 1px solid #E6E8EE
            display flex
            align-items center
            >>>.el-input__inner:focus
              border-color #DCDFE6
            >>>.el-input__inner:hover
              border-color #DCDFE6
            >>>.el-input-group__append, >>>.el-input-group__prepend
              border-left none
              background-color transparent
              padding 0 10px
            >>>.el-input__inner
              padding-right 0
            >>>.el-input-group--append >>>.el-input__inner
              border-right transparent
              padding-right 0
            .list-label
              margin-left 23px
              width 80px
              color #333333
            >>>.el-input
              width 190px
              margin-left 30px
            .selected-list
              display flex
              align-items center
              justify-content flex-start
              .list-container
                padding 5px 0
                .el-icon-circle-close
                  color #C0C4CC
                  cursor pointer
                  margin-left 5px
                .list-item
                  float left
                  height 30px
                  line-height 30px
                  color #4C8CF8
                  font-size 12px
                  font-weight 600
                  background-color #F0F2F5
                  padding 0 10px
                  border-radius 2px
                  margin-right 20px
                  margin-top 2px
          .result-item
            padding 24px 34px 24px 34px
            height 355px
            overflow-y auto
            >>>.el-collapse
              border-top-color transparent
              border-bottom-color transparent
            >>>.el-collapse-item__wrap
              border-bottom-color transparent
            >>>.el-collapse-item__header
              border-bottom-color transparent
              font-weight bold
              font-size 14px
              color #333333
            >>>.el-collapse-item__arrow
              margin 0 auto 0 10px
            >>>.el-icon-arrow-right::before
              content "\E790"
              color #B9BBC2
            >>>.el-collapse-item__arrow.is-active
              transform rotate(180deg)
            .equip-container
              display flex
              flex-wrap wrap
              .equip-item
                margin-right 30px
                font-size 14px
                color #666666
                &.slected
                  color #4C8CF8
            .data-empty
              width 100%
              text-align center
              color #ccc
    .btn-footer
      text-align center
      padding 50px 0 60px 0
</style>
