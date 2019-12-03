<template>
  <div>
    <template v-if="row._edit" class="input">
      <input
        v-model="row[col.prop]"
        v-focus="col.isFocus" class="input__inner" type="text"
        icon="close" :on-icon-click="function(){row[col.prop] = ''}"
        @keypress="KeyDownEvent($event)"
      >
    </template>
    <span v-if="!row._edit">{{ text }}</span>
  </div>
</template>

<script>
export default {
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.focus()
          el.select() // 文字全选
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
  computed: {
    text () {
      return this.row[this.col.prop]
    },
    focusStatus () {
      if (this.row._edit) {
        return this.col.isFocus
      }
      return false
    }
  },
  mounted () {
  },
  methods: {
    KeyDownEvent (ev) {
      if (this.col.eventKey) {
        if (this.col.eventKey(ev, this.row)) {
          if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
            const idx = this.data.indexOf(this.row)
            if (idx !== this.data.length - 1) {
              this.$set(this.data[idx], '_edit', false)
              this.$set(this.data[idx + 1], '_edit', true)
            } else {
              this.$set(this.data[idx], '_edit', false)
            }
          }
        }
      } else {
        if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
          const idx = this.data.indexOf(this.row)
          if (idx !== this.data.length - 1) {
            this.$set(this.data[idx], '_edit', false)
            this.$set(this.data[idx + 1], '_edit', true)
          } else {
            this.$set(this.data[idx], '_edit', false)
          }
        }
      }
    }
  }
}
</script>
<style>
</style>
