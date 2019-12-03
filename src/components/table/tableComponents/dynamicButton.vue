<template>
  <div>
    <!--     <div v-if="compareMth(row[col.compare])">
      <el-button
        v-for="btn in col.cptProperties"
        v-if="btn.check == row[col.compare]"
        :key="btn.value" :type="btn.type" :size="btn.size"
        :icon="btn.icon" @click="btn.eventClick(index, row)"
      >
        {{ btn.label }}
      </el-button>
    </div>
    <div v-else>
      无需操作
    </div> -->
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line
  props: ['row', 'col', 'index'],
  methods: {
    compareMth (num) {
      return this.col.compareVal.indexOf(num) >= 0 ? 'false' : 'true'
    }
  }
}
</script>
