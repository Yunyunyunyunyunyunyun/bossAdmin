<template>
  <div>
    <el-date-picker
      v-show="row._edit"
      v-model="dateStr" type="date"
      placeholder="选择日期"
    />
    <span v-show="!row._edit">{{ text }}</span>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/dateFormat.js'
export default {
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    col: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
    // KeyDownEvent: {
    //   type: Function,
    //   default: function (ev) {
    //   }
    // }
  },
  data () {
    return {
      dateStr: ''
    }
  },
  computed: {
    text () {
      if (this.col.dateType === 'unix') {
        var unixDate = this.row[this.col.prop]
        // eslint-disable-next-line
        this.dateStr = dateFormat(unixDate, 'YYYY-MM-DD') // 'YYYY-MM-DD HH:mm:ss'
        return this.dateStr
      }
      // eslint-disable-next-line
      this.dateStr = this.row[this.col.prop]
      return this.dateStr
    }
  },
  watch: {
    dateStr (oldValue, newValue) {
      if (this.row._edit) {
        var date = new Date(this.dateStr)
        if (this.col.dateType === 'unix') {
          // var curDate = this.dateStr.replace(/-/g, '/')
          this.row[this.col.prop] =
          Date.parse(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())))
        } else {
          this.row[this.col.prop] =
          date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        }
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
@import './tableInput.css';
</style>
