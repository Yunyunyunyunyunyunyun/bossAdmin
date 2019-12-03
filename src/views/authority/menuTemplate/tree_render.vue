<template>
  <span class="tree-expand">
    <span v-show="dATA.isEdit" class="tree-label">
      <el-input
        :ref="'treeInput'+dATA.id" v-model="dATA.name" class="edit"
        size="mini"
        autofocus
        @click.stop.native="nodeEditFocus"
        @blur.stop="nodeEditPass(sTORE,dATA,nODE)"
        @keyup.enter.stop.native="nodeEditPass(sTORE,dATA,nODE)"
      />
    </span>
    <span v-show="!dATA.isEdit">
      <span>{{ dATA.name }}<span v-show="dATA.showOldName">({{ dATA.oldName }})</span></span>
    </span>
    <span v-show="!dATA.isEdit" class="tree-btn">
      <img src="../../../../static/images/edit.png" @click.stop="nodeEdit(sTORE,dATA,nODE)">
    </span>
  </span>
</template>

<script>
export default {
  name: 'TreeExpand',
  props: {
    'nODE': {
      type: Object,
      default: function () {
        return {}
      }
    },
    'dATA': {
      type: Object,
      default: function () {
        return {}
      }
    },
    'sTORE': {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    nodeEdit (s, d, n) { // 编辑
      d.isEdit = true
      this.$nextTick(() => {
        this.$refs['treeInput' + d.id].$refs.input.focus()
      })
      this.$emit('nodeEdit', s, d, n)
    },
    nodeEditPass (s, d, n) { // 编辑完成
      d.isEdit = false
      d.showOldName = true
    },
    nodeEditFocus () {
      // 阻止点击节点的事件冒泡
    }
  }
}
</script>

<style lang="less" scoped>
	.tree-expand{
    overflow:auto;
    .tree-label {
      .edit{
        width:80%;
      }
    }
    .tree-btn{
      display:none;
      padding: 0 10px;
      cursor: pointer;
    }
	}
</style>
