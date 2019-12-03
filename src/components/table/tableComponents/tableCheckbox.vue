<template>
  <div>
    <el-checkbox-group v-show="row._edit" v-model="row[col.prop]">
      <el-checkbox v-for="(item, index) in col.options" :key="index" :label="item" />
    </el-checkbox-group>
    <span v-show="!row._edit">{{ text }}</span>
  </div>
</template>

<script>
export default {
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
  computed: {
    text () {
      return String(this.row[this.col.prop])
    }
  },
  methods: {
  }
}
</script>
