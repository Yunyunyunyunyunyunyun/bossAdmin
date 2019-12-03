<template>
  <el-cascader
    ref="select"
    v-model="region"
    placeholder="请选择省市区及街道"
    :props="props"
    clearable
    filterable
  ></el-cascader>
</template>

<script>
import { httpPost } from '@/API/request/index'
export default {
  props: {
    propsObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    const self = this
    return {
      region: '',
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          node.value = node.value ? node.value : '1'
          const { level } = node
          if (level >= 3) {
            httpPost(self.$basePath.getStreet, { areaId: node.value })
              .then(res => {
                resolve(res.result.map(item => (
                  {
                    value: item.id,
                    label: item.street,
                    leaf: level >= 3
                  }
                )))
              })
          } else {
            httpPost(self.$basePath.findByParentId, { pId: node.value })
              .then(res => {
                resolve(res.result.map(item => (
                  {
                    value: item.id,
                    label: item.name,
                    leaf: level >= 3
                  }
                )))
              })
          }
        }
      }
    }
  },
  watch: {
    region (val) {
      if (val && val.length === 4) {
        httpPost(this.$basePath.getStreet, { areaId: val[3] })
          .then(res => {
            console.log(res.result)
          })
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>

</style>
