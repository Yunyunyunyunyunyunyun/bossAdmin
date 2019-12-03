<template>
  <div>
    <el-switch
      v-show="row._edit" v-model="row[col.prop]" :active-text="onText"
      :inactive-text="offText" :active-value="onValue" :inactive-value="offValue"
      :width="width"
      :allow-focus="allowFocus" @change="eventChange"
      @blur="eventBlur"
      @focus="eventFocus"
    />
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
      if (this.row[this.col.prop] === this.col.cptProperties.onValue) {
        return this.col.cptProperties.onText
      }
      return this.col.cptProperties.offText
    },
    width () {
      return this.col.cptProperties.width ? this.col.cptProperties.width : '60'
    },
    onText () {
      return this.col.cptProperties.onText ? this.col.cptProperties.onText : ''
    },
    offText () {
      return this.col.cptProperties.offText ? this.col.cptProperties.offText : ''
    },
    onValue () {
      return this.col.cptProperties.onValue ? this.col.cptProperties.onValue : ''
    },
    offValue () {
      return this.col.cptProperties.offValue ? this.col.cptProperties.offValue : ''
    },
    allowFocus () {
      return this.col.cptProperties.allowFocus ? this.col.cptProperties.allowFocus : ''
    },
    eventChange () {
      return this.col.cptProperties.eventChange ? this.col.cptProperties.eventChange : function () {}
    },
    eventFocus () {
      return this.col.cptProperties.eventFocus ? this.col.cptProperties.eventFocus : function () {}
    },
    eventBlur () {
      return this.col.cptProperties.eventBlur ? this.col.cptProperties.eventBlur : function () {}
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
