<template>
  <div @click="col.eventClick(row, col.prop)">
    <i v-if="col.options" :class="col.options[row[col.prop]]" />
    <i v-else :class="row[col.prop]" />
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
      type: Object,
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
      icon: ''
    }
  },
  computed: {
    eventClick () {
      return this.col.cptProperties.eventClick ? this.col.cptProperties.eventClick : function () {}
    }
  },
  mounted () {
    if (this.col.options) {
      this.icon = this.col.options[this.row[this.col.prop]]
    } else {
      this.icon = this.row[this.col.prop]
    }
  }
}
</script>
