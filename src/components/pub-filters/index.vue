<template>
  <div class="filter">
    <div class="firstTitle">
      <span>{{ title }}</span>
    </div>
    <div class="firstContent">
      <div class="content-l">
        <div v-for="(item, index) in inputs" :key="'inputs'+index" class="inputs">
          <span>{{ item.title }}：</span>
          <el-input
            v-model="item.inputValue"
            :placeholder="item.placeholder"
            class="mr30 w180"
            size="medium"
          />
        </div>
        <div v-for="(item, index) in select" :key="'select'+index" class="select">
          <span>{{ item.title }}：</span>
          <el-select
            v-model="item.selectedVal" clearable class="mr30 w180"
            placeholder="请选择"
          >
            <el-option
              v-for="i in item.options" :key="i.value" :label="i.label"
              :value="i.value"
            />
          </el-select>
        </div>
        <div v-for="(item, index) in date" :key="'date'+index" class="date">
          <span>{{ item.title }}</span>：
          <!-- 选择日期 -->
          <div v-if="item.type=='date'">
            <el-date-picker
              v-model="item.dateVale"
              :type="item.type"
              size="medium"
              :placeholder="item.placeholder"
            />
          </div>
          <!-- 选择时间区间 -->
          <div v-if="item.type=='daterange'">
            <el-date-picker
              v-model="item.dateVale"
              :type="item.type"
              size="medium"
              range-separator="~"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </div>
          <div v-if="item.type=='month'">
            <el-date-picker
              v-model="item.dateVale"
              type="month"
              placeholder="选择月"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="content-r">
        <span class="tsdBtn mr16">
          <el-button
            v-has="hasValue[0]"
            type="primary" icon="el-icon-search" size="medium"
            @click="search"
          >查询</el-button>
        </span>
        <span v-if="btnVal" class="newBtn">
          <el-button
            v-has="hasValue[1]"
            type="primary"
            icon="el-icon-plus"
            size="medium"
            plain
            @click="btnEvent"
          >{{ btnVal }}</el-button>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    // 权限列表
    hasValue: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 按钮的名字
    btnVal: {
      type: String,
      default: ''
    },
    // 输入框的配置项 例[{title:'客户名称',inputValue:'}]
    inputs: {
      type: Array,
      default: function () {
        return []
      }
    },
    /** 选择框的配置项
     * 例
     * [{
          title: '模板名称',
          selectedVal: '',
          options: [
            {
              value: '0',
              label: '全部'
            },
          ]
        }]
     */
    select: {
      type: Array,
      default: function () {
        return []
      }
    },
    /** 日期选择期
     * {
        title: '创建时间',
        type: 'date',
        dateValue: '',
        placeholder: '选择日期'
        }
    */
    date: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    search () {
      this.$emit('search')
    },
    btnEvent () {
      this.$emit('btnEvent')
    }
  }
}
</script>

<style lang="less">
.filter .firstContent .el-range-editor.el-input__inner{
  padding: 0 20px;
}
.filter .firstContent .el-range-editor.el-input__inner .el-input__icon, .filter .firstContent .el-range-editor.el-input__inner .el-range-separator {
  line-height:34px;
}
</style>

<style lang="less" scoped>
.filter {
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
    width: 100%;
    border: 1px solid #e6e6e6;
    border-top: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    padding-top: 8px;
    padding-bottom: 28px;
    box-sizing: border-box;
  }
  .mr16 {
    margin-right: 16px;
  }
  .mr30 {
    margin-right: 60px;
  }
  .w180 {
    width: 180px;
  }
  .content-l {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-top: 20px;
    }
    .select,
    .inputs,
    .date {
      display: flex;
      align-items: center;
      span {
        flex: none;
      }
    }
    .el-select--medium {
      width: 180px;
    }
  }
  .content-r {
    margin-top: 20px;
    display: flex;
    .tsdBtn {
      .el-button--medium {
        width: 100px;
      }
    }
  }
}
</style>
