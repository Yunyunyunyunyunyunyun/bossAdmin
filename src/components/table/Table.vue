<template>
  <div>
    <!-- v-bind:表格属性 v-on:表格事件监听 data:表格数据-->
    <el-table
      v-loading="loading"
      style="width: 100%"
      :min-height="tableHeight"
      v-bind="tablePropertites"
      :header-cell-style="$tableHeaderColor"
      :data="data"
      v-on="$listeners"
    >
      <template v-for="tp in columnTypes">
        <!--如果列类型为expand，处理展开显示数据 -->
        <el-table-column v-if="tp === 'expand'" :key="tp" type="expand">
          <template slot-scope="props">
            <slot name="expand" v-bind="props" />
          </template>
        </el-table-column>
        <!--否则为序号或复选框，直接设置类型即可 -->
        <el-table-column
          v-else :key="tp" :type="tp"
          :selectable="checkboxInit" :width="tp === 'index'?70:''"
        />
      </template>
      <el-table-column
        v-if="isOrder"
        type="index"
        label="序号"
        width="70"
      />
      <!-- renderColumns:列数组 v-bind="getColBind(col)":获取每列的属性  -->
      <template v-for="(col, index) in renderColumns">
        <!-- todo: link点击单独类型不能通用 后期优化 -->
        <el-table-column
          v-if="col.columnsProps.type==='alink'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <a v-if="scope.row[col.prop] != 0" href="javascript:;" @click="specificClk(scope.row)">已绑定{{ scope.row[col.prop] }}个</a>
            <span v-else>未绑定</span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="col.columnsProps.type==='relative'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <a v-if="scope.row[col.prop] != 0" href="javascript:;" @click="specificClk(scope.row)">已关联{{ scope.row[col.prop] }}个</a>
            <span v-else>已关联0台</span>
          </template>
        </el-table-column>

        <!-- 设备入库表格按钮 -->
        <el-table-column
          v-else-if="col.columnsProps.type==='btnIn'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'equipRukuView'"
              type="text"
              @click="view(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-has="'equipRukuEdit'"
              type="text"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-has="'equipRukuDelete'"
              type="text"
              @click="del(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <!-- 设备组表格按钮 -->
        <el-table-column
          v-else-if="col.columnsProps.type==='btnGroup'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <el-button
              v-has="'equipGroupConfig'"
              type="text"
              @click="equipConfig(scope.row)"
            >
              设备配置
            </el-button>
            <el-button
              v-if="scope.row.state == 2"
              v-has="'equipGroupOut'"
              type="text"
              @click="outBatch(scope.row)"
            >
              批量出库
            </el-button>
            <el-button
              v-if="scope.row.state == 3"
              v-has="'equipGroupInstall'"
              type="text"
              @click="installBatch(scope.row)"
            >
              批量安装
            </el-button>
            <el-button
              v-if="false"
              type="text"
              @click="testBatch(scope.row)"
            >
              批量测试
            </el-button>
            <el-button
              v-has="'equipGroupDel'"
              type="text"
              @click="equipDel(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <!-- 设备测试表格按钮 -->
        <el-table-column
          v-else-if="col.columnsProps.type==='btnTest'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.scenario == 2 && scope.row.productMark && scope.row.productMark.key.indexOf('H210') == -1"
              v-has="'equipTestCheck'"
              type="text"
              @click="addCoin(scope.row)"
            >
              补币
            </el-button>
            <el-button
              v-if="scope.row.scenario == 2 && scope.row.productMark && scope.row.productMark.key.indexOf('H210') != -1"
              v-has="'equipTestOpen'"
              type="text"
              @click="openDoor(scope.row)"
            >
              开门
            </el-button>
            <el-button
              v-has="'equipTestPass'"
              type="text"
              @click="testPass(scope.row)"
            >
              测试通过
            </el-button>
            <el-button
              v-if="false"
              type="text"
              @click="goOut(scope.row)"
            >
              出库
            </el-button>
          </template>
        </el-table-column>

        <!-- 设备出库表格按钮 -->
        <el-table-column
          v-else-if="col.columnsProps.type==='btnOut'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.scenario == 2 && scope.row.productMark && scope.row.productMark.key.indexOf('H210') == -1"
              v-has="'equipOutAdd'"
              type="text"
              @click="addCoin(scope.row)"
            >
              补币
            </el-button>
            <el-button
              v-has="'equipOutOut'"
              type="text"
              @click="goOut(scope.row)"
            >
              出库
            </el-button>
            <el-button
              v-if="scope.row.scenario == 2 && scope.row.productMark && scope.row.productMark.key.indexOf('H210') != -1"
              v-has="'equipOutOpen'"
              type="text"
              @click="openDoor(scope.row)"
            >
              开门
            </el-button>
            <el-button
              v-has="'equipOutTest'"
              type="text"
              @click="toTest(scope.row)"
            >
              返回测试
            </el-button>
          </template>
        </el-table-column>
        <!-- 设备安装表格按钮 -->
        <el-table-column
          v-else-if="col.columnsProps.type==='install'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.stockState == 3"
              v-has="'equipInstallComplete'"
              type="text"
              @click="complete(scope.row)"
            >
              安装完成
            </el-button>
            <el-button
              v-if="scope.row.stockState == 4"
              v-has="'equipInstallView'"
              type="text"
              @click="view(scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.stockState == 4"
              v-has="'equipInstallEdit'"
              type="text"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.stockState == 4"
              v-has="'equipInstallRe'"
              type="text"
              @click="reInstall(scope.row)"
            >
              重装
            </el-button>
          </template>
        </el-table-column>
        <!-- todo: 单独类型不能通用 后期优化 end -->

        <el-table-column
          v-else-if="col.columnsProps.type==='popover'"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <span v-if="scope.row[col.prop] && scope.row[col.prop].length > 20">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row[col.prop] }}</span>
                <div slot="reference">
                  {{ scope.row[col.prop].substring(0, 20) + '...' }}
                </div>
              </el-popover>
            </span>
            <span v-else>{{ scope.row[col.prop] }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="col.columnsProps.type!=='text'"
          :key="index" v-bind="getColBind(col)"
        >
          <!--:render-header=foo-->
          <template slot-scope="scope">
            <component
              :is="col.component"
              v-bind="getCptBind(scope, col)"
              v-on="col.listeners"
            />
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="col.columnsProps.type==='text' && col.columnsProps.mouse"
          :key="index"
          v-bind="getColBind(col)"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click="specificClk(scope.row)">{{ scope.row[col.prop] }}</a>
          </template>
        </el-table-column>

        <el-table-column
          v-else :key="index"
          v-bind="getColBind(col)"
        />
      </template>
      <template slot="empty">
        <div class="empty">
          <img src="../../../static/images/noData.png">
          <div class="efont">
            暂时没有数据
          </div>
        </div>
      </template>
    </el-table>
    <div class="footer">
      <div v-if="totalCount > 10" class="pagination-footer">
        <span class="description">{{ description }}</span>
        <el-pagination
          v-show="hasPagination"
          background
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="tpageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import methods from './methods'
import Text from './text'
import Button from './tableComponents/tableButton'
import Input from './tableComponents/tableInput'
import Select from './tableComponents/tableSelect'
import NumberInput from './tableComponents/tableNumberInput'
import Switch from './tableComponents/tableSwitch'
import Icon from './tableComponents/tableIcon'
import Checkbox from './tableComponents/tableCheckbox'
import Datepicker from './tableComponents/tableDatetime'
import DyButton from './tableComponents/dynamicButton.vue'
import { httpPost } from '@/API/request/index'
const BOOLEAN_KEYS = [ // 表格中值为boolean的属性
  'fit',
  'stripe',
  'border',
  'show-header',
  'highlight-current-row',
  'default-expand-all',
  'show-summary'
]

const COLUMN_PROPS = { // 默认列属性
  align: 'center',
  component: Text,
  type: 'text'
}

const TYPES = ['selection', 'expand', 'index'] // 表格类型[selection：复选框；expand：展开表格；index：序号]

const COLUMN_KEY_MAP = { // table-column 中 label 和 prop 对应的值
  label: 'label',
  prop: 'prop'
}

const tableComponents = {
  'text': Text,
  'button': Button,
  'input': Input,
  'select': Select,
  'number': NumberInput,
  'switch': Switch,
  'icon': Icon,
  'checkbox': Checkbox,
  'date': Datepicker,
  'dynamic': DyButton
}

export default {
  name: 'TableComponent',
  mixins: [methods],
  props: {
    tableHeight: {
      type: [String, Number],
      default: 'auto'
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: { // 表格数据
      type: Array,
      default: () => []
    },
    columns: { // 表格数据
      type: Array,
      default: () => []
    },
    // eslint-disable-next-line
    columnType: [String, Array], // 列类型[序号、复选框、展开]

    columnKeyMap: {
      type: Object,
      default: () => {}
    },

    columnsSchema: {
      type: Object,
      default: () => {}
    },

    columnsHandler: {
      type: Function,
      default: function () {}
    },

    slotAppend: Boolean,

    hasPagination: Boolean, // 是否显示分页条

    totalCount: {
      type: Number,
      default: 1
    }, // 表格数据总数

    pageSizes: { // 决定每页显示的条数
      type: Array,
      default: function () {
        return [10, 20, 30, 40, 50, 100]
      }
    },

    description: { // 分页脚底左侧的数据说明
      type: String,
      default: ''
    },

    pageSize: { // 每页条数
      type: Number,
      default: 10
    },

    currentPage: { // 当前页码
      type: Number,
      default: 1
    },

    setPage: {
      type: Function,
      default: function () {}
    },

    columnsProps: {
      type: Object,
      default: () => {}
    },

    reqParams: {
      type: Object,
      default: () => {}
    },

    isOrder: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hasFindFocusCpt: false,
      tpageSize: this.pageSize,
      exportType: 'selectedData'
    }
  },
  computed: {
    // 处理 $attrs 里面 Boolean 类型的 prop 和统一 prop 命名
    tablePropertites () {
      // 取得table标签下的属性
      const { $attrs } = this
      const properties = {}
      Object.keys($attrs).forEach(key => {
        const v = $attrs[key]
        // 正则表达式，将属性中大写字母替换为-字母，并全部转小写，如maxHeight,转换后得到max-heigth
        const uniformKey = key.replace(/([A-Z])/, '-$1').toLowerCase()
        // 如果属性没有值，并且该属性在boolean值属性列表中，那么给该属性赋值true，否则保持不变
        // ~按位取反运算符--二进制
        // 取反目的，只要结果不为0就是true,代表属性列表中有该属性
        properties[key] = ~BOOLEAN_KEYS.indexOf(uniformKey) && v === '' ? true : v
      })
      return properties
    },
    // 列组装方法
    renderColumns () {
      const {
        columns, // 列值
        columnKeyMap, // 列中label与prop对应的值
        columnsHandler,
        columnsSchema: schema
      } = this
      // 自定义列keyMap和默认keyMap合并
      const map = Object.assign({}, COLUMN_KEY_MAP, columnKeyMap)
      // 循环列，将列的各个属性合并
      const renderColumns = columns.map(col => {
        const props = !col.columnsProps ? COLUMN_PROPS : col.columnsProps // 列的属性
        const componentProperties = col.componentProperties // 组件属性
        if (!this.hasFindFocusCpt) {
          var cptType = (!props.type ? 'text' : props.type)
          if (cptType === 'input') {
            this.$set(col, 'isFocus', true)
            // eslint-disable-next-line
            this.hasFindFocusCpt = true
          }
        }
        const componentType = !props.type ? 'text' : props.type
        this.$set(props, 'component', tableComponents[componentType])
        this.$set(props, 'type', componentType)
        // 获取自定义列的样式属性
        const mix = (schema && schema[col[map.label]]) || {}
        // 将列的值、列的默认属性、列的传入属性、自定义列属性合并
        const it = Object.assign({}, COLUMN_PROPS, props, col, mix, componentProperties)
        it.label = it[map.label]
        it.prop = it[map.prop]
        it.num = it[map.num]
        return it
      })
      return (columnsHandler && columnsHandler(renderColumns)) || renderColumns
    },
    // 列类型格式化方法
    columnTypes () { // 获取列类型
      const { columnType: type } = this
      if (!type) return [] // 如果没有设置返回空
      // 如果列类型是String类型，并且存在于列类型数组中，直接返回值
      if (typeof type === 'string' && ~TYPES.indexOf(type)) {
        return [type]
      }
      // 如果是数组类型，并且每个值都存在于列类型数组中，返回
      return (Array.isArray(type) && type.filter(it => ~TYPES.indexOf(it))) || []
    }
  }, // 设置status !== 4 全部置灰
  watch: {
    tpageSize (val, old) {
      // console.log('当前页显示' + val + '条数据')
    }
  },
  mounted () {
  },
  methods: {
    foo (createElement, { column }) {
      if (column.type === 'icon' && column.num && Number(column.num) > 0) {
        return createElement(
          'div',
          [
            column.label,
            createElement('em', [column.num], {
              attrs: 'class'
            })
          ]
        )
      } else {
        return column.label
      }
    },
    // 删除列属性中无效值 -- 打印表头
    getColBind (col) {
      const bind = Object.assign({}, col)
      delete bind.component
      delete bind.listeners
      delete bind.propsHandler
      return bind
    },
    // 获取组件属性
    getCptBind (scope, col) {
      const { row, column } = scope
      const index = scope.$index
      // this.$set(column, 'num', col.num)
      const props = { row, col, column, index, 'data': this.data }
      const handler = col.propsHandler
      return (handler && handler(props)) || props
    },
    handleSizeChange: function (size) {
      this.tpageSize = size
      /* 服务端分页-重新加载table */
      const params = this.reqParams.params
      params.pageIndex = 1
      params.pageSize = size
      this.pagingRequest(this.reqParams.url, params, (request) => {
        /* 第二次请求就不需要重新分页 */
        const tmp = {}
        tmp.arr = request.result.data
        tmp.currentPage = 1
        tmp.totalCount = request.result.totalCount
        this.$emit('update:data', JSON.stringify(tmp))
      })
    },
    handleCurrentChange (currentPage) {
      this.$parent.loading = true
      this.$parent.currentPage = currentPage
      /* 服务端分页-重新加载table */
      const params = this.reqParams.params
      params.pageIndex = currentPage
      params.pageSize = this.tpageSize
      this.pagingRequest(this.reqParams.url, params, (request) => {
        this.$parent.loading = false
        const tmp = {}
        tmp.arr = request.result.data
        tmp.currentPage = currentPage
        if (request.result.totalCount > 0 && tmp.arr.length === 0) {
          this.handleCurrentChange(1)
        }
        tmp.totalCount = request.result.totalCount
        this.$emit('update:data', JSON.stringify(tmp))
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    pagingRequest (url, params, callback) {
      httpPost(url, params)
        .then(res => {
          if (typeof callback === 'function') {
            callback(res)
          }
        })
        .catch(() => {

        })
    },
    checkboxInit (row, idx) {
      if (row.sPi !== undefined && Number(row.sPi) !== 4) {
        return 0
      } else {
        return 1
      }
    },
    specificClk (row) {
      this.$emit('on-specific', row)
    },

    /* todo: 整合不同按钮事件处理组件 */
    addCoin (row) {
      this.$emit('addCoin', row)
    },
    testPass (row) {
      this.$emit('testPass', row)
    },
    openDoor (row) {
      this.$emit('openDoor', row)
    },
    toTest (row) {
      this.$emit('toTest', row)
    },
    goOut (row) {
      this.$emit('goOut', row)
    },
    equipConfig (row) {
      this.$emit('equipConfig', row)
    },
    equipDel (row) {
      this.$emit('equipDel', row)
    },
    outBatch (row) {
      this.$emit('outBatch', row)
    },
    testBatch (row) {
      this.$emit('testBatch', row)
    },
    installBatch (row) {
      this.$emit('installBatch', row)
    },
    view (row) {
      this.$emit('view', row)
    },
    edit (row) {
      this.$emit('edit', row)
    },
    del (row) {
      this.$emit('del', row)
    },
    complete (row) {
      this.$emit('complete', row)
    },
    reInstall (row) {
      this.$emit('reInstall', row)
    }
  }
}
</script>

<style lang="stylus" scoped>
>>>.el-table td
  padding 0
  height 46px
>>>.el-pagination
  text-align center
.footer
  padding 30px 0
.empty
  padding 81px 0
</style>
