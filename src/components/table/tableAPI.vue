<template>
  <div class="container-fluid">
    <tableVue
      ref="table"
      :table-height="400" border
      :data="dataSource"
      :columns="columns"
      :req-params="reqParams"
      :page-sizes="pageSizes"
      :current-page="currentPage" :page-size="pageSize" :total-count="totalCount"
      :has-pagination="hasPagination" :set-page="queryData" @update:data="tabChange"
      @selection-change="selectionChange" @cell-dblclick="celldbClick"
    />
  </div>
</template>

<script>
import tableVue from '@/components/table/Table.vue'
var data = [ // 表格数据
  {
    // date: '1501776000000',
    date: '2016-05-03',
    name: '张三',
    age: 15,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    icon: 2,
    image: '6901028071772',
    favorite: ['篮球', '羽毛球'],
    zip: 200333,
    flag: 1,
    active: 1
  },
  {
    // date: '1492963200000',
    date: '2016-05-02',
    name: '陈二',
    age: 19,
    province: '南京',
    city: '江宁区',
    address: '南京市111111',
    icon: 1,
    image: '6901028071475',
    favorite: ['足球'],
    zip: 210018,
    flag: 2,
    active: 0
  },
  {
    // date: '1494604800000',
    date: '2016-05-04',
    name: '李四',
    age: 16,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    icon: 1,
    image: '6901028080521',
    favorite: ['篮球', '足球', '羽毛球'],
    zip: 200333,
    flag: 0,
    active: 1
  },
  {
    // date: '1502553600000',
    date: '2016-05-01',
    name: '何一',
    age: 17,
    province: '北京',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    icon: 0,
    image: '6901028100366',
    favorite: ['羽毛球'],
    zip: 200333,
    flag: 1,
    active: 0
  },
  {
    // date: '1512057600000',
    date: '2016-05-08',
    name: '谭天',
    age: 17,
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    icon: 2,
    image: '6901028100670',
    favorite: ['足球', '羽毛球'],
    zip: 200333,
    flag: 0,
    active: 1
  },
  {
    // date: '1500652800000',
    date: '2016-05-06',
    name: '王五',
    age: 15,
    province: '苏州',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    icon: 1,
    image: '6901028100274',
    favorite: ['篮球', '足球'],
    zip: 200333,
    flag: 2,
    active: 0
  },
  {
    // date: '1506787200000',
    date: '2016-05-07',
    name: '周日',
    age: 18,
    province: '杭州',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    icon: 2,
    image: '6901028075138',
    favorite: ['篮球'],
    zip: 200333,
    flag: 1,
    active: 0
  },
  {
    date: '2016-05-07',
    name: '周yi1',
    age: 28,
    province: '杭州',
    city: '普陀区',
    address: '上海市普陀区金沙江路 0808 弄',
    icon: 2,
    image: '6901028075138',
    favorite: ['篮球'],
    zip: 200333,
    flag: 9,
    active: 0
  },
  {
    date: '2016-05-07',
    name: '周yi1',
    age: 28,
    province: '杭州',
    city: '普陀区',
    address: '上海市普陀区金沙江路 0808 弄',
    icon: 2,
    image: '6901028075138',
    favorite: ['篮球'],
    zip: 200333,
    flag: 9,
    active: 0
  },
  {
    date: '2016-05-07',
    name: '周yi1',
    age: 28,
    province: '杭州',
    city: '普陀区',
    address: '上海市普陀区金沙江路 0808 弄',
    icon: 2,
    image: '6901028075138',
    favorite: ['篮球'],
    zip: 200333,
    flag: 9,
    active: 0
  }
]

export default {
  components: {
    tableVue
  },
  data () {
    return {
      selectRows: [],
      hasPagination: true,
      currentPage: 1, // 默认当前第一页
      pageSize: 10, // 默认每页20条数据
      pageSizes: [10, 20, 30, 40, 50, 100], // 分页数选择项
      reqParams: { // 分页条件
        url: '',
        params: {}
      },
      selectSells: [],
      totalCount: data.length, // 表格总记录数
      columns: [ // 表格列
        {
          label: '日期',
          prop: 'date',
          columnsProps: {
            minWidth: 230,
            type: 'date',
            dateType: 'date'
          }
        },
        {
          label: '姓名',
          prop: 'name',
          columnsProps: {
            minWidth: 120,
            align: 'center'
          }
        },
        {
          label: '年龄',
          prop: 'age',
          columnsProps: {
            minWidth: 180,
            align: 'center',
            type: 'number'
          },
          cptProperties: {
            size: 'small',
            min: 0,
            max: 100
          }
        },
        {
          label: '省份',
          prop: 'province',
          columnsProps: {
            minWidth: 120,
            type: 'select',
            formatter: this.colFormatter
          },
          eventChange: this.selectChange,
          options: [
            {
              value: '北京',
              label: '北京'
            },
            {
              value: '上海',
              label: '上海'
            },
            {
              value: '南京',
              label: '南京'
            },
            {
              value: '苏州',
              label: '苏州'
            },
            {
              value: '杭州',
              label: '杭州'
            }
          ]
        },
        {
          label: '市区',
          prop: 'city',
          columnsProps: {
            minWidth: 120,
            formatter: this.colFormatter
          }
        },
        {
          label: '地址',
          prop: 'address',
          columnsProps: {
            minWidth: 250,
            type: 'input'
          },
          eventKey: this.eventKey
        },
        {
          label: '地址',
          prop: 'address',
          columnsProps: {
            minWidth: 250,
            type: 'input'
          },
          eventKey: this.eventKey
        },
        {
          label: '地址',
          prop: 'address',
          columnsProps: {
            minWidth: 250,
            type: 'input'
          },
          eventKey: this.eventKey
        },
        {
          label: '地址',
          prop: 'address',
          columnsProps: {
            minWidth: 250,
            type: 'input'
          },
          eventKey: this.eventKey
        },
        {
          label: '地址',
          prop: 'address',
          columnsProps: {
            minWidth: 250,
            type: 'input'
          },
          eventKey: this.eventKey
        },
        {
          label: '地址',
          prop: 'address',
          columnsProps: {
            minWidth: 250,
            type: 'input'
          },
          eventKey: this.eventKey
        },
        {
          label: '邮编',
          prop: 'zip',
          columnsProps: {
            minWidth: 120,
            type: 'input'
          }
        },
        {
          label: '是否启用',
          prop: 'active',
          columnsProps: {
            minWidth: 160,
            type: 'switch'
          },
          cptProperties: {
            onText: '启用',
            offText: '未启用',
            onValue: 1,
            offValue: 0,
            width: 40
          }
        },
        {
          label: '状态',
          prop: 'flag',
          columnsProps: {
            minWidth: 120,
            align: 'center'
          }
        },
        /* {
          label: '动态',
          prop: 'dynamic',
          compare: 'flag',
          compareVal: [0],
          columnsProps: {
            minWidth: 200,
            type: 'dynamic'
          },
          cptProperties: [
            {
              label: '注册',
              value: 'register',
              type: 'text',
              eventClick: this.registerClk,
              check: '1'
            },
            {
              label: '不注册',
              value: 'nregister',
              type: 'text',
              eventClick: this.nregisterClk,
              check: '1'
            },
            {
              label: '删除',
              value: 'delete',
              icon: 'delete',
              size: 'small',
              type: 'text',
              eventClick: this.handleDelete,
              check: '2'
            },
            {
              label: '注册',
              value: 'register',
              type: 'text',
              eventClick: this.registerClk,
              check: '9'
            }
          ]
        }, */
        {
          label: '操作',
          prop: 'operation',
          fixed: 'right',
          columnsProps: {
            minWidth: 200,
            type: 'button'
          },
          cptProperties: [
            {
              label: '修改',
              value: 'modify',
              type: 'text',
              eventClick: this.handleModify
            },
            {
              label: '删除',
              value: 'delete',
              icon: 'delete',
              size: 'small',
              type: 'text',
              eventClick: this.handleDelete
            }
          ]
        }
      ],
      data: data,
      dataSource: []
    }
  },
  mounted () {
    this.queryData(1, this.pageSize)
  },
  methods: {
    eventKey (key, row) {
      if (key.code === 'Enter' || key.code === 'NumpadEnter') {
        if (row.address.length < 30) {
          this.$message('地址太短')
          return false
        }
        return true
      }
    },
    celldbClick () {
      // this.$message('双击事件')
    },
    changeIcon (row, col) {
      row.icon = (row.icon + 1) > 2 ? 0 : (row.icon + 1)
    },
    colFormatter (row, column) {
      return 'AS:' + row.city
    },
    queryData (page, size) { // 前端查询
      this.dataSource = this.data.filter((u, index) => index < size * page && index >= size * (page - 1))
    },
    tabChange (msg) {
      const tmp = JSON.parse(msg)
      this.currentPage = tmp.currentPage
      this.dataSource = this.tableData = tmp.arr
    },
    selectChange (row) {
    },
    handleModify (index, row) {
      this.$set(row, '_edit', !row._edit)
    },
    handleDelete (index, row) {
    },
    selectionChange (rows) {
      this.selectRows = rows
      console.log('所有选中行数据：', rows)
    },
    registerClk (index, row) {
      console.log('注册', row)
    },
    nregisterClk (index, row) {
      console.log('不注册', row)
    }
  }
}
</script>

<style scoped>

</style>
