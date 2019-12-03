<template>
  <div>
    <el-input-number
      v-show="row._edit"
      v-model="row[col.prop]" style="width:150px;" :size="size"
      :min="min" :max="max"
      :step="step" @keyup.native="KeyDownEvent"
    />
    <span v-show="!row._edit">{{ text }}</span>
  </div>
</template>

<script>
export default {
  directives: {
    focus: {
      inserted: function (el, { value }) {
        el.focus()
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
  computed: {
    text () {
      return this.row[this.col.prop]
    },
    size () {
      return this.col.cptProperties.size
    },
    min () {
      return this.col.cptProperties.min
    },
    max () {
      return this.col.cptProperties.max
    },
    step () {
      return this.col.cptProperties.step
    }
  },
  mounted () {
  },
  methods: {
    KeyDownEvent (ev) {
      if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
        const idx = this.data.indexOf(this.row)
        if (idx !== this.data.length - 1) {
          this.$set(this.data[idx], '_edit', false)
          this.$set(this.data[idx + 1], '_edit', true)
        }
      }
    }
  }
}
</script>
