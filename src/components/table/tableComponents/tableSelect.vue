<template>
  <div>
    <el-select
      v-show="row._edit" v-model="row[col.prop]" placeholder="请选择"
      @change="col.eventChange(row)"
    >
      <template v-if="col._option">
        <el-option
          v-for="item in row[col._option]"
          :key="item.implCode"
          :label="item.implName"
          :value="item.implId"
        />
      </template>
      <template v-else>
        <el-option
          v-for="item in col.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </template>
    </el-select>
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
      default: () => {}
    }
  },
  computed: {
    text () {
      return this.row[this.col.prop]
    }
  },
  methods: {
    change: function (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style>

</style>
